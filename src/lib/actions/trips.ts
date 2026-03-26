/**
 * Trip Server Actions
 *
 * All trip-related data mutations.
 */
"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { tripSchema } from "@/lib/validations/trip";
import type { Trip } from "@/lib/types";

/** Create a new trip from questionnaire data */
export async function createTrip(formData: FormData) {
  const rawData = {
    name: formData.get("name") as string,
    destination: formData.get("destination") as string,
    start_date: formData.get("start_date") as string,
    end_date: formData.get("end_date") as string,
    party_size: Number(formData.get("party_size")),
    trip_type: formData.get("trip_type") as string,
    max_travel_time_hours: Number(formData.get("max_travel_time_hours")),
    biome: formData.get("biome") as string,
    vibe: formData.get("vibe") as string,
    freeform_notes: formData.get("freeform_notes") as string,
  };

  const parsed = tripSchema.safeParse(rawData);
  if (!parsed.success) {
    return { error: parsed.error.issues[0].message };
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "Not authenticated" };
  }

  const { data, error } = await supabase
    .from("trips")
    .insert({
      user_id: user.id,
      name: parsed.data.name,
      destination: parsed.data.destination || null,
      start_date: parsed.data.start_date,
      end_date: parsed.data.end_date,
      party_size: parsed.data.party_size,
      trip_type: parsed.data.trip_type,
      max_travel_time_hours: parsed.data.max_travel_time_hours,
      biome: parsed.data.biome,
      vibe: parsed.data.vibe,
      freeform_notes: parsed.data.freeform_notes || null,
      status: "draft",
    })
    .select("id")
    .single();

  if (error) {
    return { error: error.message };
  }

  // Redirect to recommendations page for the new trip
  redirect(`/trips/${data.id}/recommendations`);
}

/** Get all trips for the current user */
export async function getTrips(): Promise<Trip[]> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return [];

  const { data } = await supabase
    .from("trips")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  return (data as Trip[]) || [];
}

/** Get a single trip by ID */
export async function getTrip(tripId: string): Promise<Trip | null> {
  const supabase = await createClient();

  const { data } = await supabase
    .from("trips")
    .select("*")
    .eq("id", tripId)
    .single();

  return data as Trip | null;
}

/** Update a trip's selected recommendation and status */
export async function selectRecommendation(
  tripId: string,
  recommendation: Record<string, unknown>
) {
  const supabase = await createClient();

  const { error } = await supabase
    .from("trips")
    .update({
      selected_recommendation: recommendation,
      status: "planned",
    })
    .eq("id", tripId);

  if (error) {
    return { error: error.message };
  }

  redirect(`/trips/${tripId}/itinerary`);
}

/** Delete a trip */
export async function deleteTrip(tripId: string) {
  const supabase = await createClient();

  const { error } = await supabase.from("trips").delete().eq("id", tripId);

  if (error) {
    return { error: error.message };
  }

  redirect("/dashboard");
}
