import type { CreateTaskDTO, Task, UpdateTaskDTO } from "@/types/task";
import { http, HttpResponse } from "msw";

const STORAGE_KEY = "msw_kanban_tasks";

const INITIAL_TASKS: Task[] = [
  {
    id: "task-1",
    title: "Setup MSW Mocking",
    description: "Configure MSW to run in dev and production Vercel builds",
    status: "Done",
    priority: "High",
    dueDate: "2026-08-30",
    createdAt: "2026-08-30T00:00:00.000Z",
    updatedAt: "2026-08-30T00:00:00.000Z",
  },
  {
    id: "task-2",
    title: "Test Drag and Drop",
    description: "Verify status updates through MSW network interceptor",
    status: "In Progress",
    priority: "Urgent",
    dueDate: "2026-09-02",
    createdAt: "2026-09-02T00:00:00.000Z",
    updatedAt: "2026-09-02T00:00:00.000Z",
  },
];

function getStoredTasks(): Task[] {
  const data = localStorage.getItem(STORAGE_KEY);
  if (!data) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_TASKS));
    return INITIAL_TASKS;
  }
  return JSON.parse(data);
}

function saveTasks(tasks: Task[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
}

export const handlers = [
  // GET /api/tasks
  http.get("/api/tasks", () => {
    return HttpResponse.json(getStoredTasks());
  }),

  // POST /api/tasks
  http.post("/api/tasks", async ({ request }) => {
    const dto = (await request.json()) as CreateTaskDTO;
    const tasks = getStoredTasks();
    const newTask: Task = {
      ...dto,
      id: `task-${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    saveTasks([newTask, ...tasks]);
    return HttpResponse.json(newTask, { status: 201 });
  }),

  // PATCH /api/tasks/:id
  http.patch("/api/tasks/:id", async ({ params, request }) => {
    const { id } = params;
    const dto = (await request.json()) as UpdateTaskDTO;
    const tasks = getStoredTasks();
    let updatedTask: Task | null = null;

    const updated = tasks.map((t) => {
      if (t.id === id) {
        updatedTask = { ...t, ...dto };
        return updatedTask;
      }
      return t;
    });

    saveTasks(updated);
    return HttpResponse.json(updatedTask);
  }),

  // DELETE /api/tasks/:id
  http.delete("/api/tasks/:id", ({ params }) => {
    const { id } = params;
    const tasks = getStoredTasks();
    saveTasks(tasks.filter((t) => t.id !== id));
    return HttpResponse.json({ success: true });
  }),
];
