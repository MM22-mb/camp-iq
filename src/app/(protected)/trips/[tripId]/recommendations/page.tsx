/**
 * Recommendations Page
 *
 * Shows 3 personalized trip recommendations after the user fills out the questionnaire.
 * This is a Server Component — it fetches the trip data and generates mock recommendations
 * on the server, then passes them to the client component for rendering.
 */
import { notFound } from "next/navigation";
import { getTrip } from "@/lib/actions/trips";
import { generateMockRecommendations } from "@/lib/mock/recommendations";
import { RecommendationList } from "@/components/trips/recommendation-list";
import type { Trip } from "@/lib/types";

export default async function RecommendationsPage({
  params,
}: {
  params: Promise<{ tripId: string }>;
}) {
  const { tripId } = await params;
  const trip = await getTrip(tripId);

  if (!trip) {
    notFound();
  }

  // Generate mock recommendations based on the trip's parameters
  const recommendations = generateMockRecommendations(trip as Trip);

  return (
    <div>
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold">Your Top Recommendations</h1>
        <p className="text-muted-foreground mt-2">
          Based on your preferences for &quot;{trip.name}&quot;, here are your
          top 3 trip options.
        </p>
      </div>

      <RecommendationList tripId={tripId} recommendations={recommendations} />
    </div>
  );
}
