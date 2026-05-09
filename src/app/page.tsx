// Link dipakai untuk tombol menuju form peminjaman.
import Link from "next/link";
// requireAccount memastikan dashboard hanya bisa dilihat user login.
import { requireAccount } from "@/lib/auth";
// Prisma dipakai untuk mengambil data dashboard.
import { prisma } from "@/lib/prisma";

// Dashboard selalu dinamis karena membaca session dan database.
export const dynamic = "force-dynamic";

// Halaman dashboard utama untuk admin, mahasiswa, dan dosen.
export default async function DashboardPage() {
  // Ambil akun login untuk menentukan dashboard yang ditampilkan.
  const account = await requireAccount();

  // Jika bukan admin, tampilkan dashboard pribadi.
  if (account.role !== "ADMIN") {
    // Ambil riwayat peminjaman milik user yang login.
    const borrowings = account.borrowerId
      ? await prisma.borrowing.findMany({
          where: { borrowerId: account.borrowerId },
          include: {
            room: true,
            equipmentItems: { include: { equipment: true } }
          },
          orderBy: { createdAt: "desc" }
        })
      : [];

    return (
      <div className="stack">
        <div className="topbar">
          <div>
            <h1 className="title">Dashboard {account.role}</h1>
            <p className="subtitle">Ringkasan akun dan riwayat peminjaman pribadi.</p>
          </div>
          <span className={account.role === "DOSEN" ? "badge lecturer" : "badge student"}>
            {account.role}
          </span>
        </div>

        <section className="grid">
          <div className="card">
            <span>Nama</span>
            <div className="metric" style={{ fontSize: 24 }}>{account.borrower?.name}</div>
          </div>
          <div className="card">
            <span>NIM/NIK</span>
            <div className="metric" style={{ fontSize: 24 }}>{account.borrower?.identityNumber}</div>
          </div>
          <div className="card">
            <span>Total Peminjaman</span>
            <div className="metric">{borrowings.length}</div>
          </div>
        </section>

        <section className="panel">
          <h2>Riwayat Peminjaman Saya</h2>
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Ruang</th>
                  <th>Tanggal Pakai</th>
                  <th>Durasi</th>
                  <th>Peralatan</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {borrowings.map((borrowing) => (
                  <tr key={borrowing.id}>
                    <td>{borrowing.room?.name ?? "-"}</td>
                    <td>{borrowing.usageDate.toISOString().slice(0, 10)}</td>
                    <td>{borrowing.durationHours} jam</td>
                    <td>
                      {borrowing.equipmentItems.map((item) => (
                        <div key={item.id}>{item.equipment.name} x {item.quantity}</div>
                      ))}
                    </td>
                    <td><span className="badge">{borrowing.status}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="actions">
            <Link className="button" href="/borrowings/new">Ajukan Peminjaman</Link>
          </div>
        </section>
      </div>
    );
  }

  // Dashboard admin menghitung ringkasan seluruh sistem.
  const [borrowers, studentBorrowers, lecturerBorrowers, rooms, equipment, borrowings, latestBorrowers] = await Promise.all([
    // Total semua peminjam.
    prisma.borrower.count(),
    // Total akun mahasiswa.
    prisma.borrower.count({ where: { accountType: "MAHASISWA" } }),
    // Total akun dosen.
    prisma.borrower.count({ where: { accountType: "DOSEN" } }),
    // Total ruang.
    prisma.room.count(),
    // Total peralatan.
    prisma.equipment.count(),
    // Total peminjaman.
    prisma.borrowing.count(),
    // Ambil peminjam terbaru untuk tabel ringkas.
    prisma.borrower.findMany({
      orderBy: { createdAt: "desc" },
      take: 6
    })
  ]);

  return (
    <>
      <div className="topbar">
        <div>
          <h1 className="title">Dashboard</h1>
          <p className="subtitle">Ringkasan admin sistem peminjaman ruang dan peralatan.</p>
        </div>
        <span className="badge admin">ADMIN</span>
      </div>
      <section className="grid">
        <div className="card">
          <span>Peminjam</span>
          <div className="metric">{borrowers}</div>
        </div>
        <div className="card">
          <span>Akun Mahasiswa</span>
          <div className="metric">{studentBorrowers}</div>
        </div>
        <div className="card">
          <span>Akun Dosen</span>
          <div className="metric">{lecturerBorrowers}</div>
        </div>
        <div className="card">
          <span>Ruang</span>
          <div className="metric">{rooms}</div>
        </div>
        <div className="card">
          <span>Peralatan</span>
          <div className="metric">{equipment}</div>
        </div>
        <div className="card">
          <span>Peminjaman</span>
          <div className="metric">{borrowings}</div>
        </div>
      </section>
      <section className="panel" style={{ marginTop: 18 }}>
        <h2>Jenis Akun Peminjam</h2>
        <p className="subtitle">Daftar ini menunjukkan akun mana yang mahasiswa dan mana yang dosen.</p>
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Nama</th>
                <th>NIM/NIK</th>
                <th>Nomor HP</th>
                <th>Jenis Akun</th>
              </tr>
            </thead>
            <tbody>
              {latestBorrowers.map((borrower) => (
                <tr key={borrower.id}>
                  <td>{borrower.name}</td>
                  <td>{borrower.identityNumber}</td>
                  <td>{borrower.phone}</td>
                  <td><span className="badge">{borrower.accountType}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </>
  );
}
