// NextRequest memberi akses ke request yang sedang masuk.
import { type NextRequest } from "next/server";
// Middleware Supabase juga dipakai untuk menyisipkan pathname ke header.
import { updateSession } from "@/utils/supabase/middleware";

// Middleware berjalan sebelum halaman dirender.
export async function middleware(request: NextRequest) {
  // Update session Supabase dan teruskan pathname ke layout.
  return updateSession(request);
}

// Matcher menentukan route mana saja yang melewati middleware.
export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)"
  ]
};
