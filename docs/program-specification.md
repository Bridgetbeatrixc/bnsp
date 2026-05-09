# Spesifikasi Program: Sistem Peminjaman Ruang dan Peralatan

## Tech Stack

- Next.js + TypeScript untuk aplikasi full-stack.
- Supabase PostgreSQL sebagai database relasional.
- Prisma ORM untuk schema, migrasi, dan query database.
- Zod untuk validasi input sebelum database.
- ExcelJS untuk export laporan.
- Vitest untuk unit test validasi kritis.
- Login sederhana berbasis `Account` dengan role `ADMIN`, `MAHASISWA`, dan `DOSEN`.

## Wireframe

```mermaid
flowchart LR
  A["Dashboard"] --> B["CRUD Peminjam"]
  A --> C["CRUD Ruang"]
  A --> D["CRUD Peralatan"]
  A --> E["Form Peminjaman"]
  E --> F["Update Status"]
  A --> G["Export Laporan Excel"]
```

## ERD

```mermaid
erDiagram
  Borrower ||--o{ Borrowing : membuat
  Borrower ||--o| Account : memiliki
  Room ||--o{ Borrowing : dipinjam
  Borrowing ||--o{ BorrowingEquipment : memiliki
  Equipment ||--o{ BorrowingEquipment : digunakan

  Borrower {
    string id PK
    string name
    string identityNumber UK
    string phone
    enum accountType
  }

  Account {
    string id PK
    string username UK
    string passwordHash
    enum role
    string borrowerId FK
  }

  Room {
    string id PK
    string code UK
    string name
    int capacity
    string building
    int floor
    enum status
  }

  Equipment {
    string id PK
    string code UK
    string name
    int stock
    string category
  }

  Borrowing {
    string id PK
    string borrowerId FK
    string roomId FK
    datetime requestDate
    datetime usageDate
    int durationHours
    enum status
    datetime actualReturnTime
    string purpose
  }

  BorrowingEquipment {
    string id PK
    string borrowingId FK
    string equipmentId FK
    int quantity
  }
```

## Class Diagram

```mermaid
classDiagram
  class BorrowerService {
    +findAll()
    +findById(id)
    +create(input)
    +update(id, input)
    +delete(id)
  }

  class RoomService {
    +findAll()
    +findById(id)
    +create(input)
    +update(id, input)
    +delete(id)
  }

  class EquipmentService {
    +findAll()
    +findById(id)
    +create(input)
    +update(id, input)
    +delete(id)
  }

  class BorrowingService {
    +findAll()
    +create(input)
    +updateStatus(id, input)
  }

  class AccountService {
    +login(input)
  }

  class ReportService {
    +buildBorrowingWorkbook()
  }

  BorrowingService --> BorrowerService
  BorrowingService --> RoomService
  BorrowingService --> EquipmentService
  ReportService --> BorrowingService
```

## Hak Akses

- `ADMIN` dapat mengelola peminjam, ruang, peralatan, seluruh peminjaman, pembaruan status, dan export laporan.
- `MAHASISWA` dan `DOSEN` hanya dapat mengajukan peminjaman untuk akunnya sendiri dan melihat riwayat milik sendiri.
- Status `DISETUJUI`, `DITOLAK`, dan `SELESAI` hanya dapat diubah oleh admin.

## Validasi

- Field wajib tidak boleh kosong.
- Format tanggal harus valid.
- Durasi peminjaman harus lebih dari 0 jam.
- Jumlah peralatan yang dipinjam tidak boleh melebihi stok.
- Status peminjaman hanya boleh `MENUNGGU`, `DISETUJUI`, `DITOLAK`, atau `SELESAI`.
- Aksi admin dibatasi oleh role di server action dan halaman route.

## Unit Test

Unit test tersedia di `src/lib/validation.test.ts` dan menguji:

- Field wajib.
- Durasi nol atau negatif.
- Jumlah pinjam melebihi stok.
- Data peminjaman valid.
