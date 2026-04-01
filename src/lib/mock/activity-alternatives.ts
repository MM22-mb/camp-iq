/**
 * Mock Activity Alternatives Generator
 *
 * Generates alternative activities a user can swap in for any given activity.
 * Uses the recommendation's highlights and amenities to create plausible options.
 * When real AI is added, replace this with AI-generated suggestions.
 */
import { simpleId } from "@/lib/mock/itineraries";
import type { DayActivity, Recommendation } from "@/lib/types";

// Which activity types can be swapped for which.
// e.g., a "hike" can be swapped for another hike, explore, or general activity.
const SWAP_COMPATIBILITY: Record<DayActivity["type"], DayActivity["type"][]> = {
  hike: ["hike", "explore", "activity"],
  meal: ["meal"],
  setup: ["setup"],
  activity: ["activity", "explore", "hike"],
  travel: ["travel"],
  rest: ["rest", "activity"],
  explore: ["explore", "hike", "activity"],
};

// Pools of alternative descriptions by activity type.
// The generator picks from these and personalizes with recommendation data.
const ALTERNATIVE_POOLS: Record<DayActivity["type"], string[]> = {
  hike: [
    "Nature photography walk",
    "Birdwatching trail hike",
    "Waterfall trail loop",
    "Ridge line scenic hike",
    "Wildflower meadow walk",
    "Lakeside trail hike",
  ],
  meal: [
    "Dutch oven campfire meal",
    "Trail mix and energy bars (quick bite)",
    "Camp stove pancakes and fruit",
    "Foil packet cooking over fire",
    "Grilled kabobs and campfire corn",
    "Simple sandwiches and fresh fruit",
  ],
  setup: [
    "Set up rain fly and weather prep",
    "Organize camp kitchen area",
    "Set up hammocks and lounging area",
  ],
  activity: [
    "Fishing at the nearest lake or stream",
    "Wildlife spotting and journaling",
    "Campfire storytelling and games",
    "Outdoor yoga and stretching session",
    "Star chart reading and constellation finding",
    "Nature sketching or watercolor painting",
    "Card games and board games at camp",
  ],
  travel: [
    "Scenic route with photo stops",
    "Stop at a local diner on the way",
  ],
  rest: [
    "Hammock reading time",
    "Lake or stream wading",
    "Cloud watching and journaling",
    "Nap and recharge at camp",
  ],
  explore: [
    "Visit the park visitor center",
    "Explore a nearby town or village",
    "Scout out swimming holes",
    "Find the best campsite viewpoint",
    "Walk the campground loop and meet neighbors",
  ],
};

/**
 * Generate 3-4 alternative activities for a given activity.
 *
 * How it works:
 * 1. Looks up which types are compatible swaps for the current activity type
 * 2. Pulls from the description pools for those types
 * 3. Mixes in the recommendation's highlights/amenities for personalization
 * 4. Returns alternatives with fresh IDs, keeping the same time slot
 */
export function generateAlternativeActivities(
  currentActivity: DayActivity,
  recommendation: Recommendation | null
): DayActivity[] {
  const compatibleTypes = SWAP_COMPATIBILITY[currentActivity.type] || [currentActivity.type];
  const alternatives: DayActivity[] = [];

  // Collect candidate descriptions from all compatible types
  const candidates: { type: DayActivity["type"]; description: string }[] = [];
  for (const type of compatibleTypes) {
    const pool = ALTERNATIVE_POOLS[type] || [];
    for (const desc of pool) {
      candidates.push({ type, description: desc });
    }
  }

  // Add recommendation-specific alternatives (personalized to the campsite)
  if (recommendation) {
    for (const highlight of recommendation.highlights) {
      if (compatibleTypes.includes("hike") || compatibleTypes.includes("explore")) {
        candidates.push({
          type: "hike",
          description: `Explore: ${highlight}`,
        });
      }
    }
    for (const amenity of recommendation.amenities) {
      if (compatibleTypes.includes("activity") || compatibleTypes.includes("explore")) {
        candidates.push({
          type: "activity",
          description: `Check out: ${amenity}`,
        });
      }
    }
  }

  // Filter out the current activity's description so we don't suggest the same thing
  const filtered = candidates.filter(
    (c) => c.description.toLowerCase() !== currentActivity.description.toLowerCase()
  );

  // Shuffle and pick up to 4 alternatives
  const shuffled = filtered.sort(() => Math.random() - 0.5);
  const picked = shuffled.slice(0, 4);

  for (const candidate of picked) {
    alternatives.push({
      id: simpleId(),
      time: currentActivity.time,
      type: candidate.type,
      description: candidate.description,
      location: recommendation?.name || currentActivity.location,
      // Use a plausible duration similar to the original
      duration_minutes: currentActivity.duration_minutes,
    });
  }

  return alternatives;
}
