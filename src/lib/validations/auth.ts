/**
 * Auth Validation Schemas
 *
 * Zod schemas define what valid form data looks like.
 * They're used in two places:
 * 1. Client-side: react-hook-form uses them to show errors as you type
 * 2. Server-side: Server Actions validate data again (never trust the client)
 */
import { z } from "zod/v4";

export const loginSchema = z.object({
  email: z.email("Please enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export const signupSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.email("Please enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  confirmPassword: z.string().min(6, "Please confirm your password"),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

export const forgotPasswordSchema = z.object({
  email: z.email("Please enter a valid email address"),
});

// TypeScript types inferred from the schemas
// This means the types automatically stay in sync with validation rules
export type LoginFormData = z.infer<typeof loginSchema>;
export type SignupFormData = z.infer<typeof signupSchema>;
export type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>;
