/**
 * Trip List Row
 *
 * Full-width row for the My Trips list, matching the Lovable app design:
 * icon circle + trip name + location + dates + status badge + chevron.
 */
import Link from "next/link";
import { Mountain, MapPin, Calendar, ChevronRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import type { Trip, TripStatus } from "@/lib/types";

interface TripListRowProps {
  trip: Trip;
}

const STATUS_STYLES: Record<TripStatus, { label: string; className: string }> = {
  draft: { label: "Draft", className: "bg-gray-100 text-gray-700" },
  planned: { label: "Upcoming", className: "bg-amber-50 text-amber-700 border-amber-200" },
  active: { label: "Active", className: "bg-green-100 text-green-700" },
  completed: { label: "Completed", className: "bg-purple-100 text-purple-700" },
  cancelled: { label: "Cancelled", className: "bg-red-100 text-red-700" },
};

function formatDateRange(start: string | null, end: string | null): string {
  if (!start || !end) return "";
  const fmt = (d: string) => {
    const date = new Date(d + "T12:00:00");
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
  };
  return `${fmt(start)}\u2013${fmt(end)}`;
}

export function TripListRow({ trip }: TripListRowProps) {
  const status = STATUS_STYLES[trip.status] || STATUS_STYLES.draft;

  return (
    <Link
      href={`/trips/${trip.id}`}
      className="flex items-center gap-4 rounded-lg border bg-card p-4 hover:bg-muted/50 transition-colors cursor-pointer"
    >
      {/* Icon */}
      <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center shrink-0">
        <Mountain className="h-5 w-5 text-muted-foreground" />
      </div>

      {/* Trip info */}
      <div className="flex-1 min-w-0">
        <p className="font-semibold truncate">{trip.name}</p>
        <div className="flex items-center gap-4 text-sm text-muted-foreground mt-0.5">
          {trip.destination && (
            <span className="flex items-center gap-1">
              <MapPin className="h-3.5 w-3.5" />
              {trip.destination}
            </span>
          )}
          {trip.start_date && trip.end_date && (
            <span className="flex items-center gap-1">
              <Calendar className="h-3.5 w-3.5" />
              {formatDateRange(trip.start_date, trip.end_date)}
            </span>
          )}
        </div>
      </div>

      {/* Status + chevron */}
      <Badge variant="outline" className={status.className}>
        {status.label}
      </Badge>
      <ChevronRight className="h-5 w-5 text-muted-foreground shrink-0" />
    </Link>
  );
}
