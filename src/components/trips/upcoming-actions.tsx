/**
 * Upcoming Actions
 *
 * Shows a brief summary of upcoming pre-trip tasks across all trips.
 * Displayed at the top of the dashboard, matching the Lovable app design.
 */
import { Clock } from "lucide-react";
import type { Trip } from "@/lib/types";

interface UpcomingActionsProps {
  trips: Trip[];
}

export function UpcomingActions({ trips }: UpcomingActionsProps) {
  // Derive upcoming actions from trip names/destinations as a simple placeholder.
  // In the future, this would pull from actual pre-trip checklist tasks.
  const actions = trips
    .filter((t) => t.status === "planned" || t.status === "active" || t.status === "draft")
    .slice(0, 3)
    .map((t) => ({
      id: t.id,
      label: t.destination
        ? `Prepare for ${t.name}`
        : `Complete planning for ${t.name}`,
      date: t.start_date,
    }));

  if (actions.length === 0) return null;

  return (
    <div className="mb-6">
      <h3 className="flex items-center gap-2 text-sm font-medium text-muted-foreground mb-3">
        <Clock className="h-4 w-4" />
        Upcoming Actions
      </h3>
      <div className="grid gap-2">
        {actions.map((action) => (
          <div
            key={action.id}
            className="flex items-center justify-between rounded-md border bg-card px-4 py-2.5 text-sm"
          >
            <span className="text-muted-foreground">{action.label}</span>
            {action.date && (
              <span className="text-xs text-muted-foreground">
                {new Date(action.date + "T12:00:00").toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                })}
              </span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
