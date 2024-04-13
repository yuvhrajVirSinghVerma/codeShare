import express from "express";
import { config } from "dotenv";
config();
import cors from "cors";
// import socket from "socket.io";
import  path  from "path";
import cookieParser from "cookie-parser";
import redisAdapter from "socket.io-redis";
import { OAuth2Client } from "google-auth-library";
import roomRoute  from "./routes/room.js";
import memberRoute  from "./routes/members.js";
import { Server } from 'socket.io';
import { createServer } from 'http';
import dotenv from 'dotenv'
dotenv.config({ path: "/.env" })
const app = express();
const httpserver = createServer(app); 
const socket = new Server(httpserver);

import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);

const __dirname = path.dirname(__filename);

const CLIENT_ID = process.env.CLIENT_ID;

const client = new OAuth2Client(CLIENT_ID);

// middlewares

app.use(cors({
  origin: process.env.FRONTEND_URL,
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE"],
}));
app.use(cookieParser());
app.use(express.json());
app.use("/room", roomRoute);
app.use("/member", memberRoute);

// app.use(express.static(path.join(__dirname, "client/build")));

const port = process.env.PORT || 3000;

// app.get("*", (req, res) => {
//   res.sendFile(path.join(__dirname + "/client/build/index.html"));
// });

app.get('/',(req,res)=>{
  res.send("Hello")
})

const server = app.listen(port, () => {
  console.log(`connected at port ${port}`);
});

app.post("/login", async (req, res) => {
  const id_token = req.cookies.authtoken;
  console.log("login id_token ",id_token)

  try {
    const status = await client.verifyIdToken({
      idToken: id_token,
      audience: CLIENT_ID,
    });

    console.log("login status ",status)

    res.send({ status: "success" });
  } catch (error) {
    console.log("error ",error)
    res.send({ status: "failed" });
  }
});

const io = new Server(server, {
  cors: true,
});

// io.adapter(
//   redisAdapter({ host: process.env.REDIS_HOST || "127.0.0.1", port: 6379 })
// );

console.log(process.env.HOST || 6000)
const socketRoomMap = new Map();
io.on("connection", (client) => {
  client.on("join", (e) => {
    console.log("joined ",e,client)
    let roomid= e.roomid
    let user=e.user
    socketRoomMap.set(client.id, {roomid, user});
    client.broadcast.to(e.roomid).emit("newUser",e.user)
    client.join(e.roomid);
  });

  client.on("codeChange", (e) => {
    console.log("chaged code ",e.user)
    let user=e.user.name
    let data=e.data
    client.broadcast.to(e.roomid).emit("codeChange", {user,data});

  });

  client.on("changeLanguage", (e) => {
    client.broadcast.to(e.roomid).emit("changeLanguage", e.data);
  });

  client.on("changeInput", (e) => {
    client.broadcast.to(e.roomid).emit("changeInput", e.data);
  });
  client.on("changeOutput", (e) => {
    client.broadcast.to(e.roomid).emit("changeOutput", e.data);
  });

  client.on("draw",(e)=>{
    let{px, py, x, y}=e
    console.log("draw ",{px, py, x, y},e.roomid)

    client.broadcast.to(e.roomid).emit("draw",{px, py, x, y})
  })
  client.on("disconnect",(e)=>{
    console.log("disconnect ",client.rooms,client.id)
    const { roomid, user } = socketRoomMap.get(client.id) || {};
    // console.log(`${user.name} disconnected from room ${roomid}`,user.name);
    if (roomid && user) {
      console.log(`${user} disconnected from room ${roomid}`);
      client.broadcast.to(roomid).emit("userDisconnect",user)
    } 
    
    socketRoomMap.delete(client.id);
  })
  
  
});
