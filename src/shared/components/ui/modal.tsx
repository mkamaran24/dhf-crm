import { cn } from "@/src/shared/lib/utils";
import { X } from "lucide-react";
import { HTMLAttributes, ReactNode } from "react";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
  size?: "sm" | "md" | "lg" | "xl";
}

export function Modal({ isOpen, onClose, children, size = "md" }: ModalProps) {
  if (!isOpen) return null;

  const sizes = {
    sm: "max-w-sm",
    md: "max-w-md",
    lg: "max-w-lg",
    xl: "max-w-xl"
  };

  return (
    <div 
      className="fixed inset-0 flex items-center justify-center z-50 p-4 bg-black/50 animate-in fade-in"
      onClick={onClose}
    >
      <div 
        className={cn(
          "bg-white rounded-2xl shadow-2xl w-full animate-in zoom-in-95",
          sizes[size]
        )}
        onClick={(e) => e.stopPropagation()}
      >
        {children}
      </div>
    </div>
  );
}

export function ModalHeader({ className, children, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn("p-6 border-b border-gray-100", className)} {...props}>
      {children}
    </div>
  );
}

export function ModalContent({ className, children, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn("p-6", className)} {...props}>
      {children}
    </div>
  );
}

export function ModalFooter({ className, children, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn("p-6 border-t border-gray-100 flex gap-3 justify-end", className)} {...props}>
      {children}
    </div>
  );
}

