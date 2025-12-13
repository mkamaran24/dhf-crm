"use client";

import Link from "next/link";
import { Calendar, Mail, TrendingUp, Clock } from "lucide-react";
import { Card, CardHeader, CardContent, Badge } from "@/src/shared/components/ui";
import { Journey } from "../types";

interface JourneyCardProps {
  journey: Journey;
}

function getStageColor(stage: string) {
  const colors: Record<string, string> = {
    "Lead": "bg-blue-50 text-blue-700 border-blue-200",
    "Contacted": "bg-purple-50 text-purple-700 border-purple-200",
    "Converted": "bg-indigo-50 text-indigo-700 border-indigo-200",
    "Onboarding": "bg-amber-50 text-amber-700 border-amber-200",
    "Active Patient": "bg-green-50 text-green-700 border-green-200",
  };
  return colors[stage] || "bg-gray-50 text-gray-700 border-gray-200";
}

export function JourneyCard({ journey }: JourneyCardProps) {
  const isComplete = journey.progress === 100;

  return (
    <Link href={`/journey/${journey.id}`}>
      <Card className="group hover:shadow-xl transition-all duration-300 border-l-4 border-l-blue-500 hover:border-l-blue-600 cursor-pointer h-full">
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white font-bold text-lg shadow-lg">
                  {journey.name.charAt(0).toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-gray-900 text-lg group-hover:text-blue-600 transition-colors truncate">
                    {journey.name}
                  </h3>
                  <p className="text-sm text-gray-500 flex items-center gap-1.5 mt-0.5">
                    <Mail className="w-3.5 h-3.5 flex-shrink-0" />
                    <span className="truncate">{journey.email}</span>
                  </p>
                </div>
              </div>
            </div>
            <Badge className={`${getStageColor(journey.currentStage)} border font-medium`}>
              {journey.currentStage}
            </Badge>
          </div>
        </CardHeader>

        <CardContent className="pt-0">
          <div className="space-y-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600 font-medium">Journey Progress</span>
                <span className="font-bold text-blue-600">{journey.progress}%</span>
              </div>
              <div className="relative h-3 bg-gray-100 rounded-full overflow-hidden">
                <div
                  className={`absolute top-0 left-0 h-full rounded-full transition-all duration-500 ${
                    isComplete
                      ? "bg-gradient-to-r from-green-500 to-green-600"
                      : "bg-gradient-to-r from-blue-500 to-blue-600"
                  }`}
                  style={{ width: `${journey.progress}%` }}
                >
                  <div className="absolute inset-0 bg-white/20 animate-pulse"></div>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-gray-100">
              <div className="flex items-center gap-4 text-xs text-gray-500">
                <div className="flex items-center gap-1.5">
                  <TrendingUp className="w-3.5 h-3.5" />
                  <span>{journey.events.length} events</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5" />
                  <span>{new Date(journey.updatedAt).toLocaleDateString()}</span>
                </div>
              </div>
              {isComplete && (
                <div className="flex items-center gap-1 text-xs font-semibold text-green-600">
                  <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                  Complete
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}

