/**
 * Trip Validation Schema
 *
 * Validates the data collected from the trip questionnaire.
 */
import { z } from "zod/v4";

export const tripSchema = z.object({
  name: z.string().min(1, "Give your trip a name"),
  destination: z.string().optional(),
  start_date: z.string().min(1, "Start date is required"),
  end_date: z.string().min(1, "End date is required"),
  party_size: z.number().min(1, "At least 1 person").max(50, "Max 50 people"),
  trip_type: z.enum(["car_camping", "backpacking", "glamping", "rv", "dispersed"], {
    message: "Please select a trip type",
  }),
  max_travel_time_hours: z.number().min(0.5).max(24),
  biome: z.enum(["forest", "desert", "mountain", "coastal", "prairie", "alpine"], {
    message: "Please select a biome",
  }),
  vibe: z.enum(["relaxing", "adventure", "family", "romantic", "social", "solo"], {
    message: "Please select a vibe",
  }),
  freeform_notes: z.string().optional(),
});

export type TripSchemaData = z.infer<typeof tripSchema>;
