// Prisma dipakai untuk query tabel Borrower.
import { prisma } from "@/lib/prisma";
// Hash password dipakai untuk membuat akun login otomatis.
import { hashPassword } from "@/lib/password";
// Schema validasi peminjam dipakai sebelum create/update.
import { borrowerSchema } from "@/lib/validation";

// Service OOP untuk semua operasi data peminjam.
export class BorrowerService {
  // Mengambil semua peminjam terbaru.
  findAll() {
    return prisma.borrower.findMany({
      include: { account: true },
      orderBy: { createdAt: "desc" }
    });
  }

  // Mengambil satu peminjam berdasarkan id.
  findById(id: string) {
    return prisma.borrower.findUniqueOrThrow({ where: { id } });
  }

  // Membuat peminjam baru setelah validasi.
  create(input: unknown) {
    const data = borrowerSchema.parse(input);
    return prisma.borrower.create({
      data: {
        ...data,
        account: {
          create: {
            // Email dipakai sebagai username agar mudah dikirim ke peminjam.
            username: data.email,
            // Password awal dibuat dari NIM/NIK agar admin tidak perlu menentukan password manual.
            passwordHash: hashPassword(data.identityNumber),
            role: data.accountType
          }
        }
      }
    });
  }

  // Mengubah peminjam berdasarkan id setelah validasi.
  update(id: string, input: unknown) {
    const data = borrowerSchema.parse(input);
    return prisma.borrower.update({
      where: { id },
      data: {
        ...data,
        account: {
          upsert: {
            create: {
              username: data.email,
              passwordHash: hashPassword(data.identityNumber),
              role: data.accountType
            },
            update: {
              username: data.email,
              role: data.accountType
            }
          }
        }
      }
    });
  }

  // Menghapus peminjam berdasarkan id.
  delete(id: string) {
    return prisma.borrower.delete({ where: { id } });
  }

  // Reset password akun peminjam kembali ke NIM/NIK.
  async resetPassword(id: string) {
    // Ambil peminjam beserta akun login yang terhubung.
    const borrower = await prisma.borrower.findUniqueOrThrow({
      where: { id },
      include: { account: true }
    });

    // Jika peminjam belum punya akun, buat akun baru dari email dan NIM/NIK.
    if (!borrower.account) {
      return prisma.account.create({
        data: {
          username: borrower.email ?? borrower.identityNumber,
          passwordHash: hashPassword(borrower.identityNumber),
          role: borrower.accountType,
          borrowerId: borrower.id
        }
      });
    }

    // Jika akun sudah ada, update password menjadi hash dari NIM/NIK.
    return prisma.account.update({
      where: { id: borrower.account.id },
      data: { passwordHash: hashPassword(borrower.identityNumber) }
    });
  }
}
