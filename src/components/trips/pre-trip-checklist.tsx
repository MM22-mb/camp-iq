/**
 * Pre-Trip Checklist Component
 *
 * Displays tasks grouped by category with checkboxes.
 * Checking a task persists to the database immediately.
 */
"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { Checkbox } from "@/components/ui/checkbox";
import { Progress } from "@/components/ui/progress";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ClipboardCheck } from "lucide-react";
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
        <CardTitle className="flex items-center gap-2">
          <ClipboardCheck className="h-5 w-5 text-green-600" />
          Pre-Trip Checklist
        </CardTitle>
        <div className="flex items-center gap-3 mt-2">
          <Progress value={progressPercent} className="h-2 flex-1" />
          <span className="text-sm text-muted-foreground whitespace-nowrap">
            {completedCount} / {tasks.length} complete
          </span>
        </div>
      </CardHeader>
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
    </Card>
  );
}
