import type { CreateTaskDTO, Task, UpdateTaskDTO } from "@/types/task";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { taskApi } from "../services/taskApi";

export const TASKS_QUERY_KEY = ["tasks"];

export function useTasks() {
  return useQuery({
    queryKey: TASKS_QUERY_KEY,
    queryFn: taskApi.getTasks,
  });
}

export function useTaskMutations() {
  const queryClient = useQueryClient();

  const createMutation = useMutation({
    mutationFn: (dto: CreateTaskDTO) => taskApi.createTask(dto),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: TASKS_QUERY_KEY });
      toast.success("Task created successfully");
    },
    onError: () => {
      toast.error("Failed to create task");
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, dto }: { id: string; dto: UpdateTaskDTO }) =>
      taskApi.updateTask(id, dto),

    // Optimistically update UI before server responds
    onMutate: async ({ id, dto }) => {
      // Cancel outgoing refetches so they don't overwrite optimistic state
      await queryClient.cancelQueries({ queryKey: TASKS_QUERY_KEY });

      // Snapshot previous tasks for rollback
      const previousTasks =
        queryClient.getQueryData<Task[]>(TASKS_QUERY_KEY) || [];

      // Optimistically update query cache
      queryClient.setQueryData<Task[]>(TASKS_QUERY_KEY, (old = []) =>
        old.map((task) => (task.id === id ? { ...task, ...dto } : task)),
      );

      return { previousTasks };
    },

    // Roll back to previous snapshot if API fails
    onError: (_err, _variables, context) => {
      if (context?.previousTasks) {
        queryClient.setQueryData(TASKS_QUERY_KEY, context.previousTasks);
      }
      toast.error("Failed to update task");
    },

    // Re-sync with server after settled
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: TASKS_QUERY_KEY });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => taskApi.deleteTask(id),

    // Optimistic deletion
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: TASKS_QUERY_KEY });

      const previousTasks =
        queryClient.getQueryData<Task[]>(TASKS_QUERY_KEY) || [];

      queryClient.setQueryData<Task[]>(TASKS_QUERY_KEY, (old = []) =>
        old.filter((task) => task.id !== id),
      );

      return { previousTasks };
    },

    onError: (_err, _id, context) => {
      if (context?.previousTasks) {
        queryClient.setQueryData(TASKS_QUERY_KEY, context.previousTasks);
      }
      toast.error("Failed to delete task");
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: TASKS_QUERY_KEY });
    },

    onSuccess: () => {
      toast.success("Task deleted");
    },
  });

  return { createMutation, updateMutation, deleteMutation };
}
