"use client";

// Link dipakai untuk tombol kembali ke halaman peminjaman.
import Link from "next/link";
// Tipe event React dipakai untuk validasi input angka di browser.
import type { ClipboardEvent, KeyboardEvent } from "react";
// useState dipakai untuk menambah/menghapus baris peralatan secara dinamis.
import { useState } from "react";

// Lookup sederhana untuk dropdown peminjam dan ruang.
type Lookup = { id: string; name: string };
// Data peralatan membutuhkan stok agar user tahu batas pinjam.
type EquipmentLookup = Lookup & { stock: number };
// Data timetable ditampilkan agar jadwal yang sudah dipakai terlihat.
type ExistingBooking = {
  id: string;
  borrowerName: string;
  roomName: string;
  usageDate: string;
  durationHours: number;
  status: string;
  equipment: string;
};

// Props form peminjaman dikirim dari server page.
type BorrowingFormProps = {
  borrowers: Lookup[];
  rooms: Lookup[];
  equipment: EquipmentLookup[];
  existingBookings: ExistingBooking[];
  fixedBorrower?: boolean;
  action: (formData: FormData) => void | Promise<void>;
};

// Tipe sederhana untuk baris dropdown peralatan.
type EquipmentRow = {
  id: number;
};

// Tombol ini tidak boleh masuk ke field angka positif.
const blockedNumberKeys = ["-", "+", "e", "E", "."];

// Mencegah user mengetik minus, plus, desimal, atau notasi eksponen.
function preventInvalidNumberKey(event: KeyboardEvent<HTMLInputElement>) {
  if (blockedNumberKeys.includes(event.key)) {
    event.preventDefault();
  }
}

// Mencegah paste nilai negatif atau teks non-angka ke field angka.
function preventInvalidNumberPaste(event: ClipboardEvent<HTMLInputElement>) {
  const pastedText = event.clipboardData.getData("text");
  if (!/^\d+$/.test(pastedText)) {
    event.preventDefault();
  }
}

// Format tanggal dan jam mulai agar mudah dibaca user Indonesia.
function formatDateTime(value: string) {
  // Ubah string ISO dari server menjadi Date di browser.
  const date = new Date(value);
  return new Intl.DateTimeFormat("id-ID", {
    dateStyle: "medium",
    timeStyle: "short"
  }).format(date);
}

// Hitung dan format jam selesai berdasarkan durasi peminjaman.
function formatEndTime(value: string, durationHours: number) {
  // Ubah string ISO dari server menjadi Date di browser.
  const date = new Date(value);
  return new Intl.DateTimeFormat("id-ID", {
    timeStyle: "short"
  }).format(new Date(date.getTime() + durationHours * 60 * 60 * 1000));
}

// Form utama untuk membuat peminjaman ruang, barang, atau keduanya.
export function BorrowingForm({ borrowers, rooms, equipment, existingBookings, fixedBorrower = false, action }: BorrowingFormProps) {
  // Untuk mahasiswa/dosen, borrower sudah tetap dari akun login.
  const selectedBorrower = borrowers[0];
  // Baris peralatan dimulai kosong agar user tidak melihat tiga item otomatis.
  const [equipmentRows, setEquipmentRows] = useState<EquipmentRow[]>([]);
  // Id bertambah sederhana untuk key React saat menambah baris baru.
  const [nextRowId, setNextRowId] = useState(1);
  // Tambah satu baris peralatan ketika user memang ingin meminjam barang.
  const addEquipmentRow = () => {
    setEquipmentRows((rows) => [...rows, { id: nextRowId }]);
    setNextRowId((value) => value + 1);
  };
  // Hapus satu baris peralatan jika user berubah pikiran.
  const removeEquipmentRow = (id: number) => {
    setEquipmentRows((rows) => rows.filter((row) => row.id !== id));
  };

  return (
    <form action={action} className="panel stack">
      <div>
        <h1 className="title">Tambah Peminjaman</h1>
        <p className="subtitle">Pilih ruang saja, peralatan saja, atau keduanya.</p>
      </div>
      <div className="form-grid">
        {fixedBorrower ? (
          <label>Peminjam
            <input value={selectedBorrower?.name ?? "Akun belum terhubung ke peminjam"} readOnly />
            {/* borrowerId tetap dikirim agar server bisa validasi, tetapi server tetap memaksa akun sendiri untuk non-admin. */}
            <input name="borrowerId" type="hidden" value={selectedBorrower?.id ?? ""} />
          </label>
        ) : (
          <label>Peminjam
            <select name="borrowerId" required>
              <option value="">Pilih peminjam</option>
              {borrowers.map((borrower) => <option key={borrower.id} value={borrower.id}>{borrower.name}</option>)}
            </select>
          </label>
        )}
        <label>Ruang
          <select name="roomId">
            {/* Ruang boleh kosong karena peminjaman barang saja diperbolehkan. */}
            <option value="">Tidak pinjam ruang</option>
            {rooms.map((room) => <option key={room.id} value={room.id}>{room.name}</option>)}
          </select>
        </label>
        <label>Tanggal Pengajuan<input name="requestDate" type="date" required /></label>
        <label>Tanggal dan Jam Pakai<input name="usageDate" type="datetime-local" required /></label>
        <label>Durasi Jam
          <input
            inputMode="numeric"
            min="1"
            name="durationHours"
            onKeyDown={preventInvalidNumberKey}
            onPaste={preventInvalidNumberPaste}
            pattern="[0-9]*"
            required
            type="number"
          />
        </label>
      </div>
      <label>Keperluan<textarea name="purpose" required /></label>
      <div className="panel">
        <h2>Peralatan</h2>
        <p className="subtitle">Klik tambah peralatan jika ingin meminjam barang. Biarkan kosong jika hanya meminjam ruang.</p>
        <div className="stack">
          {equipmentRows.map((row, index) => (
            <div className="equipment-row" key={row.id}>
              <label>Barang {index + 1}
                <select name="equipmentId" required>
                  <option value="">Pilih barang</option>
                  {equipment.map((item) => (
                    <option key={item.id} value={item.id}>
                      {item.name} - stok {item.stock}
                    </option>
                  ))}
                </select>
              </label>
              <label>Jumlah
                <input
                  inputMode="numeric"
                  min="1"
                  name="quantity"
                  onKeyDown={preventInvalidNumberKey}
                  onPaste={preventInvalidNumberPaste}
                  pattern="[0-9]*"
                  placeholder="Jumlah"
                  required
                  type="number"
                />
              </label>
              <button className="danger" onClick={() => removeEquipmentRow(row.id)} type="button">
                Hapus
              </button>
            </div>
          ))}
          {equipmentRows.length === 0 ? (
            <p className="empty-note">Belum ada peralatan dipilih.</p>
          ) : null}
          <button className="button ghost" onClick={addEquipmentRow} type="button">
            Tambah Peralatan
          </button>
        </div>
      </div>
      <section className="panel">
        <h2>Timetable Peminjaman</h2>
        <p className="subtitle">Jadwal sederhana untuk melihat waktu yang sudah dipakai.</p>
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Mulai</th>
                <th>Selesai</th>
                <th>Peminjam</th>
                <th>Ruang</th>
                <th>Peralatan</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {/* Tampilkan jadwal yang sudah tercatat agar user tidak bentrok waktu. */}
              {existingBookings.map((booking) => (
                <tr key={booking.id}>
                  <td>{formatDateTime(booking.usageDate)}</td>
                  <td>{formatEndTime(booking.usageDate, booking.durationHours)}</td>
                  <td>{booking.borrowerName}</td>
                  <td>{booking.roomName}</td>
                  <td>{booking.equipment}</td>
                  <td><span className="badge">{booking.status}</span></td>
                </tr>
              ))}
              {existingBookings.length === 0 ? (
                <tr>
                  <td colSpan={6}>Belum ada jadwal peminjaman.</td>
                </tr>
              ) : null}
            </tbody>
          </table>
        </div>
      </section>
      <div className="actions">
        <button type="submit">Simpan</button>
        <Link className="button ghost" href="/borrowings">Batal</Link>
      </div>
    </form>
  );
}
