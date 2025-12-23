import { cn } from "@/src/shared/lib/utils";
import { X } from "lucide-react";
import { HTMLAttributes, ReactNode } from "react";

interface SlideOverProps {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
  title?: string;
  size?: "sm" | "md" | "lg" | "xl";
}

export function SlideOver({ isOpen, onClose, children, title, size = "lg" }: SlideOverProps) {
  if (!isOpen) return null;

  const sizes = {
    sm: "max-w-md",
    md: "max-w-2xl",
    lg: "max-w-4xl",
    xl: "max-w-6xl"
  };

  return (
    <div 
      className="fixed inset-0 z-50 overflow-hidden"
    >
      <div 
        className="absolute inset-0 bg-black/50 transition-opacity"
        onClick={onClose}
      />
      <div className="fixed inset-y-0 right-0 flex max-w-full pl-10">
        <div 
          className={cn(
            "relative w-screen",
            sizes[size]
          )}
        >
          <div className="flex h-full flex-col overflow-y-scroll bg-white shadow-xl">
            {title && (
              <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4">
                <h2 className="text-xl font-semibold text-gray-900">{title}</h2>
                <button
                  onClick={onClose}
                  className="rounded-lg p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            )}
            <div className="flex-1">
              {children}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function SlideOverHeader({ className, children, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn("px-6 py-4 border-b border-gray-100", className)} {...props}>
      {children}
    </div>
  );
}

export function SlideOverContent({ className, children, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn("px-6 py-6", className)} {...props}>
      {children}
    </div>
  );
}

export function SlideOverFooter({ className, children, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn("px-6 py-4 border-t border-gray-100 flex gap-3 justify-end", className)} {...props}>
      {children}
    </div>
  );
}

