import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { Task, TaskStatus } from "@/types/task";
import {
  DragDropContext,
  Draggable,
  Droppable,
  type DropResult,
} from "@hello-pangea/dnd";
import { Pencil, Trash2 } from "lucide-react";
import React from "react";

const COLUMNS: TaskStatus[] = ["To Do", "In Progress", "In Review", "Done"];

const priorityVariants: Record<
  Task["priority"],
  "default" | "secondary" | "destructive" | "outline"
> = {
  Low: "secondary",
  Medium: "outline",
  High: "default",
  Urgent: "destructive",
};

interface KanbanBoardProps {
  tasks: Task[];
  onEdit?: (task: Task) => void;
  onDelete?: (taskId: string) => void;
  onTaskStatusChange: (taskId: string, newStatus: TaskStatus) => void;
  onTaskClick?: (task: Task) => void;
}

export const KanbanBoard: React.FC<KanbanBoardProps> = ({
  tasks,
  onEdit,
  onDelete,
  onTaskStatusChange,
}) => {
  const handleDragEnd = (result: DropResult) => {
    const { destination, draggableId, source } = result;

    if (
      !destination ||
      (destination.droppableId === source.droppableId &&
        destination.index === source.index)
    ) {
      return;
    }

    onTaskStatusChange(draggableId, destination.droppableId as TaskStatus);
  };

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4 min-h-full">
        {COLUMNS.map((status) => {
          const columnTasks = tasks.filter((t) => t.status === status);
          return (
            <div
              key={status}
              className="rounded-xl bg-muted/50 p-4 border border-slate-200 dark:border-0 dark:bg-slate-600 flex flex-col min-h-125"
            >
              <div className="mb-3 flex items-center justify-between">
                <h3 className="font-semibold text-sm">{status}</h3>
                <Badge variant="default" className="size-6 rounded-full">
                  {columnTasks.length}
                </Badge>
              </div>

              <Droppable droppableId={status}>
                {(provided) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    className="space-y-3 flex-1 h-full min-h-100 lg:max-h-[calc(100vh-300px)] lg:overflow-y-auto pb-6"
                  >
                    {columnTasks.map((task, index) => (
                      <Draggable
                        key={task.id}
                        draggableId={task.id}
                        index={index}
                      >
                        {(provided) => (
                          <Card
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            className="shadow-xs p-0"
                          >
                            <CardHeader className="p-4 pb-2">
                              <div className="flex items-start justify-between">
                                <CardTitle className="text-sm font-medium">
                                  {task.title}
                                </CardTitle>
                                <div className="flex items-center gap-1">
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    className="size-6"
                                    onClick={() => onEdit?.(task)}
                                  >
                                    <Pencil className="h-3.5 w-3.5" />
                                  </Button>
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    className="size-6 text-destructive hover:text-destructive"
                                    onClick={() => onDelete?.(task.id)}
                                  >
                                    <Trash2 className="h-3.5 w-3.5" />
                                  </Button>
                                </div>
                              </div>
                            </CardHeader>
                            <CardContent className="p-4 pt-0">
                              <p className="text-xs text-muted-foreground line-clamp-2">
                                {task.description}
                              </p>
                              <div className="mt-3 flex items-center justify-between text-xs">
                                <Badge
                                  variant={priorityVariants[task.priority]}
                                >
                                  {task.priority}
                                </Badge>
                                <span className="text-muted-foreground">
                                  {task.dueDate}
                                </span>
                              </div>
                            </CardContent>
                          </Card>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </div>
          );
        })}
      </div>
    </DragDropContext>
  );
};
