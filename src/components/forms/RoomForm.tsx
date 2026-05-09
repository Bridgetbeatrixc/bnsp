"use client";

// Link dipakai untuk tombol batal kembali ke daftar ruang.
import Link from "next/link";
// Tipe event React dipakai untuk validasi input angka di browser.
import type { ClipboardEvent, KeyboardEvent } from "react";

// Tombol ini tidak boleh masuk ke field angka.
const blockedNumberKeys = ["-", "+", "e", "E", "."];

// Mencegah user mengetik nilai negatif atau angka tidak utuh.
function preventInvalidNumberKey(event: KeyboardEvent<HTMLInputElement>) {
  if (blockedNumberKeys.includes(event.key)) {
    event.preventDefault();
  }
}

// Mencegah paste nilai negatif atau teks non-angka.
function preventInvalidNumberPaste(event: ClipboardEvent<HTMLInputElement>) {
  const pastedText = event.clipboardData.getData("text");
  if (!/^\d+$/.test(pastedText)) {
    event.preventDefault();
  }
}

// Props form ruang dipakai untuk mode tambah dan ubah.
type RoomFormProps = {
  title: string;
  room?: {
    code: string;
    name: string;
    capacity: number;
    building: string;
    floor: number;
    status: "TERSEDIA" | "TIDAK_TERSEDIA";
  };
  action: (formData: FormData) => void | Promise<void>;
};

// Form ruang untuk kapasitas, gedung, lantai, dan status.
export function RoomForm({ title, room, action }: RoomFormProps) {
  return (
    <form action={action} className="panel stack">
      <div>
        <h1 className="title">{title}</h1>
        <p className="subtitle">Data ruang digunakan saat transaksi peminjaman dibuat.</p>
      </div>
      <div className="form-grid">
        <label>Kode<input name="code" defaultValue={room?.code} required /></label>
        <label>Nama<input name="name" defaultValue={room?.name} required /></label>
        <label>Kapasitas
          <input
            defaultValue={room?.capacity}
            inputMode="numeric"
            min="1"
            name="capacity"
            onKeyDown={preventInvalidNumberKey}
            onPaste={preventInvalidNumberPaste}
            pattern="[0-9]*"
            required
            type="number"
          />
        </label>
        <label>Gedung<input name="building" defaultValue={room?.building} required /></label>
        <label>Lantai
          <input
            defaultValue={room?.floor ?? 1}
            inputMode="numeric"
            min="0"
            name="floor"
            onKeyDown={preventInvalidNumberKey}
            onPaste={preventInvalidNumberPaste}
            pattern="[0-9]*"
            required
            type="number"
          />
        </label>
        <label>Status
          <select name="status" defaultValue={room?.status ?? "TERSEDIA"}>
            <option value="TERSEDIA">Tersedia</option>
            <option value="TIDAK_TERSEDIA">Tidak tersedia</option>
          </select>
        </label>
      </div>
      <div className="actions">
        <button type="submit">Simpan</button>
        <Link className="button ghost" href="/rooms">Batal</Link>
      </div>
    </form>
  );
}
