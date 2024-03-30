// require("dotenv").config({ path: "../.env" });
import dotenv from 'dotenv'
dotenv.config({ path: "../.env" })
import { createTransport } from "nodemailer";

const transporter = createTransport({
  service: "gmail",
  auth: {
    type: "OAuth2",
    user: "legendyuvhraj@gmail.com",
    // pass: process.env.MAIL_PASSWORD,
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
    refreshToken: process.env.REFRESH_TOKEN,
  },
});

export default transporter;
