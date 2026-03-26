/**
 * Header / Navigation Bar
 *
 * Shows the main navigation links and user menu.
 * "use client" because it uses dropdown menu interactions and sign-out action.
 */
"use client";

import { useRouter } from "next/navigation";
import { Trees, Plus, Compass, User, LogOut } from "lucide-react";
import { LinkButton } from "@/components/ui/link-button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { signOut } from "@/lib/actions/auth";

interface HeaderProps {
  userName: string | null;
  userEmail: string;
}

export function Header({ userName, userEmail }: HeaderProps) {
  const router = useRouter();

  // Get initials for the avatar (e.g., "John Doe" -> "JD")
  const initials = userName
    ? userName
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : userEmail[0].toUpperCase();

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center justify-between px-4 mx-auto max-w-7xl">
        {/* Logo / Brand */}
        <LinkButton href="/dashboard" variant="ghost" className="font-bold text-lg gap-2 px-2">
          <Trees className="h-6 w-6 text-green-600" />
          <span>Camp.IQ</span>
        </LinkButton>

        {/* Navigation Links */}
        <nav className="hidden md:flex items-center gap-1">
          <LinkButton href="/dashboard" variant="ghost">My Trips</LinkButton>
          <LinkButton href="/trips/new" variant="ghost">
            <Plus className="mr-1 h-4 w-4" />
            Plan a Trip
          </LinkButton>
          <LinkButton href="/explore" variant="ghost">
            <Compass className="mr-1 h-4 w-4" />
            Explore
          </LinkButton>
        </nav>

        {/* User Menu */}
        <DropdownMenu>
          <DropdownMenuTrigger className="relative h-8 w-8 rounded-full cursor-pointer outline-none">
            <Avatar className="h-8 w-8">
              <AvatarFallback className="bg-green-100 text-green-700 text-sm">
                {initials}
              </AvatarFallback>
            </Avatar>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <div className="flex flex-col space-y-1 p-2">
              <p className="text-sm font-medium">{userName || "Camper"}</p>
              <p className="text-xs text-muted-foreground">{userEmail}</p>
            </div>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => router.push("/profile")}>
              <User className="mr-2 h-4 w-4" />
              Profile
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => signOut()}>
              <LogOut className="mr-2 h-4 w-4" />
              Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
