
import { cn } from "@/lib/utils";
import { InputHTMLAttributes, forwardRef } from "react";

interface MaterialFloatingInputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
}

export const MaterialFloatingInput = forwardRef<HTMLInputElement, MaterialFloatingInputProps>(({
  className,
  label,
  error,
  ...props
}, ref) => {
  return (
    <div className="relative w-full">
      <div className="relative">
        <input
          ref={ref}
          placeholder=" "
          className={cn(
            "peer block w-full rounded-lg border border-gray-200 bg-white px-4 pt-5 pb-2 text-gray-900 focus:border-blue-600 focus:ring-2 focus:ring-blue-200 outline-none transition-all placeholder:text-transparent shadow-sm",
            error && "border-red-500 focus:border-red-500 focus:ring-red-200",
            className
          )}
          {...props}
        />
        <label
          className={cn(
            "absolute left-4 top-4 z-10 origin-[0] -translate-y-2.5 scale-75 transform text-sm text-gray-500 duration-300 peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100 peer-focus:-translate-y-2.5 peer-focus:scale-75 peer-focus:text-blue-600 pointer-events-none",
            error && "text-red-500 peer-focus:text-red-500"
          )}
        >
          {label}
        </label>
      </div>
      {error && (
        <p className="mt-1.5 ml-1 text-xs text-red-500 font-medium animate-fade-in">{error}</p>
      )}
    </div>
  );
});
MaterialFloatingInput.displayName = "MaterialFloatingInput";
