/**
 * Dashboard / My Trips Page
 *
 * Fetches the user's trips and displays them in a grid.
 * Shows an empty state if no trips exist yet.
 */
import { Plus } from "lucide-react";
import { LinkButton } from "@/components/ui/link-button";
import { TripCard } from "@/components/trips/trip-card";
import { getTrips } from "@/lib/actions/trips";

export default async function DashboardPage() {
  const trips = await getTrips();

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold">My Trips</h1>
          <p className="text-muted-foreground mt-1">
            Plan, manage, and revisit your camping adventures
          </p>
        </div>
        <LinkButton href="/trips/new">
          <Plus className="mr-2 h-4 w-4" />
          Plan a New Trip
        </LinkButton>
      </div>

      {trips.length === 0 ? (
        /* Empty state */
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
        /* Trip grid */
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {trips.map((trip) => (
            <TripCard key={trip.id} trip={trip} />
          ))}
        </div>
      )}
    </div>
  );
}
