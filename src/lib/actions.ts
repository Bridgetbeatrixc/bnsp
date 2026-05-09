"use server";

// Mengambil helper Next.js untuk refresh halaman setelah data berubah.
import { revalidatePath } from "next/cache";
// Mengambil helper Next.js untuk pindah halaman setelah action selesai.
import { redirect } from "next/navigation";
// Service login dipakai untuk memeriksa username dan password.
import { AccountService } from "@/services/AccountService";
// Service peminjam menangani CRUD data mahasiswa/dosen.
import { BorrowerService } from "@/services/BorrowerService";
// Service peminjaman menangani transaksi peminjaman.
import { BorrowingService } from "@/services/BorrowingService";
// Service peralatan menangani CRUD stok dan kategori barang.
import { EquipmentService } from "@/services/EquipmentService";
// Service ruang menangani CRUD data ruang.
import { RoomService } from "@/services/RoomService";
// Helper auth dipakai untuk session login dan pembatasan role.
import { clearAccountSession, requireAccount, requireAdmin, setAccountSession } from "@/lib/auth";

// Mengubah FormData dari form HTML menjadi object biasa agar mudah divalidasi.
const toObject = (formData: FormData) => Object.fromEntries(formData.entries());

// Login user, simpan session, lalu arahkan ke dashboard sesuai role.
export async function login(formData: FormData) {
  // Siapkan variable akun agar bisa diisi setelah validasi berhasil.
  let account;
  // Tangkap error login agar production tidak menampilkan application error.
  try {
    // Validasi username/password lewat service account.
    account = await new AccountService().login(toObject(formData));
  } catch {
    // Jika username/password salah, kembali ke login dengan pesan error.
    redirect("/login?error=invalid");
  }
  // Simpan id akun ke cookie session.
  setAccountSession(account.id);
  // Refresh dashboard agar membaca session terbaru.
  revalidatePath("/");
  // Arahkan user ke dashboard.
  redirect("/");
}

// Logout user dengan menghapus cookie session.
export async function logout() {
  // Hapus session login dari cookie.
  clearAccountSession();
  // Refresh dashboard agar status login hilang.
  revalidatePath("/");
  // Arahkan kembali ke halaman login.
  redirect("/login");
}

// Membuat data peminjam baru. Hanya admin yang boleh.
export async function createBorrower(formData: FormData) {
  // Pastikan role user adalah ADMIN.
  await requireAdmin();
  // Kirim data form ke service untuk divalidasi dan disimpan.
  await new BorrowerService().create(toObject(formData));
  // Refresh halaman daftar peminjam.
  revalidatePath("/borrowers");
  // Kembali ke daftar peminjam.
  redirect("/borrowers");
}

// Mengubah data peminjam berdasarkan id. Hanya admin yang boleh.
export async function updateBorrower(id: string, formData: FormData) {
  // Pastikan role user adalah ADMIN.
  await requireAdmin();
  // Validasi dan update data peminjam.
  await new BorrowerService().update(id, toObject(formData));
  // Refresh halaman daftar peminjam.
  revalidatePath("/borrowers");
  // Kembali ke daftar peminjam.
  redirect("/borrowers");
}

// Menghapus data peminjam. Hanya admin yang boleh.
export async function deleteBorrower(id: string) {
  // Pastikan role user adalah ADMIN.
  await requireAdmin();
  // Hapus data peminjam berdasarkan id.
  await new BorrowerService().delete(id);
  // Refresh halaman daftar peminjam.
  revalidatePath("/borrowers");
}

// Membuat data ruang baru. Hanya admin yang boleh.
export async function createRoom(formData: FormData) {
  // Pastikan role user adalah ADMIN.
  await requireAdmin();
  // Validasi dan simpan data ruang.
  await new RoomService().create(toObject(formData));
  // Refresh daftar ruang.
  revalidatePath("/rooms");
  // Kembali ke daftar ruang.
  redirect("/rooms");
}

// Mengubah data ruang berdasarkan id. Hanya admin yang boleh.
export async function updateRoom(id: string, formData: FormData) {
  // Pastikan role user adalah ADMIN.
  await requireAdmin();
  // Validasi dan update data ruang.
  await new RoomService().update(id, toObject(formData));
  // Refresh daftar ruang.
  revalidatePath("/rooms");
  // Kembali ke daftar ruang.
  redirect("/rooms");
}

// Menghapus data ruang. Hanya admin yang boleh.
export async function deleteRoom(id: string) {
  // Pastikan role user adalah ADMIN.
  await requireAdmin();
  // Hapus ruang berdasarkan id.
  await new RoomService().delete(id);
  // Refresh daftar ruang.
  revalidatePath("/rooms");
}

// Membuat data peralatan baru. Hanya admin yang boleh.
export async function createEquipment(formData: FormData) {
  // Pastikan role user adalah ADMIN.
  await requireAdmin();
  // Validasi dan simpan data peralatan.
  await new EquipmentService().create(toObject(formData));
  // Refresh daftar peralatan.
  revalidatePath("/equipment");
  // Kembali ke daftar peralatan.
  redirect("/equipment");
}

// Mengubah data peralatan berdasarkan id. Hanya admin yang boleh.
export async function updateEquipment(id: string, formData: FormData) {
  // Pastikan role user adalah ADMIN.
  await requireAdmin();
  // Validasi dan update data peralatan.
  await new EquipmentService().update(id, toObject(formData));
  // Refresh daftar peralatan.
  revalidatePath("/equipment");
  // Kembali ke daftar peralatan.
  redirect("/equipment");
}

// Menghapus data peralatan. Hanya admin yang boleh.
export async function deleteEquipment(id: string) {
  // Pastikan role user adalah ADMIN.
  await requireAdmin();
  // Hapus peralatan berdasarkan id.
  await new EquipmentService().delete(id);
  // Refresh daftar peralatan.
  revalidatePath("/equipment");
}

// Membuat transaksi peminjaman ruang, barang, atau keduanya.
export async function createBorrowing(formData: FormData) {
  // Ambil akun login untuk menentukan hak akses dan borrowerId.
  const account = await requireAccount();
  // Ambil semua dropdown barang yang dikirim dari form.
  const equipmentIds = formData.getAll("equipmentId").map(String);
  // Ambil semua jumlah barang yang sejajar dengan dropdown barang.
  const quantities = formData.getAll("quantity").map(Number);
  // Gabungkan barang dan jumlah, lalu buang baris kosong atau jumlah 0.
  const equipmentItems = equipmentIds
    .map((equipmentId, index) => ({
      equipmentId,
      quantity: quantities[index]
    }))
    // Simpan semua baris yang memilih barang agar quantity negatif tetap ditolak oleh Zod.
    .filter((item) => item.equipmentId);

  // Ubah FormData utama menjadi object biasa.
  const formObject = toObject(formData);
  // Admin boleh memilih peminjam; mahasiswa/dosen selalu memakai akunnya sendiri.
  const borrowerId = account.role === "ADMIN" ? formObject.borrowerId : account.borrowerId;

  // Cegah akun tanpa profil peminjam membuat transaksi.
  if (!borrowerId) {
    throw new Error("Akun ini belum terhubung dengan data peminjam");
  }

  // Validasi dan simpan transaksi peminjaman lewat service.
  await new BorrowingService().create({
    ...formObject,
    borrowerId,
    equipmentItems
  });
  // Refresh riwayat peminjaman setelah transaksi dibuat.
  revalidatePath("/borrowings");
  // Kembali ke halaman peminjaman.
  redirect("/borrowings");
}

// Mengubah status peminjaman. Hanya admin yang boleh.
export async function updateBorrowingStatus(id: string, formData: FormData) {
  // Pastikan role user adalah ADMIN.
  await requireAdmin();
  // Validasi status dan simpan perubahan.
  await new BorrowingService().updateStatus(id, toObject(formData));
  // Refresh daftar peminjaman.
  revalidatePath("/borrowings");
  // Kembali ke halaman peminjaman.
  redirect("/borrowings");
}
