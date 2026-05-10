import { FlashMessage } from "@/components/FlashMessage";
import { RoomForm } from "@/components/forms/RoomForm";
import { updateRoom } from "@/lib/actions";
import { requireAdmin } from "@/lib/auth";
import { RoomService } from "@/services/RoomService";

export const dynamic = "force-dynamic";

export default async function EditRoomPage({
  params,
  searchParams
}: {
  params: { id: string };
  searchParams?: { error?: string };
}) {
  await requireAdmin();
  const room = await new RoomService().findById(params.id);
  return (
    <div className="stack">
      {searchParams?.error === "save" ? (
        <FlashMessage message="Ruang gagal diubah. Periksa field wajib, angka, atau kode yang sudah dipakai." type="error" />
      ) : null}
      <RoomForm action={updateRoom.bind(null, room.id)} room={room} title="Ubah Ruang" />
    </div>
  );
}
