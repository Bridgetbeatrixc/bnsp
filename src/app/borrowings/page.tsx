// Link dipakai untuk tombol tambah/ajukan peminjaman.
import Link from "next/link";
// Action update status hanya boleh dipakai admin.
import { updateBorrowingStatus } from "@/lib/actions";
// requireAccount memastikan user sudah login.
import { requireAccount } from "@/lib/auth";
// Prisma dipakai untuk mengambil riwayat pribadi non-admin.
import { prisma } from "@/lib/prisma";
// Service peminjaman mengambil semua transaksi untuk admin.
import { BorrowingService } from "@/services/BorrowingService";

// Halaman ini dinamis karena membaca session dan database.
export const dynamic = "force-dynamic";

// Halaman daftar peminjaman untuk admin atau riwayat pribadi untuk user.
export default async function BorrowingsPage() {
  // Ambil akun login.
  const account = await requireAccount();
  // Tentukan apakah user admin.
  const isAdmin = account.role === "ADMIN";
  // Admin melihat semua transaksi; user biasa hanya miliknya sendiri.
  const borrowings = isAdmin
    ? await new BorrowingService().findAll()
    : account.borrowerId
      ? await prisma.borrowing.findMany({
          where: { borrowerId: account.borrowerId },
          include: {
            borrower: true,
            room: true,
            equipmentItems: { include: { equipment: true } }
          },
          orderBy: { createdAt: "desc" }
        })
      : [];

  return (
    <div className="stack">
      <div className="topbar">
        <div>
          <h1 className="title">{isAdmin ? "Pencatatan Peminjaman" : "Riwayat Peminjaman Saya"}</h1>
          <p className="subtitle">
            {isAdmin
              ? "Admin dapat melihat seluruh transaksi dan memperbarui status."
              : "Mahasiswa dan dosen hanya dapat melihat status pengajuan sendiri."}
          </p>
        </div>
        <Link className="button" href="/borrowings/new">
          {isAdmin ? "Tambah" : "Ajukan Peminjaman"}
        </Link>
      </div>
      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th>Peminjam</th>
              <th>Ruang</th>
              <th>Jadwal</th>
              <th>Peralatan</th>
              <th>Status</th>
              {isAdmin ? <th>Update</th> : null}
            </tr>
          </thead>
          <tbody>
            {borrowings.map((borrowing) => (
              <tr key={borrowing.id}>
                <td>{borrowing.borrower.name}</td>
                <td>{borrowing.room?.name ?? "-"}</td>
                <td>
                  {borrowing.usageDate.toISOString().slice(0, 10)}
                  <br />
                  {borrowing.durationHours} jam
                </td>
                <td>
                  {borrowing.equipmentItems.map((item) => (
                    <div key={item.id}>{item.equipment.name} x {item.quantity}</div>
                  ))}
                </td>
                <td><span className="badge">{borrowing.status}</span></td>
                {isAdmin ? (
                  // Form update status hanya dirender untuk admin.
                  <td>
                    <form action={updateBorrowingStatus.bind(null, borrowing.id)} className="actions">
                      <select name="status" defaultValue={borrowing.status}>
                        <option value="MENUNGGU">Menunggu</option>
                        <option value="DISETUJUI">Disetujui</option>
                        <option value="DITOLAK">Ditolak</option>
                        <option value="SELESAI">Selesai</option>
                      </select>
                      <input name="actualReturnTime" type="datetime-local" />
                      <button type="submit">Simpan</button>
                    </form>
                  </td>
                ) : null}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
