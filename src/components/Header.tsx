import { ThemeToggle } from "@/components/ThemeToggle";
import { Button } from "@/components/ui/button";
import { CheckSquare, Plus } from "lucide-react";
import React from "react";

interface HeaderProps {
  onNewTask?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onNewTask }) => {
  return (
    <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between bg-background/85 backdrop-blur-md">
      <div className="flex items-center gap-3">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-primary-foreground shadow-xs">
          <CheckSquare className="h-5 w-5" />
        </div>
        <div>
          <h1 className="font-semibold text-sm md:text-base leading-none">
            Task Workspace
          </h1>
          <p className="mt-1 text-xs text-muted-foreground">
            Manage your tasks and workflow
          </p>
        </div>
      </div>

      <div className="flex items-center gap-3">
        {onNewTask && (
          <Button onClick={onNewTask} size="sm" className="gap-1.5">
            <Plus className="h-4 w-4" />
            <span className="hidden sm:inline">New Task</span>
          </Button>
        )}

        <ThemeToggle />
      </div>
    </header>
  );
};
