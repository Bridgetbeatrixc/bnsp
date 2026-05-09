// PrismaClient dipakai untuk semua query database.
import { PrismaClient } from "@prisma/client";

// Simpan Prisma di global saat development agar tidak membuat koneksi berulang.
const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

// Gunakan Prisma yang sudah ada, atau buat baru jika belum ada.
export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: ["error", "warn"]
  });

// Saat development, simpan PrismaClient ke global agar hot reload lebih stabil.
if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
