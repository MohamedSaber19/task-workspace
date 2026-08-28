import type { TaskPriority, TaskStatus } from "@/types/task";
import { useCallback, useMemo } from "react";
import { useSearchParams } from "react-router-dom";

export interface TaskFilterState {
  search: string;
  status: TaskStatus | "All";
  priority: TaskPriority | "All";
}

export function useTaskFilters() {
  const [searchParams, setSearchParams] = useSearchParams();

  // 1. Parse search parameters into state
  const filters: TaskFilterState = useMemo(() => {
    return {
      search: searchParams.get("search") || "",
      status: (searchParams.get("status") as TaskStatus | "All") || "All",
      priority: (searchParams.get("priority") as TaskPriority | "All") || "All",
    };
  }, [searchParams]);

  // 2. Set search parameters with support for Partial updates
  const setFilters = useCallback(
    (updates: Partial<TaskFilterState>) => {
      setSearchParams(
        (prevParams) => {
          const newParams = new URLSearchParams(prevParams);

          (Object.keys(updates) as Array<keyof TaskFilterState>).forEach(
            (key) => {
              const value = updates[key];
              if (!value || value === "All") {
                newParams.delete(key);
              } else {
                newParams.set(key, String(value));
              }
            },
          );

          return newParams;
        },
        { replace: true },
      );
    },
    [setSearchParams],
  );

  const resetFilters = useCallback(() => {
    setSearchParams({}, { replace: true });
  }, [setSearchParams]);

  return {
    filters,
    setFilters,
    resetFilters,
  };
}
