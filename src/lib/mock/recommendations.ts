/**
 * Mock Recommendation Engine
 *
 * This file contains hardcoded campsite data and a simple scoring algorithm.
 * When real AI is integrated later, only this file needs to change —
 * the rest of the app (components, pages, actions) stays the same.
 *
 * The scoring logic compares the user's trip preferences against each
 * campsite's attributes and calculates a match percentage.
 */
import type { Recommendation, Trip } from "@/lib/types";

// ============================================
// Hardcoded campsite dataset
// Each campsite has attributes the scoring algorithm compares against
// ============================================

interface CampsiteData {
  name: string;
  location: string;
  description: string;
  highlights: string[];
  amenities: string[];
  estimated_drive_time_from_chicago: string;
  image_url: string;
  // Attributes for scoring
  best_biomes: string[];
  best_vibes: string[];
  best_trip_types: string[];
  difficulty: "beginner" | "intermediate" | "advanced";
  max_group_size: number;
}

const CAMPSITES: CampsiteData[] = [
  {
    name: "Devil's Lake State Park",
    location: "Baraboo, WI",
    description:
      "Wisconsin's most popular state park with stunning bluffs, clear lakes, and over 29 miles of trails. Perfect for a mix of hiking and relaxation with excellent campground facilities.",
    highlights: [
      "Balanced Rock Trail with panoramic views",
      "Swimming and kayaking in Devil's Lake",
      "Ice Age National Scenic Trail access",
      "Beautiful fall foliage in autumn",
    ],
    amenities: [
      "Flush toilets",
      "Showers",
      "Electric hookups",
      "Camp store",
      "Boat launch",
    ],
    estimated_drive_time_from_chicago: "3 hours",
    image_url: "/images/devils-lake.jpg",
    best_biomes: ["forest", "mountain"],
    best_vibes: ["adventure", "social", "family"],
    best_trip_types: ["car_camping", "backpacking"],
    difficulty: "intermediate",
    max_group_size: 20,
  },
  {
    name: "Starved Rock State Park",
    location: "Oglesby, IL",
    description:
      "A stunning Illinois canyon landscape with 18 canyons carved by glacial meltwater. Waterfalls, lush vegetation, and well-maintained trails make it ideal for all skill levels.",
    highlights: [
      "18 unique canyons to explore",
      "Seasonal waterfalls after rainfall",
      "Illinois River views",
      "Eagle watching in winter months",
    ],
    amenities: [
      "Flush toilets",
      "Showers",
      "Electricity",
      "Lodge and restaurant nearby",
      "Visitor center",
    ],
    estimated_drive_time_from_chicago: "1.5 hours",
    image_url: "/images/starved-rock.jpg",
    best_biomes: ["forest", "prairie"],
    best_vibes: ["relaxing", "family", "romantic"],
    best_trip_types: ["car_camping", "glamping"],
    difficulty: "beginner",
    max_group_size: 30,
  },
  {
    name: "Pictured Rocks National Lakeshore",
    location: "Munising, MI",
    description:
      "Multicolored sandstone cliffs rising up to 200 feet along Lake Superior. Remote backcountry camping with incredible lake views and pristine wilderness.",
    highlights: [
      "Colorful sandstone cliffs along Lake Superior",
      "Chapel Falls and Spray Falls hikes",
      "Backcountry beach camping",
      "Dark sky stargazing",
    ],
    amenities: [
      "Vault toilets at some sites",
      "Bear boxes",
      "Backcountry permits available",
      "Kayak rentals in Munising",
    ],
    estimated_drive_time_from_chicago: "6.5 hours",
    image_url: "/images/pictured-rocks.jpg",
    best_biomes: ["forest", "coastal", "mountain"],
    best_vibes: ["adventure", "solo", "romantic"],
    best_trip_types: ["backpacking", "dispersed"],
    difficulty: "advanced",
    max_group_size: 6,
  },
  {
    name: "Indiana Dunes National Park",
    location: "Porter, IN",
    description:
      "Sand dunes along the southern shore of Lake Michigan with diverse ecosystems ranging from beaches to bogs to forests. One of the most biodiverse national parks.",
    highlights: [
      "3 Dune Challenge (climbing 3 tallest dunes)",
      "15 miles of Lake Michigan beaches",
      "Diverse ecosystems in a small area",
      "Sunset views over Chicago skyline",
    ],
    amenities: [
      "Flush toilets",
      "Showers",
      "Electric hookups",
      "Swimming beaches",
      "Visitor center",
    ],
    estimated_drive_time_from_chicago: "1 hour",
    image_url: "/images/indiana-dunes.jpg",
    best_biomes: ["coastal", "forest", "prairie"],
    best_vibes: ["relaxing", "family", "social"],
    best_trip_types: ["car_camping", "rv"],
    difficulty: "beginner",
    max_group_size: 40,
  },
  {
    name: "Shawnee National Forest",
    location: "Harrisburg, IL",
    description:
      "Southern Illinois gem featuring unique rock formations, the Garden of the Gods, and the Rim Rock trail. Perfect for those seeking a more remote and adventurous experience.",
    highlights: [
      "Garden of the Gods rock formations",
      "Rim Rock National Recreation Trail",
      "Cave-in-Rock State Park nearby",
      "Scenic river bluffs",
    ],
    amenities: [
      "Vault toilets",
      "Fire rings",
      "Picnic tables",
      "Dispersed camping allowed",
    ],
    estimated_drive_time_from_chicago: "5.5 hours",
    image_url: "/images/shawnee.jpg",
    best_biomes: ["forest", "desert", "mountain"],
    best_vibes: ["adventure", "solo"],
    best_trip_types: ["backpacking", "dispersed", "car_camping"],
    difficulty: "intermediate",
    max_group_size: 10,
  },
  {
    name: "Peninsula State Park",
    location: "Fish Creek, WI",
    description:
      "A Door County favorite with towering bluffs, a historic lighthouse, and access to charming lakeside towns. Great for a relaxed getaway with excellent biking and kayaking.",
    highlights: [
      "Eagle Bluff Lighthouse tour",
      "Sunset bike ride on Sunset Trail",
      "Kayaking in Green Bay",
      "Charming Fish Creek village nearby",
    ],
    amenities: [
      "Flush toilets",
      "Showers",
      "Electric hookups",
      "Golf course",
      "Bike rentals",
    ],
    estimated_drive_time_from_chicago: "4.5 hours",
    image_url: "/images/peninsula.jpg",
    best_biomes: ["forest", "coastal"],
    best_vibes: ["relaxing", "romantic", "family"],
    best_trip_types: ["car_camping", "glamping", "rv"],
    difficulty: "beginner",
    max_group_size: 25,
  },
];

// ============================================
// Scoring Algorithm
// ============================================

/**
 * Calculate a match score (0-100) between a trip and a campsite.
 * Higher = better match.
 */
function calculateMatchScore(trip: Trip, campsite: CampsiteData): number {
  let score = 50; // Base score
  const maxBonus = 50; // Maximum additional points
  let bonusPoints = 0;
  let totalWeight = 0;

  // Biome match (weight: 25)
  if (trip.biome) {
    totalWeight += 25;
    if (campsite.best_biomes.includes(trip.biome)) {
      bonusPoints += 25;
    }
  }

  // Vibe match (weight: 25)
  if (trip.vibe) {
    totalWeight += 25;
    if (campsite.best_vibes.includes(trip.vibe)) {
      bonusPoints += 25;
    }
  }

  // Trip type match (weight: 20)
  if (trip.trip_type) {
    totalWeight += 20;
    if (campsite.best_trip_types.includes(trip.trip_type)) {
      bonusPoints += 20;
    }
  }

  // Group size compatibility (weight: 15)
  if (trip.party_size) {
    totalWeight += 15;
    if (trip.party_size <= campsite.max_group_size) {
      bonusPoints += 15;
    } else {
      bonusPoints -= 10; // Penalty for too many people
    }
  }

  // Travel time (weight: 15)
  // Rough heuristic based on campsite distance
  if (trip.max_travel_time_hours) {
    totalWeight += 15;
    const driveHours = parseFloat(campsite.estimated_drive_time_from_chicago);
    if (driveHours <= trip.max_travel_time_hours) {
      bonusPoints += 15;
    } else {
      bonusPoints -= 5; // Small penalty
    }
  }

  // Normalize bonus to maxBonus range
  const normalizedBonus =
    totalWeight > 0 ? (bonusPoints / totalWeight) * maxBonus : 0;

  return Math.max(0, Math.min(100, Math.round(score + normalizedBonus)));
}

// ============================================
// Public API
// ============================================

/**
 * Generate mock recommendations for a trip.
 * Returns the top 3 campsites sorted by match score.
 *
 * When real AI is added, replace this function's implementation.
 * The return type (Recommendation[]) stays the same.
 */
export function generateMockRecommendations(trip: Trip): Recommendation[] {
  const scored = CAMPSITES.map((campsite) => ({
    campsite,
    score: calculateMatchScore(trip, campsite),
  }));

  // Sort by score (highest first), take top 3
  scored.sort((a, b) => b.score - a.score);
  const top3 = scored.slice(0, 3);

  return top3.map(({ campsite, score }) => ({
    name: campsite.name,
    location: campsite.location,
    description: campsite.description,
    match_score: score,
    highlights: campsite.highlights,
    amenities: campsite.amenities,
    estimated_drive_time: campsite.estimated_drive_time_from_chicago,
    image_url: campsite.image_url,
  }));
}
