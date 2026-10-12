# Universitas XYZ Borrowing System

A room and equipment borrowing system for a university, built as the case study for the BNSP (Indonesian National Professional Certification Agency) programmer certification.

**Live demo:** https://universitas-xyz-borrowing.vercel.app

## Features

- Role-based login for admins, students and lecturers
- CRUD for borrowers (students and lecturers), rooms and equipment
- Borrowing transactions with multiple equipment items per request
- Validation of required fields, dates, duration and stock
- Only admins can change a borrowing's status
- Excel report export
- Unit tests for critical input validation

## Access control

- Admins can access every menu, manage master data, export reports and update borrowing status.
- Students and lecturers only see their own dashboard, submit borrowing requests and view their own history.
- Students and lecturers cannot set a status to `DISETUJUI` (approved), `DITOLAK` (rejected) or `SELESAI` (completed).

## Tech stack

- Next.js + TypeScript
- Supabase PostgreSQL with Supabase SSR client helpers
- Prisma ORM
- Zod validation
- ExcelJS export
- Vitest unit tests

## Demo accounts

```text
ADMIN
username: admin
password: admin123

STUDENT
username: alya
password: mahasiswa123

LECTURER
username: bima
password: dosen123
```

## Getting started

1. Create a Supabase project and copy `.env.example` to `.env`.
2. Fill in `DATABASE_URL` with your Supabase database password. URL-encode the password if it contains special characters.
3. Install dependencies, push the schema, seed sample data and start the app:

```bash
npm install
npm run db:push
npm run db:seed
npm run dev
```

The Supabase browser and server helpers live in:

- `src/utils/supabase/client.ts`
- `src/utils/supabase/server.ts`
- `src/utils/supabase/middleware.ts`
- `src/middleware.ts`

### Supabase CLI (optional)

The CLI is optional because Prisma connects to Supabase PostgreSQL directly through `DATABASE_URL`. If you have it installed:

```bash
supabase login
supabase init
supabase link --project-ref <your-project-ref>
```

### If `npm run db:push` fails with P1001

On some projects the direct database host (`db.<project-ref>.supabase.co:5432`) only resolves to IPv6. If your network doesn't support IPv6, Prisma can't reach the database. The easiest fix is to open the Supabase dashboard, click **Connect**, choose the **Session pooler** connection string and put it in `DATABASE_URL`:

```env
DATABASE_URL="postgres://postgres.<project-ref>:YOUR_PASSWORD@aws-0-YOUR_REGION.pooler.supabase.com:5432/postgres"
```

For serverless deployments, use the Transaction pooler and add `pgbouncer=true` if Prisma reports prepared statement errors.

## Tests

```bash
npm test
```
