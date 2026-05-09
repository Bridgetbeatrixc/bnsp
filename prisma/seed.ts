// PrismaClient dipakai untuk mengisi data awal ke database Supabase.
import { PrismaClient } from "@prisma/client";
// Hash password dipakai agar password demo tidak disimpan sebagai teks asli.
import { hashPassword } from "../src/lib/password";

// Buat instance Prisma untuk script seed.
const prisma = new PrismaClient();

// Fungsi utama untuk mengisi data demo aplikasi.
async function main() {
  // Seed contoh peminjam mahasiswa.
  const borrower = await prisma.borrower.upsert({
    where: { identityNumber: "220001" },
    create: {
      name: "Alya Putri",
      identityNumber: "220001",
      email: "alya@universitasxyz.ac.id",
      phone: "08123456789",
      accountType: "MAHASISWA"
    },
    update: {
      email: "alya@universitasxyz.ac.id",
      phone: "08123456789",
      accountType: "MAHASISWA"
    }
  });

  // Seed contoh peminjam dosen.
  const lecturer = await prisma.borrower.upsert({
    where: { identityNumber: "198801012020121001" },
    create: {
      name: "Dr. Bima Santoso",
      identityNumber: "198801012020121001",
      email: "bima@universitasxyz.ac.id",
      phone: "081298765432",
      accountType: "DOSEN"
    },
    update: {
      email: "bima@universitasxyz.ac.id",
      phone: "081298765432",
      accountType: "DOSEN"
    }
  });

  // Master data ruang untuk demo CRUD dan peminjaman.
  const roomSeeds = [
    { code: "AULA-101", name: "Aula Utama", capacity: 150, building: "Gedung A", floor: 1, status: "TERSEDIA" as const },
    { code: "KLS-201", name: "Ruang Kelas 201", capacity: 45, building: "Gedung B", floor: 2, status: "TERSEDIA" as const },
    { code: "KLS-202", name: "Ruang Kelas 202", capacity: 45, building: "Gedung B", floor: 2, status: "TERSEDIA" as const },
    { code: "LAB-301", name: "Laboratorium Komputer 301", capacity: 40, building: "Gedung C", floor: 3, status: "TERSEDIA" as const },
    { code: "LAB-302", name: "Laboratorium Multimedia 302", capacity: 30, building: "Gedung C", floor: 3, status: "TERSEDIA" as const },
    { code: "RPT-104", name: "Ruang Rapat Dosen 104", capacity: 20, building: "Gedung A", floor: 1, status: "TERSEDIA" as const },
    { code: "STD-401", name: "Studio Konten Akademik", capacity: 12, building: "Gedung D", floor: 4, status: "TERSEDIA" as const }
  ];

  // Simpan ruang satu per satu agar tidak menabrak limit koneksi Supabase pooler.
  const rooms = [];
  for (const room of roomSeeds) {
    rooms.push(
      await prisma.room.upsert({
        where: { code: room.code },
        update: room,
        create: room
      })
    );
  }

  // Master data peralatan untuk demo stok, kategori, dan dropdown peminjaman.
  const equipmentSeeds = [
    { code: "PRJ-001", name: "Proyektor Epson", stock: 5, category: "Presentasi" },
    { code: "PRJ-002", name: "Proyektor BenQ", stock: 3, category: "Presentasi" },
    { code: "CAM-001", name: "Kamera Sony", stock: 3, category: "Dokumentasi" },
    { code: "CAM-002", name: "Kamera Canon", stock: 2, category: "Dokumentasi" },
    { code: "MIC-001", name: "Mic Wireless", stock: 6, category: "Audio" },
    { code: "MIC-002", name: "Mic Clip On", stock: 8, category: "Audio" },
    { code: "TRP-001", name: "Tripod Kamera", stock: 5, category: "Dokumentasi" },
    { code: "SPK-001", name: "Speaker Portable", stock: 4, category: "Audio" },
    { code: "SCR-001", name: "Layar Proyektor", stock: 4, category: "Presentasi" },
    { code: "LGT-001", name: "Lighting Kit", stock: 3, category: "Produksi Konten" }
  ];

  // Simpan peralatan satu per satu agar koneksi tetap aman.
  const equipment = [];
  for (const item of equipmentSeeds) {
    equipment.push(
      await prisma.equipment.upsert({
        where: { code: item.code },
        update: item,
        create: item
      })
    );
  }

  // Map memudahkan mengambil ruang berdasarkan kode.
  const roomByCode = new Map(rooms.map((room) => [room.code, room]));
  // Map memudahkan mengambil barang berdasarkan kode.
  const equipmentByCode = new Map(equipment.map((item) => [item.code, item]));
  // Ruang lab dipakai untuk contoh peminjaman ruang + barang.
  const room = roomByCode.get("LAB-301")!;
  // Aula dipakai untuk contoh peminjaman ruang saja.
  const hall = roomByCode.get("AULA-101")!;
  // Proyektor dipakai untuk contoh seminar.
  const projector = equipmentByCode.get("PRJ-001")!;
  // Kamera dipakai untuk contoh peminjaman barang saja.
  const camera = equipmentByCode.get("CAM-001")!;
  // Mic dipakai untuk contoh banyak barang dalam satu transaksi.
  const wirelessMic = equipmentByCode.get("MIC-001")!;

  // Seed akun admin untuk mengelola seluruh sistem.
  await prisma.account.upsert({
    where: { username: "admin" },
    update: {
      passwordHash: hashPassword("admin123"),
      role: "ADMIN",
      borrowerId: null
    },
    create: {
      username: "admin",
      passwordHash: hashPassword("admin123"),
      role: "ADMIN"
    }
  });

  // Seed akun mahasiswa yang terhubung ke profil Alya.
  await prisma.account.upsert({
    where: { username: "alya" },
    update: {
      passwordHash: hashPassword("mahasiswa123"),
      role: "MAHASISWA",
      borrowerId: borrower.id
    },
    create: {
      username: "alya",
      passwordHash: hashPassword("mahasiswa123"),
      role: "MAHASISWA",
      borrowerId: borrower.id
    }
  });

  // Seed akun dosen yang terhubung ke profil Dr. Bima.
  await prisma.account.upsert({
    where: { username: "bima" },
    update: {
      passwordHash: hashPassword("dosen123"),
      role: "DOSEN",
      borrowerId: lecturer.id
    },
    create: {
      username: "bima",
      passwordHash: hashPassword("dosen123"),
      role: "DOSEN",
      borrowerId: lecturer.id
    }
  });

  // Hapus detail barang dari data simulasi lama agar seed tidak dobel.
  await prisma.borrowingEquipment.deleteMany({
    where: {
      borrowing: {
        purpose: {
          startsWith: "Simulasi"
        }
      }
    }
  });

  // Hapus transaksi simulasi lama sebelum membuat ulang.
  await prisma.borrowing.deleteMany({
    where: {
      purpose: {
        startsWith: "Simulasi"
      }
    }
  });

  // Simulasi 1: peminjaman ruang saja tanpa peralatan.
  await prisma.borrowing.create({
    data: {
      borrowerId: borrower.id,
      roomId: hall.id,
      requestDate: new Date("2026-05-09"),
      usageDate: new Date("2026-05-10T09:00:00"),
      durationHours: 2,
      purpose: "Simulasi pinjam ruang saja untuk rapat himpunan"
    }
  });

  // Simulasi 2: peminjaman barang saja tanpa ruang.
  await prisma.borrowing.create({
    data: {
      borrowerId: lecturer.id,
      roomId: null,
      requestDate: new Date("2026-05-09"),
      usageDate: new Date("2026-05-10T13:00:00"),
      durationHours: 3,
      purpose: "Simulasi pinjam barang saja untuk syuting konten akademik",
      equipmentItems: {
        create: [
          { equipmentId: camera.id, quantity: 1 },
          { equipmentId: wirelessMic.id, quantity: 2 }
        ]
      }
    }
  });

  // Simulasi 3: peminjaman ruang sekaligus beberapa barang.
  await prisma.borrowing.create({
    data: {
      borrowerId: borrower.id,
      roomId: room.id,
      requestDate: new Date("2026-05-09"),
      usageDate: new Date("2026-05-11T10:00:00"),
      durationHours: 2,
      purpose: "Simulasi pinjam ruang dan barang untuk seminar teknologi",
      equipmentItems: {
        create: [
          { equipmentId: projector.id, quantity: 1 },
          { equipmentId: wirelessMic.id, quantity: 1 }
        ]
      }
    }
  });
}

// Jalankan seed lalu tutup koneksi Prisma.
main()
  .finally(async () => {
    await prisma.$disconnect();
  });
