import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { TaskModal } from "../TaskModal";

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
