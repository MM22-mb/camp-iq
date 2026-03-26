/**
 * Profile Server Actions
 */
"use server";

import { createClient } from "@/lib/supabase/server";
import { profileSchema } from "@/lib/validations/profile";
import type { Profile } from "@/lib/types";

/** Fetch the current user's profile */
export async function getProfile(): Promise<Profile | null> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  const { data } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  return data as Profile | null;
}

/** Update the current user's profile */
export async function updateProfile(formData: FormData) {
  const rawData = {
    name: formData.get("name") as string,
    experience_level: formData.get("experience_level") as string,
  };

  const parsed = profileSchema.safeParse(rawData);
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

  const { error } = await supabase
    .from("profiles")
    .update({
      name: parsed.data.name,
      experience_level: parsed.data.experience_level,
    })
    .eq("id", user.id);

  if (error) {
    return { error: error.message };
  }

  return { success: true };
}
