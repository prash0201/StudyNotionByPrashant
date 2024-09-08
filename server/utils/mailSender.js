const nodemailer = require("nodemailer");

const mailSender = async (email, title, body) => {
  var res;
  try {
    let transport = nodemailer.createTransport({
      host: process.env.MAIL_HOST,
      auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS,
      },
    });

    let info = await transport.sendMail({
      from: "StudyNotion || CodeHelp by Babbar",
      to: `${email}`,
      subject: `${title}`,
      html: `${body}`,
    });

    console.log("info", info);
    return res.status(200).json({
      success: true,
      message: "Email sent successfully",
      info,
    });
  } catch (error) {
    console.log("Error occured during mail sending", error.message);
  }
};

module.exports = mailSender;
