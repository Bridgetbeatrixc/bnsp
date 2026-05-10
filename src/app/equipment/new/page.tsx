import { FlashMessage } from "@/components/FlashMessage";
import { EquipmentForm } from "@/components/forms/EquipmentForm";
import { createEquipment } from "@/lib/actions";
import { requireAdmin } from "@/lib/auth";

export default async function NewEquipmentPage({ searchParams }: { searchParams?: { error?: string } }) {
  await requireAdmin();
  return (
    <div className="stack">
      {searchParams?.error === "save" ? (
        <FlashMessage message="Peralatan gagal disimpan. Periksa field wajib, stok, atau kode yang sudah dipakai." type="error" />
      ) : null}
      <EquipmentForm action={createEquipment} title="Tambah Peralatan" />
    </div>
  );
}
