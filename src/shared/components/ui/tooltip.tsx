
"use client";

import * as React from "react";
import { cn } from "@/src/shared/lib/utils";

interface TooltipProps {
    children: React.ReactNode;
}

interface TooltipTriggerProps {
    children: React.ReactNode;
    asChild?: boolean;
}

interface TooltipContentProps {
    children: React.ReactNode;
    className?: string;
    side?: "top" | "bottom" | "left" | "right";
}

const TooltipContext = React.createContext<{
    visible: boolean;
    setVisible: (visible: boolean) => void;
} | null>(null);

export function TooltipProvider({ children }: { children: React.ReactNode }) {
    return <>{children}</>;
}

export function Tooltip({ children }: { children: React.ReactNode }) {
    const [visible, setVisible] = React.useState(false);
    return (
        <TooltipContext.Provider value={{ visible, setVisible }}>
            <div
                className="relative inline-block"
                onMouseEnter={() => setVisible(true)}
                onMouseLeave={() => setVisible(false)}
            >
                {children}
            </div>
        </TooltipContext.Provider>
    );
}

export function TooltipTrigger({ children, asChild }: TooltipTriggerProps) {
    return <>{children}</>;
}

export function TooltipContent({ children, className, side = "top" }: TooltipContentProps) {
    const context = React.useContext(TooltipContext);
    if (!context?.visible) return null;

    // Simple positioning logic for now, defaulting to top as per current design
    return (
        <div className={cn(
            "absolute z-50 left-1/2 -translate-x-1/2 px-3 py-1.5 text-xs font-medium text-white bg-gray-900 rounded-lg shadow-sm whitespace-nowrap animate-in fade-in zoom-in-95 duration-200",
            side === "top" && "bottom-full mb-2",
            side === "bottom" && "top-full mt-2",
            className
        )}>
            {children}
            {side === "top" && (
                <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-0.5 border-4 border-transparent border-t-gray-900" />
            )}
            {side === "bottom" && (
                <div className="absolute bottom-full left-1/2 -translate-x-1/2 -mb-0.5 border-4 border-transparent border-b-gray-900" />
            )}
        </div>
    );
}
