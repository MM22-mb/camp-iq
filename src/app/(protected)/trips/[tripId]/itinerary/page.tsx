/**
 * Itinerary Page
 *
 * Shows the pre-trip checklist and day-by-day itinerary for a trip.
 */
import { notFound } from "next/navigation";
import { getTrip } from "@/lib/actions/trips";
import { getOrCreateItinerary } from "@/lib/actions/itinerary";
import { PreTripChecklist } from "@/components/trips/pre-trip-checklist";
import { ItineraryTimeline } from "@/components/trips/itinerary-timeline";
import { Badge } from "@/components/ui/badge";
import { MapPin, Users, Calendar } from "lucide-react";
import type { PreTripTask, DayPlan, Recommendation } from "@/lib/types";

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

  return (
    <div className="grid gap-6">
      {/* Trip header */}
      <div>
        <h1 className="text-3xl font-bold">{trip.name}</h1>
        {recommendation && (
          <p className="text-lg text-muted-foreground mt-1">
            {recommendation.name} — {recommendation.location}
          </p>
        )}
        <div className="flex flex-wrap gap-3 mt-3">
          {trip.destination && (
            <Badge variant="secondary" className="gap-1">
              <MapPin className="h-3 w-3" />
              {trip.destination}
            </Badge>
          )}
          {trip.start_date && trip.end_date && (
            <Badge variant="secondary" className="gap-1">
              <Calendar className="h-3 w-3" />
              {trip.start_date} to {trip.end_date}
            </Badge>
          )}
          <Badge variant="secondary" className="gap-1">
            <Users className="h-3 w-3" />
            {trip.party_size} {trip.party_size === 1 ? "person" : "people"}
          </Badge>
        </div>
      </div>

      {/* Pre-trip checklist */}
      <PreTripChecklist
        itineraryId={itinerary.id}
        tasks={itinerary.pre_trip_tasks as PreTripTask[]}
      />

      {/* Day-by-day itinerary */}
      <ItineraryTimeline dailyPlan={itinerary.daily_plan as DayPlan[]} />
    </div>
  );
}
