
"use client";

import React from "react";
import { cn } from "@/src/shared/lib/utils";

interface TooltipProviderProps {
    children: React.ReactNode;
}

export function TooltipProvider({ children }: TooltipProviderProps) {
    return <>{children}</>;
}

interface TooltipProps {
    children: React.ReactNode;
}

export function Tooltip({ children }: TooltipProps) {
    return <div className="relative inline-block group">{children}</div>;
}

interface TooltipTriggerProps {
    children: React.ReactNode;
    asChild?: boolean;
    className?: string;
}

export function TooltipTrigger({ children, className }: TooltipTriggerProps) {
    return <div className={cn("inline-block", className)}>{children}</div>;
}

interface TooltipContentProps {
    children: React.ReactNode;
    className?: string;
    sideOffset?: number;
}

export function TooltipContent({ children, className, sideOffset = 4 }: TooltipContentProps) {
    return (
        <div
            className={cn(
                "absolute z-50 px-3 py-1.5 text-xs text-secondary-foreground bg-primary/90 text-white bg-slate-800 rounded-md shadow-md animate-in fade-in-0 zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
                "bottom-full left-1/2 -translate-x-1/2 mb-2", // Simple positioning for now (top)
                "pointer-events-none invisible group-hover:visible opacity-0 group-hover:opacity-100 transition-all duration-200",
                className
            )}
            style={{ marginBottom: sideOffset }}
        >
            {children}
            <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-slate-800" />
        </div>
    );
}
