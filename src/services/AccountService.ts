// Prisma dipakai untuk mencari akun login di database.
import { prisma } from "@/lib/prisma";
// Helper password dipakai untuk membuat dan membandingkan hash password.
import { hashPassword, verifyPassword } from "@/lib/password";
// Reuse validasi string wajib dari file validation.
import { requiredString } from "@/lib/validation";
// Zod dipakai untuk validasi form login.
import { z } from "zod";

// Schema login hanya butuh username dan password.
const loginSchema = z.object({
  username: requiredString,
  password: requiredString
});

// Schema ganti password memastikan password lama, password baru, dan konfirmasi diisi.
const changePasswordSchema = z.object({
  currentPassword: requiredString,
  newPassword: requiredString.min(6, "Password baru minimal 6 karakter"),
  confirmPassword: requiredString
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Konfirmasi password tidak sama",
  path: ["confirmPassword"]
});

// Service khusus akun/login.
export class AccountService {
  // Memvalidasi login dan mengembalikan data akun jika benar.
  async login(input: unknown) {
    // Validasi input login sebelum query database.
    const data = loginSchema.parse(input);
    // Cari akun berdasarkan username dan ambil profil peminjamnya.
    const account = await prisma.account.findUnique({
      where: { username: data.username },
      include: { borrower: true }
    });

    // Tolak login jika akun tidak ada atau password salah.
    if (!account || !verifyPassword(data.password, account.passwordHash)) {
      throw new Error("Username atau password salah");
    }

    // Kembalikan akun yang valid.
    return account;
  }

  // Mengubah password akun yang sedang login.
  async changePassword(accountId: string, input: unknown) {
    // Validasi input sebelum membaca atau menulis database.
    const data = changePasswordSchema.parse(input);
    // Ambil akun berdasarkan session yang sedang aktif.
    const account = await prisma.account.findUnique({ where: { id: accountId } });

    // Tolak jika akun tidak ditemukan atau password lama salah.
    if (!account || !verifyPassword(data.currentPassword, account.passwordHash)) {
      throw new Error("Password lama salah");
    }

    // Simpan hash password baru agar password asli tidak tersimpan di database.
    return prisma.account.update({
      where: { id: accountId },
      data: { passwordHash: hashPassword(data.newPassword) }
    });
  }
}
