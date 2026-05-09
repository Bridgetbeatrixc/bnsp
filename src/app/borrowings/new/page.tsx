// Form peminjaman menerima dropdown dan timetable.
import { BorrowingForm } from "@/components/forms/BorrowingForm";
// Action ini menyimpan peminjaman baru.
import { createBorrowing } from "@/lib/actions";
// requireAccount memastikan user sudah login.
import { requireAccount } from "@/lib/auth";
// Service peminjam dipakai admin untuk memilih borrower.
import { BorrowerService } from "@/services/BorrowerService";
// Service peminjaman dipakai untuk data timetable.
import { BorrowingService } from "@/services/BorrowingService";
// Service peralatan dipakai untuk dropdown barang.
import { EquipmentService } from "@/services/EquipmentService";
// Service ruang dipakai untuk dropdown ruang.
import { RoomService } from "@/services/RoomService";

// Halaman ini dinamis karena membaca session dan database.
export const dynamic = "force-dynamic";

// Halaman untuk membuat peminjaman baru.
export default async function NewBorrowingPage() {
  // Ambil akun yang sedang login.
  const account = await requireAccount();
  // Admin boleh memilih peminjam, user biasa tidak.
  const isAdmin = account.role === "ADMIN";
  // Ambil data dropdown sesuai hak akses.
  const [borrowers, rooms, equipment] = await Promise.all([
    isAdmin ? new BorrowerService().findAll() : Promise.resolve(account.borrower ? [account.borrower] : []),
    new RoomService().findAll(),
    new EquipmentService().findAll()
  ]);
  // Ambil jadwal yang sudah ada untuk tabel timetable.
  const existingBookings = await new BorrowingService().findAll();

  return (
    <BorrowingForm
      action={createBorrowing}
      borrowers={borrowers}
      equipment={equipment}
      // Ubah data peminjaman menjadi format sederhana untuk timetable.
      existingBookings={existingBookings.map((booking) => ({
        id: booking.id,
        borrowerName: booking.borrower.name,
        roomName: booking.room?.name ?? "-",
        usageDate: booking.usageDate.toISOString(),
        durationHours: booking.durationHours,
        status: booking.status,
        equipment: booking.equipmentItems.length
          ? booking.equipmentItems.map((item) => `${item.equipment.name} x ${item.quantity}`).join(", ")
          : "-"
      }))}
      // Jika bukan admin, peminjam dikunci ke akun login.
      fixedBorrower={!isAdmin}
      rooms={rooms}
    />
  );
}
