/**
 * Header / Navigation Bar
 *
 * Flat horizontal nav matching the Lovable app design.
 * All nav items visible in the top bar (no dropdown).
 * Active route gets a dark green pill background.
 */
"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import {
  BookOpen,
  Compass,
  Globe,
  User,
  Settings,
  LogOut,
} from "lucide-react";
import { signOut } from "@/lib/actions/auth";
import { cn } from "@/lib/utils";
import { LogoBadge } from "@/components/layout/logo-badge";

interface HeaderProps {
  userName: string | null;
  userEmail: string;
}

/** Individual nav link with icon and active state */
function NavLink({
  href,
  icon: Icon,
  label,
  active,
}: {
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  active: boolean;
}) {
  return (
    <Link
      href={href}
      className={cn(
        "flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm font-medium transition-colors",
        active
          ? "bg-primary text-primary-foreground"
          : "text-muted-foreground hover:text-foreground hover:bg-muted"
      )}
    >
      <Icon className="h-4 w-4" />
      <span className="hidden sm:inline">{label}</span>
    </Link>
  );
}

export function Header({ userName, userEmail }: HeaderProps) {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center justify-between px-4 mx-auto max-w-7xl">
        {/* Logo / Brand */}
        <Link href="/dashboard" className="flex items-center gap-2 font-bold text-lg">
          <LogoBadge />
          <span>Camp.IQ</span>
        </Link>

        {/* Navigation Links — all visible */}
        <nav className="flex items-center gap-1">
          <NavLink
            href="/dashboard"
            icon={BookOpen}
            label="My Trips"
            active={pathname === "/dashboard"}
          />
          <NavLink
            href="/trips/new"
            icon={Compass}
            label="Plan a Trip"
            active={pathname === "/trips/new"}
          />
          <NavLink
            href="/explore"
            icon={Globe}
            label="Explore"
            active={pathname === "/explore"}
          />
          <NavLink
            href="/profile"
            icon={User}
            label="Profile"
            active={pathname === "/profile"}
          />
          <NavLink
            href="/settings"
            icon={Settings}
            label="Settings"
            active={pathname === "/settings"}
          />

          {/* Log Out — styled as a nav link but triggers server action */}
          <button
            onClick={() => signOut()}
            className="flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted transition-colors cursor-pointer"
          >
            <LogOut className="h-4 w-4" />
            <span className="hidden sm:inline">Log Out</span>
          </button>
        </nav>
      </div>
    </header>
  );
}
