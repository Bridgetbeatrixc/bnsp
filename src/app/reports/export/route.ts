// NextResponse dipakai untuk mengirim file Excel sebagai response download.
import { NextResponse } from "next/server";
// Hanya admin yang boleh export laporan.
import { requireAdmin } from "@/lib/auth";
// Service report membuat workbook Excel.
import { ReportService } from "@/services/ReportService";

// Route ini harus dinamis karena membaca database.
export const dynamic = "force-dynamic";

// Handler GET untuk download laporan Excel.
export async function GET() {
  // Pastikan hanya admin yang bisa export laporan.
  await requireAdmin();
  // Bangun workbook Excel dari data peminjaman.
  const workbook = await new ReportService().buildBorrowingWorkbook();
  // Ubah workbook menjadi buffer agar bisa dikirim sebagai file.
  const buffer = await workbook.xlsx.writeBuffer();

  // Kirim buffer Excel dengan header download.
  return new NextResponse(buffer, {
    headers: {
      "Content-Type": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "Content-Disposition": 'attachment; filename="rekap-peminjaman.xlsx"'
    }
  });
}
