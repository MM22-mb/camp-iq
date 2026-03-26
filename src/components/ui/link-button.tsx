"use client";

/**
 * LinkButton — A styled link that looks like a button
 *
 * In the latest shadcn/ui (v4+), the Button component uses @base-ui/react
 * which doesn't support the `asChild` pattern from older Radix-based versions.
 *
 * This component combines Next.js Link with button styling, so you can
 * use it anywhere you need a link that looks like a button.
 *
 * Usage:
 *   <LinkButton href="/trips/new" variant="outline">Plan a Trip</LinkButton>
 */
import Link from "next/link";
import { type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";

interface LinkButtonProps
  extends React.AnchorHTMLAttributes<HTMLAnchorElement>,
    VariantProps<typeof buttonVariants> {
  href: string;
}

function LinkButton({
  className,
  variant = "default",
  size = "default",
  href,
  ...props
}: LinkButtonProps) {
  return (
    <Link
      href={href}
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  );
}

export { LinkButton };
