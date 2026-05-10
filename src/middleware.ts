// NextResponse meneruskan request tanpa call tambahan.
import { NextResponse } from "next/server";

// Middleware berjalan sebelum halaman dirender.
export function middleware() {
  // Aplikasi memakai cookie custom, jadi tidak perlu refresh session Supabase di setiap route.
  return NextResponse.next();
}

// Matcher menentukan route mana saja yang melewati middleware.
export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)"
  ]
};
