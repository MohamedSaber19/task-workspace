export type Priority = "Low" | "Medium" | "High" | "Urgent";
export type Status = "To Do" | "In Progress" | "In Review" | "Done";

export interface Task {
  id: string;
  title: string;
  description: string;
  priority: Priority;
  status: Status;
  dueDate: string; // ISO String format (YYYY-MM-DD)
  createdAt: string;
  updatedAt: string;
}

export interface TaskFilterParams {
  search?: string;
  status?: Status[];
  priority?: Priority[];
  startDate?: string;
  endDate?: string;
}

export type CreateTaskDTO = Omit<Task, "id" | "createdAt" | "updatedAt">;
export type UpdateTaskDTO = Partial<CreateTaskDTO>;
