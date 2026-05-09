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
          <p className="subtitle">Masuk sebagai admin, mahasiswa, atau dosen.</p>
        </div>
        <label>
          Username
          <input name="username" required />
        </label>
        <label>
          Password
          <input name="password" required type="password" />
        </label>
        {hasLoginError ? (
          <p className="error-message">Username atau password salah. Coba gunakan akun demo di samping.</p>
        ) : null}
        <button type="submit">Login</button>
        {account ? (
          <p className="subtitle">Sedang login sebagai {account.username} ({account.role}).</p>
        ) : null}
      </form>

      <section className="panel stack">
        <div>
          <h2>Demo Account</h2>
          <p className="subtitle">Gunakan akun ini untuk melihat dashboard sesuai role.</p>
        </div>
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Role</th>
                <th>Username</th>
                <th>Password</th>
                <th>Dashboard</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><span className="badge admin">ADMIN</span></td>
                <td>admin</td>
                <td>admin123</td>
                <td>Semua data sistem</td>
              </tr>
              <tr>
                <td><span className="badge student">MAHASISWA</span></td>
                <td>alya</td>
                <td>mahasiswa123</td>
                <td>Data dan peminjaman Alya</td>
              </tr>
              <tr>
                <td><span className="badge lecturer">DOSEN</span></td>
                <td>bima</td>
                <td>dosen123</td>
                <td>Data dan peminjaman Dr. Bima</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
