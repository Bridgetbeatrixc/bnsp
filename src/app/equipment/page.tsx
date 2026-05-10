// Link dipakai untuk tombol tambah dan edit.
import Link from "next/link";
// FlashMessage dipakai untuk menampilkan notifikasi sukses/gagal.
import { FlashMessage } from "@/components/FlashMessage";
// Action hapus peralatan dipasang pada form hapus.
import { deleteEquipment } from "@/lib/actions";
// Halaman peralatan hanya boleh dibuka admin.
import { requireAdmin } from "@/lib/auth";
// Service peralatan mengambil data dari database.
import { EquipmentService } from "@/services/EquipmentService";

// Halaman ini dinamis karena membaca database dan session.
export const dynamic = "force-dynamic";

// Halaman daftar peralatan.
export default async function EquipmentPage({
  searchParams
}: {
  searchParams?: { success?: string; error?: string };
}) {
  // Pastikan user adalah admin.
  await requireAdmin();
  // Ambil semua data peralatan.
  const equipment = await new EquipmentService().findAll();
  // Ambil status query untuk menentukan notifikasi yang ditampilkan.
  const success = searchParams?.success;
  const error = searchParams?.error;

  return (
    <div className="stack">
      <div className="topbar">
        <div>
          <h1 className="title">Manajemen Peralatan</h1>
          <p className="subtitle">Kelola kode, kategori, dan stok peralatan pendukung.</p>
        </div>
        <Link className="button" href="/equipment/new">Tambah</Link>
      </div>
      {success === "created" ? <FlashMessage message="Peralatan berhasil ditambahkan." type="success" /> : null}
      {success === "updated" ? <FlashMessage message="Peralatan berhasil diubah." type="success" /> : null}
      {success === "deleted" ? (
        <FlashMessage message="Peralatan berhasil dihapus dari daftar aktif. Riwayat peminjaman lama tetap tersimpan." type="success" />
      ) : null}
      {error === "delete-used" ? <FlashMessage message="Peralatan gagal dihapus." type="error" /> : null}
      <div className="table-wrap">
        <table>
          <thead><tr><th>Kode</th><th>Nama</th><th>Kategori</th><th>Stok</th><th>Aksi</th></tr></thead>
          <tbody>
            {equipment.map((item) => (
              <tr key={item.id}>
                <td>{item.code}</td>
                <td>{item.name}</td>
                <td>{item.category}</td>
                <td>{item.stock}</td>
                <td className="actions">
                  <Link className="button ghost" href={`/equipment/${item.id}/edit`}>Ubah</Link>
                  <form action={deleteEquipment.bind(null, item.id)}>
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
