/**
 * Supabase Server Client
 *
 * Use this in Server Components, Server Actions, and Route Handlers.
 * It reads/writes cookies via Next.js `cookies()` to maintain the auth session.
 *
 * WHY: Supabase stores the user's session in cookies. On the server, we need
 * to explicitly read and write these cookies so the session persists across
 * requests. The browser client handles this automatically, but server code doesn't.
 *
 * Usage:
 *   import { createClient } from "@/lib/supabase/server"
 *   const supabase = await createClient()
 */
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

export async function createClient() {
  const cookieStore = await cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch {
            // setAll is called from a Server Component where cookies can't be set.
            // This is fine — the middleware will handle refreshing the session.
          }
        },
      },
    }
  );
}
