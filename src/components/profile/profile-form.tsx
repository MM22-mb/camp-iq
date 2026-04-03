/**
 * Profile Form Component
 *
 * Matches the Lovable app layout: three cards for Personal Information,
 * Trip Type Preferences, and Preferred Biomes. Amber "Save Preferences" button.
 */
"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { updateProfile } from "@/lib/actions/profile";
import { profileSchema, type ProfileFormData } from "@/lib/validations/profile";
import type { Profile } from "@/lib/types";

interface ProfileFormProps {
  profile: Profile | null;
}

const TRIP_TYPES = [
  "Car Camping",
  "Backpacking",
  "Glamping",
  "RV Camping",
  "Hammock Camping",
];

const BIOMES = [
  "Forest",
  "Desert",
  "Mountains",
  "Lake/River",
  "Coastal",
  "Prairie",
];

export function ProfileForm({ profile }: ProfileFormProps) {
  const [serverMessage, setServerMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  // Local state for preference checkboxes (stored in trip_preferences JSON)
  const prefs = (profile?.trip_preferences || {}) as Record<string, unknown>;
  const [selectedTripTypes, setSelectedTripTypes] = useState<string[]>(
    (prefs.trip_types as string[]) || []
  );
  const [selectedBiomes, setSelectedBiomes] = useState<string[]>(
    (prefs.biomes as string[]) || []
  );

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: profile?.name || "",
      experience_level: profile?.experience_level || "beginner",
    },
  });

  const experienceLevel = watch("experience_level");

  function toggleItem(list: string[], item: string, setter: (v: string[]) => void) {
    setter(
      list.includes(item) ? list.filter((i) => i !== item) : [...list, item]
    );
  }

  async function onSubmit(data: ProfileFormData) {
    setServerMessage(null);
    const formData = new FormData();
    formData.append("name", data.name);
    formData.append("experience_level", data.experience_level);
    const result = await updateProfile(formData);
    if (result.error) {
      setServerMessage({ type: "error", text: result.error });
    } else {
      setServerMessage({ type: "success", text: "Profile updated!" });
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="grid gap-6 max-w-2xl">
      {serverMessage && (
        <div
          className={`rounded-md p-3 text-sm ${
            serverMessage.type === "success"
              ? "bg-green-50 text-green-700"
              : "bg-red-50 text-red-700"
          }`}
        >
          {serverMessage.text}
        </div>
      )}

      {/* Personal Information */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Personal Information</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="name">Full Name</Label>
                <Input id="name" placeholder="John Doe" {...register("name")} />
                {errors.name && (
                  <p className="text-sm text-red-500">{errors.name.message}</p>
                )}
              </div>
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={profile?.email || ""}
                  disabled
                  className="bg-muted"
                />
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="experience_level">Experience Level</Label>
              <select
                id="experience_level"
                value={experienceLevel}
                onChange={(e) =>
                  setValue("experience_level", e.target.value as ProfileFormData["experience_level"])
                }
                className="flex h-8 w-full items-center rounded-lg border border-input bg-transparent px-2.5 py-2 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
              >
                <option value="beginner">Beginner</option>
                <option value="intermediate">Intermediate</option>
                <option value="advanced">Advanced</option>
              </select>
              {errors.experience_level && (
                <p className="text-sm text-red-500">{errors.experience_level.message}</p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Trip Type Preferences */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Trip Type Preferences</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-4">
            {TRIP_TYPES.map((type) => (
              <label key={type} className="flex items-center gap-2 cursor-pointer">
                <Checkbox
                  checked={selectedTripTypes.includes(type)}
                  onCheckedChange={() =>
                    toggleItem(selectedTripTypes, type, setSelectedTripTypes)
                  }
                />
                <span className="text-sm">{type}</span>
              </label>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Preferred Biomes */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Preferred Biomes</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-4">
            {BIOMES.map((biome) => (
              <label key={biome} className="flex items-center gap-2 cursor-pointer">
                <Checkbox
                  checked={selectedBiomes.includes(biome)}
                  onCheckedChange={() =>
                    toggleItem(selectedBiomes, biome, setSelectedBiomes)
                  }
                />
                <span className="text-sm">{biome}</span>
              </label>
            ))}
          </div>
        </CardContent>
      </Card>

      <Button
        type="submit"
        disabled={isSubmitting}
        className="w-full bg-[oklch(0.65_0.12_70)] hover:bg-[oklch(0.60_0.12_70)] text-white"
      >
        <Save className="mr-2 h-4 w-4" />
        {isSubmitting ? "Saving..." : "Save Preferences"}
      </Button>
    </form>
  );
}
