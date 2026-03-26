/**
 * Login Page
 *
 * This is a Server Component (no "use client") — it runs on the server.
 * It reads the URL search params and passes them to the LoginForm client component.
 */
import { LoginForm } from "@/components/auth/login-form";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ message?: string }>;
}) {
  const { message } = await searchParams;

  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <LoginForm message={message} />
    </div>
  );
}
