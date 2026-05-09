// Prisma dipakai untuk query tabel Room.
import { prisma } from "@/lib/prisma";
// Schema validasi ruang dipakai sebelum create/update.
import { roomSchema } from "@/lib/validation";

// Service OOP untuk semua operasi data ruang.
export class RoomService {
  // Mengambil semua ruang terbaru.
  findAll() {
    return prisma.room.findMany({ orderBy: { createdAt: "desc" } });
  }

  // Mengambil satu ruang berdasarkan id.
  findById(id: string) {
    return prisma.room.findUniqueOrThrow({ where: { id } });
  }

  // Membuat ruang baru setelah validasi.
  create(input: unknown) {
    const data = roomSchema.parse(input);
    return prisma.room.create({ data });
  }

  // Mengubah ruang berdasarkan id setelah validasi.
  update(id: string, input: unknown) {
    const data = roomSchema.parse(input);
    return prisma.room.update({ where: { id }, data });
  }

  // Menghapus ruang berdasarkan id.
  delete(id: string) {
    return prisma.room.delete({ where: { id } });
  }
}
