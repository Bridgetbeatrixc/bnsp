// Action login dipanggil saat form login disubmit.
import { login } from "@/lib/actions";
// Helper auth dipakai untuk menampilkan akun jika sudah login.
import { getCurrentAccount } from "@/lib/auth";
// Link dipakai untuk membuka halaman lupa password.
import Link from "next/link";
// Utility Tailwind bersama untuk form login.
import { cx, ui } from "@/lib/ui";

// Login dinamis karena membaca cookie session.
export const dynamic = "force-dynamic";

// Halaman login terpisah dari layout dashboard.
export default async function LoginPage({ searchParams }: { searchParams?: { error?: string } }) {
  // Ambil akun yang sedang login jika ada.
  const account = await getCurrentAccount();
  // Error query dipakai untuk menampilkan pesan credential salah.
  const hasLoginError = searchParams?.error === "invalid";

  return (
    <div className={ui.loginShell}>
      <form action={login} className={cx(ui.panel, ui.stack, ui.formControls, "shadow-authPanel")}>
        <div>
          <h1 className={ui.title}>Login Akun</h1>
          <p className={ui.subtitle}>Masuk sebagai admin, mahasiswa, atau dosen. Akun baru memakai email sebagai username.</p>
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
          <p className={ui.errorMessage}>Username atau password salah.</p>
        ) : null}
        <button className={ui.button} type="submit">Login</button>
        {account ? (
          <p className={ui.subtitle}>Sedang login sebagai {account.username} ({account.role}).</p>
        ) : null}
        <Link className={ui.textLinkLight} href="/forgot-password">Lupa password?</Link>
      </form>

    </div>
  );
}
