/**
 * Recommendation List
 *
 * Renders the top 3 recommendations for a trip.
 * "use client" because it handles the select action with loading state.
 */
"use client";

import { useState } from "react";
import { RecommendationCard } from "@/components/trips/recommendation-card";
import { selectRecommendation } from "@/lib/actions/trips";
import type { Recommendation } from "@/lib/types";

interface RecommendationListProps {
  tripId: string;
  recommendations: Recommendation[];
}

export function RecommendationList({
  tripId,
  recommendations,
}: RecommendationListProps) {
  const [isSelecting, setIsSelecting] = useState(false);

  async function handleSelect(recommendation: Recommendation) {
    setIsSelecting(true);
    // selectRecommendation saves the choice and redirects to itinerary
    await selectRecommendation(tripId, recommendation as unknown as Record<string, unknown>);
    // If we get here, something went wrong (normally it redirects)
    setIsSelecting(false);
  }

  return (
    <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-3">
      {recommendations.map((rec, index) => (
        <RecommendationCard
          key={index}
          recommendation={rec}
          index={index}
          onSelect={handleSelect}
          isSelecting={isSelecting}
        />
      ))}
    </div>
  );
}
