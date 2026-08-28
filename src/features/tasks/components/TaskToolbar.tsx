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
import React from "react";
import { useTaskFilters } from "../hooks/useTaskFilters";
import { SearchInput } from "./SearchInput";

export const TaskToolbar: React.FC = () => {
  const { filters, setFilters, resetFilters } = useTaskFilters();

  const isFiltered =
    filters.search !== "" ||
    filters.status !== "All" ||
    filters.priority !== "All";

  return (
    <div className="flex flex-wrap items-center gap-3 py-2">
      <SearchInput
        value={filters.search}
        onChange={(val) => setFilters({ search: val })}
      />

      {/* Status Filter */}
      <Select
        value={filters.status}
        onValueChange={(val) =>
          setFilters({ status: val as TaskStatus | "All" })
        }
      >
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
      <Select
        value={filters.priority}
        onValueChange={(val) =>
          setFilters({ priority: val as TaskPriority | "All" })
        }
      >
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
          onClick={resetFilters}
          className="h-9 px-2 text-xs gap-1"
        >
          <X className="h-3.5 w-3.5" />
          Clear
        </Button>
      )}
    </div>
  );
};
