/**
 * Supabase Browser Client
 *
 * Use this in Client Components (files with "use client" at the top).
 * It reads the auth session from cookies automatically in the browser.
 *
 * Usage:
 *   import { createClient } from "@/lib/supabase/client"
 *   const supabase = createClient()
 */
import { createBrowserClient } from "@supabase/ssr";

export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}
