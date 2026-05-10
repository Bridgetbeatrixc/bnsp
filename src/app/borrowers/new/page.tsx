import { FlashMessage } from "@/components/FlashMessage";
import { BorrowerForm } from "@/components/forms/BorrowerForm";
import { createBorrower } from "@/lib/actions";
import { requireAdmin } from "@/lib/auth";
import { ui } from "@/lib/ui";

export default async function NewBorrowerPage({ searchParams }: { searchParams?: { error?: string } }) {
  await requireAdmin();
  return (
    <div className={ui.stack}>
      {searchParams?.error === "save" ? (
        <FlashMessage message="Peminjam gagal disimpan. Periksa field wajib, email, atau NIM/NIK yang sudah dipakai." type="error" />
      ) : null}
      <BorrowerForm action={createBorrower} title="Tambah Peminjam" />
    </div>
  );
}
