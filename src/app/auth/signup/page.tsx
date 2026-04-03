/**
 * Signup Page
 *
 * Centered layout with Camp.IQ logo badge above the form card.
 */
import { SignupForm } from "@/components/auth/signup-form";
import { LogoBadge } from "@/components/layout/logo-badge";

export default function SignupPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-4">
      <LogoBadge size="lg" className="mb-6" />
      <h1 className="text-3xl font-bold mb-1">Create Your Account</h1>
      <p className="text-muted-foreground mb-8">Start planning your next adventure</p>
      <SignupForm />
    </div>
  );
}
