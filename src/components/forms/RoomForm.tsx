// Link dipakai untuk tombol batal kembali ke daftar ruang.
import Link from "next/link";

// Props form ruang dipakai untuk mode tambah dan ubah.
type RoomFormProps = {
  title: string;
  room?: {
    code: string;
    name: string;
    capacity: number;
    building: string;
    floor: number;
    status: "TERSEDIA" | "TIDAK_TERSEDIA";
  };
  action: (formData: FormData) => void | Promise<void>;
};

// Form ruang untuk kapasitas, gedung, lantai, dan status.
export function RoomForm({ title, room, action }: RoomFormProps) {
  return (
    <form action={action} className="panel stack">
      <div>
        <h1 className="title">{title}</h1>
        <p className="subtitle">Data ruang digunakan saat transaksi peminjaman dibuat.</p>
      </div>
      <div className="form-grid">
        <label>Kode<input name="code" defaultValue={room?.code} required /></label>
        <label>Nama<input name="name" defaultValue={room?.name} required /></label>
        <label>Kapasitas<input name="capacity" type="number" min="1" defaultValue={room?.capacity} required /></label>
        <label>Gedung<input name="building" defaultValue={room?.building} required /></label>
        <label>Lantai<input name="floor" type="number" min="0" defaultValue={room?.floor ?? 1} required /></label>
        <label>Status
          <select name="status" defaultValue={room?.status ?? "TERSEDIA"}>
            <option value="TERSEDIA">Tersedia</option>
            <option value="TIDAK_TERSEDIA">Tidak tersedia</option>
          </select>
        </label>
      </div>
      <div className="actions">
        <button type="submit">Simpan</button>
        <Link className="button ghost" href="/rooms">Batal</Link>
      </div>
    </form>
  );
}
