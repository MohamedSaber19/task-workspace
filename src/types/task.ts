export type TaskPriority = "Low" | "Medium" | "High" | "Urgent";
export type TaskStatus = "To Do" | "In Progress" | "In Review" | "Done";

export interface Task {
  id: string;
  title: string;
  description: string;
  priority: TaskPriority;
  status: TaskStatus;
  dueDate: string; // ISO String format (YYYY-MM-DD)
  createdAt: string;
  updatedAt: string;
}

export interface TaskFilterParams {
  search?: string;
  status?: TaskStatus[];
  priority?: TaskPriority[];
  startDate?: string;
  endDate?: string;
}

export type CreateTaskDTO = Omit<Task, "id" | "createdAt" | "updatedAt">;
export type UpdateTaskDTO = Partial<CreateTaskDTO>;
