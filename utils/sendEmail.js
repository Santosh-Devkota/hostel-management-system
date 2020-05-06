const nodemailer = require("nodemailer");

const sendEmail = async function (Options) {
  // const oauth2Client = new OAuth2(
  //   "39040353371-tlp57t0hovho44t10sl1tlqd946sj459.apps.googleusercontent.com", // ClientID
  //   "U9Zsx1NVP1X0tALePgfikMGv", // Client Secret
  //   "https://developers.google.com/oauthplayground" // Redirect URL
  // );
  // await oauth2Client.setCredentials({
  //   refresh_token:
  //     "1//04dI7cuTPLRhLCgYIARAAGAQSNwF-L9IrCGJGaqRuFrdpIjaxQIkOIrc6j9l_DcjeMgONh3-UnEC4g6adsMcnbon73mE3eiAODRU",
  // });
  // const accessToken = oauth2Client.getAccessToken();

  var transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
      type: "OAuth2",
      user: process.env.MAIL_ADDRESS,
      clientId: process.env.MAIL_CLIENTID,
      clientSecret: process.env.MAIL_CLIENTSECRET,
      refreshToken: process.env.MAIL_REFRESH_TOKEN,
      accessToken: process.env.MAIL_ACCESS_TOKEN,
    },
  });
  transporter.verify(function (error, success) {
    if (error) {
      console.log(error);
    } else {
      console.log("Server is ready to take our messages");
    }
  });
  const mailOptions = {
    from: process.env.MAIL_ADDRESS, // sender address
    to: Options.receiverEmail, // list of receivers
    subject: Options.subject, // Subject line
    text: Options.message, //message to be sent in email
  };
  const info = await transporter.sendMail(mailOptions);
  console.log(info.messageId);
};
module.exports = sendEmail;
