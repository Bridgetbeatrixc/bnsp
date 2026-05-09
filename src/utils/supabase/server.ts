// Helper Supabase untuk server component dan route handler.
import { createServerClient } from "@supabase/ssr";
// Cookies Next.js dipakai agar Supabase bisa membaca/menulis session.
import { cookies } from "next/headers";

// URL project Supabase dari env publik.
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
// Key publik Supabase dari env publik.
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

// Membuat client Supabase server-side dengan cookie store.
export const createClient = (cookieStore: Awaited<ReturnType<typeof cookies>>) => {
  return createServerClient(supabaseUrl!, supabaseKey!, {
    cookies: {
      // Ambil semua cookie dari Next.js cookie store.
      getAll() {
        return cookieStore.getAll();
      },
      // Simpan cookie session jika Supabase memperbarui token.
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options)
          );
        } catch {
          // Server Components cannot set cookies directly; middleware refreshes sessions.
        }
      }
    }
  });
};
