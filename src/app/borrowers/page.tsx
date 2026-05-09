// Link dipakai untuk tombol tambah dan edit.
import Link from "next/link";
// Action hapus peminjam dipasang pada form hapus.
import { deleteBorrower } from "@/lib/actions";
// Halaman peminjam hanya boleh dibuka admin.
import { requireAdmin } from "@/lib/auth";
// Service peminjam mengambil data dari database.
import { BorrowerService } from "@/services/BorrowerService";

// Halaman ini dinamis karena membaca database dan session.
export const dynamic = "force-dynamic";

// Halaman daftar peminjam.
export default async function BorrowersPage() {
  // Pastikan user adalah admin.
  await requireAdmin();
  // Ambil semua data peminjam.
  const borrowers = await new BorrowerService().findAll();

  return (
    <div className="stack">
      <div className="topbar">
        <div>
          <h1 className="title">Manajemen Peminjam</h1>
          <p className="subtitle">Kelola mahasiswa dan dosen yang mengajukan peminjaman.</p>
        </div>
        <Link className="button" href="/borrowers/new">
          Tambah
        </Link>
      </div>
      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th>Nama</th>
              <th>NIM/NIK</th>
              <th>HP</th>
              <th>Jenis</th>
              <th>Aksi</th>
            </tr>
          </thead>
          <tbody>
            {borrowers.map((borrower) => (
              <tr key={borrower.id}>
                <td>{borrower.name}</td>
                <td>{borrower.identityNumber}</td>
                <td>{borrower.phone}</td>
                <td><span className="badge">{borrower.accountType}</span></td>
                <td className="actions">
                  <Link className="button ghost" href={`/borrowers/${borrower.id}/edit`}>
                    Ubah
                  </Link>
                  <form action={deleteBorrower.bind(null, borrower.id)}>
                    <button className="danger" type="submit">Hapus</button>
                  </form>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
