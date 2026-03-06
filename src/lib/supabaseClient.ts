import { createClient } from "@supabase/supabase-js";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key =
  process.env.SUPABASE_SERVICE_ROLE_KEY ||
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

if (!url) {
  throw new Error("Missing NEXT_PUBLIC_SUPABASE_URL in environment");
}
if (!key) {
  throw new Error(
    "Missing Supabase key in environment (SUPABASE_SERVICE_ROLE_KEY or NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY)",
  );
}

export const supabaseServerClient = createClient(url, key, {
  auth: { persistSession: false },
});

export default supabaseServerClient;
