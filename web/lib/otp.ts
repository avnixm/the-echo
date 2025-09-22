import crypto from "node:crypto";
import bcrypt from "bcrypt";

export function generateOtpCode(length = 6) {
  const digits = "0123456789";
  let code = "";
  for (let i = 0; i < length; i++) code += digits[Math.floor(Math.random() * digits.length)];
  return code;
}

export function generateOtpToken() {
  return crypto.randomBytes(24).toString("hex");
}

export async function hashOtp(code: string) {
  return bcrypt.hash(code, 10);
}

export async function verifyOtp(code: string, hash: string) {
  return bcrypt.compare(code, hash);
}

