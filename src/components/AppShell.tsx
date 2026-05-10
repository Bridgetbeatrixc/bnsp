"use client";

// Link dipakai untuk navigasi cepat tanpa reload penuh.
import Link from "next/link";
// ReactNode dipakai untuk tipe children.
import type { ReactNode } from "react";
// usePathname membaca route aktif di client sehingga sidebar tidak perlu refresh.
import { usePathname } from "next/navigation";
// Action logout dipasang di form sidebar.
import { logout } from "@/lib/actions";

// Data akun dibuat plain object agar aman dikirim dari Server Component ke Client Component.
type ShellAccount = {
  username: string;
  role: "ADMIN" | "MAHASISWA" | "DOSEN";
  borrowerName: string | null;
} | null;

// Props shell membawa account dan isi halaman.
type AppShellProps = {
  account: ShellAccount;
  children: ReactNode;
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

// Shell utama aplikasi yang responsif terhadap perubahan route client-side.
export function AppShell({ account, children }: AppShellProps) {
  // Ambil pathname langsung dari browser saat user klik menu.
  const pathname = usePathname();
  // Login dan lupa password memakai layout khusus tanpa sidebar.
  const isAuthPage = pathname === "/login" || pathname === "/forgot-password";
  // Pilih menu berdasarkan role akun.
  const links = account?.role === "ADMIN" ? adminLinks : userLinks;

  if (isAuthPage) {
    return <main className="auth-page">{children}</main>;
  }

  return (
    <div className="shell">
      <aside className="sidebar">
        <div className="brand">Universitas XYZ</div>
        {account ? (
          <div className="account-box">
            <strong title={account.username}>{account.username}</strong>
            <span>{account.role}</span>
            <small>{account.borrowerName ?? "Administrator"}</small>
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
          <form action={logout} className="logout-form">
            <button type="submit">Logout</button>
          </form>
        ) : null}
      </aside>
      <main className="content">{children}</main>
    </div>
  );
}
