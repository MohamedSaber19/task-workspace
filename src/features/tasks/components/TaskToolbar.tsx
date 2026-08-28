import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { TaskPriority, TaskStatus } from "@/types/task";
import { Search, X } from "lucide-react";
import React from "react";
import { useTaskFilters } from "../hooks/useTaskFilters";

export const TaskToolbar: React.FC = () => {
  const { filters, setFilters, resetFilters } = useTaskFilters();

  const isFiltered =
    filters.search !== "" ||
    filters.status !== "All" ||
    filters.priority !== "All";

  return (
    <div className="flex flex-wrap items-center gap-3 py-4">
      {/* Search Input */}
      <div className="relative min-w-50 flex-1">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Filter tasks by name..."
          value={filters.search}
          onChange={(e) => setFilters({ search: e.target.value })}
          className="pl-8"
        />
      </div>
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

      {/* Reset Filters */}
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
