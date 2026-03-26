/**
 * Mock Itinerary Generator Tests
 */
import { describe, it, expect } from "vitest";
import { generateMockItinerary } from "../itineraries";
import type { Trip, Recommendation } from "@/lib/types";

const mockTrip: Trip = {
  id: "test-id",
  user_id: "user-id",
  name: "Test Trip",
  destination: "Baraboo, WI",
  start_date: "2026-07-15",
  end_date: "2026-07-17",
  party_size: 4,
  trip_type: "car_camping",
  max_travel_time_hours: 3,
  biome: "forest",
  vibe: "adventure",
  freeform_notes: null,
  status: "planned",
  selected_recommendation: null,
  created_at: "2026-01-01",
  updated_at: "2026-01-01",
};

const mockRecommendation: Recommendation = {
  name: "Devil's Lake State Park",
  location: "Baraboo, WI",
  description: "A great park.",
  match_score: 85,
  highlights: ["Balanced Rock Trail", "Swimming", "Ice Age Trail"],
  amenities: ["Showers", "Toilets"],
  estimated_drive_time: "3 hours",
  image_url: "/images/devils-lake.jpg",
};

describe("generateMockItinerary", () => {
  it("generates correct number of days based on trip dates", () => {
    const result = generateMockItinerary(mockTrip, mockRecommendation);
    // July 15 to July 17 = 3 days
    expect(result.daily_plan).toHaveLength(3);
  });

  it("generates pre-trip tasks", () => {
    const result = generateMockItinerary(mockTrip, mockRecommendation);
    expect(result.pre_trip_tasks.length).toBeGreaterThan(0);
  });

  it("pre-trip tasks have required fields", () => {
    const result = generateMockItinerary(mockTrip, mockRecommendation);
    for (const task of result.pre_trip_tasks) {
      expect(task.id).toBeTruthy();
      expect(task.task).toBeTruthy();
      expect(task.category).toBeTruthy();
      expect(task.completed).toBe(false);
    }
  });

  it("each day has activities", () => {
    const result = generateMockItinerary(mockTrip, mockRecommendation);
    for (const day of result.daily_plan) {
      expect(day.activities.length).toBeGreaterThan(0);
      expect(day.day_number).toBeGreaterThan(0);
    }
  });

  it("activities have time and description", () => {
    const result = generateMockItinerary(mockTrip, mockRecommendation);
    for (const day of result.daily_plan) {
      for (const activity of day.activities) {
        expect(activity.time).toMatch(/^\d{2}:\d{2}$/);
        expect(activity.description).toBeTruthy();
        expect(activity.type).toBeTruthy();
      }
    }
  });

  it("adds extra tasks for large groups", () => {
    const largeGroupTrip = { ...mockTrip, party_size: 8 };
    const smallGroupResult = generateMockItinerary(mockTrip, mockRecommendation);
    const largeGroupResult = generateMockItinerary(largeGroupTrip, mockRecommendation);

    expect(largeGroupResult.pre_trip_tasks.length).toBeGreaterThan(
      smallGroupResult.pre_trip_tasks.length
    );
  });
});
