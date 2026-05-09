import { RoomForm } from "@/components/forms/RoomForm";
import { updateRoom } from "@/lib/actions";
import { requireAdmin } from "@/lib/auth";
import { RoomService } from "@/services/RoomService";

export const dynamic = "force-dynamic";

export default async function EditRoomPage({ params }: { params: { id: string } }) {
  await requireAdmin();
  const room = await new RoomService().findById(params.id);
  return <RoomForm action={updateRoom.bind(null, room.id)} room={room} title="Ubah Ruang" />;
}
