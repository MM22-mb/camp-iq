/**
 * Itinerary Timeline Component
 *
 * Displays a day-by-day, hour-by-hour itinerary with activity cards.
 * Uses tabs to switch between days.
 */
"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Mountain,
  Utensils,
  Tent,
  Car,
  Clock,
  Compass,
  Coffee,
  TreePine,
} from "lucide-react";
import type { DayPlan, DayActivity } from "@/lib/types";

interface ItineraryTimelineProps {
  dailyPlan: DayPlan[];
}

/** Map activity types to icons and colors */
function getActivityStyle(type: DayActivity["type"]) {
  switch (type) {
    case "hike":
      return {
        icon: Mountain,
        color: "text-green-600",
        bg: "bg-green-50",
        label: "Hike",
      };
    case "meal":
      return {
        icon: Utensils,
        color: "text-orange-600",
        bg: "bg-orange-50",
        label: "Meal",
      };
    case "setup":
      return {
        icon: Tent,
        color: "text-blue-600",
        bg: "bg-blue-50",
        label: "Camp",
      };
    case "travel":
      return {
        icon: Car,
        color: "text-purple-600",
        bg: "bg-purple-50",
        label: "Travel",
      };
    case "rest":
      return {
        icon: Coffee,
        color: "text-amber-600",
        bg: "bg-amber-50",
        label: "Rest",
      };
    case "explore":
      return {
        icon: Compass,
        color: "text-teal-600",
        bg: "bg-teal-50",
        label: "Explore",
      };
    default:
      return {
        icon: TreePine,
        color: "text-green-600",
        bg: "bg-green-50",
        label: "Activity",
      };
  }
}

function formatDuration(minutes: number): string {
  if (minutes < 60) return `${minutes}min`;
  const hours = Math.floor(minutes / 60);
  const remaining = minutes % 60;
  return remaining > 0 ? `${hours}h ${remaining}m` : `${hours}h`;
}

export function ItineraryTimeline({ dailyPlan }: ItineraryTimelineProps) {
  const [activeDay] = useState("1");

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Clock className="h-5 w-5 text-green-600" />
          Trip Itinerary
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue={activeDay}>
          <TabsList className="mb-4">
            {dailyPlan.map((day) => (
              <TabsTrigger key={day.day_number} value={String(day.day_number)}>
                Day {day.day_number}
                <span className="hidden sm:inline ml-1 text-muted-foreground">
                  — {day.date}
                </span>
              </TabsTrigger>
            ))}
          </TabsList>

          {dailyPlan.map((day) => (
            <TabsContent key={day.day_number} value={String(day.day_number)}>
              <div className="relative">
                {/* Vertical timeline line */}
                <div className="absolute left-[39px] top-0 bottom-0 w-px bg-border" />

                <div className="grid gap-4">
                  {day.activities.map((activity, index) => {
                    const style = getActivityStyle(activity.type);
                    const Icon = style.icon;

                    return (
                      <div key={index} className="relative flex gap-4">
                        {/* Time label */}
                        <div className="w-[50px] text-right text-sm text-muted-foreground pt-3 shrink-0">
                          {activity.time}
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
  );
}
