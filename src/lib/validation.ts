// Zod dipakai untuk validasi input sebelum data masuk database.
import { z } from "zod";

// Jenis akun peminjam hanya boleh mahasiswa atau dosen.
export const accountTypeSchema = z.enum(["MAHASISWA", "DOSEN"]);
// Status ruang hanya boleh tersedia atau tidak tersedia.
export const roomStatusSchema = z.enum(["TERSEDIA", "TIDAK_TERSEDIA"]);
// Status peminjaman mengikuti kebutuhan studi kasus.
export const borrowingStatusSchema = z.enum([
  "MENUNGGU",
  "DISETUJUI",
  "DITOLAK",
  "SELESAI"
]);

// String wajib tidak boleh kosong setelah spasi depan/belakang dibuang.
export const requiredString = z.string().trim().min(1, "Field wajib diisi");
// Angka positif dipakai untuk durasi dan jumlah pinjam.
export const positiveInteger = z.coerce.number().int().positive("Nilai harus lebih dari 0");
// Angka nol atau lebih dipakai untuk stok.
export const nonNegativeInteger = z.coerce.number().int().min(0, "Nilai tidak boleh negatif");
// Input tanggal dipaksa menjadi Date dan ditolak jika format salah.
export const dateInput = z.coerce.date({
  invalid_type_error: "Format tanggal tidak valid"
});

// Validasi form peminjam.
export const borrowerSchema = z.object({
  name: requiredString,
  identityNumber: requiredString,
  phone: requiredString,
  accountType: accountTypeSchema
});

// Validasi form ruang.
export const roomSchema = z.object({
  code: requiredString,
  name: requiredString,
  capacity: positiveInteger,
  building: requiredString,
  floor: z.coerce.number().int().min(0, "Lantai tidak boleh negatif"),
  status: roomStatusSchema
});

// Validasi form peralatan.
export const equipmentSchema = z.object({
  code: requiredString,
  name: requiredString,
  stock: nonNegativeInteger,
  category: requiredString
});

// Validasi satu baris barang pada transaksi peminjaman.
export const borrowingEquipmentInputSchema = z.object({
  equipmentId: requiredString,
  quantity: positiveInteger
});

// Validasi transaksi peminjaman.
export const borrowingSchema = z.object({
  borrowerId: requiredString,
  // Ruang boleh kosong karena user bisa pinjam barang saja.
  roomId: z.preprocess(
    (value) => (value === "" ? undefined : value),
    requiredString.optional()
  ),
  requestDate: dateInput,
  usageDate: dateInput,
  durationHours: positiveInteger,
  purpose: requiredString,
  // Peralatan boleh kosong karena user bisa pinjam ruang saja.
  equipmentItems: z.array(borrowingEquipmentInputSchema)
}).refine((value) => value.roomId || value.equipmentItems.length > 0, {
  // Minimal salah satu harus ada: ruang atau peralatan.
  message: "Minimal pilih ruang atau satu peralatan",
  path: ["roomId"]
});

// Validasi update status oleh admin.
export const statusUpdateSchema = z
  .object({
    status: borrowingStatusSchema,
    // String kosong dari input datetime dianggap tidak diisi.
    actualReturnTime: z.preprocess(
      (value) => (value === "" ? undefined : value),
      z.coerce.date().optional()
    )
  })
  // Jika status selesai, waktu pengembalian wajib ada.
  .refine((value) => value.status !== "SELESAI" || value.actualReturnTime, {
    message: "Waktu pengembalian aktual wajib diisi saat status selesai",
    path: ["actualReturnTime"]
  });

// TypeScript type diambil dari schema agar input service tetap konsisten.
export type BorrowerInput = z.infer<typeof borrowerSchema>;
export type RoomInput = z.infer<typeof roomSchema>;
export type EquipmentInput = z.infer<typeof equipmentSchema>;
export type BorrowingInput = z.infer<typeof borrowingSchema>;
export type StatusUpdateInput = z.infer<typeof statusUpdateSchema>;

// Memastikan jumlah barang yang dipinjam tidak melebihi stok.
export function validateEquipmentStock(
  requestedItems: Array<{ equipmentId: string; quantity: number }>,
  stockByEquipmentId: Map<string, number>
) {
  // Cek satu per satu barang yang diminta.
  for (const item of requestedItems) {
    // Jika barang tidak ditemukan, stok dianggap 0.
    const stock = stockByEquipmentId.get(item.equipmentId) ?? 0;
    // Tolak jika jumlah pinjam lebih besar dari stok tersedia.
    if (item.quantity > stock) {
      throw new Error("Jumlah peralatan yang dipinjam melebihi stok tersedia");
    }
  }
}
