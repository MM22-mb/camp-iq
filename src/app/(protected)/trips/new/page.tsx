/**
 * New Trip Page
 *
 * Renders the multi-step trip questionnaire.
 */
import { TripQuestionnaire } from "@/components/trips/trip-questionnaire";

export default function NewTripPage() {
  return (
    <div>
      <h1 className="text-3xl font-bold mb-6 text-center">Plan a New Trip</h1>
      <TripQuestionnaire />
    </div>
  );
}
