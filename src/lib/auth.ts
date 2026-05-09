// Mengambil helper cookie dari Next.js untuk menyimpan session sederhana.
import { cookies } from "next/headers";
// Mengambil redirect untuk memaksa user kembali ke halaman yang benar.
import { redirect } from "next/navigation";
// Prisma dipakai untuk membaca akun login dari database.
import { prisma } from "@/lib/prisma";

// Nama cookie yang menyimpan id akun login.
const sessionCookieName = "account_id";

// Mengambil akun yang sedang login berdasarkan cookie session.
export async function getCurrentAccount() {
  // Baca id akun dari cookie.
  const accountId = cookies().get(sessionCookieName)?.value;
  // Jika cookie tidak ada, berarti user belum login.
  if (!accountId) {
    return null;
  }

  // Cari akun di database dan sertakan profil peminjam jika ada.
  return prisma.account.findUnique({
    where: { id: accountId },
    include: { borrower: true }
  });
}

// Memastikan user sudah login sebelum masuk halaman/action tertentu.
export async function requireAccount() {
  // Ambil akun dari session.
  const account = await getCurrentAccount();
  // Jika belum login, arahkan ke halaman login.
  if (!account) {
    redirect("/login");
  }
  // Kembalikan akun untuk dipakai oleh halaman/action.
  return account;
}

// Memastikan user login sebagai admin.
export async function requireAdmin() {
  // Pertama pastikan user sudah login.
  const account = await requireAccount();
  // Jika bukan admin, arahkan ke dashboard pribadi.
  if (account.role !== "ADMIN") {
    redirect("/");
  }
  // Kembalikan akun admin.
  return account;
}

// Menyimpan id akun ke cookie session setelah login.
export function setAccountSession(accountId: string) {
  // Cookie dibuat httpOnly agar tidak dibaca langsung oleh JavaScript browser.
  cookies().set(sessionCookieName, accountId, {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 8
  });
}

// Menghapus cookie session saat logout.
export function clearAccountSession() {
  // Delete cookie membuat user kembali menjadi guest.
  cookies().delete(sessionCookieName);
}
