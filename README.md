# Universitas XYZ Borrowing System

Sistem peminjaman ruang dan peralatan untuk studi kasus BNSP programmer.

## Stack

- Next.js + TypeScript
- Supabase PostgreSQL
- Supabase SSR client helpers
- Prisma ORM
- Zod validation
- ExcelJS export
- Vitest unit test

## Setup

1. Buka project Supabase `ljvttalliqfmtfudsqwu`.
2. Isi `.env` dengan password database Supabase pada bagian `DATABASE_URL`.
   Jika password mengandung karakter khusus, URL-encode password terlebih dahulu.
3. Install dependency:

```bash
npm install
```

4. Push schema ke Supabase:

```bash
npm run db:push
```

5. Jalankan seed data contoh:

```bash
npm run db:seed
```

6. Jalankan aplikasi:

```bash
npm run dev
```

The Supabase browser/server helpers are available in:

- `src/utils/supabase/client.ts`
- `src/utils/supabase/server.ts`
- `src/utils/supabase/middleware.ts`
- `src/middleware.ts`

## Supabase CLI

Supabase CLI bersifat opsional untuk project ini karena Prisma langsung terhubung ke Supabase PostgreSQL melalui `DATABASE_URL`.
Jika Supabase CLI sudah terpasang, jalankan:

```bash
supabase login
supabase init
supabase link --project-ref ljvttalliqfmtfudsqwu
```

Untuk push schema database dengan Prisma, perintah yang dipakai tetap:

```bash
npm run db:push
```

## Jika `npm run db:push` Error P1001

Direct database host Supabase `db.ljvttalliqfmtfudsqwu.supabase.co:5432` hanya resolve ke IPv6 di beberapa project/network.
Jika komputer/jaringan tidak mendukung IPv6, Prisma akan gagal menjangkau database.

Solusi termudah:

1. Buka Supabase Dashboard.
2. Klik **Connect**.
3. Pilih connection string **Session pooler**.
4. Masukkan connection string tersebut ke `DATABASE_URL`.
5. Jalankan ulang:

```bash
npm run db:push
```

Format Session pooler biasanya seperti:

```env
DATABASE_URL="postgres://postgres.ljvttalliqfmtfudsqwu:YOUR_PASSWORD@aws-0-YOUR_REGION.pooler.supabase.com:5432/postgres"
```

Untuk deployment serverless, gunakan Transaction pooler dan tambahkan `pgbouncer=true` jika Prisma mengalami error prepared statement.

## Test

```bash
npm test
```

## Fitur

- Login role admin, mahasiswa, dan dosen
- CRUD peminjam mahasiswa/dosen
- CRUD ruang
- CRUD peralatan
- Transaksi peminjaman dengan banyak peralatan
- Validasi field wajib, tanggal, durasi, dan stok
- Update status peminjaman hanya oleh admin
- Export laporan Excel
- Unit test validasi input kritis

## Demo Login

```text
ADMIN
username: admin
password: admin123

MAHASISWA
username: alya
password: mahasiswa123

DOSEN
username: bima
password: dosen123
```

## Hak Akses

- Admin dapat mengakses semua menu, CRUD master data, export laporan, dan update status peminjaman.
- Mahasiswa dan dosen hanya melihat dashboard pribadi, mengajukan peminjaman, dan melihat riwayat sendiri.
- Mahasiswa dan dosen tidak dapat mengubah status `DISETUJUI`, `DITOLAK`, atau `SELESAI`.
