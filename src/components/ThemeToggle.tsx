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

  return (
    <div className="flex items-center gap-2">
      <Select value={theme} onValueChange={(val) => setTheme(val as Theme)}>
        <SelectTrigger className="h-8 w-27.5 text-xs">
          <SelectValue placeholder="Theme" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="light">
            <div className="flex items-center gap-2">
              <Sun className="h-3.5 w-3.5" />
              <span>Light</span>
            </div>
          </SelectItem>
          <SelectItem value="dark">
            <div className="flex items-center gap-2">
              <Moon className="h-3.5 w-3.5" />
              <span>Dark</span>
            </div>
          </SelectItem>
          <SelectItem value="system">
            <div className="flex items-center gap-2">
              <Monitor className="h-3.5 w-3.5" />
              <span>System</span>
            </div>
          </SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
};
