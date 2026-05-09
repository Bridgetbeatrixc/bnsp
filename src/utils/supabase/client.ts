// Helper browser Supabase dipakai jika nanti butuh auth/client-side query.
import { createBrowserClient } from "@supabase/ssr";

// URL project Supabase dari env publik.
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
// Key publik Supabase dari env publik.
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

// Membuat client Supabase untuk komponen client/browser.
export const createClient = () =>
  createBrowserClient(supabaseUrl!, supabaseKey!);
