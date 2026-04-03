/**
 * Camp.IQ Logo Badge
 *
 * Circular badge with a Trees icon — matches the Lovable app's logo style.
 * Used in the nav header, landing page, and auth pages.
 */
import { Trees } from "lucide-react";
import { cn } from "@/lib/utils";

interface LogoBadgeProps {
  size?: "sm" | "md" | "lg";
  className?: string;
}

const sizes = {
  sm: "h-8 w-8",
  md: "h-14 w-14",
  lg: "h-20 w-20",
};

const iconSizes = {
  sm: "h-4 w-4",
  md: "h-7 w-7",
  lg: "h-10 w-10",
};

export function LogoBadge({ size = "sm", className }: LogoBadgeProps) {
  return (
    <div
      className={cn(
        "rounded-full bg-[oklch(0.65_0.08_70)] flex items-center justify-center shrink-0",
        sizes[size],
        className
      )}
    >
      <Trees className={cn("text-white", iconSizes[size])} />
    </div>
  );
}
