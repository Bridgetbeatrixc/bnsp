import { EquipmentForm } from "@/components/forms/EquipmentForm";
import { createEquipment } from "@/lib/actions";
import { requireAdmin } from "@/lib/auth";

export default async function NewEquipmentPage() {
  await requireAdmin();
  return <EquipmentForm action={createEquipment} title="Tambah Peralatan" />;
}
