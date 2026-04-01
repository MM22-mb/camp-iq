/**
 * Activity Edit Dialog
 *
 * Opens when a user clicks an activity in the itinerary timeline.
 * Two sections:
 *   1. Edit form — change the activity's details (time, description, etc.)
 *   2. Alternatives — swap in a completely different activity
 *
 * Uses the same useTransition + router.refresh() pattern as PreTripChecklist
 * to persist changes without a full page reload.
 */
"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { updateActivity, swapActivity } from "@/lib/actions/itinerary";
import { getActivityStyle, formatDuration, ACTIVITY_TYPES } from "@/lib/activity-styles";
import type { DayActivity, Recommendation } from "@/lib/types";

interface ActivityEditDialogProps {
  activity: DayActivity;
  dayNumber: number;
  itineraryId: string;
  alternatives: DayActivity[];
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ActivityEditDialog({
  activity,
  dayNumber,
  itineraryId,
  alternatives,
  open,
  onOpenChange,
}: ActivityEditDialogProps) {
  // Local form state — initialized from the current activity
  const [time, setTime] = useState(activity.time);
  const [description, setDescription] = useState(activity.description);
  const [location, setLocation] = useState(activity.location);
  const [durationMinutes, setDurationMinutes] = useState(activity.duration_minutes);
  const [activityType, setActivityType] = useState<DayActivity["type"]>(activity.type);

  // useTransition gives us a pending state while the server action runs
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const style = getActivityStyle(activity.type);
  const Icon = style.icon;

  // Reset form state when a different activity is opened
  // (React will remount if key changes, but this is a safety net)
  function resetForm() {
    setTime(activity.time);
    setDescription(activity.description);
    setLocation(activity.location);
    setDurationMinutes(activity.duration_minutes);
    setActivityType(activity.type);
  }

  function handleSave() {
    startTransition(async () => {
      await updateActivity(itineraryId, dayNumber, activity.id, {
        time,
        description,
        location,
        duration_minutes: durationMinutes,
        type: activityType,
      });
      router.refresh();
      onOpenChange(false);
    });
  }

  function handleSwap(alternative: DayActivity) {
    startTransition(async () => {
      await swapActivity(itineraryId, dayNumber, activity.id, alternative);
      router.refresh();
      onOpenChange(false);
    });
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Icon className={`h-5 w-5 ${style.color}`} />
            Edit Activity
          </DialogTitle>
          <DialogDescription>
            Change this activity&apos;s details or swap it for an alternative.
          </DialogDescription>
        </DialogHeader>

        {/* Edit form */}
        <div className="grid gap-3">
          <div className="grid gap-1.5">
            <Label htmlFor="activity-time">Time</Label>
            <Input
              id="activity-time"
              type="time"
              value={time}
              onChange={(e) => setTime(e.target.value)}
              disabled={isPending}
            />
          </div>

          <div className="grid gap-1.5">
            <Label htmlFor="activity-description">Description</Label>
            <Input
              id="activity-description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              disabled={isPending}
            />
          </div>

          <div className="grid gap-1.5">
            <Label htmlFor="activity-location">Location</Label>
            <Input
              id="activity-location"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              disabled={isPending}
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="grid gap-1.5">
              <Label htmlFor="activity-duration">Duration (min)</Label>
              <Input
                id="activity-duration"
                type="number"
                min={15}
                max={480}
                value={durationMinutes}
                onChange={(e) => setDurationMinutes(Number(e.target.value))}
                disabled={isPending}
              />
            </div>

            <div className="grid gap-1.5">
              <Label htmlFor="activity-type">Type</Label>
              {/* Using a native <select> for simplicity and guaranteed compatibility */}
              <select
                id="activity-type"
                value={activityType}
                onChange={(e) => setActivityType(e.target.value as DayActivity["type"])}
                disabled={isPending}
                className="flex h-8 w-full items-center rounded-lg border border-input bg-transparent px-2.5 py-2 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {ACTIVITY_TYPES.map((t) => (
                  <option key={t} value={t}>
                    {getActivityStyle(t).label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        <Button onClick={handleSave} disabled={isPending} className="w-full">
          {isPending ? "Saving..." : "Save Changes"}
        </Button>

        {/* Alternatives section */}
        {alternatives.length > 0 && (
          <>
            <div className="relative">
              <Separator />
              <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-background px-2 text-xs text-muted-foreground">
                Or swap for an alternative
              </span>
            </div>

            <div className="grid gap-2">
              {alternatives.map((alt) => {
                const altStyle = getActivityStyle(alt.type);
                const AltIcon = altStyle.icon;

                return (
                  <div
                    key={alt.id}
                    className="flex items-center justify-between gap-3 rounded-lg border p-3 hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      <AltIcon className={`h-4 w-4 shrink-0 ${altStyle.color}`} />
                      <span className="text-sm truncate">{alt.description}</span>
                      <Badge variant="secondary" className="text-xs shrink-0">
                        {formatDuration(alt.duration_minutes)}
                      </Badge>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleSwap(alt)}
                      disabled={isPending}
                    >
                      {isPending ? "..." : "Use This"}
                    </Button>
                  </div>
                );
              })}
            </div>
          </>
        )}

        <DialogFooter showCloseButton />
      </DialogContent>
    </Dialog>
  );
}
