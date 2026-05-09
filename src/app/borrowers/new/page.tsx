import { BorrowerForm } from "@/components/forms/BorrowerForm";
import { createBorrower } from "@/lib/actions";
import { requireAdmin } from "@/lib/auth";

export default async function NewBorrowerPage() {
  await requireAdmin();
  return <BorrowerForm action={createBorrower} title="Tambah Peminjam" />;
}
