import { cn } from "@/src/shared/lib/utils";
import { InputHTMLAttributes, forwardRef } from "react";
import { Search, X } from "lucide-react";

interface SearchInputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
  onClear?: () => void;
}

export const SearchInput = forwardRef<HTMLInputElement, SearchInputProps>(({
  className,
  value,
  onClear,
  ...props
}, ref) => {
  const hasValue = value && String(value).length > 0;

  return (
    <div className="relative w-full">
      <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
        <Search className="w-4 h-4" />
      </div>
      <input
        ref={ref}
        type="text"
        value={value}
        className={cn(
          "w-full rounded-lg border border-gray-200 bg-white pl-10 pr-10 py-2.5 text-sm outline-none transition-all placeholder:text-gray-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 shadow-sm",
          className
        )}
        {...props}
      />
      {hasValue && onClear && (
        <button
          type="button"
          onClick={onClear}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      )}
    </div>
  );
});

SearchInput.displayName = "SearchInput";

