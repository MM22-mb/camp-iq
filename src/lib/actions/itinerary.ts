/**
 * Itinerary Server Actions
 */
"use server";

import { createClient } from "@/lib/supabase/server";
import { generateMockItinerary, simpleId } from "@/lib/mock/itineraries";
import type { Trip, Recommendation, Itinerary, DayPlan, DayActivity } from "@/lib/types";

/**
 * Get or create an itinerary for a trip.
 * If one already exists, return it. Otherwise, generate a mock one and save it.
 */
export async function getOrCreateItinerary(
  tripId: string
): Promise<Itinerary | null> {
  const supabase = await createClient();

  // Check if itinerary already exists
  const { data: existing } = await supabase
    .from("itineraries")
    .select("*")
    .eq("trip_id", tripId)
    .single();

  if (existing) {
    // Backfill: add IDs to any activities that were created before the id field existed.
    // This lets us address individual activities for editing/swapping.
    const itinerary = existing as unknown as Itinerary;
    const dailyPlan = itinerary.daily_plan || [];
    let needsBackfill = false;

    for (const day of dailyPlan) {
      for (const activity of day.activities) {
        if (!activity.id) {
          activity.id = simpleId();
          needsBackfill = true;
        }
      }
    }

    if (needsBackfill) {
      await supabase
        .from("itineraries")
        .update({ daily_plan: dailyPlan })
        .eq("id", itinerary.id);
    }

    return itinerary;
  }

  // Fetch the trip to generate an itinerary
  const { data: trip } = await supabase
    .from("trips")
    .select("*")
    .eq("id", tripId)
    .single();

  if (!trip || !trip.selected_recommendation) {
    return null;
  }

  // Generate mock itinerary
  const { pre_trip_tasks, daily_plan } = generateMockItinerary(
    trip as unknown as Trip,
    trip.selected_recommendation as unknown as Recommendation
  );

  // Save to database
  const { data: newItinerary, error } = await supabase
    .from("itineraries")
    .insert({
      trip_id: tripId,
      pre_trip_tasks,
      daily_plan,
    })
    .select("*")
    .single();

  if (error) {
    console.error("Error creating itinerary:", error);
    return null;
  }

  return newItinerary as unknown as Itinerary;
}

/**
 * Toggle a pre-trip task's completion status.
 */
export async function togglePreTripTask(
  itineraryId: string,
  taskId: string
) {
  const supabase = await createClient();

  // Fetch current itinerary
  const { data: itinerary } = await supabase
    .from("itineraries")
    .select("pre_trip_tasks")
    .eq("id", itineraryId)
    .single();

  if (!itinerary) {
    return { error: "Itinerary not found" };
  }

  // Toggle the task
  const tasks = (itinerary.pre_trip_tasks as unknown as Array<{ id: string; completed: boolean }>) || [];
  const updatedTasks = tasks.map((task) =>
    task.id === taskId ? { ...task, completed: !task.completed } : task
  );

  const { error } = await supabase
    .from("itineraries")
    .update({ pre_trip_tasks: updatedTasks })
    .eq("id", itineraryId);

  if (error) {
    return { error: error.message };
  }

  return { success: true };
}

/**
 * Update an activity's details (time, description, location, duration, type).
 * Finds the activity by its unique ID within the JSONB daily_plan column,
 * merges the updates, and writes the whole plan back.
 */
export async function updateActivity(
  itineraryId: string,
  dayNumber: number,
  activityId: string,
  updates: Partial<Omit<DayActivity, "id">>
) {
  const supabase = await createClient();

  const { data: itinerary } = await supabase
    .from("itineraries")
    .select("daily_plan")
    .eq("id", itineraryId)
    .single();

  if (!itinerary) {
    return { error: "Itinerary not found" };
  }

  const dailyPlan = (itinerary.daily_plan as unknown as DayPlan[]) || [];
  const day = dailyPlan.find((d) => d.day_number === dayNumber);
  if (!day) {
    return { error: "Day not found" };
  }

  const activityIndex = day.activities.findIndex((a) => a.id === activityId);
  if (activityIndex === -1) {
    return { error: "Activity not found" };
  }

  // Merge the updates into the existing activity
  day.activities[activityIndex] = { ...day.activities[activityIndex], ...updates };

  const { error } = await supabase
    .from("itineraries")
    .update({ daily_plan: dailyPlan })
    .eq("id", itineraryId);

  if (error) {
    return { error: error.message };
  }

  return { success: true };
}

/**
 * Swap an activity for a completely different one (e.g., from the alternatives list).
 * Replaces the old activity at the same position in the day's timeline.
 */
export async function swapActivity(
  itineraryId: string,
  dayNumber: number,
  activityId: string,
  newActivity: DayActivity
) {
  const supabase = await createClient();

  const { data: itinerary } = await supabase
    .from("itineraries")
    .select("daily_plan")
    .eq("id", itineraryId)
    .single();

  if (!itinerary) {
    return { error: "Itinerary not found" };
  }

  const dailyPlan = (itinerary.daily_plan as unknown as DayPlan[]) || [];
  const day = dailyPlan.find((d) => d.day_number === dayNumber);
  if (!day) {
    return { error: "Day not found" };
  }

  const activityIndex = day.activities.findIndex((a) => a.id === activityId);
  if (activityIndex === -1) {
    return { error: "Activity not found" };
  }

  // Replace the entire activity with the new one
  day.activities[activityIndex] = newActivity;

  const { error } = await supabase
    .from("itineraries")
    .update({ daily_plan: dailyPlan })
    .eq("id", itineraryId);

  if (error) {
    return { error: error.message };
  }

  return { success: true };
}
