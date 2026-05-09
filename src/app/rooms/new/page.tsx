import { RoomForm } from "@/components/forms/RoomForm";
import { createRoom } from "@/lib/actions";
import { requireAdmin } from "@/lib/auth";

export default async function NewRoomPage() {
  await requireAdmin();
  return <RoomForm action={createRoom} title="Tambah Ruang" />;
}
