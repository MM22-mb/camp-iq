/**
 * Itinerary Server Actions
 */
"use server";

import { createClient } from "@/lib/supabase/server";
import { generateMockItinerary } from "@/lib/mock/itineraries";
import type { Trip, Recommendation, Itinerary } from "@/lib/types";

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
    return existing as unknown as Itinerary;
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
