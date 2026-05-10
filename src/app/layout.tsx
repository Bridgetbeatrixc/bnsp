// Metadata memberi judul dan deskripsi dasar aplikasi.
import type { Metadata } from "next";
// AppShell mengatur sidebar dan layout utama di client.
import { AppShell } from "@/components/AppShell";
// Helper auth membaca akun yang sedang login.
import { getCurrentAccount } from "@/lib/auth";
// CSS global dipakai untuk seluruh halaman.
import "./globals.css";

// Metadata aplikasi untuk tab browser.
export const metadata: Metadata = {
  title: "Universitas XYZ Borrowing",
  description: "Sistem peminjaman ruang dan peralatan"
};

// Root layout membungkus semua halaman aplikasi.
export default async function RootLayout({ children }: { children: React.ReactNode }) {
  // Ambil akun login untuk menentukan menu dan tampilan sidebar.
  const account = await getCurrentAccount();
  // Ubah account Prisma menjadi plain object untuk client component.
  const shellAccount = account
    ? {
        username: account.username,
        role: account.role,
        borrowerName: account.borrower?.name ?? null
      }
    : null;

  return (
    <html className="overflow-x-hidden" lang="id">
      <body className="m-0 overflow-x-hidden bg-app-bg font-sans text-app-text">
        <AppShell account={shellAccount}>{children}</AppShell>
      </body>
    </html>
  );
}
