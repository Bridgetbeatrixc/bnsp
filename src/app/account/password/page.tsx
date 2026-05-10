// Action ganti password dipanggil saat form disubmit.
import { changePassword } from "@/lib/actions";
// requireAccount memastikan hanya user login yang bisa membuka halaman ini.
import { requireAccount } from "@/lib/auth";

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
    <div className="stack">
      <div>
        <h1 className="title">Ganti Password</h1>
        <p className="subtitle">Ubah password untuk akun {account.username}.</p>
      </div>
      <form action={changePassword} className="panel stack password-form">
        {hasError ? (
          <p className="error-message">Password lama salah, password baru terlalu pendek, atau konfirmasi tidak sama.</p>
        ) : null}
        {isSuccess ? (
          <p className="success-message">Password berhasil diganti.</p>
        ) : null}
        <div className="form-grid">
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
        <div className="actions">
          <button type="submit">Simpan Password</button>
        </div>
      </form>
    </div>
  );
}
