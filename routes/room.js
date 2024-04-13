import express,{ Router, query } from "express";

// import Prisma from "@prisma/client";
import { PrismaClient } from '@prisma/client'
// const { PrismaClient } = Prisma;

const prisma = new PrismaClient();

// const roomRoute = Router();
const roomRoute=express.Router();

roomRoute.route("/data").get( async (req, res) => {
  const { roomid } = req.query;
  console.log("query ",roomid)


  try {
    const result = await prisma.rooms.findFirst({
      where: {
        roomid: roomid,
      },
      select: {
        value: true,
      },
    });

    res.status(200).send({ status: "ok", data: result.value });
  } catch (error) {
    res.status(404).send({ status: "failed", message: "room not found" });
  }
});

roomRoute.route("/list").get( async (req, res) => {
  const { user } = req.query;
  console.log("query list",query)

  try {
    const result = await prisma.rooms.findMany({
      where: {
        owner: user,
      },
      select: {
        roomid: true,
        title: true,
        date: true,
      },
    });
    res.status(200).send({ status: "ok", data: result });
  } catch (error) {
    console.log("error ",error)
    res.status(404).send({ status: "failed", message: "Not found" });
  }
});

roomRoute.route("/create").post( async (req, res) => {
  const data = req.body;
  var date = new Date();
  console.log("data ",data)
  date = date.toLocaleString();
  data.date = date.toString();

  try {
    const result = await prisma.rooms.create({
      data: data,
    });

    const author = await prisma.collaborator.create({
      data: {
        roomid: data.roomid,
        user: data.owner,
      },
    });

    res.status(201).send({
      status: "ok",
      message: "Room created successfully",
    });
  } catch (error) {
    res.status(400).send({
      status: "failed",
      message: "Room creation failed",
    });
  }
});

roomRoute.post("/update", async (req, res) => {
  const { roomid, value } = req.body;

  try {
    const result = await prisma.rooms.update({
      where: {
        roomid: roomid,
      },
      data: {
        value: value,
      },
    });

    res.send({ status: "ok" });
  } catch (error) {
    res.status(400).send({
      status: "failed",
      message: "Cannot update code value",
    });
  }
});

roomRoute.delete("/delete", async (req, res) => {
  const { roomid } = req.body;
  try {
    const result = await prisma.rooms.deleteMany({
      where: {
        roomid: roomid,
      },
    });

    const deleteResponse = await prisma.collaborator.deleteMany({
      where: {
        roomid: roomid,
      },
    });

    res.status(200).send({
      status: "ok",
    });
  } catch (error) {
    res.status(404).send({
      status: "failed",
    });
  }
});

export default roomRoute ;
