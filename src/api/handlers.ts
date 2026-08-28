import { delay, http, HttpResponse } from "msw";
import type { Task } from "../types/task";

const initialTasks: Task[] = [
  {
    id: "1",
    title: "Setup initial repository architecture",
    description: "Configure Vite, TypeScript strict mode, and folder layout.",
    priority: "High",
    status: "In Progress",
    dueDate: "2026-09-01",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "2",
    title: "Design Kanban board layout",
    description: "Implement responsive 4-column layout using Tailwind CSS.",
    priority: "Medium",
    status: "To Do",
    dueDate: "2026-09-05",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

export const handlers = [
  http.get("/api/tasks", async () => {
    await delay(500);
    return HttpResponse.json(initialTasks);
  }),

  http.post("/api/tasks", async ({ request }) => {
    await delay(300);
    const body = (await request.json()) as Omit<
      Task,
      "id" | "createdAt" | "updatedAt"
    >;
    const newTask: Task = {
      ...body,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    initialTasks.push(newTask);
    return HttpResponse.json(newTask, { status: 201 });
  }),
];
