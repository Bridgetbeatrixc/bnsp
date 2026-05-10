// Link dipakai untuk tombol tambah/ajukan peminjaman.
import Link from "next/link";
// FlashMessage dipakai untuk menampilkan notifikasi sukses/gagal.
import { FlashMessage } from "@/components/FlashMessage";
// Action update status hanya boleh dipakai admin.
import { updateBorrowingStatus } from "@/lib/actions";
// requireAccount memastikan user sudah login.
import { requireAccount } from "@/lib/auth";
// Prisma dipakai untuk mengambil riwayat pribadi non-admin.
import { prisma } from "@/lib/prisma";
// Service peminjaman mengambil semua transaksi untuk admin.
import { BorrowingService } from "@/services/BorrowingService";
// Utility Tailwind bersama untuk layout, tabel, form kecil, dan tombol.
import { cx, ui } from "@/lib/ui";

// Halaman ini dinamis karena membaca session dan database.
export const dynamic = "force-dynamic";

// Mengubah Date menjadi format yang cocok untuk input datetime-local.
function formatDateTimeLocal(value: Date | null) {
  // Jika belum ada waktu pengembalian, input dibiarkan kosong.
  if (!value) {
    return "";
  }
  // Buat Date dari nilai database.
  const date = new Date(value);
  // Helper kecil untuk angka dua digit.
  const pad = (number: number) => String(number).padStart(2, "0");
  // Ambil format yyyy-MM-ddTHH:mm sesuai waktu lokal browser/server.
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

// Menampilkan tanggal pakai dengan format yang mudah dibaca.
function formatScheduleDate(value: Date) {
  // Intl dipakai agar tanggal tampil alami untuk user Indonesia.
  return new Intl.DateTimeFormat("id-ID", {
    dateStyle: "medium"
  }).format(value);
}

// Menampilkan rentang jam pakai dari jam mulai sampai jam selesai.
function formatScheduleTime(value: Date, durationHours: number) {
  // Jam selesai dihitung dari jam mulai ditambah durasi.
  const endDate = new Date(value.getTime() + durationHours * 60 * 60 * 1000);
  // Format jam dibuat dua digit agar rapi di tabel.
  const formatter = new Intl.DateTimeFormat("id-ID", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false
  });
  // Jika melewati hari berbeda, tampilkan tanggal selesai juga.
  if (value.toDateString() !== endDate.toDateString()) {
    return `${formatter.format(value)} - ${formatScheduleDate(endDate)} ${formatter.format(endDate)}`;
  }
  // Jika masih hari yang sama, cukup tampilkan rentang jam.
  return `${formatter.format(value)} - ${formatter.format(endDate)}`;
}

// Halaman daftar peminjaman untuk admin atau riwayat pribadi untuk user.
export default async function BorrowingsPage({
  searchParams
}: {
  searchParams?: { success?: string; error?: string };
}) {
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
  // Ambil status query untuk menentukan notifikasi yang ditampilkan.
  const success = searchParams?.success;
  const error = searchParams?.error;

  return (
    <div className={ui.stack}>
      <div className={ui.topbar}>
        <div>
          <h1 className={ui.title}>{isAdmin ? "Pencatatan Peminjaman" : "Riwayat Peminjaman Saya"}</h1>
          <p className={ui.subtitle}>
            {isAdmin
              ? "Admin dapat melihat seluruh transaksi dan memperbarui status."
              : "Mahasiswa dan dosen hanya dapat melihat status pengajuan sendiri."}
          </p>
        </div>
        <Link className={ui.button} href="/borrowings/new">
          {isAdmin ? "Tambah" : "Ajukan Peminjaman"}
        </Link>
      </div>
      {success === "created" ? <FlashMessage message="Peminjaman berhasil dibuat." type="success" /> : null}
      {success === "status" ? <FlashMessage message="Status peminjaman berhasil diupdate." type="success" /> : null}
      {error === "status" ? (
        <FlashMessage message="Status gagal diupdate. Jika memilih selesai, waktu pengembalian wajib diisi." type="error" />
      ) : null}
      <div className={ui.tableWrap}>
        <table>
          <thead>
            <tr>
              <th>Peminjam</th>
              <th>Ruang</th>
              <th>Jadwal</th>
              <th>Keperluan</th>
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
                  <div className="font-semibold">{formatScheduleDate(borrowing.usageDate)}</div>
                  <div>{formatScheduleTime(borrowing.usageDate, borrowing.durationHours)}</div>
                  <div className="text-sm text-app-muted">{borrowing.durationHours} jam</div>
                </td>
                <td>{borrowing.purpose}</td>
                <td>
                  {borrowing.equipmentItems.map((item) => (
                    <div key={item.id}>{item.equipment.name} x {item.quantity}</div>
                  ))}
                </td>
                <td><span className={ui.badge}>{borrowing.status}</span></td>
                {isAdmin ? (
                  // Form update status hanya dirender untuk admin.
                  <td>
                    <form action={updateBorrowingStatus.bind(null, borrowing.id)} className={cx(ui.actions, ui.formControls)}>
                      <select name="status" defaultValue={borrowing.status}>
                        <option value="MENUNGGU">Menunggu</option>
                        <option value="DISETUJUI">Disetujui</option>
                        <option value="DITOLAK">Ditolak</option>
                        <option value="SELESAI">Selesai</option>
                      </select>
                      <label>
                        Tanggal dan Jam Pakai
                        <input
                          defaultValue={formatDateTimeLocal(borrowing.usageDate)}
                          name="usageDate"
                          type="datetime-local"
                          required
                        />
                      </label>
                      <label>
                        Durasi Jam
                        <input
                          defaultValue={borrowing.durationHours}
                          min="1"
                          name="durationHours"
                          type="number"
                          required
                        />
                      </label>
                      <label>
                        Waktu Pengembalian Aktual
                        <input
                          defaultValue={formatDateTimeLocal(borrowing.actualReturnTime)}
                          name="actualReturnTime"
                          type="datetime-local"
                        />
                      </label>
                      <button className={ui.button} type="submit">Simpan</button>
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
