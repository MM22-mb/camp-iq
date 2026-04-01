/**
 * Activity Style Helpers
 *
 * Maps activity types to their icons and color schemes.
 * Shared between the itinerary timeline and the activity edit dialog.
 */
import {
  Mountain,
  Utensils,
  Tent,
  Car,
  Compass,
  Coffee,
  TreePine,
} from "lucide-react";
import type { DayActivity } from "@/lib/types";
import type { LucideIcon } from "lucide-react";

export interface ActivityStyle {
  icon: LucideIcon;
  color: string;
  bg: string;
  label: string;
}

/** Map an activity type to its icon, color scheme, and display label */
export function getActivityStyle(type: DayActivity["type"]): ActivityStyle {
  switch (type) {
    case "hike":
      return { icon: Mountain, color: "text-green-600", bg: "bg-green-50", label: "Hike" };
    case "meal":
      return { icon: Utensils, color: "text-orange-600", bg: "bg-orange-50", label: "Meal" };
    case "setup":
      return { icon: Tent, color: "text-blue-600", bg: "bg-blue-50", label: "Camp" };
    case "travel":
      return { icon: Car, color: "text-purple-600", bg: "bg-purple-50", label: "Travel" };
    case "rest":
      return { icon: Coffee, color: "text-amber-600", bg: "bg-amber-50", label: "Rest" };
    case "explore":
      return { icon: Compass, color: "text-teal-600", bg: "bg-teal-50", label: "Explore" };
    default:
      return { icon: TreePine, color: "text-green-600", bg: "bg-green-50", label: "Activity" };
  }
}

/** Format a duration in minutes as a human-readable string like "2h 30m" */
export function formatDuration(minutes: number): string {
  if (minutes < 60) return `${minutes}min`;
  const hours = Math.floor(minutes / 60);
  const remaining = minutes % 60;
  return remaining > 0 ? `${hours}h ${remaining}m` : `${hours}h`;
}

/** All possible activity types — used in the edit dialog's type selector */
export const ACTIVITY_TYPES: DayActivity["type"][] = [
  "hike",
  "meal",
  "setup",
  "activity",
  "travel",
  "rest",
  "explore",
];
