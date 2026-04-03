/**
 * Itinerary Timeline Component
 *
 * Displays a day-by-day itinerary as stacked cards (one per day),
 * with expandable activity rows. Matches the Lovable app design.
 *
 * Click any activity row to open the edit dialog.
 */
"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChevronDown, ChevronUp, Lightbulb, Pencil } from "lucide-react";
import { getActivityStyle, formatDuration, formatTime12h } from "@/lib/activity-styles";
import { generateAlternativeActivities } from "@/lib/mock/activity-alternatives";
import { ActivityEditDialog } from "@/components/trips/activity-edit-dialog";
import type { DayPlan, DayActivity, Recommendation } from "@/lib/types";

interface ItineraryTimelineProps {
  dailyPlan: DayPlan[];
  itineraryId: string;
  recommendation: Recommendation | null;
}

/** Convert a date string to a day name like "Friday" */
function getDayName(dateStr: string): string {
  if (!dateStr.match(/^\d{4}-\d{2}-\d{2}$/)) return dateStr;
  const date = new Date(dateStr + "T12:00:00");
  return date.toLocaleDateString("en-US", { weekday: "long" });
}

export function ItineraryTimeline({
  dailyPlan,
  itineraryId,
  recommendation,
}: ItineraryTimelineProps) {
  // Track which activity rows are expanded (shows "Why this was chosen")
  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set());

  // Track which activity is being edited (null = dialog closed)
  const [editingActivity, setEditingActivity] = useState<DayActivity | null>(null);
  const [editingDayNumber, setEditingDayNumber] = useState<number | null>(null);

  const alternatives =
    editingActivity
      ? generateAlternativeActivities(editingActivity, recommendation)
      : [];

  function toggleExpand(activityId: string) {
    setExpandedIds((prev) => {
      const next = new Set(prev);
      if (next.has(activityId)) {
        next.delete(activityId);
      } else {
        next.add(activityId);
      }
      return next;
    });
  }

  function handleEditClick(e: React.MouseEvent, activity: DayActivity, dayNumber: number) {
    // Prevent the expand/collapse from triggering
    e.stopPropagation();
    setEditingActivity(activity);
    setEditingDayNumber(dayNumber);
  }

  return (
    <>
      <div className="grid gap-4">
        {dailyPlan.map((day) => (
          <Card key={day.day_number}>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">{getDayName(day.date)}</CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="divide-y">
                {day.activities.map((activity) => {
                  const isExpanded = expandedIds.has(activity.id);
                  const style = getActivityStyle(activity.type);

                  return (
                    <div key={activity.id}>
                      {/* Activity row */}
                      <div
                        className={`flex items-center gap-4 py-3 cursor-pointer group transition-colors hover:bg-muted/30 -mx-2 px-2 rounded-md ${
                          isExpanded ? "bg-muted/20" : ""
                        }`}
                        role="button"
                        tabIndex={0}
                        onClick={() => toggleExpand(activity.id)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter" || e.key === " ") {
                            e.preventDefault();
                            toggleExpand(activity.id);
                          }
                        }}
                      >
                        {/* Amber/gold time label */}
                        <span className="text-sm font-medium text-[oklch(0.60_0.12_70)] w-[80px] shrink-0">
                          {formatTime12h(activity.time)}
                        </span>

                        {/* Description */}
                        <span className="flex-1 text-sm">{activity.description}</span>

                        {/* Edit pencil (on hover) */}
                        <button
                          onClick={(e) => handleEditClick(e, activity, day.day_number)}
                          className="opacity-0 group-hover:opacity-100 transition-opacity p-1 rounded hover:bg-muted"
                          title="Edit activity"
                        >
                          <Pencil className="h-3.5 w-3.5 text-muted-foreground" />
                        </button>

                        {/* Expand chevron */}
                        {isExpanded ? (
                          <ChevronUp className="h-4 w-4 text-muted-foreground shrink-0" />
                        ) : (
                          <ChevronDown className="h-4 w-4 text-muted-foreground shrink-0" />
                        )}
                      </div>

                      {/* Expanded detail — "Why this was chosen" */}
                      {isExpanded && (
                        <div className="pb-3 pl-[96px]">
                          <div className="flex items-start gap-2 text-sm text-muted-foreground">
                            <Lightbulb className="h-4 w-4 shrink-0 mt-0.5 text-amber-500" />
                            <div>
                              <p className="text-xs font-medium text-muted-foreground/70 mb-0.5">
                                Why this was chosen
                              </p>
                              <p>
                                {activity.location || `${style.label} activity — ${formatDuration(activity.duration_minutes)}`}
                              </p>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Edit dialog — rendered outside the cards so it overlays properly */}
      {editingActivity && editingDayNumber !== null && (
        <ActivityEditDialog
          key={editingActivity.id}
          activity={editingActivity}
          dayNumber={editingDayNumber}
          itineraryId={itineraryId}
          alternatives={alternatives}
          dayActivities={
            dailyPlan.find((d) => d.day_number === editingDayNumber)?.activities || []
          }
          open={true}
          onOpenChange={(open) => {
            if (!open) {
              setEditingActivity(null);
              setEditingDayNumber(null);
            }
          }}
        />
      )}
    </>
  );
}
