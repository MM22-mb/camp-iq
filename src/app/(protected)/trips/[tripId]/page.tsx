/**
 * Trip Detail Page
 *
 * Overview of a trip. Redirects to appropriate sub-page based on status.
 */
import { notFound, redirect } from "next/navigation";
import { getTrip } from "@/lib/actions/trips";

export default async function TripDetailPage({
  params,
}: {
  params: Promise<{ tripId: string }>;
}) {
  const { tripId } = await params;
  const trip = await getTrip(tripId);

  if (!trip) {
    notFound();
  }

  // If the trip has a selected recommendation, show the itinerary
  if (trip.selected_recommendation) {
    redirect(`/trips/${tripId}/itinerary`);
  }

  // Otherwise, show recommendations
  redirect(`/trips/${tripId}/recommendations`);
}
