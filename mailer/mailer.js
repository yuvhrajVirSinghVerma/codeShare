import transporter from "./transport.js";
import message from "./template.js";
const sendInvitation = (roomid, roomname, recipient, user) => {
  let mailOptions = {
    from: "CodeShares <no-reply@gmail.com>",
    to: recipient,
    subject: `Invitiation to Code Room by ${user}`,
    html: message(roomid, roomname, user),
  };
  transporter.sendMail(mailOptions, function (err, data) {
    if (err) {
      console.log("Error " + err);
      sendInvitation(roomid, roomname, recipient, user);
    } else {
      console.log("Email sent successfully");
    }
  });
};

export default sendInvitation;
