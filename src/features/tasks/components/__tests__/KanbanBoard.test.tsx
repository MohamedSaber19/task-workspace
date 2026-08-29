import type { Task } from "@/types/task";
import { render, screen, within } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { KanbanBoard } from "../KanbanBoard";

const mockTasks: Task[] = [
  {
    id: "task-1",
    title: "Test Drag Task",
    description: "Drag description",
    status: "To Do",
    priority: "High",
    dueDate: "2026-09-01",
    createdAt: "",
    updatedAt: "",
  },
];

describe("KanbanBoard DND Integration", () => {
  it("renders tasks under their respective status columns", () => {
    const handleStatusChange = vi.fn();

    render(
      <KanbanBoard
        tasks={mockTasks}
        onTaskStatusChange={handleStatusChange}
        onEdit={vi.fn()}
        onDelete={vi.fn()}
      />,
    );

    const heading = screen.getByRole("heading", { name: /to do/i });

    const toDoColumn =
      heading.closest("section") ||
      heading.closest("div[class*='column']") ||
      heading.parentElement?.parentElement;

    if (!toDoColumn) throw new Error("Could not locate column container");

    expect(within(toDoColumn).getByText("Test Drag Task")).toBeInTheDocument();
  });

  it("renders only filtered tasks passed via props", () => {
    const allTasks = [
      { id: "1", title: "Fix Auth Bug", status: "To Do" },
      { id: "2", title: "Update Documentation", status: "To Do" },
    ];

    // Filter before passing to KanbanBoard
    const filteredTasks = allTasks.filter((task) =>
      task.title.toLowerCase().includes("auth"),
    );

    render(
      <KanbanBoard
        tasks={filteredTasks as Task[]}
        onTaskStatusChange={vi.fn()}
        onEdit={vi.fn()}
        onDelete={vi.fn()}
      />,
    );

    expect(screen.getByText("Fix Auth Bug")).toBeInTheDocument();
    expect(screen.queryByText("Update Documentation")).not.toBeInTheDocument();
  });
});
