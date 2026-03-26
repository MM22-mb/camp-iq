/**
 * Trip Card Component
 *
 * Displays a summary of a trip in the My Trips list.
 */
import Link from "next/link";
import { MapPin, Users, Calendar } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { Trip, TripStatus } from "@/lib/types";

interface TripCardProps {
  trip: Trip;
}

const STATUS_STYLES: Record<TripStatus, { label: string; className: string }> = {
  draft: { label: "Draft", className: "bg-gray-100 text-gray-700" },
  planned: { label: "Planned", className: "bg-blue-100 text-blue-700" },
  active: { label: "Active", className: "bg-green-100 text-green-700" },
  completed: { label: "Completed", className: "bg-purple-100 text-purple-700" },
  cancelled: { label: "Cancelled", className: "bg-red-100 text-red-700" },
};

export function TripCard({ trip }: TripCardProps) {
  const status = STATUS_STYLES[trip.status] || STATUS_STYLES.draft;

  return (
    <Link href={`/trips/${trip.id}`}>
      <Card className="h-full transition-colors hover:bg-muted/50 cursor-pointer">
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <CardTitle className="text-lg line-clamp-1">{trip.name}</CardTitle>
            <Badge className={status.className}>{status.label}</Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid gap-2 text-sm text-muted-foreground">
            {trip.destination && (
              <div className="flex items-center gap-2">
                <MapPin className="h-3.5 w-3.5" />
                <span>{trip.destination}</span>
              </div>
            )}
            {trip.start_date && trip.end_date && (
              <div className="flex items-center gap-2">
                <Calendar className="h-3.5 w-3.5" />
                <span>
                  {trip.start_date} to {trip.end_date}
                </span>
              </div>
            )}
            <div className="flex items-center gap-2">
              <Users className="h-3.5 w-3.5" />
              <span>
                {trip.party_size} {trip.party_size === 1 ? "person" : "people"}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
