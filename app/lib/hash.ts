// lib/hash.ts
import crypto from "crypto";

export function generateCertificateHash(input: string) {
  return crypto
    .createHash("sha256")
    .update(input)
    .digest("hex");
}
