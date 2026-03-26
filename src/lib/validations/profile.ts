/**
 * Profile Validation Schema
 */
import { z } from "zod/v4";

export const profileSchema = z.object({
  name: z.string().min(1, "Name is required"),
  experience_level: z.enum(["beginner", "intermediate", "advanced"], {
    message: "Please select your experience level",
  }),
});

export type ProfileFormData = z.infer<typeof profileSchema>;
