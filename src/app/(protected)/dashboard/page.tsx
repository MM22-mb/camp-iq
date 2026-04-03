/**
 * Dashboard / My Trips Page
 *
 * Matches the Lovable app layout: "My Trips" heading with "+ New Trip" button,
 * Upcoming Actions section, Current/Past Trips tabs, and list-row trip cards.
 */
import { Plus } from "lucide-react";
import { LinkButton } from "@/components/ui/link-button";
import { TripListRow } from "@/components/trips/trip-list-row";
import { UpcomingActions } from "@/components/trips/upcoming-actions";
import { TripTabs } from "@/components/trips/trip-tabs";
import { getTrips } from "@/lib/actions/trips";

export default async function DashboardPage() {
  const trips = await getTrips();

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold">My Trips</h1>
        <LinkButton
          href="/trips/new"
          className="bg-[oklch(0.65_0.12_70)] hover:bg-[oklch(0.60_0.12_70)] text-white"
        >
          <Plus className="mr-2 h-4 w-4" />
          New Trip
        </LinkButton>
      </div>

      {trips.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-lg border border-dashed p-12 text-center">
          <div className="rounded-full bg-green-50 p-4 mb-4">
            <Plus className="h-8 w-8 text-green-600" />
          </div>
          <h2 className="text-xl font-semibold mb-2">No trips yet</h2>
          <p className="text-muted-foreground mb-4 max-w-md">
            Start planning your first camping trip. Our AI will create a
            personalized itinerary based on your preferences.
          </p>
          <LinkButton href="/trips/new">Plan Your First Trip</LinkButton>
        </div>
      ) : (
        <>
          <UpcomingActions trips={trips} />
          <TripTabs trips={trips} />
        </>
      )}
    </div>
  );
}
