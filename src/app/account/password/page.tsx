// Action ganti password dipanggil saat form disubmit.
import { changePassword } from "@/lib/actions";
// requireAccount memastikan hanya user login yang bisa membuka halaman ini.
import { requireAccount } from "@/lib/auth";
// Utility Tailwind bersama untuk form ganti password.
import { cx, ui } from "@/lib/ui";

// Halaman ini dinamis karena membaca session login.
export const dynamic = "force-dynamic";

// Halaman form ganti password akun.
export default async function ChangePasswordPage({
  searchParams
}: {
  searchParams?: { error?: string; success?: string };
}) {
  // Ambil akun yang sedang login.
  const account = await requireAccount();
  // Cek apakah action mengirim status error.
  const hasError = searchParams?.error === "invalid";
  // Cek apakah action mengirim status sukses.
  const isSuccess = searchParams?.success === "1";

  return (
    <div className={ui.stack}>
      <div>
        <h1 className={ui.title}>Ganti Password</h1>
        <p className={ui.subtitle}>Ubah password untuk akun {account.username}.</p>
      </div>
      <form action={changePassword} className={cx(ui.panel, ui.stack, ui.formControls)}>
        {hasError ? (
          <p className={ui.errorMessage}>Password lama salah, password baru terlalu pendek, atau konfirmasi tidak sama.</p>
        ) : null}
        {isSuccess ? (
          <p className={ui.successMessage}>Password berhasil diganti.</p>
        ) : null}
        <div className={ui.formGrid}>
          <label>
            Password Lama
            <input name="currentPassword" required type="password" />
          </label>
          <label>
            Password Baru
            <input minLength={6} name="newPassword" required type="password" />
          </label>
          <label>
            Konfirmasi Password Baru
            <input minLength={6} name="confirmPassword" required type="password" />
          </label>
        </div>
        <div className={ui.actions}>
          <button className={ui.button} type="submit">Simpan Password</button>
        </div>
      </form>
    </div>
  );
}
