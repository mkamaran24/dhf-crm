"use client";

import { cn } from "@/lib/utils";
import * as Icons from "lucide-react";
import { JourneyEvent } from "@/types/journey";
import { MaterialCard } from "./MaterialCard";

interface MaterialTimelineProps {
  events: JourneyEvent[];
  className?: string;
}

export function MaterialTimeline({ events, className }: MaterialTimelineProps) {
  // Sort events by date descending
  const sortedEvents = [...events].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  return (
    <div className={cn("relative pl-8 space-y-8 before:absolute before:left-3.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-gray-200", className)}>
      {sortedEvents.map((event) => {
        // Dynamic Icon Rendering
        // @ts-ignore
        const IconComponent = Icons[event.icon || "Circle"] || Icons.Circle;

        const date = new Date(event.date);

        return (
          <div key={event.id} className="relative">
            {/* Dot */}
            <div className={cn(
              "absolute -left-[1.6rem] top-1 w-8 h-8 rounded-full border-4 border-white flex items-center justify-center shadow-sm",
              event.type === "success" ? "bg-green-500 text-white" :
              event.type === "warning" ? "bg-yellow-500 text-white" :
              event.type === "error" ? "bg-red-500 text-white" :
              "bg-blue-500 text-white"
            )}>
              <IconComponent className="w-4 h-4" />
            </div>

            {/* Content */}
            <MaterialCard className="p-5 hover:shadow-md transition-shadow relative group">
              {/* Triangle pointer */}
              <div className="absolute top-4 -left-2 w-4 h-4 bg-white transform rotate-45 border-l border-b border-gray-100 group-hover:block hidden" />
              
              <div className="flex justify-between items-start mb-2">
                <h4 className="font-bold text-gray-800 text-lg">{event.title}</h4>
                <span className="text-xs font-medium text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                  {date.toLocaleDateString()} {date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
              
              {event.description && (
                <p className="text-gray-600 text-sm leading-relaxed">
                  {event.description}
                </p>
              )}
            </MaterialCard>
          </div>
        );
      })}
    </div>
  );
}
