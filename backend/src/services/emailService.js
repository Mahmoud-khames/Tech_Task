const nodemailer = require("nodemailer");
require("dotenv").config();

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT),
  secure: process.env.SMTP_SECURE === "true", 
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  }, 
});

transporter.verify((error, success) => {
  if (error) {
    console.error("❌ SMTP Connection Error:", error);
  } else {
    console.log("✅ SMTP Connection Success! Ready to send emails.");
  }
});

const sendEmail = async (to, subject, text, html) => {
  try {
    await transporter.sendMail({
      from: `"Task Manager" <${process.env.SMTP_USER}>`,
      to,
      subject,
      text,
      html,  
      replyTo: process.env.SMTP_USER, 
      headers: {
        "List-Unsubscribe": `<mailto:${process.env.SMTP_USER}>`
      }
    });
    console.log("✅ Email sent successfully to", to);
  } catch (error) {
    console.error("❌ Email sending error:", error);
  }
};

module.exports = { sendEmail };
