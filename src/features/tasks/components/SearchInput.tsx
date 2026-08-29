import { Input } from "@/components/ui/input";
import { Search, X } from "lucide-react";
import React, { useEffect, useRef, useState } from "react";

interface SearchInputProps {
  value?: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export const SearchInput: React.FC<SearchInputProps> = ({
  value = "",
  onChange,
  placeholder = "Filter tasks by title or description...",
}) => {
  const [localValue, setLocalValue] = useState(value);
  const onChangeRef = useRef(onChange);

  useEffect(() => {
    onChangeRef.current = onChange;
  }, [onChange]);

  // Sync external prop resets
  const [prevValue, setPrevValue] = useState(value);
  if (value !== prevValue) {
    setPrevValue(value);
    setLocalValue(value);
  }

  // Handle live typing debounce
  useEffect(() => {
    const timer = setTimeout(() => {
      if (localValue !== value) {
        onChangeRef.current(localValue);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [localValue, value]);

  const handleClear = () => {
    // Reset local state instantly
    setLocalValue("");
    // Bypass debounce timer and immediately notify parent
    onChangeRef.current("");
  };

  return (
    <div className="relative min-w-50 flex-1">
      <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
      <Input
        placeholder={placeholder}
        value={localValue}
        onChange={(e) => setLocalValue(e.target.value)}
        className="pl-8 pr-8"
      />
      {localValue && (
        <button
          type="button"
          onMouseDown={(e) => e.preventDefault()} // Prevent focus loss
          onClick={handleClear}
          className="absolute right-2.5 top-2.5 text-muted-foreground hover:text-foreground"
          aria-label="Clear search"
        >
          <X className="h-4 w-4" />
        </button>
      )}
    </div>
  );
};
