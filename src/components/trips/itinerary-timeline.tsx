/**
 * Itinerary Timeline Component
 *
 * Displays a day-by-day, hour-by-hour itinerary with activity cards.
 * Uses tabs to switch between days.
 *
 * Click any activity card to open the edit dialog where you can
 * change details or swap it for an alternative.
 */
"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Clock, Pencil } from "lucide-react";
import { getActivityStyle, formatDuration, formatTime12h, formatFriendlyDate } from "@/lib/activity-styles";
import { generateAlternativeActivities } from "@/lib/mock/activity-alternatives";
import { ActivityEditDialog } from "@/components/trips/activity-edit-dialog";
import type { DayPlan, DayActivity, Recommendation } from "@/lib/types";

interface ItineraryTimelineProps {
  dailyPlan: DayPlan[];
  itineraryId: string;
  recommendation: Recommendation | null;
}

export function ItineraryTimeline({
  dailyPlan,
  itineraryId,
  recommendation,
}: ItineraryTimelineProps) {
  const [activeDay] = useState("1");

  // Track which activity is being edited (null = dialog closed)
  const [editingActivity, setEditingActivity] = useState<DayActivity | null>(null);
  const [editingDayNumber, setEditingDayNumber] = useState<number | null>(null);

  // Generate alternatives when an activity is selected for editing
  const alternatives =
    editingActivity
      ? generateAlternativeActivities(editingActivity, recommendation)
      : [];

  function handleActivityClick(activity: DayActivity, dayNumber: number) {
    setEditingActivity(activity);
    setEditingDayNumber(dayNumber);
  }

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5 text-green-600" />
            Trip Itinerary
            <span className="text-sm font-normal text-muted-foreground ml-auto">
              Click an activity to edit
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue={activeDay}>
            <TabsList className="mb-4">
              {dailyPlan.map((day) => (
                <TabsTrigger key={day.day_number} value={String(day.day_number)}>
                  Day {day.day_number}
                  <span className="hidden sm:inline ml-1 text-muted-foreground">
                    — {formatFriendlyDate(day.date)}
                  </span>
                </TabsTrigger>
              ))}
            </TabsList>

            {dailyPlan.map((day) => (
              <TabsContent key={day.day_number} value={String(day.day_number)}>
                <div className="relative">
                  {/* Vertical timeline line */}
                  <div className="absolute left-[49px] top-0 bottom-0 w-px bg-border" />

                  <div className="grid gap-4">
                    {day.activities.map((activity) => {
                      const style = getActivityStyle(activity.type);
                      const Icon = style.icon;

                      return (
                        <div
                          key={activity.id}
                          className="relative flex gap-4 group cursor-pointer"
                          role="button"
                          tabIndex={0}
                          onClick={() => handleActivityClick(activity, day.day_number)}
                          onKeyDown={(e) => {
                            if (e.key === "Enter" || e.key === " ") {
                              e.preventDefault();
                              handleActivityClick(activity, day.day_number);
                            }
                          }}
                        >
                          {/* Time label — displayed in 12-hour format */}
                          <div className="w-[70px] text-right text-sm text-muted-foreground pt-3 shrink-0">
                            {formatTime12h(activity.time)}
                          </div>

                          {/* Timeline dot */}
                          <div
                            className={`relative z-10 mt-3 h-5 w-5 shrink-0 rounded-full ${style.bg} flex items-center justify-center`}
                          >
                            <div
                              className={`h-2 w-2 rounded-full ${style.color.replace("text-", "bg-")}`}
                            />
                          </div>

                          {/* Activity card */}
                          <div className="flex-1 rounded-lg border p-3 hover:bg-muted/50 transition-colors">
                            <div className="flex items-start justify-between gap-2">
                              <div className="flex items-center gap-2">
                                <Icon className={`h-4 w-4 ${style.color}`} />
                                <span className="font-medium text-sm">
                                  {activity.description}
                                </span>
                              </div>
                              <div className="flex items-center gap-2 shrink-0">
                                {/* Pencil icon appears on hover to hint that the card is editable */}
                                <Pencil className="h-3.5 w-3.5 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                                <Badge variant="secondary" className="text-xs">
                                  {formatDuration(activity.duration_minutes)}
                                </Badge>
                              </div>
                            </div>
                            {activity.location && (
                              <p className="text-xs text-muted-foreground mt-1 ml-6">
                                {activity.location}
                              </p>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </TabsContent>
            ))}
          </Tabs>
        </CardContent>
      </Card>

      {/* Edit dialog — rendered outside the Card so it overlays properly */}
      {editingActivity && editingDayNumber !== null && (
        <ActivityEditDialog
          // key forces React to remount the dialog with fresh state when switching activities
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
