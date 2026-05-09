// ExcelJS adalah library pihak ketiga untuk membuat file Excel.
import ExcelJS from "exceljs";
// Report membutuhkan data peminjaman lengkap dari service.
import { BorrowingService } from "@/services/BorrowingService";

// Service OOP untuk membuat laporan rekap peminjaman.
export class ReportService {
  // Membuat workbook Excel yang siap di-download.
  async buildBorrowingWorkbook() {
    // Buat file workbook baru.
    const workbook = new ExcelJS.Workbook();
    // Buat sheet utama laporan.
    const sheet = workbook.addWorksheet("Rekap Peminjaman");
    // Ambil seluruh data peminjaman dari service.
    const borrowings = await new BorrowingService().findAll();

    // Definisikan kolom laporan agar rapi saat dibuka di Excel.
    sheet.columns = [
      { header: "Peminjam", key: "borrower", width: 24 },
      { header: "Jenis Akun", key: "accountType", width: 16 },
      { header: "Ruang", key: "room", width: 18 },
      { header: "Tanggal Pakai", key: "usageDate", width: 18 },
      { header: "Durasi", key: "durationHours", width: 10 },
      { header: "Status", key: "status", width: 14 },
      { header: "Peralatan", key: "equipment", width: 40 },
      { header: "Keperluan", key: "purpose", width: 36 }
    ];

    // Isi setiap baris laporan dari data peminjaman.
    borrowings.forEach((borrowing) => {
      sheet.addRow({
        borrower: borrowing.borrower.name,
        accountType: borrowing.borrower.accountType,
        // Room bisa kosong jika peminjaman hanya barang.
        room: borrowing.room?.name ?? "-",
        usageDate: borrowing.usageDate.toISOString().slice(0, 10),
        durationHours: borrowing.durationHours,
        status: borrowing.status,
        // Gabungkan banyak barang menjadi satu teks ringkas.
        equipment: borrowing.equipmentItems
          .map((item) => `${item.equipment.name} (${item.quantity})`)
          .join(", "),
        purpose: borrowing.purpose
      });
    });

    // Header dibuat tebal agar mudah dibaca.
    sheet.getRow(1).font = { bold: true };
    // Kembalikan workbook ke route export.
    return workbook;
  }
}
