import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();

console.log("SMTP_USER:", process.env.EMAIL_USER);
console.log("SMTP_PASS:", process.env.EMAIL_PASS ? "********" : "NOT SET");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS, // App password if 2FA enabled
  },
  port: 587,
  secure: false, // false for STARTTLS
  tls: {
    rejectUnauthorized: false,
  },
});

export const sendEmail = (to, subject, text) => {
  const mailOptions = {
    from: `"Travel Booking Sri Lanka" <${process.env.SMTP_USER}>`,
    to,
    subject,
    text,
  };

  return transporter.sendMail(mailOptions);
};
