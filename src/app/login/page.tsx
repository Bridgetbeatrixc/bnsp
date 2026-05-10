// Action login dipanggil saat form login disubmit.
import { login } from "@/lib/actions";
// Helper auth dipakai untuk menampilkan akun jika sudah login.
import { getCurrentAccount } from "@/lib/auth";

// Login dinamis karena membaca cookie session.
export const dynamic = "force-dynamic";

// Halaman login terpisah dari layout dashboard.
export default async function LoginPage({ searchParams }: { searchParams?: { error?: string } }) {
  // Ambil akun yang sedang login jika ada.
  const account = await getCurrentAccount();
  // Error query dipakai untuk menampilkan pesan credential salah.
  const hasLoginError = searchParams?.error === "invalid";

  return (
    <div className="login-shell">
      <form action={login} className="panel stack">
        <div>
          <h1 className="title">Login Akun</h1>
          <p className="subtitle">Masuk sebagai admin, mahasiswa, atau dosen. Akun baru memakai email sebagai username.</p>
        </div>
        <label>
          Username / Email
          <input name="username" required />
        </label>
        <label>
          Password
          <input name="password" required type="password" />
        </label>
        {hasLoginError ? (
          <p className="error-message">Username atau password salah.</p>
        ) : null}
        <button type="submit">Login</button>
        {account ? (
          <p className="subtitle">Sedang login sebagai {account.username} ({account.role}).</p>
        ) : null}
      </form>

    </div>
  );
}
