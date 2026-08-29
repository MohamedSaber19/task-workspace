import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import type { Task } from "@/types/task";
import { useVirtualizer } from "@tanstack/react-virtual";
import { Calendar, Pencil, Trash2 } from "lucide-react";
import React, { useRef } from "react";

const priorityStripeColors: Record<Task["priority"], string> = {
  Low: "bg-slate-400 dark:bg-slate-500",
  Medium: "bg-blue-500",
  High: "bg-amber-500",
  Urgent: "bg-rose-500",
};

const priorityBadgeVariants: Record<
  Task["priority"],
  "default" | "secondary" | "destructive" | "outline"
> = {
  Low: "secondary",
  Medium: "outline",
  High: "default",
  Urgent: "destructive",
};

const statusVariants: Record<
  Task["status"],
  "default" | "secondary" | "outline"
> = {
  "To Do": "outline",
  "In Progress": "secondary",
  "In Review": "default",
  Done: "secondary",
};

interface VirtualizedTaskListProps {
  tasks: Task[];
  onEdit?: (task: Task) => void;
  onDelete?: (taskId: string) => void;
}

export const VirtualizedTaskList: React.FC<VirtualizedTaskListProps> = ({
  tasks,
  onEdit,
  onDelete,
}) => {
  const parentRef = useRef<HTMLDivElement>(null);

  const ROW_HEIGHT = 88;

  const rowVirtualizer = useVirtualizer({
    count: tasks.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => ROW_HEIGHT,
    overscan: 5,
  });

  if (tasks.length === 0) {
    return (
      <div className="flex h-[400px] flex-col items-center justify-center rounded-xl border border-dashed border-slate-300 dark:border-slate-700 p-8 text-center">
        <p className="text-sm text-muted-foreground">
          No tasks found matching your filters.
        </p>
      </div>
    );
  }

  return (
    <div
      ref={parentRef}
      className="h-[calc(100vh-220px)] min-h-[500px] overflow-auto rounded-xl border border-slate-200 dark:border-slate-800 p-3"
    >
      <div
        className="relative w-full"
        style={{ height: `${rowVirtualizer.getTotalSize()}px` }}
      >
        {rowVirtualizer.getVirtualItems().map((virtualRow) => {
          const task = tasks[virtualRow.index];

          return (
            <div
              key={task.id}
              className="absolute top-0 left-0 w-full pb-3"
              style={{
                height: `${ROW_HEIGHT}px`,
                transform: `translateY(${virtualRow.start}px)`,
              }}
            >
              <Card
                onClick={() => onEdit?.(task)}
                className="py-0 group relative h-full flex items-center overflow-hidden rounded-lg border border-slate-200 dark:border-slate-800 bg-card transition-all hover:border-slate-300 dark:hover:border-slate-700 shadow-xs cursor-pointer select-none"
              >
                {/* Priority Stripe */}
                <div
                  className={`absolute left-0 top-0 bottom-0 w-1.5 ${
                    priorityStripeColors[task.priority]
                  }`}
                />

                <div className="flex items-center justify-between gap-4 w-full p-3 pl-5">
                  {/* Left: Info */}
                  <div className="flex flex-col justify-center gap-1 min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <h4 className="font-semibold text-sm truncate text-foreground transition-colors">
                        {task.title}
                      </h4>
                      <Badge
                        variant={statusVariants[task.status]}
                        className="text-[10px] px-2 py-0.5 rounded-md shrink-0"
                      >
                        {task.status}
                      </Badge>
                    </div>

                    {task.description && (
                      <p className="text-xs text-muted-foreground line-clamp-1">
                        {task.description}
                      </p>
                    )}
                  </div>

                  {/* Right: Actions */}
                  <div className="flex items-center gap-3 shrink-0">
                    <Badge variant={priorityBadgeVariants[task.priority]}>
                      {task.priority}
                    </Badge>

                    {task.dueDate && (
                      <div className="hidden sm:flex items-center gap-1 text-xs text-muted-foreground">
                        <Calendar className="h-3.5 w-3.5 opacity-70" />
                        <span>{task.dueDate}</span>
                      </div>
                    )}

                    <div className="flex items-center gap-1 border-l border-border/60 pl-2">
                      {onEdit && (
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7 text-muted-foreground hover:text-foreground"
                          onClick={(e) => {
                            e.stopPropagation();
                            onEdit(task);
                          }}
                        >
                          <Pencil className="h-3.5 w-3.5" />
                        </Button>
                      )}
                      {onDelete && (
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7 text-muted-foreground hover:text-destructive"
                          onClick={(e) => {
                            e.stopPropagation();
                            onDelete(task.id);
                          }}
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </Card>
            </div>
          );
        })}
      </div>
    </div>
  );
};
