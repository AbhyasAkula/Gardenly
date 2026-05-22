import fetch from "node-fetch";
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

const BREVO_API_URL = "https://api.brevo.com/v3/smtp/email";
const BREVO_API_KEY = process.env.BREVO_API_KEY;

const FROM_EMAIL =
  process.env.MAIL_FROM || "Gardenly <no-reply@gardenly.com>";

const senderEmail =
  process.env.MAIL_FROM_EMAIL ||
  process.env.EMAIL_USER ||
  "no-reply@gardenly.com";

const senderName =
  process.env.MAIL_FROM_NAME || "Gardenly";

const sendBrevoEmail = async ({ to, subject, html, text, failureMessage }) => {
  const controller = new AbortController();

  const timeout = setTimeout(() => {
    controller.abort();
  }, 10000);

  try {
    if (!BREVO_API_KEY) {
      throw new Error("BREVO_API_KEY is not configured");
    }

    console.log("📧 Sending email to:", to);

    const response = await fetch(BREVO_API_URL, {
      method: "POST",
      headers: {
        accept: "application/json",
        "content-type": "application/json",
        "api-key": BREVO_API_KEY,
      },
      body: JSON.stringify({
        sender: {
          name: senderName,
          email: senderEmail,
        },
        to: [{ email: to }],
        subject,
        htmlContent: html,
        textContent: text,
      }),
      signal: controller.signal,
    });

    if (!response.ok) {
      let details = "";
      try {
        details = await response.text();
      } catch {
        details = "Unable to read Brevo error response";
      }
      throw new Error(`Brevo API ${response.status}: ${details}`);
    }

    console.log("✅ Email API success");
    return true;
  } catch (err) {
    console.error("❌ Email API failed:", err);
    throw errorHandler(500, failureMessage);
  } finally {
    clearTimeout(timeout);
  }
};

/**
 * Send OTP email
 */
export const sendOtpMail = async (to, otp) => {
  return sendBrevoEmail({
    to,
    subject: "Your Gardenly Order OTP",
    text: `Your Gardenly order OTP is ${otp}. This OTP is valid for 10 minutes.`,
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
    failureMessage: "Failed to send OTP email. Please try again later.",
  });
};

/**
 * Signup verification mail
 */
export const sendSignupVerificationMail = async (to, otp) => {
  return sendBrevoEmail({
    to,
    subject: "Verify your Gardenly account",
    text: `Your Gardenly verification code is ${otp}. This code expires in 10 minutes.`,
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
    failureMessage: "Failed to send verification email",
  });
};

/**
 * 2FA mail
 */
export const send2FAMail = async (to, otp) => {
  return sendBrevoEmail({
    to,
    subject: "Gardenly 2FA Login Code",
    text: `Your Gardenly login code is ${otp}. This code expires in 10 minutes.`,
    html: `
      <div style="font-family: Arial, sans-serif;">
        <h2>Login Verification</h2>
        <p>Your login code is:</p>
        <h1 style="letter-spacing: 4px;">${otp}</h1>
        <p>This code expires in 10 minutes.</p>
      </div>
    `,
    failureMessage: "Failed to send 2FA email",
  });
};

/**
 * Generic mail sender
 */
export const sendMail = async (to, subject, text) => {
  return sendBrevoEmail({
    to,
    subject,
    text,
    html: `
      <div style="font-family: Arial, sans-serif; line-height: 1.5; white-space: pre-wrap;">
        ${text}
      </div>
    `,
    failureMessage: "Failed to send email.",
  });
};
