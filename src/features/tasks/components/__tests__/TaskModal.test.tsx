import type { Task } from "@/types/task";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { TaskModal } from "../TaskModal";
import { VirtualizedTaskList } from "../VirtualizedTaskList";

describe("TaskModal Component", () => {
  it("shows validation error when submitting empty title", async () => {
    const handleSubmit = vi.fn();
    const handleClose = vi.fn();

    render(
      <TaskModal isOpen={true} onClose={handleClose} onSubmit={handleSubmit} />,
    );

    // Click submit without entering a title
    fireEvent.click(screen.getByRole("button", { name: /create/i }));

    await waitFor(
      () => {
        expect(
          screen.getByText(/Title must be at least 3 characters long/i),
        ).toBeInTheDocument();
      },
      { timeout: 2000 },
    );

    expect(handleSubmit).not.toHaveBeenCalled();
  });

  it("submits valid form data correctly", async () => {
    const handleSubmit = vi.fn();
    const handleClose = vi.fn();

    render(
      <TaskModal isOpen={true} onClose={handleClose} onSubmit={handleSubmit} />,
    );

    // Fill Title
    fireEvent.change(screen.getByPlaceholderText(/task title/i), {
      target: { value: "New Integration Test Task" },
    });

    // Fill Description (>= 5 chars)
    fireEvent.change(screen.getByPlaceholderText(/describe the task/i), {
      target: { value: "This is a valid task description." },
    });

    // Submit form directly
    const titleInput = screen.getByPlaceholderText(/task title/i);
    const form = titleInput.closest("form");
    if (!form) throw new Error("Form element not found");

    fireEvent.submit(form);

    await waitFor(() => {
      expect(handleSubmit).toHaveBeenCalledWith(
        expect.objectContaining({
          title: "New Integration Test Task",
          description: "This is a valid task description.",
        }),
        expect.anything(),
      );
    });
  });
});

describe("Virtualization Performance Benchmarks", () => {
  it("renders only visible DOM nodes when given a large dataset", () => {
    // Mock element dimensions in JSDOM so TanStack Virtual detects container height
    const originalGetBoundingClientRect =
      HTMLElement.prototype.getBoundingClientRect;

    HTMLElement.prototype.getBoundingClientRect = function () {
      return {
        width: 500,
        height: 600, // Simulated viewport height
        top: 0,
        left: 0,
        bottom: 600,
        right: 500,
        x: 0,
        y: 0,
        toJSON: () => {},
      };
    };

    Object.defineProperties(HTMLElement.prototype, {
      offsetHeight: { get: () => 600, configurable: true },
      clientHeight: { get: () => 600, configurable: true },
    });

    const largeTasks = Array.from({ length: 1000 }, (_, i) => ({
      id: `task-${i}`,
      title: `Task ${i}`,
      status: "To Do" as const,
    }));

    // Render the Virtualized List
    const { container } = render(
      <VirtualizedTaskList tasks={largeTasks as Task[]} />,
    );

    // Query rendered items
    const renderedItems = container.querySelectorAll('[data-slot="card"]');

    // Virtualizer will now only mount visible items (~10 to 20 cards)
    expect(renderedItems.length).toBeLessThan(50);

    // Restore original prototype method after test
    HTMLElement.prototype.getBoundingClientRect = originalGetBoundingClientRect;
  });
});
