// Link dipakai untuk tombol batal kembali ke daftar peralatan.
import Link from "next/link";

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
        <label>Stok<input name="stock" type="number" min="0" defaultValue={equipment?.stock ?? 0} required /></label>
      </div>
      <div className="actions">
        <button type="submit">Simpan</button>
        <Link className="button ghost" href="/equipment">Batal</Link>
      </div>
    </form>
  );
}
