// Supabase SSR helper dipakai untuk refresh session auth Supabase.
import { createServerClient } from "@supabase/ssr";
// NextRequest dan NextResponse dipakai untuk membaca request dan membuat response.
import { type NextRequest, NextResponse } from "next/server";

// URL project Supabase dari environment.
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
// Publishable key Supabase dari environment.
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

// Refresh session Supabase dan sisipkan pathname untuk layout.
export async function updateSession(request: NextRequest) {
  // Clone headers agar bisa menambahkan x-pathname.
  const requestHeaders = new Headers(request.headers);
  // Pathname dipakai layout untuk membedakan halaman login.
  requestHeaders.set("x-pathname", request.nextUrl.pathname);

  // Response awal diteruskan dengan header yang sudah ditambah.
  let supabaseResponse = NextResponse.next({
    request: {
      headers: requestHeaders
    }
  });

  // Buat client Supabase server-side.
  const supabase = createServerClient(supabaseUrl!, supabaseKey!, {
    cookies: {
      // Ambil semua cookie dari request browser.
      getAll() {
        return request.cookies.getAll();
      },
      // Set cookie baru jika Supabase memperbarui session.
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
        supabaseResponse = NextResponse.next({
          request: {
            headers: requestHeaders
          }
        });
        cookiesToSet.forEach(({ name, value, options }) =>
          supabaseResponse.cookies.set(name, value, options)
        );
      }
    }
  });

  // Memanggil getUser membuat Supabase refresh session jika perlu.
  await supabase.auth.getUser();
  // Kembalikan response yang sudah membawa cookie terbaru.
  return supabaseResponse;
}
