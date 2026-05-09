// Prisma dipakai untuk mencari akun login di database.
import { prisma } from "@/lib/prisma";
// Helper password dipakai untuk membandingkan password input dengan hash.
import { verifyPassword } from "@/lib/password";
// Reuse validasi string wajib dari file validation.
import { requiredString } from "@/lib/validation";
// Zod dipakai untuk validasi form login.
import { z } from "zod";

// Schema login hanya butuh username dan password.
const loginSchema = z.object({
  username: requiredString,
  password: requiredString
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
}
