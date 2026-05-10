// Link dipakai untuk tombol download Excel.
import Link from "next/link";
// requireAdmin membatasi laporan hanya untuk admin.
import { requireAdmin } from "@/lib/auth";
// Service peminjaman dipakai untuk membuat preview laporan.
import { BorrowingService } from "@/services/BorrowingService";

// Halaman laporan dinamis karena membaca session admin.
export const dynamic = "force-dynamic";

// Halaman laporan peminjaman.
export default async function ReportsPage() {
  // Pastikan hanya admin yang bisa membuka laporan.
  await requireAdmin();
  // Ambil seluruh peminjaman untuk preview laporan.
  const borrowings = await new BorrowingService().findAll();
  // Hitung total transaksi untuk ringkasan preview.
  const totalBorrowings = borrowings.length;
  // Hitung transaksi yang masih menunggu.
  const pendingBorrowings = borrowings.filter((borrowing) => borrowing.status === "MENUNGGU").length;
  // Hitung transaksi selesai.
  const completedBorrowings = borrowings.filter((borrowing) => borrowing.status === "SELESAI").length;
  // Batasi preview agar halaman tetap ringan.
  const previewRows = borrowings.slice(0, 10);

  return (
    <div className="stack">
      <div className="panel stack">
        <div className="topbar">
          <div>
            <h1 className="title">Laporan Peminjaman</h1>
            <p className="subtitle">Preview rekap peminjaman sebelum export menggunakan ExcelJS.</p>
          </div>
          <Link className="button" href="/reports/export">Export Excel</Link>
        </div>
        <div className="grid">
          <div className="card">
            <p className="subtitle">Total Transaksi</p>
            <div className="metric">{totalBorrowings}</div>
          </div>
          <div className="card">
            <p className="subtitle">Menunggu</p>
            <div className="metric">{pendingBorrowings}</div>
          </div>
          <div className="card">
            <p className="subtitle">Selesai</p>
            <div className="metric">{completedBorrowings}</div>
          </div>
        </div>
      </div>

      <div className="panel stack">
        <div>
          <h2 className="title">Preview Laporan</h2>
          <p className="subtitle">Menampilkan 10 transaksi terbaru dari data yang akan diexport.</p>
        </div>
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Peminjam</th>
                <th>Jenis</th>
                <th>Ruang</th>
                <th>Tanggal</th>
                <th>Durasi</th>
                <th>Peralatan</th>
                <th>Status</th>
                <th>Keperluan</th>
              </tr>
            </thead>
            <tbody>
              {previewRows.map((borrowing) => (
                <tr key={borrowing.id}>
                  <td>{borrowing.borrower.name}</td>
                  <td><span className="badge">{borrowing.borrower.accountType}</span></td>
                  <td>{borrowing.room?.name ?? "-"}</td>
                  <td>{borrowing.usageDate.toISOString().slice(0, 10)}</td>
                  <td>{borrowing.durationHours} jam</td>
                  <td>
                    {borrowing.equipmentItems.length
                      ? borrowing.equipmentItems.map((item) => (
                          <div key={item.id}>{item.equipment.name} x {item.quantity}</div>
                        ))
                      : "-"}
                  </td>
                  <td><span className="badge">{borrowing.status}</span></td>
                  <td>{borrowing.purpose}</td>
                </tr>
              ))}
              {previewRows.length === 0 ? (
                <tr>
                  <td colSpan={8}>Belum ada data peminjaman.</td>
                </tr>
              ) : null}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
