import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { TaskPriority, TaskStatus } from "@/types/task";
import { X } from "lucide-react";
import React, { useCallback, useTransition } from "react";
import { useTaskFilters } from "../hooks/useTaskFilters";
import { SearchInput } from "./SearchInput";

export const TaskToolbar: React.FC = () => {
  const { filters, setFilters, resetFilters } = useTaskFilters();
  const [, startTransition] = useTransition();

  const isFiltered =
    filters.search !== "" ||
    filters.status !== "All" ||
    filters.priority !== "All";

  // Wrap search state updates in startTransition to defer rendering filtered lists
  const handleSearchChange = useCallback(
    (search: string) => {
      startTransition(() => {
        setFilters({ search });
      });
    },
    [setFilters],
  );

  const handleStatusChange = useCallback(
    (status: string) => {
      startTransition(() => {
        setFilters({ status: status as TaskStatus | "All" });
      });
    },
    [setFilters],
  );

  const handlePriorityChange = useCallback(
    (priority: string) => {
      startTransition(() => {
        setFilters({ priority: priority as TaskPriority | "All" });
      });
    },
    [setFilters],
  );

  const handleReset = useCallback(() => {
    startTransition(() => {
      resetFilters();
    });
  }, [resetFilters]);

  return (
    <div className="flex flex-wrap items-center gap-3 py-2">
      <SearchInput value={filters.search} onChange={handleSearchChange} />

      {/* Status Filter */}
      <Select value={filters.status} onValueChange={handleStatusChange}>
        <SelectTrigger className="w-35">
          <SelectValue placeholder="Status" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="All">All Statuses</SelectItem>
          <SelectItem value="To Do">To Do</SelectItem>
          <SelectItem value="In Progress">In Progress</SelectItem>
          <SelectItem value="In Review">In Review</SelectItem>
          <SelectItem value="Done">Done</SelectItem>
        </SelectContent>
      </Select>

      {/* Priority Filter */}
      <Select value={filters.priority} onValueChange={handlePriorityChange}>
        <SelectTrigger className="w-35">
          <SelectValue placeholder="Priority" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="All">All Priorities</SelectItem>
          <SelectItem value="Low">Low</SelectItem>
          <SelectItem value="Medium">Medium</SelectItem>
          <SelectItem value="High">High</SelectItem>
          <SelectItem value="Urgent">Urgent</SelectItem>
        </SelectContent>
      </Select>

      {/* Clear Button */}
      {isFiltered && (
        <Button
          variant="ghost"
          onClick={handleReset}
          className="h-9 px-2 text-xs gap-1"
        >
          <X className="h-3.5 w-3.5" />
          Clear
        </Button>
      )}
    </div>
  );
};
