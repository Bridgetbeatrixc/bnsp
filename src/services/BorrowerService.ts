// Prisma dipakai untuk query tabel Borrower.
import { prisma } from "@/lib/prisma";
// Schema validasi peminjam dipakai sebelum create/update.
import { borrowerSchema } from "@/lib/validation";

// Service OOP untuk semua operasi data peminjam.
export class BorrowerService {
  // Mengambil semua peminjam terbaru.
  findAll() {
    return prisma.borrower.findMany({ orderBy: { createdAt: "desc" } });
  }

  // Mengambil satu peminjam berdasarkan id.
  findById(id: string) {
    return prisma.borrower.findUniqueOrThrow({ where: { id } });
  }

  // Membuat peminjam baru setelah validasi.
  create(input: unknown) {
    const data = borrowerSchema.parse(input);
    return prisma.borrower.create({ data });
  }

  // Mengubah peminjam berdasarkan id setelah validasi.
  update(id: string, input: unknown) {
    const data = borrowerSchema.parse(input);
    return prisma.borrower.update({ where: { id }, data });
  }

  // Menghapus peminjam berdasarkan id.
  delete(id: string) {
    return prisma.borrower.delete({ where: { id } });
  }
}
