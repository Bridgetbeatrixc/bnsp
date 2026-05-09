// Link dipakai untuk tombol batal kembali ke daftar peminjam.
import Link from "next/link";

// Props form peminjam dipakai untuk mode tambah dan ubah.
type BorrowerFormProps = {
  title: string;
  borrower?: {
    name: string;
    identityNumber: string;
    phone: string;
    accountType: "MAHASISWA" | "DOSEN";
  };
  action: (formData: FormData) => void | Promise<void>;
};

// Form peminjam untuk data mahasiswa/dosen.
export function BorrowerForm({ title, borrower, action }: BorrowerFormProps) {
  return (
    <form action={action} className="panel stack">
      <div>
        <h1 className="title">{title}</h1>
        <p className="subtitle">Field wajib diisi sebelum data disimpan.</p>
      </div>
      <div className="form-grid">
        <label>Nama<input name="name" defaultValue={borrower?.name} required /></label>
        <label>NIM/NIK<input name="identityNumber" defaultValue={borrower?.identityNumber} required /></label>
        <label>Nomor HP<input name="phone" defaultValue={borrower?.phone} required /></label>
        <label>Jenis Akun
          <select name="accountType" defaultValue={borrower?.accountType ?? "MAHASISWA"}>
            <option value="MAHASISWA">Mahasiswa</option>
            <option value="DOSEN">Dosen</option>
          </select>
        </label>
      </div>
      <div className="actions">
        <button type="submit">Simpan</button>
        <Link className="button ghost" href="/borrowers">Batal</Link>
      </div>
    </form>
  );
}
