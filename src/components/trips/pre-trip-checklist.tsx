/**
 * Pre-Trip Checklist Component
 *
 * Displays tasks with checkboxes and due dates, matching the Lovable app design.
 * Tasks persist to the database when checked/unchecked.
 * The checklist can be collapsed/expanded.
 */
"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Checkbox } from "@/components/ui/checkbox";
import { Progress } from "@/components/ui/progress";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ExternalLink, ChevronDown, ChevronUp } from "lucide-react";
import { togglePreTripTask } from "@/lib/actions/itinerary";
import type { PreTripTask } from "@/lib/types";

interface PreTripChecklistProps {
  itineraryId: string;
  tasks: PreTripTask[];
}

export function PreTripChecklist({ itineraryId, tasks }: PreTripChecklistProps) {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  const [isExpanded, setIsExpanded] = useState(true);

  const completedCount = tasks.filter((t) => t.completed).length;
  const progressPercent = tasks.length > 0 ? (completedCount / tasks.length) * 100 : 0;

  function handleToggle(taskId: string) {
    startTransition(async () => {
      await togglePreTripTask(itineraryId, taskId);
      router.refresh();
    });
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">Pre-Trip Checklist</CardTitle>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsExpanded(!isExpanded)}
            className="gap-1 text-muted-foreground"
          >
            {isExpanded ? (
              <>Hide <ChevronUp className="h-4 w-4" /></>
            ) : (
              <>Show <ChevronDown className="h-4 w-4" /></>
            )}
          </Button>
        </div>
        <div className="flex items-center gap-3 mt-2">
          <Progress value={progressPercent} className="h-2 flex-1" />
          <span className="text-sm text-muted-foreground whitespace-nowrap">
            {completedCount} / {tasks.length} complete
          </span>
        </div>
      </CardHeader>

      {isExpanded && (
        <CardContent>
          <div className="divide-y">
            {tasks.map((task) => (
              <div
                key={task.id}
                className={`flex items-center justify-between py-3 ${
                  isPending ? "opacity-70" : ""
                }`}
              >
                <label className="flex items-center gap-3 cursor-pointer flex-1 min-w-0">
                  <Checkbox
                    checked={task.completed}
                    onCheckedChange={() => handleToggle(task.id)}
                    disabled={isPending}
                  />
                  <span
                    className={`text-sm ${
                      task.completed
                        ? "line-through text-muted-foreground"
                        : ""
                    }`}
                  >
                    {task.task}
                  </span>
                </label>
                <div className="flex items-center gap-2 shrink-0 ml-4">
                  {task.category && (
                    <span className="text-xs text-muted-foreground">
                      {task.category}
                    </span>
                  )}
                  <ExternalLink className="h-3.5 w-3.5 text-muted-foreground" />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      )}
    </Card>
  );
}
