"use node";

// Node-only (node:crypto): import from "use node" action files exclusively.
import { randomBytes, scrypt as scryptCallback, timingSafeEqual } from "node:crypto";
import { promisify } from "node:util";

const scrypt = promisify(scryptCallback);
const saltByteLength = 16;
const keyByteLength = 64;

export const hashPassword = async (password: string) => {
  const salt = randomBytes(saltByteLength);
  const hash = (await scrypt(password.normalize(), salt, keyByteLength)) as Buffer;

  return `${salt.toString("hex")}:${hash.toString("hex")}`;
};

export const verifyPassword = async (password: string, storedHash: string) => {
  const [saltHex, hashHex] = storedHash.split(":");

  if (!saltHex || !hashHex) {
    return false;
  }

  const expected = Buffer.from(hashHex, "hex");

  // Reject malformed stored hashes: an invalid hex segment decodes to fewer
  // bytes (down to zero, where timingSafeEqual of two empty buffers is true).
  if (expected.byteLength !== keyByteLength) {
    return false;
  }

  const actual = (await scrypt(
    password.normalize(),
    Buffer.from(saltHex, "hex"),
    keyByteLength,
  )) as Buffer;

  return timingSafeEqual(actual, expected);
};
