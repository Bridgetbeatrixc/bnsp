// Link dipakai untuk tombol tambah dan edit.
import Link from "next/link";
// FlashMessage dipakai untuk menampilkan notifikasi sukses/gagal.
import { FlashMessage } from "@/components/FlashMessage";
// Action hapus peminjam dipasang pada form hapus.
import { deleteBorrower } from "@/lib/actions";
// Halaman peminjam hanya boleh dibuka admin.
import { requireAdmin } from "@/lib/auth";
// Service peminjam mengambil data dari database.
import { BorrowerService } from "@/services/BorrowerService";

// Halaman ini dinamis karena membaca database dan session.
export const dynamic = "force-dynamic";

// Halaman daftar peminjam.
export default async function BorrowersPage({
  searchParams
}: {
  searchParams?: { success?: string; error?: string };
}) {
  // Pastikan user adalah admin.
  await requireAdmin();
  // Ambil semua data peminjam.
  const borrowers = await new BorrowerService().findAll();
  // Ambil status query untuk menentukan notifikasi yang ditampilkan.
  const success = searchParams?.success;
  const error = searchParams?.error;

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
      {success === "created" ? <FlashMessage message="Peminjam berhasil ditambahkan." type="success" /> : null}
      {success === "updated" ? <FlashMessage message="Peminjam berhasil diubah." type="success" /> : null}
      {success === "deleted" ? <FlashMessage message="Peminjam berhasil dihapus." type="success" /> : null}
      {error === "delete-used" ? (
        <FlashMessage message="Peminjam tidak bisa dihapus karena sudah memiliki akun atau data peminjaman." type="error" />
      ) : null}
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
