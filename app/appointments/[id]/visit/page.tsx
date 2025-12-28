"use client";

import React, { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
    Activity,
    ClipboardList,
    FileText,
    History,
    Calendar,
    ArrowLeft,
    Clock,
    CheckCircle2,
    ArrowRight,
    Plus,
    User,
    ShieldCheck,
    Stethoscope,
    PenTool,
    CheckCircle
} from "lucide-react";
import { Button } from "@/src/shared/components/ui";
import { cn } from "@/src/shared/lib/utils";

// Mock data
const VISIT_HISTORY = [
    {
        id: "VIS-9281",
        date: "Dec 12, 2023",
        time: "10:30 AM",
        doctor: "Dr. Ahmed Yasin",
        reason: "Cardiac Consultation",
        conductedBy: "Admin Sara",
        forms: [
            { id: 'intake', type: "Cardiac Intake", completed: true, lastUpdate: "10:45 AM", doctor: "Dr. Ahmed Yasin" },
            { id: 'echo', type: "Echocardiogram", completed: true, lastUpdate: "11:00 AM", doctor: "Dr. Saud Sherwan" },
            { id: 'rx', type: "Prescription", completed: true, lastUpdate: "11:15 AM", doctor: "Dr. Ahmed Yasin" }
        ]
    },
    {
        id: "VIS-8542",
        date: "Nov 28, 2023",
        time: "02:15 PM",
        doctor: "Dr. Karwan Mustafa",
        reason: "Follow-up - Chest Pain",
        conductedBy: "Admin Ali",
        forms: [
            { id: 'intake', type: "Cardiac Intake", completed: true, lastUpdate: "02:30 PM", doctor: "Dr. Karwan Mustafa" },
            { id: 'echo', type: "Echocardiogram", completed: false, lastUpdate: "—", doctor: "Pending" },
            { id: 'rx', type: "Prescription", completed: true, lastUpdate: "02:45 PM", doctor: "Dr. Karwan Mustafa" }
        ]
    }
];

export default function PatientVisitPage() {
    const params = useParams();
    const router = useRouter();
    const [visits, setVisits] = useState(VISIT_HISTORY);

    // Active session state with per-form doctor tracking
    const [sessionForms, setSessionForms] = useState([
        { id: 'intake', type: "Cardiac Intake", completed: true, lastUpdate: "10:45 AM", doctor: "Dr. Ahmed Yasin" },
        { id: 'echo', type: "Echocardiogram", completed: false, lastUpdate: "—", doctor: "Pending" },
        { id: 'rx', type: "Prescription", completed: false, lastUpdate: "—", doctor: "Pending" }
    ]);

    const completedCount = sessionForms.filter(f => f.completed).length;
    const totalCount = sessionForms.length;
    const progressPercent = (completedCount / totalCount) * 100;
    const isSessionComplete = completedCount === totalCount;

    const handleCompleteEncounter = () => {
        if (!isSessionComplete) return;

        const newVisit = {
            id: `VIS-${Math.floor(1000 + Math.random() * 9000)}`,
            date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
            time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
            doctor: "Clinical Team",
            reason: "Cardiac Consultation",
            conductedBy: "System",
            forms: [...sessionForms]
        };

        setVisits([newVisit, ...visits]);
        setSessionForms([
            { id: 'intake', type: "Cardiac Intake", completed: false, lastUpdate: "—", doctor: "Pending" },
            { id: 'echo', type: "Echocardiogram", completed: false, lastUpdate: "—", doctor: "Pending" },
            { id: 'rx', type: "Prescription", completed: false, lastUpdate: "—", doctor: "Pending" }
        ]);
    };

    return (
        <div className="max-w-6xl mx-auto space-y-8 pb-20 mt-8 px-4 sm:px-0 bg-slate-50/20">
            {/* Elegant Header */}
            <div className="flex items-center justify-between pb-6 border-b border-slate-200">
                <div className="flex items-center gap-4">
                    <button
                        onClick={() => router.back()}
                        className="p-2.5 hover:bg-white rounded-lg text-slate-400 hover:text-indigo-600 transition-all border border-slate-200 shadow-sm"
                    >
                        <ArrowLeft className="w-5 h-5" />
                    </button>
                    <div>
                        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Clinical Encounter</h1>
                        <div className="flex items-center gap-2 mt-0.5">
                            <span className="text-xs font-semibold text-slate-500">Encounter Reference # {params.id || "ENC-2025-001"}</span>
                            <span className="w-1 h-1 bg-slate-300 rounded-full" />
                            <div className="flex items-center gap-1.5 px-2 py-0.5 bg-indigo-50 text-indigo-700 rounded text-[10px] font-bold uppercase tracking-wider">
                                <span className="w-1 h-1 bg-indigo-600 rounded-full animate-pulse" />
                                Active Session
                            </div>
                        </div>
                    </div>
                </div>
                <Button
                    onClick={handleCompleteEncounter}
                    disabled={!isSessionComplete}
                    className={cn(
                        "h-11 px-8 rounded-xl font-semibold text-sm shadow-sm transition-all active:scale-95",
                        isSessionComplete
                            ? "bg-slate-900 hover:bg-slate-800 text-white"
                            : "bg-slate-100 text-slate-400 cursor-not-allowed border border-slate-200"
                    )}
                >
                    Finalize Encounter
                </Button>
            </div>

            {/* Patient Information Box */}
            <div className="bg-white px-8 py-5 rounded-xl border border-slate-200 shadow-sm flex flex-wrap items-center gap-x-12 gap-y-4">
                <div className="flex flex-col">
                    <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-widest mb-1 leading-none">Patient Name</span>
                    <span className="text-sm font-bold text-slate-900 tracking-tight">John Doe</span>
                </div>
                <div className="flex flex-col">
                    <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-widest mb-1 leading-none">Demographics</span>
                    <span className="text-sm font-medium text-slate-600 tracking-tight">63y • Male</span>
                </div>
                <div className="flex flex-col">
                    <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-widest mb-1 leading-none">Internal Identification</span>
                    <span className="text-sm font-mono font-bold text-slate-500 italic">PT-9281-00</span>
                </div>
                <div className="flex flex-col">
                    <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-widest mb-1 leading-none">Session Guard</span>
                    <div className="flex items-center gap-1.5 px-2 py-0.5 bg-indigo-50 text-indigo-700 rounded text-[10px] font-bold uppercase border border-indigo-100 italic">
                        Confirmed Entry
                    </div>
                </div>
            </div>

            {/* Encounter Progress & Control Center */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-8 flex flex-col md:flex-row items-center justify-between gap-8 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-1 bg-slate-50">
                    <div
                        className="h-full bg-indigo-600 transition-all duration-1000 ease-in-out"
                        style={{ width: `${progressPercent}%` }}
                    />
                </div>

                <div className="flex items-center gap-6">
                    <div className={cn(
                        "w-12 h-12 rounded-xl flex items-center justify-center shadow-md transition-all",
                        isSessionComplete ? "bg-emerald-600 text-white" : "bg-indigo-600 text-white"
                    )}>
                        {isSessionComplete ? <ShieldCheck className="w-6 h-6" /> : <Activity className="w-6 h-6" />}
                    </div>
                    <div>
                        <h2 className="text-lg font-bold text-slate-900 tracking-tight">Encounter Completion</h2>
                        <div className="flex items-center gap-3 mt-1">
                            <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-widest leading-none">
                                {completedCount} OF {totalCount} REPORTS FINALIZED
                            </span>
                            <span className="w-1 h-1 bg-slate-300 rounded-full" />
                            <span className={cn(
                                "text-[10px] font-bold uppercase tracking-widest",
                                isSessionComplete ? "text-emerald-600" : "text-indigo-600 animate-pulse"
                            )}>
                                {isSessionComplete ? "VALIDATION COMPLETE" : "INPUT SESSION ACTIVE"}
                            </span>
                        </div>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    {sessionForms.map((form) => (
                        <div
                            key={form.id}
                            className={cn(
                                "px-3 py-1.5 rounded-lg border text-[10px] font-bold uppercase transition-all flex items-center gap-2",
                                form.completed
                                    ? "bg-emerald-50 text-emerald-700 border-emerald-100"
                                    : "bg-slate-50 text-slate-400 border-slate-100"
                            )}
                        >
                            {form.completed ? <CheckCircle2 className="w-3 h-3" /> : <Clock className="w-3 h-3" />}
                            {form.type}
                        </div>
                    ))}
                </div>
            </div>

            {/* Diagnostic Form Grid - Per-Doctor Tracking */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {sessionForms.map((form) => {
                    const iconMap = { intake: ClipboardList, echo: Activity, rx: FileText };
                    const Icon = iconMap[form.id as keyof typeof iconMap];
                    return (
                        <VisitActionCard
                            key={form.id}
                            title={form.type}
                            description={
                                form.id === 'intake' ? "Comprehensive medical history & cardiovascular risk assessment." :
                                    form.id === 'echo' ? "Ultrasonic valve function & chamber analysis documentation." :
                                        "Clinical medication orders, dosing schedules & pharmacy guides."
                            }
                            icon={Icon}
                            doctor={form.doctor}
                            isCompleted={form.completed}
                            onClick={() => router.push(`/appointments/${params.id}/visit/${form.id === 'intake' ? 'clinical-assessment' : form.id === 'echo' ? 'treatment-plan' : 'prescription'}`)}
                        />
                    );
                })}
            </div>

            {/* History Timeline */}
            <div className="space-y-6 pt-6">
                <div className="flex items-center gap-3 border-b border-slate-200 pb-4">
                    <div className="p-2 bg-slate-900 rounded-xl text-white shadow-sm">
                        <History className="w-5 h-5" />
                    </div>
                    <h2 className="text-xl font-bold text-slate-800 tracking-tight">Historical Clinical Record</h2>
                </div>

                <div className="space-y-4">
                    {visits.map((visit) => (
                        <div key={visit.id} className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden group hover:border-indigo-200 transition-all">
                            <div className="flex flex-col lg:flex-row divide-y lg:divide-y-0 lg:divide-x border-slate-100">
                                {/* Details Sidebar */}
                                <div className="p-6 lg:w-[280px] bg-slate-50/30">
                                    <div className="flex items-center gap-3 mb-4">
                                        <div className="p-2 bg-white border border-slate-200 rounded-lg shadow-sm">
                                            <Calendar className="w-4 h-4 text-slate-600" />
                                        </div>
                                        <div>
                                            <p className="text-sm font-bold text-slate-900">{visit.date}</p>
                                            <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-widest">{visit.time || "Scheduled"}</p>
                                        </div>
                                    </div>
                                    <div className="space-y-3">
                                        <div>
                                            <label className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-1 block text-left">Clinical Motive</label>
                                            <p className="text-xs font-semibold text-slate-600 italic">"{visit.reason}"</p>
                                        </div>
                                        <div className="px-3 py-1 bg-white border border-slate-100 rounded-md w-max shadow-sm flex items-center gap-2">
                                            <div className="w-1.5 h-1.5 bg-indigo-500 rounded-full" />
                                            <span className="text-[9px] font-bold text-slate-500 uppercase tracking-wider">Validated Record</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Components Grid */}
                                <div className="p-6 flex-1">
                                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                                        {(visit.forms || []).map((form: any) => (
                                            <button
                                                key={form.type}
                                                onClick={() => {
                                                    const pathMap: any = {
                                                        "Cardiac Intake": "clinical-assessment",
                                                        "Echocardiogram": "treatment-plan",
                                                        "Prescription": "prescription"
                                                    };
                                                    router.push(`/appointments/${params.id}/visit/${pathMap[form.type]}`);
                                                }}
                                                className={cn(
                                                    "flex items-center gap-3 p-3 rounded-lg border transition-all text-left group/form",
                                                    form.completed
                                                        ? "bg-emerald-50/20 border-emerald-100 hover:border-emerald-200 hover:bg-emerald-50/40"
                                                        : "bg-slate-50 border-slate-100 hover:border-slate-200 hover:bg-white"
                                                )}
                                            >
                                                <div className={cn(
                                                    "w-8 h-8 rounded-lg flex items-center justify-center border transition-all",
                                                    form.completed ? "bg-white border-emerald-100 text-emerald-600" : "bg-white border-slate-200 text-slate-400"
                                                )}>
                                                    {form.completed ? <CheckCircle className="w-4 h-4" /> : <PenTool className="w-4 h-4" />}
                                                </div>
                                                <div className="flex flex-col min-w-0">
                                                    <span className="text-[10px] font-bold text-slate-700 truncate">{form.type}</span>
                                                    <span className="text-[8px] font-bold text-indigo-600/80 uppercase tracking-tighter truncate">
                                                        {form.doctor}
                                                    </span>
                                                </div>
                                            </button>
                                        ))}
                                    </div>
                                    <div className="mt-5 pt-4 border-t border-slate-50 flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <Stethoscope className="w-3 h-3 text-slate-300" />
                                            <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-widest leading-none">Registered by {visit.doctor}</span>
                                        </div>
                                        <span className="text-[9px] font-bold text-slate-200 uppercase tracking-widest leading-none">REF: {visit.id}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

function VisitActionCard({ title, description, icon: Icon, onClick, isCompleted, doctor }: any) {
    return (
        <button
            onClick={onClick}
            className={cn(
                "group p-6 rounded-xl border shadow-sm transition-all text-left flex flex-col h-full relative overflow-hidden",
                isCompleted
                    ? "bg-slate-50/50 border-emerald-100"
                    : "bg-white border-slate-200 hover:border-indigo-400 hover:shadow-md shadow-indigo-200/20"
            )}
        >
            {isCompleted && (
                <div className="absolute top-4 right-4">
                    <div className="bg-emerald-500 text-white p-1 rounded-full border border-white shadow-sm">
                        <CheckCircle2 className="w-3 h-3" />
                    </div>
                </div>
            )}

            <div className={cn(
                "w-10 h-10 rounded-lg flex items-center justify-center border transition-all mb-5",
                isCompleted
                    ? "bg-white border-emerald-100 text-emerald-600"
                    : "bg-slate-50 border-slate-100 text-slate-400 group-hover:bg-indigo-600 group-hover:text-white group-hover:border-indigo-600"
            )}>
                <Icon className="w-5 h-5 flex-shrink-0" />
            </div>

            <div className="space-y-1 flex-1">
                <div className="flex flex-col">
                    <span className="text-[9px] font-bold text-indigo-600 uppercase tracking-widest mb-0.5 leading-none">
                        {isCompleted ? "VALIDATED BY" : "ASSIGNED TO"}
                    </span>
                    <span className={cn(
                        "text-xs font-semibold truncate",
                        isCompleted ? "text-slate-900" : "text-slate-400"
                    )}>
                        {doctor || "Selecting Specialist..."}
                    </span>
                </div>
                <h3 className="text-base font-bold tracking-tight text-slate-900 mt-3">{title}</h3>
                <p className="text-[11px] font-medium leading-relaxed text-slate-500 line-clamp-2">{description}</p>
            </div>

            <div className={cn(
                "mt-6 flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest transition-colors",
                isCompleted ? "text-emerald-600" : "text-slate-400 group-hover:text-indigo-600"
            )}>
                {isCompleted ? "Review Record" : "Begin Documentation"}
                <ArrowRight className="w-3.5 h-3.5" />
            </div>
        </button>
    );
}
