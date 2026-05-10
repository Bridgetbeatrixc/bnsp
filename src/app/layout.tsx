// Metadata memberi judul dan deskripsi dasar aplikasi.
import type { Metadata } from "next";
// Link dipakai untuk navigasi tanpa reload halaman penuh.
import Link from "next/link";
// Headers dipakai untuk membaca pathname dari middleware.
import { headers } from "next/headers";
// Action logout dipasang di tombol sidebar.
import { logout } from "@/lib/actions";
// Helper auth membaca akun yang sedang login.
import { getCurrentAccount } from "@/lib/auth";
// CSS global dipakai untuk seluruh halaman.
import "./globals.css";

// Metadata aplikasi untuk tab browser.
export const metadata: Metadata = {
  title: "Universitas XYZ Borrowing",
  description: "Sistem peminjaman ruang dan peralatan"
};

// Menu lengkap untuk admin.
const adminLinks = [
  ["/", "Dashboard"],
  ["/borrowers", "Peminjam"],
  ["/rooms", "Ruang"],
  ["/equipment", "Peralatan"],
  ["/borrowings", "Peminjaman"],
  ["/reports", "Laporan"]
];

// Menu terbatas untuk mahasiswa dan dosen.
const userLinks = [
  ["/", "Dashboard"],
  ["/borrowings/new", "Ajukan Peminjaman"],
  ["/borrowings", "Riwayat Saya"]
];

// Menentukan apakah link sidebar sedang aktif.
function isActiveLink(pathname: string, href: string) {
  // Dashboard hanya aktif di route utama.
  if (href === "/") {
    return pathname === "/";
  }
  // Ajukan peminjaman harus aktif hanya pada halaman form ajukan.
  if (href === "/borrowings/new") {
    return pathname === "/borrowings/new";
  }
  // Riwayat/peminjaman tidak boleh ikut aktif saat berada di form ajukan.
  if (href === "/borrowings") {
    return pathname === "/borrowings";
  }
  // Route nested seperti /rooms/new tetap menyalakan menu /rooms.
  return pathname === href || pathname.startsWith(`${href}/`);
}

// Root layout membungkus semua halaman aplikasi.
export default async function RootLayout({ children }: { children: React.ReactNode }) {
  // Ambil akun login untuk menentukan menu dan tampilan sidebar.
  const account = await getCurrentAccount();
  // Baca pathname agar halaman login bisa memakai layout berbeda.
  const pathname = headers().get("x-pathname") ?? "";
  // Login page dibuat terpisah dari dashboard shell.
  const isLoginPage = pathname === "/login" || pathname === "/forgot-password";
  // Pilih menu berdasarkan role akun.
  const links = account?.role === "ADMIN" ? adminLinks : userLinks;

  return (
    <html lang="id">
      <body>
        {isLoginPage ? (
          <main className="auth-page">{children}</main>
        ) : (
          // Shell utama berisi sidebar dan konten aplikasi.
          <div className="shell">
            <aside className="sidebar">
              <div className="brand">Universitas XYZ</div>
              {account ? (
                <div className="account-box">
                  <strong>{account.username}</strong>
                  <span>{account.role}</span>
                  {account.borrower ? <small>{account.borrower.name}</small> : <small>Administrator</small>}
                  <Link
                    className={isActiveLink(pathname, "/account/password") ? "account-link active" : "account-link"}
                    href="/account/password"
                  >
                    Ganti Password
                  </Link>
                </div>
              ) : (
                <div className="account-box">
                  <strong>Belum login</strong>
                  <span>Guest</span>
                </div>
              )}
              <nav className="nav">
                {links.map(([href, label]) => (
                  <Link
                    aria-current={isActiveLink(pathname, href) ? "page" : undefined}
                    className={isActiveLink(pathname, href) ? "active" : ""}
                    href={href}
                    key={href}
                  >
                    {label}
                  </Link>
                ))}
                {!account ? (
                  <Link
                    aria-current={isActiveLink(pathname, "/login") ? "page" : undefined}
                    className={isActiveLink(pathname, "/login") ? "active" : ""}
                    href="/login"
                  >
                    Login
                  </Link>
                ) : null}
              </nav>
              {account ? (
                // Logout hanya muncul jika user sudah login.
                <form action={logout} className="logout-form">
                  <button type="submit">Logout</button>
                </form>
              ) : null}
            </aside>
            <main className="content">{children}</main>
          </div>
        )}
      </body>
    </html>
  );
}
