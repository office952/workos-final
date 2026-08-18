import { randomBytes, scrypt, timingSafeEqual } from "node:crypto";

const SCRYPT_OPTIONS = {
  N: 32768,
  r: 8,
  p: 1,
  maxmem: 64 * 1024 * 1024,
} as const;

function scryptHash(password: string, salt: Buffer, keylen: number): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    scrypt(password, salt, keylen, SCRYPT_OPTIONS, (error, derived) => {
      if (error) {
        reject(error);
        return;
      }
      resolve(derived as Buffer);
    });
  });
}

export const CLOUD_PASSWORD_KDF = "scrypt:N=32768,r=8,p=1" as const;
const SCRYPT_KEYLEN = 64;
const SALT_BYTES = 16;
const MIN_PASSWORD_LENGTH = 10;

export type CloudPasswordIssue = "too_short" | "too_simple" | "pin_like";

export function validateCloudPassword(password: string): CloudPasswordIssue | null {
  if (password.length < MIN_PASSWORD_LENGTH) {
    return "too_short";
  }
  if (/^\d+$/.test(password)) {
    return "pin_like";
  }
  if (!/[A-Za-z]/.test(password) || !/\d/.test(password)) {
    return "too_simple";
  }
  return null;
}

export async function hashCloudPassword(password: string): Promise<{
  passwordHash: Buffer;
  passwordSalt: Buffer;
  kdf: typeof CLOUD_PASSWORD_KDF;
}> {
  const passwordSalt = randomBytes(SALT_BYTES);
  const passwordHash = await scryptHash(password, passwordSalt, SCRYPT_KEYLEN);
  return { passwordHash, passwordSalt, kdf: CLOUD_PASSWORD_KDF };
}

export async function verifyCloudPassword(
  password: string,
  passwordHash: Buffer,
  passwordSalt: Buffer,
): Promise<boolean> {
  const derived = await scryptHash(password, passwordSalt, SCRYPT_KEYLEN);
  if (derived.length !== passwordHash.length) {
    return false;
  }
  return timingSafeEqual(derived, passwordHash);
}
