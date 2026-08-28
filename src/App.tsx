import { useState } from "react";
import { ConfirmDialog } from "./components/ConfirmDialog";
import { Header } from "./components/Header";
import { KanbanBoard } from "./features/tasks/components/KanbanBoard";
import { TaskModal } from "./features/tasks/components/TaskModal";
import { useTaskMutations, useTasks } from "./features/tasks/hooks/useTasks";
import type { TaskFormData } from "./features/tasks/schemas/taskSchema";
import type { Task } from "./types/task";

export default function App() {
  const { data: tasks = [], isLoading, isError } = useTasks();
  const { createMutation, updateMutation, deleteMutation } = useTaskMutations();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const handleCreateOrUpdate = (formData: TaskFormData) => {
    if (editingTask) {
      updateMutation.mutate(
        { id: editingTask.id, dto: formData },
        {
          onSuccess: () => {
            setIsModalOpen(false);
            setEditingTask(null);
          },
        },
      );
    } else {
      createMutation.mutate(formData, {
        onSuccess: () => setIsModalOpen(false),
      });
    }
  };

  const handleConfirmDelete = () => {
    if (deletingId) {
      deleteMutation.mutate(deletingId, {
        onSuccess: () => setDeletingId(null),
      });
    }
  };

  return (
    <div className="min-h-screen bg-zinc-50 p-6 text-zinc-900 dark:bg-zinc-950 dark:text-zinc-100">
      <Header onNewTask={() => setIsModalOpen(true)} />

      {isLoading ? (
        <div className="py-12 text-center text-zinc-500">Loading tasks...</div>
      ) : isError ? (
        <div className="py-12 text-center text-red-500">
          Failed to load tasks
        </div>
      ) : (
        <KanbanBoard
          tasks={tasks}
          onEdit={(task) => {
            setEditingTask(task);
            setIsModalOpen(true);
          }}
          onDelete={(id) => setDeletingId(id)}
        />
      )}

      <TaskModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingTask(null);
        }}
        onSubmit={handleCreateOrUpdate}
        initialData={editingTask}
        isLoading={createMutation.isPending || updateMutation.isPending}
      />

      <ConfirmDialog
        isOpen={!!deletingId}
        title="Delete Task"
        message="Are you sure you want to delete this task? This action cannot be undone."
        onConfirm={handleConfirmDelete}
        onCancel={() => setDeletingId(null)}
        isLoading={deleteMutation.isPending}
      />
    </div>
  );
}
