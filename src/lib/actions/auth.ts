/**
 * Auth Server Actions
 *
 * Server Actions are functions that run on the server, not in the browser.
 * They're triggered by form submissions. The "use server" directive at the
 * top tells Next.js this entire file runs server-side only.
 *
 * WHY Server Actions? They let you:
 * - Safely use server-only code (database, secrets)
 * - Avoid building separate API routes
 * - Get automatic form handling with progressive enhancement
 */
"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { loginSchema, signupSchema, forgotPasswordSchema } from "@/lib/validations/auth";
import { headers } from "next/headers";

/**
 * Sign up with email and password.
 * Returns an error message if something goes wrong, otherwise redirects.
 */
export async function signUpWithEmail(formData: FormData) {
  const rawData = {
    name: formData.get("name") as string,
    email: formData.get("email") as string,
    password: formData.get("password") as string,
    confirmPassword: formData.get("confirmPassword") as string,
  };

  // Server-side validation (never trust client data)
  const parsed = signupSchema.safeParse(rawData);
  if (!parsed.success) {
    return { error: parsed.error.issues[0].message };
  }

  const supabase = await createClient();

  const { error } = await supabase.auth.signUp({
    email: parsed.data.email,
    password: parsed.data.password,
    options: {
      data: {
        full_name: parsed.data.name,
      },
    },
  });

  if (error) {
    return { error: error.message };
  }

  // After signup, redirect to login page with success message
  redirect("/auth/login?message=Check your email to confirm your account");
}

/**
 * Sign in with email and password.
 */
export async function signInWithEmail(formData: FormData) {
  const rawData = {
    email: formData.get("email") as string,
    password: formData.get("password") as string,
  };

  const parsed = loginSchema.safeParse(rawData);
  if (!parsed.success) {
    return { error: parsed.error.issues[0].message };
  }

  const supabase = await createClient();

  const { error } = await supabase.auth.signInWithPassword({
    email: parsed.data.email,
    password: parsed.data.password,
  });

  if (error) {
    return { error: error.message };
  }

  redirect("/dashboard");
}

/**
 * Sign in with Google OAuth.
 * This redirects the user to Google's login page, then back to our callback URL.
 */
export async function signInWithGoogle() {
  const supabase = await createClient();
  const headersList = await headers();
  const origin = headersList.get("origin") || "http://localhost:3000";

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo: `${origin}/auth/callback`,
    },
  });

  if (error) {
    return { error: error.message };
  }

  // Redirect to Google's OAuth page
  redirect(data.url);
}

/**
 * Send a password reset email.
 */
export async function forgotPassword(formData: FormData) {
  const rawData = {
    email: formData.get("email") as string,
  };

  const parsed = forgotPasswordSchema.safeParse(rawData);
  if (!parsed.success) {
    return { error: parsed.error.issues[0].message };
  }

  const supabase = await createClient();

  const { error } = await supabase.auth.resetPasswordForEmail(parsed.data.email, {
    redirectTo: `${process.env.NEXT_PUBLIC_SUPABASE_URL ? "" : "http://localhost:3000"}/auth/confirm`,
  });

  if (error) {
    return { error: error.message };
  }

  redirect("/auth/login?message=Check your email for a password reset link");
}

/**
 * Sign out the current user.
 */
export async function signOut() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/auth/login");
}
