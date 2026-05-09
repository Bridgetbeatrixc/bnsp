// Crypto bawaan Node.js dipakai untuk membuat hash password sederhana.
import { createHash } from "node:crypto";

// Salt tetap agar hash password demo tidak berupa teks asli.
const salt = "universitas-xyz-bnsp";

// Mengubah password asli menjadi hash SHA-256.
export function hashPassword(password: string) {
  // Gabungkan salt dan password sebelum di-hash.
  return createHash("sha256").update(`${salt}:${password}`).digest("hex");
}

// Membandingkan password input dengan hash yang tersimpan di database.
export function verifyPassword(password: string, passwordHash: string) {
  // Password valid jika hasil hash sama persis.
  return hashPassword(password) === passwordHash;
}
