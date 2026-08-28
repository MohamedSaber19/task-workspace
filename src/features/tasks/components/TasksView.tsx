import { Button } from "@/components/ui/button";
import type { Task, TaskStatus } from "@/types/task";
import { LayoutGrid, List, SearchX } from "lucide-react";
import React, { useMemo, useState } from "react";
import { useTaskFilters } from "../hooks/useTaskFilters";
import { KanbanBoard } from "./KanbanBoard";
import { TaskToolbar } from "./TaskToolbar";

export interface TasksViewProps {
  tasks: Task[];
  onTaskStatusChange: (taskId: string, newStatus: TaskStatus) => void;
  onEdit?: (task: Task) => void;
  onDelete?: (taskId: string) => void;
  onTaskClick?: (task: Task) => void;
}

export const TasksView: React.FC<TasksViewProps> = ({
  tasks,
  onTaskStatusChange,
  onEdit,
  onDelete,
  onTaskClick,
}) => {
  const { filters } = useTaskFilters();
  const [viewMode, setViewMode] = useState<"board" | "list">("board");

  const filteredTasks = useMemo(() => {
    return tasks.filter((task) => {
      if (filters.search.trim()) {
        const query = filters.search.toLowerCase();
        const matchesTitle = task.title.toLowerCase().includes(query);
        const matchesDesc = task.description?.toLowerCase().includes(query);
        if (!matchesTitle && !matchesDesc) return false;
      }
      if (filters.status !== "All" && task.status !== filters.status)
        return false;
      if (filters.priority !== "All" && task.priority !== filters.priority)
        return false;
      return true;
    });
  }, [tasks, filters]);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <TaskToolbar />
        <div className="flex items-center gap-1 self-end sm:self-auto">
          <Button
            variant={viewMode === "board" ? "secondary" : "ghost"}
            size="sm"
            onClick={() => setViewMode("board")}
            className="h-8 px-2.5"
          >
            <LayoutGrid className="h-4 w-4" />
          </Button>
          <Button
            variant={viewMode === "list" ? "secondary" : "ghost"}
            size="sm"
            onClick={() => setViewMode("list")}
            className="h-8 px-2.5"
          >
            <List className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Empty State / No Results Found */}
      {filteredTasks.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border py-12 text-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted/50 mb-3">
            <SearchX className="h-6 w-6 text-muted-foreground" />
          </div>
          <h3 className="font-semibold text-base">No tasks found</h3>
          <p className="mt-1 text-xs text-muted-foreground max-w-sm">
            No tasks match your current filter criteria. Try adjusting your
            search query or clearing your filters.
          </p>
        </div>
      ) : viewMode === "board" ? (
        <KanbanBoard
          tasks={filteredTasks}
          onTaskStatusChange={onTaskStatusChange}
          onEdit={onEdit}
          onDelete={onDelete}
          onTaskClick={onTaskClick}
        />
      ) : (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {filteredTasks.map((task) => (
            <div
              key={task.id}
              onClick={() => (onEdit ? onEdit(task) : onTaskClick?.(task))}
              className="group relative cursor-pointer rounded-xl border border-border/80 bg-card p-4 text-card-foreground shadow-xs transition-all hover:border-border hover:shadow-md"
            >
              <div className="flex items-start justify-between gap-2">
                <h3 className="font-medium text-sm leading-snug">
                  {task.title}
                </h3>
                <div className="flex items-center gap-1.5 shrink-0">
                  {/* Priority Badge */}
                  <span className="rounded-full bg-secondary px-2 py-0.5 text-[10px] font-semibold text-secondary-foreground">
                    {task.priority}
                  </span>
                </div>
              </div>

              {task.description && (
                <p className="mt-2 text-xs text-muted-foreground line-clamp-2">
                  {task.description}
                </p>
              )}

              {/* Card Footer: Status Badge + Actions */}
              <div className="mt-4 flex items-center justify-between border-t border-border/40 pt-2.5 text-[11px] text-muted-foreground">
                <span className="rounded-md bg-muted px-2 py-0.5 font-mono text-[10px] font-medium">
                  {task.status}
                </span>

                {onDelete && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onDelete(task.id);
                    }}
                    className="text-xs text-destructive hover:underline opacity-80 group-hover:opacity-100"
                  >
                    Delete
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
