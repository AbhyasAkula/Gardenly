// api/utils/mailer.js
import nodemailer from "nodemailer";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import { errorHandler } from "./error.js";

// Load .env from project root
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({
  path: path.join(__dirname, "../../.env"),
});

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: Number(process.env.EMAIL_PORT),
  secure: process.env.EMAIL_SECURE === "true",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const FROM_EMAIL =
  process.env.MAIL_FROM || process.env.EMAIL_USER;

/**
 * Send OTP email
 */
export const sendOtpMail = async (to, otp) => {
  try {
    await transporter.sendMail({
      from: FROM_EMAIL,
      to,
      subject: "Your Gardenly Order OTP",
      html: `
        <div style="font-family: Arial, sans-serif; line-height: 1.5;">
          <h2>Gardenly Order Verification</h2>
          <p>Your OTP for confirming the order is:</p>
          <h1 style="letter-spacing: 4px;">${otp}</h1>
          <p>This OTP is valid for <strong>10 minutes</strong>.</p>
          <p>If you did not try to place an order, ignore this email.</p>
          <br />
          <p>Thanks,<br />Gardenly Team</p>
        </div>
      `,
    });

    console.log("✅ OTP email sent");
    return true;
  } catch (err) {
    console.error("❌ OTP email failed:", err);
    throw errorHandler(
      500,
      "Failed to send OTP email. Please try again later."
    );
  }
};

/**
 * Signup verification mail
 */
export const sendSignupVerificationMail = async (to, otp) => {
  try {
    await transporter.sendMail({
      from: FROM_EMAIL,
      to,
      subject: "Verify your Gardenly account",
      html: `
        <div style="font-family: Arial, sans-serif;">
          <h2>Gardenly Account Verification</h2>
          <p>Your verification code is:</p>
          <h1 style="letter-spacing: 4px;">${otp}</h1>
          <p>This code expires in 10 minutes.</p>
          <br />
          <p>Thanks,<br />Gardenly Team</p>
        </div>
      `,
    });

    console.log("✅ Signup verification email sent");
    return true;
  } catch (err) {
    console.error("❌ Signup verification failed:", err);
    throw errorHandler(500, "Failed to send verification email");
  }
};

/**
 * 2FA mail
 */
export const send2FAMail = async (to, otp) => {
  try {
    await transporter.sendMail({
      from: FROM_EMAIL,
      to,
      subject: "Gardenly 2FA Login Code",
      html: `
        <div style="font-family: Arial, sans-serif;">
          <h2>Login Verification</h2>
          <p>Your login code is:</p>
          <h1 style="letter-spacing: 4px;">${otp}</h1>
          <p>This code expires in 10 minutes.</p>
        </div>
      `,
    });

    console.log("✅ 2FA email sent");
    return true;
  } catch (err) {
    console.error("❌ 2FA email failed:", err);
    throw errorHandler(500, "Failed to send 2FA email");
  }
};

/**
 * Generic mail sender
 */
export const sendMail = async (to, subject, text) => {
  try {
    await transporter.sendMail({
      from: FROM_EMAIL,
      to,
      subject,
      text,
      html: `
        <div style="font-family: Arial, sans-serif; line-height: 1.5; white-space: pre-wrap;">
          ${text}
        </div>
      `,
    });

    console.log("✅ Generic email sent");
    return true;
  } catch (err) {
    console.error("❌ Email send failed:", err);
    throw errorHandler(500, "Failed to send email.");
  }
};
