
import React from "react";
import { cn } from "@/src/shared/lib/utils";
import { Check, X, AlertCircle } from "lucide-react";
import { STAGES } from "../../data/mock-progress-data";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/src/shared/components/ui";

interface LeadProgressBarProps {
    stages: string[];
    currentStage: string;
    lost: boolean;
    lostReason?: string;
    className?: string;
}


export function LeadProgressBar({
    stages,
    currentStage,
    lost,
    lostReason,
    className
}: LeadProgressBarProps) {

    // Helper to determine step status
    const getStepStatus = (stepLabel: string) => {
        const isCompleted = stages.includes(stepLabel);
        const isCurrent = currentStage === stepLabel;

        if (lost && isCurrent) return "lost";
        if (isCompleted && stepLabel === "Converted") return "converted";
        if (isCompleted) return "completed";
        if (isCurrent) return "current";
        return "upcoming";
    };

    return (
        <div className={cn("w-full py-4", className)}>
            <div className="relative">
                {/* Labels Above */}
                <div className="flex justify-between mb-3 px-1">
                    {STAGES.map((stage, index) => {
                        const status = getStepStatus(stage.label);
                        return (
                            <div key={stage.id} className="flex flex-col items-center flex-1 text-center">
                                <span
                                    className={cn(
                                        "text-[10px] uppercase tracking-wider font-bold transition-colors duration-200",
                                        status === "completed" || status === "converted" ? "text-blue-600" :
                                            status === "current" ? "text-blue-700" :
                                                status === "lost" ? "text-red-600" : "text-gray-400"
                                    )}
                                >
                                    <span className="hidden sm:inline">{stage.label}</span>
                                    <span className="sm:hidden">{index + 1}</span>
                                </span>
                            </div>
                        );
                    })}
                </div>

                {/* Progress Bar Container */}
                <div className="relative h-2 bg-gray-100 rounded-full overflow-hidden flex">
                    {STAGES.map((stage, index) => {
                        const status = getStepStatus(stage.label);
                        const isLast = index === STAGES.length - 1;

                        let barColor = "bg-transparent";
                        if (status === "completed") barColor = "bg-blue-500";
                        if (status === "converted") barColor = "bg-emerald-500";
                        if (status === "current") barColor = "bg-blue-400/50 animate-pulse";
                        if (status === "lost") barColor = "bg-red-500";

                        return (
                            <div
                                key={stage.id}
                                className={cn(
                                    "flex-1 h-full relative border-r border-white last:border-0",
                                    barColor
                                )}
                            >
                                {status === "lost" && lostReason && (
                                    <div className="absolute inset-0 flex items-center justify-center">
                                        <TooltipProvider>
                                            <Tooltip>
                                                <TooltipTrigger asChild>
                                                    <div className="w-full h-full cursor-help" />
                                                </TooltipTrigger>
                                                <TooltipContent className="bg-red-900 border-red-800">
                                                    <p className="font-semibold text-white">Lost: {lostReason}</p>
                                                </TooltipContent>
                                            </Tooltip>
                                        </TooltipProvider>
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
