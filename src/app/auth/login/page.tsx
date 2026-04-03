/**
 * Login Page
 *
 * Centered layout with Camp.IQ logo badge above the form card.
 */
import { LoginForm } from "@/components/auth/login-form";
import { LogoBadge } from "@/components/layout/logo-badge";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ message?: string }>;
}) {
  const { message } = await searchParams;

  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-4">
      <LogoBadge size="lg" className="mb-6" />
      <h1 className="text-3xl font-bold mb-1">Welcome to Camp.IQ</h1>
      <p className="text-muted-foreground mb-8">Sign in to plan your next adventure</p>
      <LoginForm message={message} />
    </div>
  );
}
