/**
 * Itinerary Page
 *
 * Matches the Lovable app layout: back link, trip header with metadata,
 * share button, pre-trip checklist, and stacked day cards with activities.
 */
import { notFound } from "next/navigation";
import Link from "next/link";
import { getTrip } from "@/lib/actions/trips";
import { getOrCreateItinerary } from "@/lib/actions/itinerary";
import { PreTripChecklist } from "@/components/trips/pre-trip-checklist";
import { ItineraryTimeline } from "@/components/trips/itinerary-timeline";
import { ArrowLeft, MapPin, Calendar, Clock, Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { PreTripTask, DayPlan, Recommendation } from "@/lib/types";

function formatDateRange(start: string, end: string): string {
  const fmt = (d: string) => {
    const date = new Date(d + "T12:00:00");
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
  };
  return `${fmt(start)}\u2013${fmt(end)}`;
}

function nightsBetween(start: string, end: string): number {
  const s = new Date(start + "T12:00:00");
  const e = new Date(end + "T12:00:00");
  return Math.round((e.getTime() - s.getTime()) / (1000 * 60 * 60 * 24));
}

export default async function ItineraryPage({
  params,
}: {
  params: Promise<{ tripId: string }>;
}) {
  const { tripId } = await params;
  const trip = await getTrip(tripId);

  if (!trip) {
    notFound();
  }

  const itinerary = await getOrCreateItinerary(tripId);

  if (!itinerary) {
    return (
      <div className="text-center py-12">
        <h1 className="text-2xl font-bold mb-2">No itinerary yet</h1>
        <p className="text-muted-foreground">
          Please select a recommendation first to generate your itinerary.
        </p>
      </div>
    );
  }

  const recommendation = trip.selected_recommendation as Recommendation | null;
  const nights =
    trip.start_date && trip.end_date
      ? nightsBetween(trip.start_date, trip.end_date)
      : null;

  return (
    <div className="grid gap-6">
      {/* Back link */}
      <Link
        href="/dashboard"
        className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground w-fit"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Trips
      </Link>

      {/* Trip header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-bold">{trip.name}</h1>
          <div className="flex flex-wrap items-center gap-4 mt-2 text-sm text-muted-foreground">
            {(recommendation?.location || trip.destination) && (
              <span className="flex items-center gap-1">
                <MapPin className="h-4 w-4" />
                {recommendation?.location || trip.destination}
              </span>
            )}
            {trip.start_date && trip.end_date && (
              <span className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                {formatDateRange(trip.start_date, trip.end_date)}
              </span>
            )}
            {nights !== null && (
              <span className="flex items-center gap-1">
                <Clock className="h-4 w-4" />
                {nights} {nights === 1 ? "night" : "nights"}
              </span>
            )}
          </div>
        </div>
        <Button variant="outline" className="gap-2 shrink-0">
          <Share2 className="h-4 w-4" />
          Share With Friends
        </Button>
      </div>

      {/* Pre-trip checklist */}
      <PreTripChecklist
        itineraryId={itinerary.id}
        tasks={itinerary.pre_trip_tasks as PreTripTask[]}
      />

      {/* Day-by-day itinerary — stacked day cards with expandable activity rows */}
      <ItineraryTimeline
        dailyPlan={itinerary.daily_plan as DayPlan[]}
        itineraryId={itinerary.id}
        recommendation={recommendation}
      />
    </div>
  );
}
