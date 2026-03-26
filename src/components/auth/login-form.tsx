/**
 * Login Form Component
 *
 * "use client" because forms need state (tracking input values, errors,
 * submission status) which only works in the browser.
 *
 * Uses react-hook-form for form state management + Zod for validation.
 * The form calls a Server Action on submit, which runs on the server.
 */
"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { OAuthButtons } from "@/components/auth/oauth-buttons";
import { signInWithEmail } from "@/lib/actions/auth";
import { loginSchema, type LoginFormData } from "@/lib/validations/auth";

export function LoginForm({ message }: { message?: string }) {
  const [serverError, setServerError] = useState<string | null>(null);

  // react-hook-form manages form state and validation
  // zodResolver connects our Zod schema to the form
  const {
    register,     // Connects an input to the form (tracks its value)
    handleSubmit,  // Wraps our submit handler with validation
    formState: { errors, isSubmitting },  // Validation errors + loading state
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  async function onSubmit(data: LoginFormData) {
    setServerError(null);

    // Create FormData to pass to the Server Action
    const formData = new FormData();
    formData.append("email", data.email);
    formData.append("password", data.password);

    const result = await signInWithEmail(formData);
    // If signInWithEmail returns (instead of redirecting), there was an error
    if (result?.error) {
      setServerError(result.error);
    }
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl font-bold">Welcome back</CardTitle>
        <CardDescription>Sign in to your Camp.IQ account</CardDescription>
      </CardHeader>
      <CardContent>
        {/* Success message (e.g., after signup) */}
        {message && (
          <div className="mb-4 rounded-md bg-green-50 p-3 text-sm text-green-700">
            {message}
          </div>
        )}

        {/* Server error (e.g., wrong password) */}
        {serverError && (
          <div className="mb-4 rounded-md bg-red-50 p-3 text-sm text-red-700">
            {serverError}
          </div>
        )}

        <OAuthButtons />

        <div className="relative my-4">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-card px-2 text-muted-foreground">Or continue with email</span>
          </div>
        </div>

        {/* handleSubmit validates the form, then calls onSubmit if valid */}
        <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="email">Email</Label>
            {/* register("email") tells react-hook-form to track this input */}
            <Input
              id="email"
              type="email"
              placeholder="you@example.com"
              {...register("email")}
            />
            {/* Show validation error if the email is invalid */}
            {errors.email && (
              <p className="text-sm text-red-500">{errors.email.message}</p>
            )}
          </div>

          <div className="grid gap-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="password">Password</Label>
              <Link
                href="/auth/forgot-password"
                className="text-sm text-muted-foreground underline-offset-4 hover:underline"
              >
                Forgot password?
              </Link>
            </div>
            <Input
              id="password"
              type="password"
              {...register("password")}
            />
            {errors.password && (
              <p className="text-sm text-red-500">{errors.password.message}</p>
            )}
          </div>

          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? "Signing in..." : "Sign in"}
          </Button>
        </form>

        <p className="mt-4 text-center text-sm text-muted-foreground">
          Don&apos;t have an account?{" "}
          <Link href="/auth/signup" className="underline underline-offset-4 hover:text-primary">
            Sign up
          </Link>
        </p>
      </CardContent>
    </Card>
  );
}
