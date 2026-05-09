import { BorrowerForm } from "@/components/forms/BorrowerForm";
import { updateBorrower } from "@/lib/actions";
import { requireAdmin } from "@/lib/auth";
import { BorrowerService } from "@/services/BorrowerService";

export const dynamic = "force-dynamic";

export default async function EditBorrowerPage({ params }: { params: { id: string } }) {
  await requireAdmin();
  const borrower = await new BorrowerService().findById(params.id);
  return (
    <BorrowerForm
      action={updateBorrower.bind(null, borrower.id)}
      borrower={borrower}
      title="Ubah Peminjam"
    />
  );
}
