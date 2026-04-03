/**
 * Pre-Trip Checklist Component
 *
 * Displays tasks grouped by category with checkboxes.
 * Checking a task persists to the database immediately.
 * The whole checklist can be collapsed/expanded via a toggle button.
 */
"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Checkbox } from "@/components/ui/checkbox";
import { Progress } from "@/components/ui/progress";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ClipboardCheck, ChevronDown, ChevronUp } from "lucide-react";
import { togglePreTripTask } from "@/lib/actions/itinerary";
import type { PreTripTask } from "@/lib/types";

interface PreTripChecklistProps {
  itineraryId: string;
  tasks: PreTripTask[];
}

export function PreTripChecklist({ itineraryId, tasks }: PreTripChecklistProps) {
  // useTransition lets us show a pending state without blocking the UI
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  // Controls whether the checklist body is visible or collapsed
  const [isExpanded, setIsExpanded] = useState(true);

  const completedCount = tasks.filter((t) => t.completed).length;
  const progressPercent = tasks.length > 0 ? (completedCount / tasks.length) * 100 : 0;

  // Group tasks by category
  const grouped = tasks.reduce<Record<string, PreTripTask[]>>((acc, task) => {
    const category = task.category || "Other";
    if (!acc[category]) acc[category] = [];
    acc[category].push(task);
    return acc;
  }, {});

  function handleToggle(taskId: string) {
    startTransition(async () => {
      await togglePreTripTask(itineraryId, taskId);
      // Refresh the page data to show the updated state
      router.refresh();
    });
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <ClipboardCheck className="h-5 w-5 text-green-600" />
            Pre-Trip Checklist
          </CardTitle>
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

      {/* Collapsible content — the header/progress bar always stays visible */}
      {isExpanded && (
        <CardContent>
          <div className="grid gap-4">
            {Object.entries(grouped).map(([category, categoryTasks]) => (
              <div key={category}>
                <h4 className="text-sm font-semibold text-muted-foreground mb-2">
                  {category}
                </h4>
                <div className="grid gap-2">
                  {categoryTasks.map((task) => (
                    <label
                      key={task.id}
                      className={`flex items-center gap-3 rounded-md border p-3 cursor-pointer transition-colors hover:bg-muted/50 ${
                        task.completed ? "bg-muted/30" : ""
                      } ${isPending ? "opacity-70" : ""}`}
                    >
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
                  ))}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      )}
    </Card>
  );
}
