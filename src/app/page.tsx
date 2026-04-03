/**
 * Landing Page
 *
 * The public-facing homepage. Authenticated users are redirected to /dashboard
 * by the middleware, so only logged-out users see this page.
 */
import Link from "next/link";
import { MapPin, Clock, Users } from "lucide-react";
import { LinkButton } from "@/components/ui/link-button";
import { LogoBadge } from "@/components/layout/logo-badge";

export default function HomePage() {
  return (
    <div className="flex min-h-screen flex-col">
      {/* Header */}
      <header className="border-b">
        <div className="container flex h-14 items-center justify-between px-4 mx-auto max-w-7xl">
          <Link href="/" className="flex items-center gap-2 font-bold text-lg">
            <LogoBadge />
            <span>Camp.IQ</span>
          </Link>
          <div className="flex items-center gap-2">
            <LinkButton href="/auth/login" variant="ghost">Sign in</LinkButton>
            <LinkButton href="/auth/signup">Get Started</LinkButton>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-1">
        <section className="bg-gradient-to-b from-accent/50 to-background">
          <div className="container mx-auto max-w-7xl px-4 py-24 text-center">
          <h1 className="text-4xl font-bold tracking-tight sm:text-6xl">
            Plan your perfect
            <span className="text-primary"> camping trip</span>
            <br />
            in minutes, not hours
          </h1>
          <p className="mt-6 text-lg text-muted-foreground max-w-2xl mx-auto">
            Stop juggling campsite websites, trail blogs, and group texts.
            Camp.IQ creates a personalized camping plan tailored to your
            location, group size, and outdoor goals.
          </p>
          <div className="mt-8 flex justify-center gap-4">
            <LinkButton href="/auth/signup" size="lg">
              Start Planning for Free
            </LinkButton>
            <LinkButton href="/auth/login" size="lg" variant="outline">
              Sign In
            </LinkButton>
          </div>
          </div>
        </section>

        {/* Features */}
        <section className="container mx-auto max-w-7xl px-4 py-16">
          <div className="grid gap-8 md:grid-cols-3">
            <div className="flex flex-col items-center text-center p-6">
              <div className="rounded-full bg-green-50 p-3 mb-4">
                <MapPin className="h-6 w-6 text-green-600" />
              </div>
              <h3 className="font-semibold text-lg mb-2">Smart Recommendations</h3>
              <p className="text-muted-foreground">
                Get personalized campsite and itinerary recommendations
                matched to your preferences and experience level.
              </p>
            </div>
            <div className="flex flex-col items-center text-center p-6">
              <div className="rounded-full bg-green-50 p-3 mb-4">
                <Clock className="h-6 w-6 text-green-600" />
              </div>
              <h3 className="font-semibold text-lg mb-2">Save Hours of Planning</h3>
              <p className="text-muted-foreground">
                Go from &quot;I want to go camping&quot; to a complete
                hour-by-hour itinerary in minutes.
              </p>
            </div>
            <div className="flex flex-col items-center text-center p-6">
              <div className="rounded-full bg-green-50 p-3 mb-4">
                <Users className="h-6 w-6 text-green-600" />
              </div>
              <h3 className="font-semibold text-lg mb-2">Built for Groups</h3>
              <p className="text-muted-foreground">
                Whether you&apos;re planning solo or for a group of 10,
                Camp.IQ adapts to your needs.
              </p>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t py-6">
        <div className="container mx-auto max-w-7xl px-4 text-center text-sm text-muted-foreground">
          &copy; {new Date().getFullYear()} Camp.IQ. All rights reserved.
        </div>
      </footer>
    </div>
  );
}
