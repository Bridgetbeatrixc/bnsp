// Link dipakai untuk tombol download Excel.
import Link from "next/link";
// requireAdmin membatasi laporan hanya untuk admin.
import { requireAdmin } from "@/lib/auth";

// Halaman laporan dinamis karena membaca session admin.
export const dynamic = "force-dynamic";

// Halaman laporan peminjaman.
export default async function ReportsPage() {
  // Pastikan hanya admin yang bisa membuka laporan.
  await requireAdmin();
  return (
    <div className="panel stack">
      <div>
        <h1 className="title">Laporan Peminjaman</h1>
        <p className="subtitle">Export rekap peminjaman menggunakan library pihak ketiga ExcelJS.</p>
      </div>
      <div className="actions">
        <Link className="button" href="/reports/export">Export Excel</Link>
      </div>
    </div>
  );
}
