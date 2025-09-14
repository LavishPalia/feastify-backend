import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

export const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL,
    pass: process.env.GMAIL_APP_PASSWORD,
  },
});

export const sendOTPMail = async (to, otp) => {
  const mailOptions = {
    from: process.env.EMAIL,
    to,
    subject: "Feastify Password Reset - Your One-Time Passcode",
    text: `Hello,

We received a request to reset your Feastify account password. 
Please use the One-Time Passcode (OTP) below to proceed:

🔐 OTP: ${otp}

This code is valid for 5 minutes. 
If you did not request a password reset, you can safely ignore this email.

Thank you,  
Team Feastify`,
    html: `
      <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
        <h2 style="color: #ff4d2d;">Feastify Password Reset</h2>
        <p>Hello,</p>
        <p>We received a request to reset your Feastify account password. Please use the One-Time Passcode (OTP) below to proceed:</p>
        <p style="font-size: 20px; font-weight: bold; color: #e64323; margin: 16px 0;">${otp}</p>
        <p>This code will expire in <strong>5 minutes</strong>.</p>
        <p>If you did not request a password reset, you can safely ignore this email.</p>
        <br/>
        <p>Thank you,<br/>Team Feastify</p>
      </div>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.error("Error sending OTP mail:", error);
  }
};
