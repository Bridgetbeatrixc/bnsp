// Tipe role sederhana agar aturan akses bisa dites tanpa koneksi database.
export type UserRoleName = "ADMIN" | "MAHASISWA" | "DOSEN";

// Mengecek apakah role saat ini adalah admin.
export function isAdminRole(role: UserRoleName) {
  return role === "ADMIN";
}

// Admin boleh mengelola data master seperti peminjam, ruang, dan peralatan.
export function canManageMasterData(role: UserRoleName) {
  return isAdminRole(role);
}

// Admin boleh mengubah status peminjaman menjadi disetujui, ditolak, atau selesai.
export function canUpdateBorrowingStatus(role: UserRoleName) {
  return isAdminRole(role);
}

// Admin boleh melihat semua peminjaman, user biasa hanya boleh melihat miliknya sendiri.
export function canViewBorrowing(
  role: UserRoleName,
  accountBorrowerId: string | null,
  borrowingBorrowerId: string
) {
  return isAdminRole(role) || accountBorrowerId === borrowingBorrowerId;
}

// Admin memakai pilihan borrower dari form, sedangkan mahasiswa/dosen memakai profilnya sendiri.
export function resolveBorrowerIdForBorrowing(
  role: UserRoleName,
  accountBorrowerId: string | null,
  selectedBorrowerId?: string
) {
  return isAdminRole(role) ? selectedBorrowerId : accountBorrowerId;
}
