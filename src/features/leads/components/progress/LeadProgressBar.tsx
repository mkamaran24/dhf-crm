
import React, { useState } from "react";
import { cn } from "@/src/shared/lib/utils";
import { STAGES, StageHistory } from "../../data/mock-progress-data";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/src/shared/components/ui/tooltip";
import { Modal } from "@/src/shared/components/ui/modal";
import { Calendar, History, X } from "lucide-react";

interface LeadProgressBarProps {
    stages: string[];
    currentStage: string;
    lost: boolean;
    lostReason?: string;
    history?: StageHistory[];
    className?: string;
}

export function LeadProgressBar({
    stages,
    currentStage,
    lost,
    lostReason,
    history = [],
    className
}: LeadProgressBarProps) {
    const [selectedStageHistory, setSelectedStageHistory] = useState<{ label: string, data: StageHistory[] } | null>(null);

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
                {/* Labels Above - Improved Spacing & Long Label Handling */}
                <div className="flex justify-between mb-4 px-1">
                    {STAGES.map((stage, index) => {
                        const status = getStepStatus(stage.label);
                        const stageActions = history.filter(h => h.stage === stage.label);

                        // Handle long labels for the specific "Appointment Booked" case
                        const displayLabel = stage.label === "Appointment Booked" ? "Appt Booked" : stage.label;

                        return (
                            <div key={stage.id} className="flex flex-col items-center flex-1 text-center min-w-0 px-0.5">
                                <TooltipProvider>
                                    <Tooltip>
                                        <TooltipTrigger asChild>
                                            <span
                                                className={cn(
                                                    "text-[9px] sm:text-[10px] uppercase tracking-tighter sm:tracking-normal font-bold transition-colors duration-200 flex items-center justify-center gap-1 w-full",
                                                    status === "completed" || status === "converted" ? "text-blue-700" :
                                                        status === "current" ? "text-blue-800 font-extrabold" :
                                                            status === "lost" ? "text-red-700" : "text-slate-400"
                                                )}
                                            >
                                                <span className="truncate max-w-full">
                                                    <span className="hidden lg:inline">{stage.label}</span>
                                                    <span className="lg:hidden">{displayLabel}</span>
                                                </span>
                                                <span className="sr-only sm:not-sr-only">
                                                    {stageActions.length > 1 && (
                                                        <Badge count={stageActions.length} />
                                                    )}
                                                </span>
                                            </span>
                                        </TooltipTrigger>
                                        <TooltipContent side="top" className="bg-slate-800 text-white text-[10px] font-bold py-1 px-2 rounded-lg border-none shadow-lg">
                                            {stage.label}
                                        </TooltipContent>
                                    </Tooltip>
                                </TooltipProvider>
                            </div>
                        );
                    })}
                </div>

                {/* Progress Bar Container - Thick and Tactile */}
                <div className="relative h-2.5 bg-slate-100 rounded-full overflow-hidden flex border border-slate-200/50 shadow-inner mx-1">
                    {STAGES.map((stage) => {
                        const status = getStepStatus(stage.label);

                        let barColor = "bg-transparent";
                        if (status === "completed") barColor = "bg-blue-600";
                        if (status === "converted") barColor = "bg-emerald-600";
                        if (status === "current") barColor = "bg-blue-400/40 animate-pulse";
                        if (status === "lost") barColor = "bg-red-600";

                        return (
                            <div
                                key={stage.id}
                                className={cn(
                                    "flex-1 h-full relative border-r border-white/40 last:border-0",
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
                                                <TooltipContent className="bg-slate-900 border-slate-800 p-2 rounded-xl shadow-xl">
                                                    <p className="font-bold text-white text-xs">Lost: {lostReason}</p>
                                                </TooltipContent>
                                            </Tooltip>
                                        </TooltipProvider>
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>

                {/* Audit Info Below: Interactive for Multiple Actions */}
                <div className="flex justify-between mt-3 px-1">
                    {STAGES.map((stage) => {
                        const stageHistory = history.filter(h => h.stage === stage.label);
                        const latest = stageHistory[stageHistory.length - 1];
                        const hasMultiple = stageHistory.length > 1;

                        return (
                            <div key={stage.id} className="flex flex-col items-center flex-1 text-center min-w-0 px-0.5">
                                {latest ? (
                                    <div className="w-full">
                                        {hasMultiple ? (
                                            /* Modal Trigger for Multiple Actions */
                                            <button
                                                onClick={() => setSelectedStageHistory({ label: stage.label, data: stageHistory })}
                                                className="flex flex-col items-center gap-0.5 w-full bg-slate-50/50 hover:bg-amber-50 rounded-xl p-1 transition-all duration-200 border border-transparent hover:border-amber-200 group outline-none"
                                            >
                                                <span className="text-[9px] text-slate-600 font-bold tracking-tight whitespace-nowrap">
                                                    {latest.completedAt.split(' ')[0]}
                                                </span>
                                                <span className="text-[8px] font-bold text-blue-700 bg-blue-50 px-1.5 py-0.5 rounded border border-blue-100 truncate w-full group-hover:bg-white group-hover:border-amber-300 transition-colors">
                                                    {latest.completedBy.split(' ')[1] || latest.completedBy}
                                                </span>
                                                <span className="text-[8px] font-bold text-amber-600 animate-bounce mt-0.5 flex items-center gap-0.5">
                                                    +{stageHistory.length - 1} <History className="w-2 h-2" />
                                                </span>
                                            </button>
                                        ) : (
                                            /* Simple View for Single Action */
                                            <div className="flex flex-col items-center gap-0.5 w-full translate-y-1">
                                                <span className="text-[9px] text-slate-600 font-bold tracking-tight bg-slate-50 px-1 py-0.5 rounded-md border border-slate-100 whitespace-nowrap">
                                                    {latest.completedAt.split(' ')[0]}
                                                </span>
                                                <span className="text-[8px] font-bold text-blue-700 bg-blue-50 px-1 py-0.5 rounded border border-blue-100 truncate w-full max-w-[60px] text-center">
                                                    {latest.completedBy.split(' ')[1] || latest.completedBy}
                                                </span>
                                            </div>
                                        )}
                                    </div>
                                ) : (
                                    <div className="w-1 h-1 bg-slate-200 rounded-full mt-3" />
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Stage History Modal */}
            {selectedStageHistory && (
                <Modal
                    isOpen={!!selectedStageHistory}
                    onClose={() => setSelectedStageHistory(null)}
                    size="md"
                >
                    <div className="p-0 overflow-hidden">
                        <div className="p-6 bg-slate-50 border-b border-slate-100 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="p-3 bg-amber-100 text-amber-600 rounded-2xl">
                                    <History className="w-6 h-6" />
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold text-slate-800">
                                        {selectedStageHistory.label} History
                                    </h3>
                                    <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-widest mt-1">
                                        Audit Trail • {selectedStageHistory.data.length} Interactions
                                    </p>
                                </div>
                            </div>
                            <button
                                onClick={() => setSelectedStageHistory(null)}
                                className="p-2 hover:bg-slate-100 rounded-full transition-colors text-slate-400"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                        <div className="p-6 space-y-4 max-h-[400px] overflow-y-auto bg-white">
                            {[...selectedStageHistory.data].reverse().map((h, i) => (
                                <div key={i} className="flex items-start gap-4 p-4 rounded-2xl bg-slate-50/50 border border-slate-100 group hover:bg-white hover:shadow-lg hover:border-blue-100 transition-all">
                                    <div className={cn(
                                        "w-10 h-10 rounded-xl flex items-center justify-center font-bold text-lg shadow-sm border",
                                        i === 0 ? "bg-blue-600 text-white border-blue-700" : "bg-white text-slate-400 border-slate-100"
                                    )}>
                                        {h.completedBy[0]}
                                    </div>
                                    <div className="flex-1 space-y-1">
                                        <div className="flex items-center justify-between">
                                            <span className="text-sm font-bold text-slate-800">{h.completedBy}</span>
                                            {i === 0 && (
                                                <span className="text-[10px] font-bold bg-blue-50 text-blue-600 px-2 py-0.5 rounded-full border border-blue-100">MOST RECENT</span>
                                            )}
                                        </div>
                                        <div className="flex items-center gap-3 text-xs text-slate-500 font-medium">
                                            <span className="flex items-center gap-1.5"><Calendar className="w-3.5 h-3.5" /> {h.completedAt}</span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </Modal>
            )}
        </div>
    );
}

function Badge({ count }: { count: number }) {
    return (
        <span className="relative flex h-3.5 w-3.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
            <span className="relative inline-flex items-center justify-center rounded-full h-3.5 w-3.5 bg-amber-500 text-[7px] font-bold text-white border border-amber-600 shadow-sm leading-none">
                {count}
            </span>
        </span>
    );
}
