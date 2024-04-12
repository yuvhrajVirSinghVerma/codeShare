import transporter from "./transport.js";
import message from "./template.js";
const sendInvitation =async(roomid, roomname, recipient, user) => {
  try{
    let mailOptions = {
      from: "CodeShares <no-reply@gmail.com>",
      to: recipient,
      subject: `Invitiation to Code Room by ${user}`,
      html: message(roomid, roomname, user),
    };
    let res=await transporter.sendMail(mailOptions);
    console.log("transporter res  ",res)
    return res
  }catch(err){
    console.log("transporter err ",err)
    return {error:'failed'}
  }
};

export default sendInvitation;
