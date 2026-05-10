// Link dipakai untuk tombol batal kembali ke daftar peminjam.
import Link from "next/link";
// Utility Tailwind bersama untuk form dan tombol.
import { cx, ui } from "@/lib/ui";

// Props form peminjam dipakai untuk mode tambah dan ubah.
type BorrowerFormProps = {
  title: string;
  borrower?: {
    name: string;
    identityNumber: string;
    email: string | null;
    phone: string;
    accountType: "MAHASISWA" | "DOSEN";
  };
  action: (formData: FormData) => void | Promise<void>;
};

// Form peminjam untuk data mahasiswa/dosen.
export function BorrowerForm({ title, borrower, action }: BorrowerFormProps) {
  return (
    <form action={action} className={cx(ui.panel, ui.stack, ui.formControls)}>
      <div>
        <h1 className={ui.title}>{title}</h1>
        <p className={ui.subtitle}>Email menjadi username login. Password awal memakai NIM/NIK.</p>
      </div>
      <div className={ui.formGrid}>
        <label>Nama<input name="name" defaultValue={borrower?.name} required /></label>
        <label>NIM/NIK<input name="identityNumber" defaultValue={borrower?.identityNumber} required /></label>
        <label>Email<input name="email" defaultValue={borrower?.email ?? ""} required type="email" /></label>
        <label>Nomor HP<input name="phone" defaultValue={borrower?.phone} required /></label>
        <label>Jenis Akun
          <select name="accountType" defaultValue={borrower?.accountType ?? "MAHASISWA"}>
            <option value="MAHASISWA">Mahasiswa</option>
            <option value="DOSEN">Dosen</option>
          </select>
        </label>
      </div>
      <div className={ui.actions}>
        <button className={ui.button} type="submit">Simpan</button>
        <Link className={ui.ghostButton} href="/borrowers">Batal</Link>
      </div>
    </form>
  );
}
