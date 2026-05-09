"use client";

// Link dipakai untuk tombol batal kembali ke daftar peralatan.
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

// Props form peralatan dipakai untuk mode tambah dan ubah.
type EquipmentFormProps = {
  title: string;
  equipment?: {
    code: string;
    name: string;
    stock: number;
    category: string;
  };
  action: (formData: FormData) => void | Promise<void>;
};

// Form peralatan untuk kode, nama, kategori, dan stok.
export function EquipmentForm({ title, equipment, action }: EquipmentFormProps) {
  return (
    <form action={action} className="panel stack">
      <div>
        <h1 className="title">{title}</h1>
        <p className="subtitle">Stok dipakai untuk validasi transaksi peminjaman.</p>
      </div>
      <div className="form-grid">
        <label>Kode<input name="code" defaultValue={equipment?.code} required /></label>
        <label>Nama<input name="name" defaultValue={equipment?.name} required /></label>
        <label>Kategori<input name="category" defaultValue={equipment?.category} required /></label>
        <label>Stok
          <input
            defaultValue={equipment?.stock ?? 0}
            inputMode="numeric"
            min="0"
            name="stock"
            onKeyDown={preventInvalidNumberKey}
            onPaste={preventInvalidNumberPaste}
            pattern="[0-9]*"
            required
            type="number"
          />
        </label>
      </div>
      <div className="actions">
        <button type="submit">Simpan</button>
        <Link className="button ghost" href="/equipment">Batal</Link>
      </div>
    </form>
  );
}
