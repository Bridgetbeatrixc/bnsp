// Link dipakai untuk tombol tambah dan edit.
import Link from "next/link";
// FlashMessage dipakai untuk menampilkan notifikasi sukses/gagal.
import { FlashMessage } from "@/components/FlashMessage";
// Action hapus dan reset password peminjam dipasang pada form admin.
import { deleteBorrower, resetBorrowerPassword } from "@/lib/actions";
// Halaman peminjam hanya boleh dibuka admin.
import { requireAdmin } from "@/lib/auth";
// Service peminjam mengambil data dari database.
import { BorrowerService } from "@/services/BorrowerService";
// Utility Tailwind bersama untuk layout, tabel, dan tombol.
import { ui } from "@/lib/ui";

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
    <div className={ui.stack}>
      <div className={ui.topbar}>
        <div>
          <h1 className={ui.title}>Manajemen Peminjam</h1>
          <p className={ui.subtitle}>Kelola mahasiswa dan dosen yang mengajukan peminjaman.</p>
        </div>
        <Link className={ui.button} href="/borrowers/new">
          Tambah
        </Link>
      </div>
      {success === "created" ? <FlashMessage message="Peminjam berhasil ditambahkan." type="success" /> : null}
      {success === "updated" ? <FlashMessage message="Peminjam berhasil diubah." type="success" /> : null}
      {success === "deleted" ? <FlashMessage message="Peminjam berhasil dihapus." type="success" /> : null}
      {success === "reset" ? <FlashMessage message="Password peminjam berhasil direset ke NIM/NIK." type="success" /> : null}
      {error === "delete-used" ? (
        <FlashMessage message="Peminjam tidak bisa dihapus karena sudah memiliki akun atau data peminjaman." type="error" />
      ) : null}
      {error === "reset" ? <FlashMessage message="Password peminjam gagal direset." type="error" /> : null}
      <div className={ui.tableWrap}>
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
                <td><span className={ui.badge}>{borrower.accountType}</span></td>
                <td>
                  <div>{borrower.account?.username ?? borrower.email}</div>
                  <small>Password awal: {borrower.identityNumber}</small>
                </td>
                <td className={ui.actions}>
                  <Link className={ui.ghostButton} href={`/borrowers/${borrower.id}/edit`}>
                    Ubah
                  </Link>
                  <form action={resetBorrowerPassword.bind(null, borrower.id)}>
                    <button className={ui.ghostButton} type="submit">Reset Password</button>
                  </form>
                  <form action={deleteBorrower.bind(null, borrower.id)}>
                    <button className={ui.dangerButton} type="submit">Hapus</button>
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
