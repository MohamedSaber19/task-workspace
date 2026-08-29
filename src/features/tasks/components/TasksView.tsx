import { Button } from "@/components/ui/button";
import type { Task, TaskStatus } from "@/types/task";
import { LayoutGrid, List, SearchX } from "lucide-react";
import React, { useMemo, useState } from "react";
import { useTaskFilters } from "../hooks/useTaskFilters";
import { useTaskMutations } from "../hooks/useTasks";
import { KanbanBoard } from "./KanbanBoard";
import { TaskToolbar } from "./TaskToolbar";
import { VirtualizedTaskList } from "./VirtualizedTaskList";

export interface TasksViewProps {
  tasks: Task[];
  onTaskStatusChange: (taskId: string, newStatus: TaskStatus) => void;
  onEdit?: (task: Task) => void;
  onDelete?: (taskId: string) => void;
  onTaskClick?: (task: Task) => void;
}

export const TasksView: React.FC<TasksViewProps> = ({
  tasks,
  onEdit,
  onTaskClick,
}) => {
  const { filters } = useTaskFilters();
  const [viewMode, setViewMode] = useState<"board" | "list">("board");
  const { updateMutation, deleteMutation } = useTaskMutations();

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
          onTaskStatusChange={(id, newStatus) =>
            updateMutation.mutate({ id, dto: { status: newStatus } })
          }
          onEdit={onEdit}
          onDelete={(id) => deleteMutation.mutate(id)}
          onTaskClick={onTaskClick}
        />
      ) : (
        <VirtualizedTaskList
          tasks={tasks}
          onDelete={(id) => deleteMutation.mutate(id)}
          onEdit={(task) => onEdit?.(task)}
        />
      )}
    </div>
  );
};
