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
              <th>Email</th>
              <th>HP</th>
              <th>Jenis</th>
              <th>Akun Login</th>
              <th>Aksi</th>
            </tr>
          </thead>
          <tbody>
            {borrowers.map((borrower) => (
              <tr key={borrower.id}>
                <td>{borrower.name}</td>
                <td>{borrower.identityNumber}</td>
                <td>{borrower.email}</td>
                <td>{borrower.phone}</td>
                <td><span className="badge">{borrower.accountType}</span></td>
                <td>
                  <div>{borrower.account?.username ?? borrower.email}</div>
                  <small>Password awal: {borrower.identityNumber}</small>
                </td>
                <td className="actions">
                  {borrower.email ? (
                    <a
                      className="button ghost"
                      href={`mailto:${borrower.email}?subject=Akun%20Peminjaman%20Universitas%20XYZ&body=Halo%20${encodeURIComponent(borrower.name)}%2C%0A%0AAkun%20peminjaman%20Universitas%20XYZ%20Anda%20sudah%20dibuat.%0AUsername%3A%20${encodeURIComponent(borrower.email)}%0APassword%20awal%3A%20${encodeURIComponent(borrower.identityNumber)}%0A%0ASilakan%20login%20dan%20ubah%20password%20jika%20fitur%20ubah%20password%20tersedia.%0A`}
                    >
                      Kirim Email
                    </a>
                  ) : null}
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
