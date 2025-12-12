"use client";

import { cn } from "@/lib/utils";
import { Check } from "lucide-react";

export interface Step {
  id: string;
  label: string;
  status: "completed" | "current" | "upcoming";
}

interface MaterialStepperProps {
  steps: Step[];
  className?: string;
}

export function MaterialStepper({ steps, className }: MaterialStepperProps) {
  return (
    <div className={cn("w-full", className)}>
      <div className="flex items-center justify-between relative">
        {/* Connecting Line */}
        <div className="absolute top-1/2 left-0 w-full h-0.5 bg-gray-200 -z-10 -translate-y-1/2" />
        
        {steps.map((step, index) => {
          const isCompleted = step.status === "completed";
          const isCurrent = step.status === "current";
          
          return (
            <div key={step.id} className="flex flex-col items-center bg-white px-2">
              <div
                className={cn(
                  "w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all duration-300",
                  isCompleted ? "bg-blue-600 border-blue-600 text-white" :
                  isCurrent ? "bg-white border-blue-600 text-blue-600 shadow-md ring-4 ring-blue-50" :
                  "bg-white border-gray-300 text-gray-400"
                )}
              >
                {isCompleted ? <Check className="w-5 h-5" /> : <span>{index + 1}</span>}
              </div>
              <span 
                className={cn(
                  "mt-2 text-xs font-semibold uppercase tracking-wide",
                  isCompleted ? "text-blue-600" :
                  isCurrent ? "text-gray-900" :
                  "text-gray-400"
                )}
              >
                {step.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
