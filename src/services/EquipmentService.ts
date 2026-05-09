// Prisma dipakai untuk query tabel Equipment.
import { prisma } from "@/lib/prisma";
// Schema validasi peralatan dipakai sebelum create/update.
import { equipmentSchema } from "@/lib/validation";

// Service OOP untuk semua operasi data peralatan.
export class EquipmentService {
  // Mengambil semua peralatan terbaru.
  findAll() {
    return prisma.equipment.findMany({ orderBy: { createdAt: "desc" } });
  }

  // Mengambil satu peralatan berdasarkan id.
  findById(id: string) {
    return prisma.equipment.findUniqueOrThrow({ where: { id } });
  }

  // Membuat peralatan baru setelah validasi.
  create(input: unknown) {
    const data = equipmentSchema.parse(input);
    return prisma.equipment.create({ data });
  }

  // Mengubah peralatan berdasarkan id setelah validasi.
  update(id: string, input: unknown) {
    const data = equipmentSchema.parse(input);
    return prisma.equipment.update({ where: { id }, data });
  }

  // Menghapus peralatan berdasarkan id.
  delete(id: string) {
    return prisma.equipment.delete({ where: { id } });
  }
}
