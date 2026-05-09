import { EquipmentForm } from "@/components/forms/EquipmentForm";
import { updateEquipment } from "@/lib/actions";
import { requireAdmin } from "@/lib/auth";
import { EquipmentService } from "@/services/EquipmentService";

export const dynamic = "force-dynamic";

export default async function EditEquipmentPage({ params }: { params: { id: string } }) {
  await requireAdmin();
  const equipment = await new EquipmentService().findById(params.id);
  return (
    <EquipmentForm
      action={updateEquipment.bind(null, equipment.id)}
      equipment={equipment}
      title="Ubah Peralatan"
    />
  );
}
