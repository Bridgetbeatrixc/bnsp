import { FlashMessage } from "@/components/FlashMessage";
import { EquipmentForm } from "@/components/forms/EquipmentForm";
import { updateEquipment } from "@/lib/actions";
import { requireAdmin } from "@/lib/auth";
import { EquipmentService } from "@/services/EquipmentService";

export const dynamic = "force-dynamic";

export default async function EditEquipmentPage({
  params,
  searchParams
}: {
  params: { id: string };
  searchParams?: { error?: string };
}) {
  await requireAdmin();
  const equipment = await new EquipmentService().findById(params.id);
  return (
    <div className="stack">
      {searchParams?.error === "save" ? (
        <FlashMessage message="Peralatan gagal diubah. Periksa field wajib, stok, atau kode yang sudah dipakai." type="error" />
      ) : null}
      <EquipmentForm
        action={updateEquipment.bind(null, equipment.id)}
        equipment={equipment}
        title="Ubah Peralatan"
      />
    </div>
  );
}
