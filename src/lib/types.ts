/**
 * Camp.IQ TypeScript Type Definitions
 *
 * These types define the shape of our data throughout the app.
 * They match the database schema in supabase/schema.sql.
 */

// ============================================
// Enums / Union Types
// ============================================

export type ExperienceLevel = "beginner" | "intermediate" | "advanced";

export type TripType =
  | "car_camping"
  | "backpacking"
  | "glamping"
  | "rv"
  | "dispersed";

export type TripStatus =
  | "draft"
  | "planned"
  | "active"
  | "completed"
  | "cancelled";

export type Biome =
  | "forest"
  | "desert"
  | "mountain"
  | "coastal"
  | "prairie"
  | "alpine";

export type Vibe =
  | "relaxing"
  | "adventure"
  | "family"
  | "romantic"
  | "social"
  | "solo";

// ============================================
// Database Row Types
// ============================================

export interface Profile {
  id: string;
  name: string | null;
  email: string;
  experience_level: ExperienceLevel | null;
  trip_preferences: Record<string, unknown>;
  created_at: string;
  updated_at: string;
}

export interface Trip {
  id: string;
  user_id: string;
  name: string;
  destination: string | null;
  start_date: string | null;
  end_date: string | null;
  party_size: number;
  trip_type: TripType | null;
  max_travel_time_hours: number | null;
  biome: Biome | null;
  vibe: Vibe | null;
  freeform_notes: string | null;
  status: TripStatus;
  selected_recommendation: Recommendation | null;
  created_at: string;
  updated_at: string;
}

export interface Itinerary {
  id: string;
  trip_id: string;
  pre_trip_tasks: PreTripTask[];
  daily_plan: DayPlan[];
  created_at: string;
  updated_at: string;
}

// ============================================
// App-Level Types (not directly DB rows)
// ============================================

/** A single AI-generated trip recommendation */
export interface Recommendation {
  name: string;
  location: string;
  description: string;
  match_score: number; // 0-100
  highlights: string[];
  amenities: string[];
  estimated_drive_time: string;
  image_url: string;
}

/** A task in the pre-trip checklist */
export interface PreTripTask {
  id: string;
  task: string;
  category: string;
  completed: boolean;
}

/** A single activity within a day */
export interface DayActivity {
  id: string; // unique ID for editing/swapping individual activities
  time: string; // "08:00"
  type: "hike" | "meal" | "setup" | "activity" | "travel" | "rest" | "explore";
  description: string;
  location: string;
  duration_minutes: number;
}

/** One day's plan within an itinerary */
export interface DayPlan {
  day_number: number;
  date: string;
  activities: DayActivity[];
}

// ============================================
// Form Input Types
// ============================================

/** Data collected from the trip questionnaire */
export interface TripFormData {
  name: string;
  destination: string;
  start_date: string;
  end_date: string;
  party_size: number;
  trip_type: TripType;
  max_travel_time_hours: number;
  biome: Biome;
  vibe: Vibe;
  freeform_notes: string;
}
