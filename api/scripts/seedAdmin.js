import bcrypt from "bcryptjs";
import dotenv from "dotenv";
import mongoose from "mongoose";
import path from "path";
import { fileURLToPath } from "url";

import User, { USER_ROLES } from "../models/user.model.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, "../../.env") });

const ADMIN_USERNAME = "Admin";
const ADMIN_EMAIL = "Admin";
const ADMIN_PASSWORD = "Admin@123";
const ADMIN_MOBILE = "9999999999";

async function seedAdmin() {
  if (!process.env.MONGO_URI) {
    throw new Error("MONGO_URI is not configured");
  }

  await mongoose.connect(process.env.MONGO_URI, { dbName: "gardenly" });

  const existingUser = await User.findOne({
    $or: [{ username: ADMIN_USERNAME }, { email: ADMIN_EMAIL }],
  });

  if (existingUser && existingUser.role !== USER_ROLES.ADMIN) {
    throw new Error(
      `Refusing to overwrite existing non-admin user "${existingUser.username}".`
    );
  }

  const hashedPassword = bcrypt.hashSync(ADMIN_PASSWORD, 10);

  if (!existingUser) {
    await User.create({
      username: ADMIN_USERNAME,
      email: ADMIN_EMAIL,
      password: hashedPassword,
      role: USER_ROLES.ADMIN,
      mobile: ADMIN_MOBILE,
      expertise: "General",
      isEmailVerified: true,
      emailVerificationOtp: undefined,
      emailVerificationOtpExpiresAt: undefined,
      twoFactorOtp: undefined,
      twoFactorOtpExpiresAt: undefined,
      resetOtp: undefined,
      resetOtpExpiresAt: undefined,
    });

    console.log("Admin user created successfully.");
  } else {
    existingUser.password = hashedPassword;
    existingUser.role = USER_ROLES.ADMIN;
    existingUser.isEmailVerified = true;
    existingUser.emailVerificationOtp = undefined;
    existingUser.emailVerificationOtpExpiresAt = undefined;
    existingUser.twoFactorOtp = undefined;
    existingUser.twoFactorOtpExpiresAt = undefined;
    existingUser.resetOtp = undefined;
    existingUser.resetOtpExpiresAt = undefined;
    await existingUser.save();

    console.log("Existing admin user refreshed successfully.");
  }

  console.log(`Username: ${ADMIN_USERNAME}`);
  console.log(`Email: ${ADMIN_EMAIL}`);
  console.log(`Password: ${ADMIN_PASSWORD}`);
}

seedAdmin()
  .catch((error) => {
    console.error("Admin seeding failed:", error.message);
    process.exitCode = 1;
  })
  .finally(async () => {
    await mongoose.disconnect();
  });
