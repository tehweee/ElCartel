import { createClient } from "@supabase/supabase-js";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

// Only treat the service role key as valid if it is a real JWT (starts with eyJ)
const rawServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const validServiceKey =
  rawServiceKey && rawServiceKey.startsWith("eyJ") ? rawServiceKey : undefined;

if (!url) throw new Error("Missing NEXT_PUBLIC_SUPABASE_URL in environment");
if (!anonKey)
  throw new Error(
    "Missing NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY in environment",
  );

// No-op storage — prevents "Persisting failed" warnings when the Supabase
// client is used in a server / Node.js context where there is no localStorage.
const noopStorage = {
  getItem: (_key: string): string | null => null,
  setItem: (_key: string, _value: string): void => {},
  removeItem: (_key: string): void => {},
};

/**
 * Anon client — uses the publishable key, subject to RLS.
 * Safe for user-facing auth (signUp, signInWithPassword) and operations
 * covered by anon-role RLS policies.
 */
export const supabaseAnonClient = createClient(url, anonKey, {
  auth: { persistSession: false, storage: noopStorage },
});

/**
 * Admin client — uses the service role key, bypasses RLS.
 * SERVER SIDE ONLY. null when SUPABASE_SERVICE_ROLE_KEY is not set or is
 * still the placeholder value.
 */
export const supabaseAdminClient = validServiceKey
  ? createClient(url, validServiceKey, {
      auth: { persistSession: false, storage: noopStorage },
    })
  : null;

// Backward-compat exports used by existing code
export const supabaseServerClient = supabaseAdminClient ?? supabaseAnonClient;
export default supabaseServerClient;
