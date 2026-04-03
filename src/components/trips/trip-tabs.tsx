/**
 * Trip Tabs
 *
 * "Current Trips" / "Past Trips" tab toggle for the dashboard,
 * matching the Lovable app design.
 */
"use client";

import { useState } from "react";
import { TripListRow } from "@/components/trips/trip-list-row";
import type { Trip } from "@/lib/types";

interface TripTabsProps {
  trips: Trip[];
}

export function TripTabs({ trips }: TripTabsProps) {
  const [tab, setTab] = useState<"current" | "past">("current");

  const currentTrips = trips.filter(
    (t) => t.status === "draft" || t.status === "planned" || t.status === "active"
  );
  const pastTrips = trips.filter(
    (t) => t.status === "completed" || t.status === "cancelled"
  );

  const displayed = tab === "current" ? currentTrips : pastTrips;

  return (
    <div>
      {/* Tab toggle */}
      <div className="flex gap-1 mb-4 bg-muted rounded-lg p-1 w-fit">
        <button
          onClick={() => setTab("current")}
          className={`px-4 py-1.5 text-sm font-medium rounded-md transition-colors cursor-pointer ${
            tab === "current"
              ? "bg-card text-foreground shadow-sm"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          Current Trips
        </button>
        <button
          onClick={() => setTab("past")}
          className={`px-4 py-1.5 text-sm font-medium rounded-md transition-colors cursor-pointer ${
            tab === "past"
              ? "bg-card text-foreground shadow-sm"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          Past Trips
        </button>
      </div>

      {/* Trip list */}
      {displayed.length === 0 ? (
        <p className="text-sm text-muted-foreground py-8 text-center">
          {tab === "current" ? "No current trips." : "No past trips."}
        </p>
      ) : (
        <div className="grid gap-3">
          {displayed.map((trip) => (
            <TripListRow key={trip.id} trip={trip} />
          ))}
        </div>
      )}
    </div>
  );
}
