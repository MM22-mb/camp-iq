/**
 * Trip Validation Schema Tests
 */
import { describe, it, expect } from "vitest";
import { tripSchema } from "../trip";

const validTrip = {
  name: "Weekend at Devil's Lake",
  destination: "Baraboo, WI",
  start_date: "2026-07-15",
  end_date: "2026-07-17",
  party_size: 4,
  trip_type: "car_camping" as const,
  max_travel_time_hours: 3,
  biome: "forest" as const,
  vibe: "adventure" as const,
  freeform_notes: "Bring the dog!",
};

describe("tripSchema", () => {
  it("accepts valid trip data", () => {
    const result = tripSchema.safeParse(validTrip);
    expect(result.success).toBe(true);
  });

  it("rejects empty trip name", () => {
    const result = tripSchema.safeParse({ ...validTrip, name: "" });
    expect(result.success).toBe(false);
  });

  it("rejects party size of 0", () => {
    const result = tripSchema.safeParse({ ...validTrip, party_size: 0 });
    expect(result.success).toBe(false);
  });

  it("rejects party size over 50", () => {
    const result = tripSchema.safeParse({ ...validTrip, party_size: 51 });
    expect(result.success).toBe(false);
  });

  it("rejects invalid trip type", () => {
    const result = tripSchema.safeParse({ ...validTrip, trip_type: "unknown" });
    expect(result.success).toBe(false);
  });

  it("rejects invalid biome", () => {
    const result = tripSchema.safeParse({ ...validTrip, biome: "tundra" });
    expect(result.success).toBe(false);
  });

  it("allows optional destination", () => {
    const { destination, ...withoutDest } = validTrip;
    const result = tripSchema.safeParse(withoutDest);
    expect(result.success).toBe(true);
  });

  it("allows optional freeform notes", () => {
    const { freeform_notes, ...withoutNotes } = validTrip;
    const result = tripSchema.safeParse(withoutNotes);
    expect(result.success).toBe(true);
  });
});
