/**
 * Mock Recommendation Engine Tests
 */
import { describe, it, expect } from "vitest";
import { generateMockRecommendations } from "../recommendations";
import type { Trip } from "@/lib/types";

// Minimal trip object for testing
const baseTripData: Trip = {
  id: "test-id",
  user_id: "user-id",
  name: "Test Trip",
  destination: null,
  start_date: "2026-07-15",
  end_date: "2026-07-17",
  party_size: 4,
  trip_type: "car_camping",
  max_travel_time_hours: 3,
  biome: "forest",
  vibe: "adventure",
  freeform_notes: null,
  status: "draft",
  selected_recommendation: null,
  created_at: "2026-01-01",
  updated_at: "2026-01-01",
};

describe("generateMockRecommendations", () => {
  it("returns exactly 3 recommendations", () => {
    const recs = generateMockRecommendations(baseTripData);
    expect(recs).toHaveLength(3);
  });

  it("each recommendation has required fields", () => {
    const recs = generateMockRecommendations(baseTripData);
    for (const rec of recs) {
      expect(rec.name).toBeTruthy();
      expect(rec.location).toBeTruthy();
      expect(rec.description).toBeTruthy();
      expect(rec.match_score).toBeGreaterThanOrEqual(0);
      expect(rec.match_score).toBeLessThanOrEqual(100);
      expect(rec.highlights.length).toBeGreaterThan(0);
      expect(rec.amenities.length).toBeGreaterThan(0);
      expect(rec.estimated_drive_time).toBeTruthy();
    }
  });

  it("recommendations are sorted by match score (highest first)", () => {
    const recs = generateMockRecommendations(baseTripData);
    for (let i = 1; i < recs.length; i++) {
      expect(recs[i - 1].match_score).toBeGreaterThanOrEqual(recs[i].match_score);
    }
  });

  it("scores vary based on different trip preferences", () => {
    const forestTrip = { ...baseTripData, biome: "forest" as const };
    const desertTrip = { ...baseTripData, biome: "desert" as const };

    const forestRecs = generateMockRecommendations(forestTrip);
    const desertRecs = generateMockRecommendations(desertTrip);

    // Top recommendation should differ (or at least scores should differ)
    const forestTopScore = forestRecs[0].match_score;
    const desertTopScore = desertRecs[0].match_score;

    // They shouldn't all be identical
    expect(forestRecs[0].name !== desertRecs[0].name || forestTopScore !== desertTopScore).toBe(
      true
    );
  });
});
