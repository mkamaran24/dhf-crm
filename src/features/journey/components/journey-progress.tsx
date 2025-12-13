"use client";

import { CheckCircle2, Circle } from "lucide-react";
import { JourneyStage } from "@/src/shared/types";
import { Badge } from "@/src/shared/components/ui";

interface JourneyProgressProps {
  currentStage: JourneyStage;
  progress: number;
}

const STAGES: { value: JourneyStage; label: string; description: string }[] = [
  { value: "Lead", label: "Lead", description: "Initial inquiry or contact received" },
  { value: "Contacted", label: "Contacted", description: "First response sent to potential patient" },
  { value: "Converted", label: "Converted", description: "Successfully converted to patient" },
  { value: "Onboarding", label: "Onboarding", description: "Patient onboarding in progress" },
  { value: "Active Patient", label: "Active Patient", description: "Fully active patient with visits" },
];

function getStageIndex(stage: JourneyStage): number {
  return STAGES.findIndex(s => s.value === stage);
}

function getStageColor(index: number, currentIndex: number, isComplete: boolean) {
  if (isComplete) {
    return "bg-green-500 border-green-600 text-white shadow-lg";
  }
  if (index <= currentIndex) {
    return "bg-blue-500 border-blue-600 text-white shadow-lg";
  }
  return "bg-gray-100 border-gray-300 text-gray-500";
}

function getCardColor(index: number, currentIndex: number, isComplete: boolean) {
  if (index === currentIndex && !isComplete) {
    return "bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-300 shadow-md";
  }
  if (index < currentIndex || isComplete) {
    return "bg-gradient-to-br from-green-50 to-emerald-50 border-green-300";
  }
  return "bg-white border-gray-200";
}

export function JourneyProgress({ currentStage, progress }: JourneyProgressProps) {
  const currentIndex = getStageIndex(currentStage);
  const isComplete = progress === 100;

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h3 className="text-base font-semibold text-gray-900">Overall Progress</h3>
        <Badge variant={isComplete ? "success" : "info"} className="text-base font-bold px-4 py-1.5">
          {progress}%
        </Badge>
      </div>

      <div className="relative">
        <div className="h-4 bg-gray-100 rounded-full overflow-hidden shadow-inner border border-gray-200">
          <div
            className={`h-full rounded-full transition-all duration-700 relative overflow-hidden ${
              isComplete
                ? "bg-gradient-to-r from-green-500 via-green-600 to-emerald-600"
                : "bg-gradient-to-r from-blue-500 via-blue-600 to-indigo-600"
            }`}
            style={{ width: `${progress}%` }}
          >
            <div className="absolute inset-0 bg-white/20 animate-pulse"></div>
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer"></div>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        {STAGES.map((stage, index) => {
          const isActive = index === currentIndex;
          const isCompleted = index < currentIndex || isComplete;
          const isUpcoming = index > currentIndex && !isComplete;
          const cardColor = getCardColor(index, currentIndex, isComplete);
          const iconColor = getStageColor(index, currentIndex, isComplete);

          return (
            <div key={stage.value} className="relative">
              <div
                className={`flex items-start gap-4 p-5 rounded-xl border-2 transition-all duration-300 ${cardColor}`}
              >
                <div className={`flex-shrink-0 w-14 h-14 rounded-xl ${iconColor} border-2 flex items-center justify-center font-bold text-lg transition-all duration-300`}>
                  {isCompleted ? (
                    <CheckCircle2 className="w-7 h-7" />
                  ) : (
                    <span>{index + 1}</span>
                  )}
                </div>
                <div className="flex-1 min-w-0 pt-1">
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <h4 className={`font-bold text-lg ${
                      isActive ? "text-blue-900" : isCompleted ? "text-green-900" : "text-gray-600"
                    }`}>
                      {stage.label}
                    </h4>
                    {isActive && !isComplete && (
                      <Badge variant="info" className="text-xs font-semibold px-2.5 py-1">
                        Current Stage
                      </Badge>
                    )}
                    {isCompleted && (
                      <Badge variant="success" className="text-xs font-semibold px-2.5 py-1">
                        Completed
                      </Badge>
                    )}
                  </div>
                  <p className={`text-sm leading-relaxed ${
                    isActive ? "text-blue-700" : isCompleted ? "text-green-700" : "text-gray-500"
                  }`}>
                    {stage.description}
                  </p>
                </div>
              </div>

              {index < STAGES.length - 1 && (
                <div className="flex justify-center py-4">
                  <div className={`h-8 w-0.5 rounded-full transition-all duration-500 ${
                    index < currentIndex || isComplete 
                      ? "bg-gradient-to-b from-green-400 to-green-500" 
                      : index === currentIndex
                      ? "bg-gradient-to-b from-blue-400 to-blue-500"
                      : "bg-gray-200"
                  }`}></div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {isComplete && (
        <div className="mt-6 p-6 bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-300 rounded-xl text-center">
          <CheckCircle2 className="w-12 h-12 text-green-600 mx-auto mb-3" />
          <h3 className="text-xl font-bold text-green-900 mb-1">Journey Complete!</h3>
          <p className="text-green-700">Patient has completed all journey stages</p>
        </div>
      )}
    </div>
  );
}
