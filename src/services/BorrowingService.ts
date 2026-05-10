// Prisma dipakai untuk query transaksi peminjaman.
import { prisma } from "@/lib/prisma";
// Import schema validasi dan helper stok.
import {
  borrowingSchema,
  statusUpdateSchema,
  validateEquipmentStock
} from "@/lib/validation";

// Service OOP untuk proses peminjaman dan update status.
export class BorrowingService {
  // Mengambil semua peminjaman beserta peminjam, ruang, dan peralatan.
  findAll() {
    return prisma.borrowing.findMany({
      include: {
        borrower: true,
        room: true,
        equipmentItems: { include: { equipment: true } }
      },
      orderBy: { createdAt: "desc" }
    });
  }

  // Membuat transaksi peminjaman baru.
  async create(input: unknown) {
    // Validasi input: tanggal, durasi, borrower, ruang/barang, dan tujuan.
    const data = borrowingSchema.parse(input);
    // Ambil data stok untuk semua barang yang dipilih.
    const equipment = await prisma.equipment.findMany({
      where: {
        id: { in: data.equipmentItems.map((item) => item.equipmentId) },
        deletedAt: null
      }
    });
    // Pastikan jumlah pinjam tidak melebihi stok.
    validateEquipmentStock(
      data.equipmentItems,
      new Map(equipment.map((item) => [item.id, item.stock]))
    );

    // Simpan peminjaman utama dan detail barang dalam satu create nested.
    return prisma.borrowing.create({
      data: {
        borrowerId: data.borrowerId,
        // roomId boleh null untuk peminjaman barang saja.
        roomId: data.roomId ?? null,
        requestDate: data.requestDate,
        usageDate: data.usageDate,
        durationHours: data.durationHours,
        purpose: data.purpose,
        equipmentItems: {
          // Buat baris detail untuk setiap barang yang dipinjam.
          create: data.equipmentItems.map((item) => ({
            equipmentId: item.equipmentId,
            quantity: item.quantity
          }))
        }
      }
    });
  }

  // Mengubah status peminjaman oleh admin.
  updateStatus(id: string, input: unknown) {
    // Validasi status dan waktu pengembalian jika selesai.
    const data = statusUpdateSchema.parse(input);
    // Simpan status baru ke database.
    return prisma.borrowing.update({
      where: { id },
      data: {
        status: data.status,
        // Jika kosong, simpan null agar database bersih.
        actualReturnTime: data.actualReturnTime ?? null
      }
    });
  }
}
