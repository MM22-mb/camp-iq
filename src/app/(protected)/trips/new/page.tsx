/**
 * New Trip Page
 *
 * Matches the Lovable app layout: sparkle icon heading, Guided/Freeform toggle.
 * Guided mode uses the existing multi-step questionnaire.
 * Freeform mode shows a chat-style input (placeholder for future AI chat).
 */
"use client";

import { useState } from "react";
import { Sparkles, Send } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { TripQuestionnaire } from "@/components/trips/trip-questionnaire";

export default function NewTripPage() {
  const [mode, setMode] = useState<"guided" | "freeform">("guided");

  return (
    <div>
      {/* Header with toggle */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="flex items-center gap-2 text-3xl font-bold">
          <Sparkles className="h-7 w-7 text-amber-500" />
          Plan a New Trip
        </h1>
        <div className="flex gap-1 bg-muted rounded-lg p-1">
          <button
            onClick={() => setMode("guided")}
            className={`px-4 py-1.5 text-sm font-medium rounded-md transition-colors cursor-pointer ${
              mode === "guided"
                ? "bg-card text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Guided
          </button>
          <button
            onClick={() => setMode("freeform")}
            className={`px-4 py-1.5 text-sm font-medium rounded-md transition-colors cursor-pointer ${
              mode === "freeform"
                ? "bg-card text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Freeform
          </button>
        </div>
      </div>

      {mode === "guided" ? (
        <TripQuestionnaire />
      ) : (
        <div className="max-w-2xl mx-auto">
          {/* AI chat placeholder */}
          <div className="rounded-lg border bg-card p-6 mb-4">
            <div className="flex items-start gap-3 text-sm text-muted-foreground">
              <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                <Sparkles className="h-4 w-4 text-primary" />
              </div>
              <p className="pt-1">
                Welcome to Camp.IQ! Tell me about your dream trip, or use the
                form below to get started.
              </p>
            </div>
          </div>

          {/* Chat input */}
          <div className="flex gap-2">
            <Input
              placeholder="Describe your ideal camping trip..."
              className="flex-1"
            />
            <Button
              className="bg-[oklch(0.65_0.12_70)] hover:bg-[oklch(0.60_0.12_70)] text-white shrink-0"
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
          <p className="text-xs text-muted-foreground mt-2 text-center">
            AI chat coming soon — use Guided mode for now.
          </p>
        </div>
      )}
    </div>
  );
}
