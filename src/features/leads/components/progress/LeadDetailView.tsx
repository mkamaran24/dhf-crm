
"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
    Calendar,
    ChevronLeft,
    Mail,
    Phone,
    MoreHorizontal,
    Edit,
    Clock,
    User,
    FileText,
    CheckCircle,
    Circle,
    AlertCircle,
    ArrowRight,
    Flag,
    XCircle,
    MapPin,
    MessageSquare,
    Save,
    X,
    History,
    RefreshCcw
} from "lucide-react";
import { cn } from "@/src/shared/lib/utils";
import { Badge } from "@/src/shared/components/ui/badge";
import { STAGES, mockLeadsProgress, StageHistory } from "../../data/mock-progress-data";

interface LeadDetailViewProps {
    leadId: string;
}

export function LeadDetailView({ leadId }: LeadDetailViewProps) {
    // For now, use the first lead as mock data if not found or just a representative one
    const initialLead = mockLeadsProgress.find(l => l.leadId === leadId) || mockLeadsProgress[0];
    const [lead, setLead] = useState({
        ...initialLead,
        notes: initialLead.notes || "Patient prefers consultation in Erbil clinic. Interested in multiple grafts. Budget confirmed in IQD."
    });

    // State for Note Editing
    const [isEditingNotes, setIsEditingNotes] = useState(false);
    const [tempNotes, setTempNotes] = useState(lead.notes);

    const [isStatusMenuOpen, setIsStatusMenuOpen] = useState(false);
    const [isLostModalOpen, setIsLostModalOpen] = useState(false);
    const [lostNote, setLostNote] = useState("");

    // Status Date Modal State
    const [pendingStage, setPendingStage] = useState<string | null>(null);
    const [scheduleDate, setScheduleDate] = useState("");

    const getStatusColor = (status: string) => {
        if (status === "Converted") return "bg-emerald-50 text-emerald-600 border-emerald-100";
        if (lead.lost) return "bg-red-50 text-red-600 border-red-100";
        return "bg-blue-50 text-blue-600 border-blue-100";
    };

    const handleMarkAsLost = () => {
        const timestamp = new Date().toISOString().replace('T', ' ').substring(0, 16);
        const newHistory: StageHistory = {
            stage: "Closed Lost",
            completedAt: timestamp,
            completedBy: "Admin Ali" // Mock current user
        };

        setLead({
            ...lead,
            lost: true,
            lostReason: lostNote || "No specific reason provided",
            history: [...lead.history, newHistory],
            lastUpdated: timestamp.split(' ')[0]
        });
        setIsLostModalOpen(false);
        setIsStatusMenuOpen(false);
    };

    const handleStageChange = (stageLabel: string, date?: string) => {
        // Validation: If it's a schedule-required stage and no date is provided, show modal
        if (!date && ["Follow-up", "Ready", "Appointment Booked"].includes(stageLabel)) {
            setPendingStage(stageLabel);
            return;
        }

        const timestamp = new Date().toISOString().replace('T', ' ').substring(0, 16);
        const newHistoryEntry: StageHistory = {
            stage: stageLabel,
            completedAt: timestamp,
            completedBy: "Admin Ali" // Mock current user
        };

        const updatedLead = {
            ...lead,
            currentStage: stageLabel,
            stages: [...new Set([...lead.stages, stageLabel])],
            history: [...lead.history, newHistoryEntry],
            lost: false,
            lastUpdated: timestamp.split(' ')[0],
            // In a real app we'd save this date to a specific field
            ...(date && { followUpDate: date })
        };

        setLead(updatedLead);
        setIsStatusMenuOpen(false);
        setPendingStage(null);
        setScheduleDate("");
    };

    const handleSaveNotes = () => {
        setLead({ ...lead, notes: tempNotes });
        setIsEditingNotes(false);
    };

    const handleCancelNotes = () => {
        setTempNotes(lead.notes);
        setIsEditingNotes(false);
    };

    // Find the last admin/user who made a change
    const lastAction = lead.history[lead.history.length - 1];

    return (
        <div className="max-w-6xl mx-auto space-y-8 p-6">
            {/* Breadcrumbs & Actions */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                    <Link href="/leads/progress" className="p-2 hover:bg-slate-100 rounded-full transition-colors text-slate-500">
                        <ChevronLeft className="w-6 h-6" />
                    </Link>
                    <div>
                        <div className="flex items-center gap-3">
                            <h1 className="text-3xl font-bold text-slate-800 tracking-tight">{lead.name}</h1>
                            <Badge className={cn("px-2.5 py-0.5 font-semibold uppercase tracking-wider text-[10px]", getStatusColor(lead.currentStage))}>
                                {lead.lost ? "Closed Lost" : lead.currentStage}
                            </Badge>
                        </div>
                        <div className="flex flex-wrap items-center gap-y-2 gap-x-4 text-slate-500 text-sm font-medium mt-1">
                            <span className="font-mono bg-slate-100 px-1.5 py-0.5 rounded text-slate-600 font-semibold">{lead.leadId}</span>
                            <span className="flex items-center gap-1.5">
                                <MapPin className="w-4 h-4" />
                                Erbil, Iraq
                            </span>
                            <span className="flex items-center gap-1.5 text-slate-400">
                                <Clock className="w-4 h-4" />
                                Updated {lead.lastUpdated}
                            </span>
                        </div>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <div className="relative">
                        <button
                            onClick={() => setIsStatusMenuOpen(!isStatusMenuOpen)}
                            className="flex items-center gap-2 bg-white border border-slate-200 text-slate-700 px-5 py-2.5 rounded-xl font-semibold hover:bg-slate-50 transition-all shadow-sm active:scale-95"
                        >
                            <Flag className="w-4 h-4 text-blue-500" />
                            Update Status
                        </button>

                        {isStatusMenuOpen && (
                            <div className="absolute right-0 mt-2 w-56 bg-white border border-slate-100 rounded-2xl shadow-xl z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                                <div className="p-2 font-semibold text-[10px] text-slate-400 uppercase tracking-widest px-4 py-2 bg-slate-50/50">Transition To</div>
                                <div className="p-2 space-y-1">
                                    {STAGES.map((s) => (
                                        <button
                                            key={s.id}
                                            onClick={() => handleStageChange(s.label)}
                                            className="w-full text-left px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-blue-50 hover:text-blue-600 rounded-lg transition-colors flex items-center justify-between group"
                                        >
                                            {s.label}
                                            <ArrowRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-all -translate-x-2 group-hover:translate-x-0" />
                                        </button>
                                    ))}
                                    <div className="h-px bg-slate-50 mx-2 my-1" />
                                    <button
                                        onClick={() => setIsLostModalOpen(true)}
                                        className="w-full text-left px-4 py-2.5 text-sm font-semibold text-red-600 hover:bg-red-50 rounded-lg transition-colors flex items-center gap-2"
                                    >
                                        <XCircle className="w-4 h-4" />
                                        Mark as Lost
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>

                    <button className="flex-1 md:flex-none flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-xl font-semibold shadow-md shadow-blue-200 transition-all active:scale-95">
                        <Calendar className="w-4 h-4" />
                        Book Appointment
                    </button>
                    <button className="p-2.5 bg-white border border-slate-200 hover:bg-slate-50 rounded-xl transition-all shadow-sm text-slate-400 hover:text-slate-600 active:scale-95">
                        <MoreHorizontal className="w-5 h-5" />
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Column: Progress & Timeline */}
                <div className="lg:col-span-2 space-y-8">
                    {/* Progress Card */}
                    <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-8">
                        <div className="flex items-center justify-between mb-10 border-b border-slate-50 pb-6">
                            <h2 className="text-xl font-bold text-slate-800 flex items-center gap-3">
                                <div className="p-2 bg-blue-50 text-blue-600 rounded-xl">
                                    <History className="w-5 h-5" />
                                </div>
                                Pipeline Journey
                            </h2>
                            <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-widest bg-slate-50 px-4 py-1.5 rounded-full border border-slate-100">
                                Live Audit Feed
                            </span>
                        </div>

                        <div className="relative">
                            {/* Vertical Line - Thinner and cleaner */}
                            <div className="absolute left-[19px] top-4 bottom-4 w-0.5 bg-slate-100 rounded-full" />

                            <div className="space-y-12">
                                {STAGES.map((stage, index) => {
                                    const stageHistory = lead.history.filter(h => h.stage === stage.label);
                                    const isCompleted = stageHistory.length > 0;
                                    const isCurrent = lead.currentStage === stage.label;
                                    const isLostAtThisStage = lead.lost && isCurrent;

                                    return (
                                        <div key={stage.id} className="relative flex gap-10 group">
                                            {/* Icon/Circle - Refined definitions */}
                                            <div className={cn(
                                                "relative z-10 w-10 h-10 rounded-2xl flex items-center justify-center border-2 transition-all duration-300",
                                                isCompleted ? "bg-emerald-500 border-emerald-100 text-white" :
                                                    isCurrent ? (lead.lost ? "bg-red-500 border-red-100 text-white" : "bg-blue-600 border-blue-100 text-white shadow-lg shadow-blue-100") :
                                                        "bg-white border-slate-100 text-slate-300"
                                            )}>
                                                {isCompleted ? <CheckCircle className="w-4 h-4" /> :
                                                    isCurrent ? (lead.lost ? <AlertCircle className="w-4 h-4" /> : <Clock className="w-4 h-4 animate-pulse" />) :
                                                        <Circle className="w-3.5 h-3.5" />}
                                            </div>

                                            {/* Content */}
                                            <div className="flex-1 space-y-3">
                                                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                                                    <div>
                                                        <div className="flex items-center gap-3">
                                                            <h3 className={cn(
                                                                "font-bold text-lg transition-colors tracking-tight",
                                                                isCurrent ? (lead.lost ? "text-red-700" : "text-blue-700") :
                                                                    isCompleted ? "text-slate-800" : "text-slate-300"
                                                            )}>
                                                                {stage.label}
                                                            </h3>
                                                            {stageHistory.length > 1 && (
                                                                <div className="flex items-center h-5 bg-amber-50 text-amber-700 border border-amber-100 text-[9px] px-2 rounded-full font-bold uppercase tracking-widest shadow-sm">
                                                                    {stageHistory.length} Cycles Logged
                                                                </div>
                                                            )}
                                                        </div>

                                                        {/* History List */}
                                                        {isCompleted && (
                                                            <div className="mt-3 space-y-2">
                                                                {stageHistory.map((h, i) => (
                                                                    <div key={i} className="flex items-center gap-3 animate-in fade-in slide-in-from-left-2 duration-300" style={{ animationDelay: `${i * 100}ms` }}>
                                                                        <div className="px-2.5 py-1 bg-slate-50 border border-slate-100 rounded-lg flex items-center gap-1.5">
                                                                            <Calendar className="w-3 h-3 text-slate-400" />
                                                                            <span className="text-[11px] font-medium text-slate-600">
                                                                                {h.completedAt}
                                                                            </span>
                                                                        </div>
                                                                        <div className="px-2.5 py-1 bg-blue-50/50 border border-blue-100/50 rounded-lg flex items-center gap-1.5">
                                                                            <User className="w-3 h-3 text-blue-500" />
                                                                            <span className="text-[11px] font-semibold text-blue-700">
                                                                                {h.completedBy}
                                                                            </span>
                                                                        </div>
                                                                        {i === stageHistory.length - 1 && stageHistory.length > 1 && (
                                                                            <span className="text-[9px] font-semibold text-emerald-600 uppercase tracking-widest px-2 py-0.5">
                                                                                • Current Touch
                                                                            </span>
                                                                        )}
                                                                    </div>
                                                                ))}
                                                            </div>
                                                        )}
                                                    </div>
                                                    {isCompleted && !isCurrent && (
                                                        <div className="flex items-center gap-1.5 px-3 py-1 bg-emerald-50 text-emerald-600 rounded-xl border border-emerald-100 text-[10px] font-bold uppercase tracking-widest">
                                                            <CheckCircle className="w-3 h-3" />
                                                            Verified
                                                        </div>
                                                    )}
                                                </div>

                                                {isCurrent && !lead.lost && (
                                                    <div className="p-5 bg-slate-50/50 border border-slate-100 rounded-2xl space-y-4">
                                                        <p className="text-sm text-slate-600 font-medium leading-relaxed">
                                                            Provide the necessary documentation to move beyond <span className="font-semibold text-slate-800">{stage.label}</span>.
                                                            {stage.label === "Follow-up" && stageHistory.length > 0 && (
                                                                <span className="block mt-2 text-amber-700 font-semibold bg-amber-50/50 p-2 rounded-lg border border-amber-100/50">
                                                                    Priority Follow-up cycle #{stageHistory.length + 1} starting.
                                                                </span>
                                                            )}
                                                        </p>
                                                        <div className="flex flex-wrap gap-3">
                                                            {stage.label === "Follow-up" && (
                                                                <button
                                                                    onClick={() => handleStageChange("Follow-up")}
                                                                    className="px-4 py-2 bg-amber-500 text-white text-xs font-bold rounded-xl hover:bg-amber-600 transition-all flex items-center gap-1.5 shadow-sm active:scale-95"
                                                                >
                                                                    <RefreshCcw className="w-3.5 h-3.5" />
                                                                    Log Action
                                                                </button>
                                                            )}
                                                            <button
                                                                onClick={() => {
                                                                    const nextStage = STAGES[index + 1];
                                                                    if (nextStage) handleStageChange(nextStage.label);
                                                                }}
                                                                className="px-4 py-2 bg-blue-600 text-white text-xs font-bold rounded-xl hover:bg-blue-700 transition-all flex items-center gap-1.5 shadow-md shadow-blue-100 active:scale-95"
                                                            >
                                                                Advance Stage <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
                                                            </button>
                                                        </div>
                                                    </div>
                                                )}

                                                {isLostAtThisStage && (
                                                    <div className="p-5 bg-red-50/50 border border-red-100 rounded-2xl space-y-3">
                                                        <div className="flex items-center gap-2">
                                                            <AlertCircle className="w-4 h-4 text-red-500" />
                                                            <span className="text-[10px] font-bold text-red-700 uppercase tracking-widest">Final Loss Reason</span>
                                                        </div>
                                                        <div className="bg-white/80 p-4 rounded-xl border border-red-100 font-medium text-sm text-red-800 leading-relaxed italic shadow-sm">
                                                            "{lead.lostReason}"
                                                        </div>
                                                        <div className="text-[10px] text-red-400 font-semibold uppercase flex items-center gap-2 pl-1">
                                                            <User className="w-3 h-3" />
                                                            Authorized by {lastAction.completedBy}
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </div>

                    {/* Info Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-6 space-y-5">
                            <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2.5">
                                <FileText className="w-5 h-5 text-amber-500" />
                                Discovery
                            </h3>
                            <div className="space-y-4">
                                <div className="flex flex-col gap-1">
                                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Service Category</span>
                                    <span className="font-semibold text-slate-700 text-sm bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-100">Hair Transplant</span>
                                </div>
                                <div className="flex justify-between items-center bg-slate-50/30 p-3 rounded-xl">
                                    <span className="text-xs font-semibold text-slate-500">Source</span>
                                    <span className="text-xs font-bold text-slate-800">Facebook Ads</span>
                                </div>
                                <div className="flex justify-between items-center bg-blue-50/30 p-3 rounded-xl border border-blue-100/30">
                                    <span className="text-xs font-semibold text-slate-500">Budget</span>
                                    <span className="text-sm font-bold text-blue-700">3.5M - 5M IQD</span>
                                </div>
                            </div>
                        </div>

                        {/* Recent Activity Card */}
                        <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-6 space-y-5">
                            <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2.5">
                                <History className="w-5 h-5 text-emerald-500" />
                                Recent Activity
                            </h3>
                            <div className="space-y-5">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-xl bg-slate-50 flex items-center justify-center text-slate-500 font-bold border border-slate-100 shadow-inner">
                                        {lastAction.completedBy?.[0] || "A"}
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Modified By</p>
                                        <p className="font-bold text-slate-800">{lastAction.completedBy}</p>
                                    </div>
                                </div>
                                <div className="p-4 bg-slate-50 border border-slate-100 rounded-xl">
                                    <p className="text-[10px] text-slate-400 font-bold uppercase mb-1 tracking-widest">Latest Update</p>
                                    <p className="text-xs font-semibold text-slate-700 leading-relaxed">Lead successfully transitioned to <span className="text-blue-600 font-bold">{lastAction.stage}</span></p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Column: Contact & Metadata */}
                <div className="space-y-8">
                    {/* Contact Card */}
                    <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-8 space-y-6">
                        <h2 className="text-xl font-bold text-slate-800 tracking-tight">Contact</h2>

                        <div className="space-y-4">
                            <div className="group cursor-pointer bg-slate-50 p-4 rounded-2xl border border-slate-100 hover:border-blue-100 hover:bg-white transition-all">
                                <div className="flex items-center gap-4">
                                    <div className="p-3 bg-white text-slate-400 group-hover:text-blue-600 rounded-xl shadow-sm border border-slate-100 transition-colors">
                                        <Phone className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Mobile</p>
                                        <p className="text-sm font-bold text-slate-800">+(964) 750 123 4567</p>
                                    </div>
                                </div>
                            </div>

                            <div className="group cursor-pointer bg-slate-50 p-4 rounded-2xl border border-slate-100 hover:border-blue-100 hover:bg-white transition-all">
                                <div className="flex items-center gap-4">
                                    <div className="p-3 bg-white text-slate-400 group-hover:text-blue-600 rounded-xl shadow-sm border border-slate-100 transition-colors">
                                        <Mail className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Email</p>
                                        <p className="text-sm font-bold text-slate-800 truncate max-w-[140px]">{lead.name.toLowerCase().split(' ')[0]}@demo.iq</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="pt-6 border-t border-slate-50 space-y-3">
                            <button className="w-full bg-emerald-600 text-white font-bold py-3.5 rounded-2xl shadow-lg shadow-emerald-50 hover:bg-emerald-700 transition-all flex items-center justify-center gap-2 active:scale-95">
                                <Phone className="w-4 h-4" />
                                WhatsApp
                            </button>
                            <button className="w-full bg-white border border-slate-200 text-slate-700 font-bold py-3.5 rounded-2xl hover:bg-slate-50 transition-all active:scale-95">
                                Send SMS
                            </button>
                        </div>
                    </div>

                    {/* Notes View */}
                    <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-8 space-y-5 relative">
                        <div className="flex items-center justify-between">
                            <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2.5">
                                <MessageSquare className="w-5 h-5 text-blue-500" />
                                Case Notes
                            </h2>
                            {!isEditingNotes ? (
                                <button
                                    onClick={() => setIsEditingNotes(true)}
                                    className="p-2 bg-slate-50 hover:bg-slate-100 rounded-lg transition-colors border border-slate-100"
                                >
                                    <Edit className="w-4 h-4 text-slate-400 hover:text-blue-500 transition-colors" />
                                </button>
                            ) : (
                                <div className="flex gap-1.5">
                                    <button
                                        onClick={handleSaveNotes}
                                        className="p-1.5 bg-emerald-50 text-emerald-600 hover:bg-emerald-100 rounded-lg transition-colors shadow-sm"
                                    >
                                        <Save className="w-4 h-4" />
                                    </button>
                                    <button
                                        onClick={handleCancelNotes}
                                        className="p-1.5 bg-red-50 text-red-600 hover:bg-red-100 rounded-lg transition-colors shadow-sm"
                                    >
                                        <X className="w-4 h-4" />
                                    </button>
                                </div>
                            )}
                        </div>

                        {isEditingNotes ? (
                            <textarea
                                className="w-full px-4 py-3 rounded-xl border border-blue-200 focus:outline-none focus:ring-4 focus:ring-blue-500/5 focus:border-blue-500 bg-slate-50 transition-all min-h-[140px] text-slate-800 font-medium text-sm leading-relaxed"
                                value={tempNotes}
                                onChange={(e) => setTempNotes(e.target.value)}
                                autoFocus
                            />
                        ) : (
                            <div className="bg-slate-50/50 rounded-xl p-5 border border-slate-100 min-h-[100px]">
                                <p className="text-sm text-slate-600 font-medium leading-relaxed italic">
                                    "{lead.notes || "No official documentation."}"
                                </p>
                            </div>
                        )}

                        <div className="flex items-center justify-between pt-2">
                            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">
                                Collaboration
                            </p>
                            <span className="text-[9px] font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full border border-blue-100">
                                Verified: {lastAction.completedBy.split(' ')[1] || lastAction.completedBy}
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Modal */}
            {isLostModalOpen && (
                <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[100] flex items-center justify-center p-4 animate-in fade-in duration-300">
                    <div className="bg-white rounded-3xl w-full max-w-lg shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300 border border-slate-100">
                        <div className="p-10 space-y-8">
                            <div className="flex items-center gap-5">
                                <div className="w-14 h-14 bg-red-50 text-red-600 rounded-2xl flex items-center justify-center border border-red-100 shadow-sm">
                                    <AlertCircle className="w-7 h-7" />
                                </div>
                                <div>
                                    <h2 className="text-2xl font-bold text-slate-800 tracking-tight">Finalize Loss Audit</h2>
                                    <p className="text-slate-500 font-medium mt-1">This will conclude the journey for {lead.name}.</p>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest pl-1">Reason</label>
                                <textarea
                                    className="w-full px-5 py-4 rounded-xl border border-slate-200 focus:outline-none focus:ring-4 focus:ring-red-500/5 focus:border-red-500 bg-slate-50 transition-all min-h-[140px] text-slate-800 font-semibold"
                                    placeholder="Provide detailed reasoning..."
                                    value={lostNote}
                                    onChange={(e) => setLostNote(e.target.value)}
                                />
                            </div>

                            <div className="flex gap-3 pt-2">
                                <button
                                    onClick={() => setIsLostModalOpen(false)}
                                    className="flex-1 px-6 py-3.5 rounded-xl text-sm font-bold text-slate-500 hover:bg-slate-50 transition-all"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleMarkAsLost}
                                    disabled={!lostNote.trim()}
                                    className="flex-1 px-6 py-3.5 rounded-xl text-sm font-bold bg-red-600 hover:bg-red-700 text-white shadow-lg shadow-red-100 transition-all disabled:opacity-50"
                                >
                                    Confirm Loss
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Status Date Modal */}
            {pendingStage && (
                <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[100] flex items-center justify-center p-4 animate-in fade-in duration-300">
                    <div className="bg-white rounded-3xl w-full max-w-md shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300 border border-slate-100">
                        <div className="p-8 space-y-6">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center border border-blue-100 shadow-sm">
                                    <Calendar className="w-6 h-6" />
                                </div>
                                <div>
                                    <h2 className="text-xl font-bold text-slate-800 tracking-tight">Set Schedule Date</h2>
                                    <p className="text-slate-500 font-medium text-sm mt-0.5">Scheduling for: <span className="text-blue-600 font-bold">{pendingStage}</span></p>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest pl-1">Target Date</label>
                                    <input
                                        type="date"
                                        className="w-full px-5 py-3.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-4 focus:ring-blue-500/5 focus:border-blue-500 bg-slate-50 transition-all font-semibold text-slate-700"
                                        value={scheduleDate}
                                        onChange={(e) => setScheduleDate(e.target.value)}
                                    />
                                </div>
                            </div>

                            <div className="flex gap-3 pt-2">
                                <button
                                    onClick={() => setPendingStage(null)}
                                    className="flex-1 px-6 py-3.5 rounded-xl text-sm font-bold text-slate-500 hover:bg-slate-50 transition-all"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={() => handleStageChange(pendingStage, scheduleDate)}
                                    disabled={!scheduleDate}
                                    className="flex-1 px-6 py-3.5 rounded-xl text-sm font-bold bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-100 transition-all disabled:opacity-50 active:scale-95"
                                >
                                    Confirm Stage
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
