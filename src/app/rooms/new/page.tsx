import { FlashMessage } from "@/components/FlashMessage";
import { RoomForm } from "@/components/forms/RoomForm";
import { createRoom } from "@/lib/actions";
import { requireAdmin } from "@/lib/auth";

export default async function NewRoomPage({ searchParams }: { searchParams?: { error?: string } }) {
  await requireAdmin();
  return (
    <div className="stack">
      {searchParams?.error === "save" ? (
        <FlashMessage message="Ruang gagal disimpan. Periksa field wajib, angka, atau kode yang sudah dipakai." type="error" />
      ) : null}
      <RoomForm action={createRoom} title="Tambah Ruang" />
    </div>
  );
}
