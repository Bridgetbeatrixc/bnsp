"use client";

// Link dipakai untuk navigasi cepat tanpa reload penuh.
import Link from "next/link";
// ReactNode dipakai untuk tipe children.
import type { ReactNode } from "react";
// usePathname membaca route aktif di client sehingga sidebar tidak perlu refresh.
import { usePathname } from "next/navigation";
// Action logout dipasang di form sidebar.
import { logout } from "@/lib/actions";
// Utility Tailwind bersama agar tidak memakai class CSS global.
import { cx, ui } from "@/lib/ui";

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
    return <main className={ui.authPage}>{children}</main>;
  }

  return (
    <div className="grid min-h-screen grid-cols-[260px_minmax(0,1fr)] max-lg:grid-cols-[220px_minmax(0,1fr)] max-md:grid-cols-1">
      <aside className="bg-app-sidebar px-5 py-6 text-white max-lg:px-4 max-md:static max-md:px-3.5 max-md:py-3">
        <div className="mb-[18px] text-xl font-bold max-md:mb-3 max-md:text-lg">Universitas XYZ</div>
        {account ? (
          <div className="mb-5 grid min-w-0 gap-1 overflow-hidden rounded-lg bg-app-sidebarPanel p-3 max-md:mb-3">
            <strong className="block max-w-full truncate text-base leading-snug" title={account.username}>{account.username}</strong>
            <span className="block max-w-full truncate leading-snug text-[#b7cddd]">{account.role}</span>
            <small className="block max-w-full truncate leading-snug text-[#b7cddd]">{account.borrowerName ?? "Administrator"}</small>
            <Link
              className={cx(
                "mt-2 inline-flex max-w-full justify-center truncate rounded-md bg-white/10 px-2.5 py-2 text-center text-[13px] text-white no-underline hover:bg-white/20",
                isActiveLink(pathname, "/account/password") && "bg-white font-bold text-app-sidebar"
              )}
              href="/account/password"
            >
              Ganti Password
            </Link>
          </div>
        ) : (
          <div className="mb-5 grid min-w-0 gap-1 overflow-hidden rounded-lg bg-app-sidebarPanel p-3 max-md:mb-3">
            <strong className="block max-w-full truncate text-base leading-snug">Belum login</strong>
            <span className="block max-w-full truncate leading-snug text-[#b7cddd]">Guest</span>
          </div>
        )}
        <nav className="grid gap-2 max-md:flex max-md:gap-2 max-md:overflow-x-auto max-md:pb-1">
          {links.map(([href, label]) => (
            <Link
              aria-current={isActiveLink(pathname, href) ? "page" : undefined}
              className={cx(ui.navLink, isActiveLink(pathname, href) && ui.navLinkActive)}
              href={href}
              key={href}
            >
              {label}
            </Link>
          ))}
          {!account ? (
            <Link
              aria-current={isActiveLink(pathname, "/login") ? "page" : undefined}
              className={cx(ui.navLink, isActiveLink(pathname, "/login") && ui.navLinkActive)}
              href="/login"
            >
              Login
            </Link>
          ) : null}
        </nav>
        {account ? (
          <form action={logout} className="mt-5 max-md:mt-3">
            <button className="inline-flex w-full cursor-pointer items-center justify-center rounded-lg border-0 bg-[#35566f] px-3.5 py-2.5 text-white hover:bg-app-primaryDark max-md:min-h-11 max-md:w-auto" type="submit">Logout</button>
          </form>
        ) : null}
      </aside>
      <main className="min-w-0 p-7 max-md:p-3.5 max-[420px]:p-2.5">{children}</main>
    </div>
  );
}
