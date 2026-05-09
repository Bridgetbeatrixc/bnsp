// Link dipakai untuk tombol tambah dan edit.
import Link from "next/link";
// Action hapus ruang dipasang pada form hapus.
import { deleteRoom } from "@/lib/actions";
// Halaman ruang hanya boleh dibuka admin.
import { requireAdmin } from "@/lib/auth";
// Service ruang mengambil data dari database.
import { RoomService } from "@/services/RoomService";

// Halaman ini dinamis karena membaca database dan session.
export const dynamic = "force-dynamic";

// Halaman daftar ruang.
export default async function RoomsPage() {
  // Pastikan user adalah admin.
  await requireAdmin();
  // Ambil semua data ruang.
  const rooms = await new RoomService().findAll();

  return (
    <div className="stack">
      <div className="topbar">
        <div>
          <h1 className="title">Manajemen Ruang</h1>
          <p className="subtitle">Kelola kapasitas, gedung, lantai, dan ketersediaan ruang.</p>
        </div>
        <Link className="button" href="/rooms/new">Tambah</Link>
      </div>
      <div className="table-wrap">
        <table>
          <thead><tr><th>Kode</th><th>Nama</th><th>Kapasitas</th><th>Lokasi</th><th>Status</th><th>Aksi</th></tr></thead>
          <tbody>
            {rooms.map((room) => (
              <tr key={room.id}>
                <td>{room.code}</td>
                <td>{room.name}</td>
                <td>{room.capacity}</td>
                <td>{room.building}, Lantai {room.floor}</td>
                <td><span className="badge">{room.status}</span></td>
                <td className="actions">
                  <Link className="button ghost" href={`/rooms/${room.id}/edit`}>Ubah</Link>
                  <form action={deleteRoom.bind(null, room.id)}>
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
