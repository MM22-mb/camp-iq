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

/**
 * Convert a 24-hour time string like "08:00" or "13:30" to 12-hour format
 * like "8:00 AM" or "1:30 PM".
 */
export function formatTime12h(time24: string): string {
  const [hourStr, minuteStr] = time24.split(":");
  let hour = parseInt(hourStr, 10);
  const minute = minuteStr || "00";
  const ampm = hour >= 12 ? "PM" : "AM";
  if (hour === 0) hour = 12;
  else if (hour > 12) hour -= 12;
  return `${hour}:${minute} ${ampm}`;
}

/**
 * Format a date string like "2026-04-09" into a friendly format
 * like "Thurs, April 9th". Works with ISO date strings (YYYY-MM-DD).
 */
export function formatFriendlyDate(dateStr: string): string {
  // If it's not a real date (e.g. "Day 2"), return as-is
  if (!dateStr.match(/^\d{4}-\d{2}-\d{2}$/)) return dateStr;

  const date = new Date(dateStr + "T12:00:00"); // noon to avoid timezone issues
  const days = ["Sun", "Mon", "Tues", "Wed", "Thurs", "Fri", "Sat"];
  const months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December",
  ];

  const dayName = days[date.getDay()];
  const month = months[date.getMonth()];
  const dayNum = date.getDate();

  // Add ordinal suffix (1st, 2nd, 3rd, 4th, etc.)
  let suffix = "th";
  if (dayNum % 10 === 1 && dayNum !== 11) suffix = "st";
  else if (dayNum % 10 === 2 && dayNum !== 12) suffix = "nd";
  else if (dayNum % 10 === 3 && dayNum !== 13) suffix = "rd";

  return `${dayName}, ${month} ${dayNum}${suffix}`;
}

/**
 * Parse a 24-hour time string "HH:MM" into total minutes since midnight.
 * Useful for overlap detection between activities.
 */
export function timeToMinutes(time: string): number {
  const [h, m] = time.split(":").map(Number);
  return h * 60 + (m || 0);
}

/**
 * Convert total minutes since midnight back to a "HH:MM" string.
 */
export function minutesToTime(totalMinutes: number): string {
  const h = Math.floor(totalMinutes / 60) % 24;
  const m = totalMinutes % 60;
  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
}
