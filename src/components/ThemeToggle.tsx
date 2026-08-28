import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useTheme, type Theme } from "@/context/ThemeContext";
import { Monitor, Moon, Sun } from "lucide-react";
import React from "react";

export const ThemeToggle: React.FC = () => {
  const { theme, setTheme } = useTheme();

  const renderCurrentIcon = () => {
    switch (theme) {
      case "light":
        return <Sun className="h-4 w-4 text-amber-500" />;
      case "dark":
        return <Moon className="h-4 w-4 text-blue-400" />;
      default:
        return <Monitor className="h-4 w-4 text-muted-foreground" />;
    }
  };

  return (
    <div className="flex items-center">
      <Select value={theme} onValueChange={(val) => setTheme(val as Theme)}>
        <SelectTrigger className="h-8 w-auto px-2.5 sm:w-30 text-xs">
          <div className="flex items-center gap-2">
            {/* Mobile icon (hidden on desktop) */}
            <span className="sm:hidden flex items-center">
              {renderCurrentIcon()}
            </span>

            {/* Desktop value with icon (hidden on mobile) */}
            <span className="hidden sm:inline-flex items-center">
              <SelectValue placeholder="Theme" />
            </span>
          </div>
        </SelectTrigger>
        <SelectContent align="end">
          <SelectItem value="light">
            <div className="flex items-center gap-2">
              <Sun className="h-3.5 w-3.5 text-amber-500" />
              <span>Light</span>
            </div>
          </SelectItem>
          <SelectItem value="dark">
            <div className="flex items-center gap-2">
              <Moon className="h-3.5 w-3.5 text-blue-400" />
              <span>Dark</span>
            </div>
          </SelectItem>
          <SelectItem value="system">
            <div className="flex items-center gap-2">
              <Monitor className="h-3.5 w-3.5 text-muted-foreground" />
              <span>System</span>
            </div>
          </SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
};
