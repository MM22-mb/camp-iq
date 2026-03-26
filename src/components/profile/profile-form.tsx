/**
 * Profile Form Component
 *
 * Allows users to set their name and experience level.
 * These preferences help the AI generate better recommendations.
 */
"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { updateProfile } from "@/lib/actions/profile";
import { profileSchema, type ProfileFormData } from "@/lib/validations/profile";
import type { Profile } from "@/lib/types";

interface ProfileFormProps {
  profile: Profile | null;
}

export function ProfileForm({ profile }: ProfileFormProps) {
  const [serverMessage, setServerMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

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

  // Watch the experience_level so RadioGroup and form stay in sync
  const experienceLevel = watch("experience_level");

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
    <Card className="w-full max-w-lg">
      <CardHeader>
        <CardTitle>Your Profile</CardTitle>
        <CardDescription>
          Tell us about yourself so we can personalize your trip recommendations.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {serverMessage && (
          <div
            className={`mb-4 rounded-md p-3 text-sm ${
              serverMessage.type === "success"
                ? "bg-green-50 text-green-700"
                : "bg-red-50 text-red-700"
            }`}
          >
            {serverMessage.text}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="grid gap-6">
          <div className="grid gap-2">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              placeholder="Your name"
              {...register("name")}
            />
            {errors.name && (
              <p className="text-sm text-red-500">{errors.name.message}</p>
            )}
          </div>

          <div className="grid gap-3">
            <Label>Experience Level</Label>
            <RadioGroup
              value={experienceLevel}
              onValueChange={(value) =>
                setValue("experience_level", value as ProfileFormData["experience_level"])
              }
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="beginner" id="beginner" />
                <Label htmlFor="beginner" className="font-normal">
                  Beginner — New to camping or only been a few times
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="intermediate" id="intermediate" />
                <Label htmlFor="intermediate" className="font-normal">
                  Intermediate — Camp a few times a year, comfortable with basics
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="advanced" id="advanced" />
                <Label htmlFor="advanced" className="font-normal">
                  Advanced — Experienced camper, comfortable backcountry
                </Label>
              </div>
            </RadioGroup>
            {errors.experience_level && (
              <p className="text-sm text-red-500">
                {errors.experience_level.message}
              </p>
            )}
          </div>

          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Saving..." : "Save Profile"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
