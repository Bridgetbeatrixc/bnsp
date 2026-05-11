// Prisma dipakai untuk query transaksi peminjaman.
import { prisma } from "@/lib/prisma";
// Enum status dipakai untuk menentukan jadwal ruang yang masih aktif.
import { BorrowingStatus } from "@prisma/client";
// Import schema validasi dan helper stok.
import {
  borrowingSchema,
  statusUpdateSchema,
  validateEquipmentStock
} from "@/lib/validation";

// Status ini dianggap masih memblokir jadwal ruang.
const activeRoomStatuses = [BorrowingStatus.MENUNGGU, BorrowingStatus.DISETUJUI];

// Mengecek apakah status peminjaman masih memblokir jadwal ruang.
function isActiveRoomStatus(status: string) {
  // Menunggu dan disetujui dianggap belum bebas untuk dipakai orang lain.
  return status === BorrowingStatus.MENUNGGU || status === BorrowingStatus.DISETUJUI;
}

// Menghitung jam selesai dari jam mulai dan durasi.
function getEndTime(startTime: Date, durationHours: number) {
  // Durasi disimpan dalam jam, lalu dikonversi ke milidetik.
  return new Date(startTime.getTime() + durationHours * 60 * 60 * 1000);
}

// Mengecek apakah dua rentang waktu saling bertabrakan.
function isOverlapping(firstStart: Date, firstEnd: Date, secondStart: Date, secondEnd: Date) {
  // Overlap terjadi jika mulai pertama sebelum selesai kedua dan selesai pertama setelah mulai kedua.
  return firstStart < secondEnd && firstEnd > secondStart;
}

// Memastikan ruang tidak dipakai pada jam yang sama.
async function ensureRoomScheduleIsAvailable(roomId: string | undefined, usageDate: Date, durationHours: number, ignoredBorrowingId?: string) {
  // Jika peminjaman barang saja, tidak ada ruang yang perlu dicek.
  if (!roomId) {
    return;
  }

  // Hitung rentang waktu pengajuan baru.
  const requestedStart = usageDate;
  const requestedEnd = getEndTime(usageDate, durationHours);

  // Ambil peminjaman aktif untuk ruang yang sama dan mulai sebelum jadwal baru selesai.
  const existingBorrowings = await prisma.borrowing.findMany({
    where: {
      roomId,
      status: { in: activeRoomStatuses },
      usageDate: { lt: requestedEnd },
      ...(ignoredBorrowingId ? { id: { not: ignoredBorrowingId } } : {})
    },
    select: {
      id: true,
      usageDate: true,
      durationHours: true
    }
  });

  // Cari jadwal aktif yang rentangnya bertabrakan dengan jadwal baru.
  const hasOverlap = existingBorrowings.some((borrowing) =>
    isOverlapping(
      requestedStart,
      requestedEnd,
      borrowing.usageDate,
      getEndTime(borrowing.usageDate, borrowing.durationHours)
    )
  );

  // Jika overlap, transaksi ditolak agar ruang tidak double-booking.
  if (hasOverlap) {
    throw new Error("Ruang sudah dipinjam pada jadwal tersebut");
  }
}

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
    // Pastikan ruang yang dipilih belum dipakai pada rentang waktu yang sama.
    await ensureRoomScheduleIsAvailable(data.roomId, data.usageDate, data.durationHours);

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
  async updateStatus(id: string, input: unknown) {
    // Validasi status dan waktu pengembalian jika selesai.
    const data = statusUpdateSchema.parse(input);
    // Jika status masih aktif, cek jadwal ruang agar edit admin tidak membuat bentrok.
    const shouldBlockRoomSchedule = isActiveRoomStatus(data.status);
    // Ambil roomId transaksi lama hanya saat status baru masih memblokir jadwal.
    if (shouldBlockRoomSchedule) {
      const currentBorrowing = await prisma.borrowing.findUniqueOrThrow({
        where: { id },
        select: { roomId: true }
      });
      // Cek overlap dengan mengabaikan transaksi yang sedang diedit.
      await ensureRoomScheduleIsAvailable(currentBorrowing.roomId ?? undefined, data.usageDate, data.durationHours, id);
    }
    // Simpan status baru ke database.
    return prisma.borrowing.update({
      where: { id },
      data: {
        status: data.status,
        // Tanggal dan jam pakai bisa diperbaiki admin dari tabel peminjaman.
        usageDate: data.usageDate,
        // Durasi juga disimpan ulang agar jadwal tampil sesuai edit terbaru.
        durationHours: data.durationHours,
        // Jika kosong, simpan null agar database bersih.
        actualReturnTime: data.actualReturnTime ?? null
      }
    });
  }
}
