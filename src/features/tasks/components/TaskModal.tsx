import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import type { Task } from "@/types/task";
import { zodResolver } from "@hookform/resolvers/zod";
import React, { useEffect } from "react";
import { useForm, useWatch } from "react-hook-form";
import { taskSchema, type TaskFormData } from "../schemas/taskSchema";

interface TaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: TaskFormData) => void;
  initialData?: Task | null;
  isLoading?: boolean;
}

export const TaskModal: React.FC<TaskModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  initialData,
  isLoading,
}) => {
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    control,
    formState: { errors },
  } = useForm<TaskFormData>({
    resolver: zodResolver(taskSchema),
    defaultValues: {
      title: "",
      description: "",
      priority: "Medium",
      status: "To Do",
      dueDate: new Date().toISOString().split("T")[0],
    },
  });

  const currentPriority = useWatch({
    control,
    name: "priority",
  });

  const currentStatus = useWatch({
    control,
    name: "status",
  });

  useEffect(() => {
    if (initialData) {
      reset({
        title: initialData.title,
        description: initialData.description,
        priority: initialData.priority,
        status: initialData.status,
        dueDate: initialData.dueDate,
      });
    } else {
      reset({
        title: "",
        description: "",
        priority: "Medium",
        status: "To Do",
        dueDate: new Date().toISOString().split("T")[0],
      });
    }
  }, [initialData, reset, isOpen]);

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-125">
        <DialogHeader>
          <DialogTitle>
            {initialData ? "Edit Task" : "Create New Task"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 py-2">
          <div className="space-y-1 flex flex-col gap-0.5">
            <label className="text-sm font-medium">Title</label>
            <Input {...register("title")} placeholder="Task title..." />
            {errors.title && (
              <p className="text-xs text-destructive">{errors.title.message}</p>
            )}
          </div>

          <div className="space-y-1 flex flex-col gap-0.5">
            <label className="text-sm font-medium">Description</label>
            <Textarea
              {...register("description")}
              placeholder="Describe the task..."
              rows={3}
            />
            {errors.description && (
              <p className="text-xs text-destructive">
                {errors.description.message}
              </p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1 flex flex-col gap-0.5">
              <label className="text-sm font-medium">Priority</label>
              <Select
                value={currentPriority}
                onValueChange={(val) =>
                  setValue("priority", val as TaskFormData["priority"])
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select priority" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Low">Low</SelectItem>
                  <SelectItem value="Medium">Medium</SelectItem>
                  <SelectItem value="High">High</SelectItem>
                  <SelectItem value="Urgent">Urgent</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1 flex flex-col gap-0.5">
              <label className="text-sm font-medium">Status</label>
              <Select
                value={currentStatus}
                onValueChange={(val) =>
                  setValue("status", val as TaskFormData["status"])
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="To Do">To Do</SelectItem>
                  <SelectItem value="In Progress">In Progress</SelectItem>
                  <SelectItem value="In Review">In Review</SelectItem>
                  <SelectItem value="Done">Done</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-1 flex flex-col gap-0.5">
            <label className="text-sm font-medium">Due Date</label>
            <Input type="date" {...register("dueDate")} />
            {errors.dueDate && (
              <p className="text-xs text-destructive">
                {errors.dueDate.message}
              </p>
            )}
          </div>

          <DialogFooter className="pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Saving..." : initialData ? "Update" : "Create"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
