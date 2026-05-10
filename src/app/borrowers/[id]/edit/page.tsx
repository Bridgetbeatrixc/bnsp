import { FlashMessage } from "@/components/FlashMessage";
import { BorrowerForm } from "@/components/forms/BorrowerForm";
import { updateBorrower } from "@/lib/actions";
import { requireAdmin } from "@/lib/auth";
import { ui } from "@/lib/ui";
import { BorrowerService } from "@/services/BorrowerService";

export const dynamic = "force-dynamic";

export default async function EditBorrowerPage({
  params,
  searchParams
}: {
  params: { id: string };
  searchParams?: { error?: string };
}) {
  await requireAdmin();
  const borrower = await new BorrowerService().findById(params.id);
  return (
    <div className={ui.stack}>
      {searchParams?.error === "save" ? (
        <FlashMessage message="Peminjam gagal diubah. Periksa field wajib, email, atau NIM/NIK yang sudah dipakai." type="error" />
      ) : null}
      <BorrowerForm
        action={updateBorrower.bind(null, borrower.id)}
        borrower={borrower}
        title="Ubah Peminjam"
      />
    </div>
  );
}
