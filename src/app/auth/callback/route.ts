/**
 * OAuth Callback Route Handler
 *
 * After a user signs in with Google, Supabase redirects them here with
 * an authorization code. This route exchanges that code for a session.
 *
 * Flow: User clicks "Sign in with Google" → Google login → redirected here → session created → go to dashboard
 */
import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const next = searchParams.get("next") ?? "/dashboard";

  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error) {
      return NextResponse.redirect(`${origin}${next}`);
    }
  }

  // If something went wrong, redirect to login with error
  return NextResponse.redirect(`${origin}/auth/login?message=Could not authenticate`);
}
