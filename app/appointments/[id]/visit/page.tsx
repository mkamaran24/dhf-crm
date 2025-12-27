"use client";

import React, { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
    ChevronLeft,
    Stethoscope,
    FileText,
    ClipboardList,
    History,
    Plus,
    Calendar,
    User,
    Activity,
    ArrowRight,
    Clock,
    CheckCircle,
    PenTool,
    ArrowLeft,
    Files
} from "lucide-react";
import { Button } from "@/src/shared/components/ui";
import { cn } from "@/src/shared/lib/utils";

// Mock data for demonstration
const VISIT_HISTORY = [
    {
        id: "VIS-9281",
        date: "Dec 12, 2023",
        time: "10:30 AM",
        primaryDoctor: "Dr. Ahmed Yasin",
        reason: "Cardiac Consultation",
        conductedBy: "Admin Sara",
        forms: [
            { type: "Cardiac Intake", completed: true, lastUpdate: "10:45 AM", doctor: "Dr. Ahmed Yasin" },
            { type: "Echocardiogram", completed: true, lastUpdate: "11:00 AM", doctor: "Dr. Saud Sherwan" },
            { type: "Prescription", completed: true, lastUpdate: "11:15 AM", doctor: "Dr. Ahmed Yasin" }
        ]
    },
    {
        id: "VIS-8542",
        date: "Nov 28, 2023",
        time: "02:15 PM",
        primaryDoctor: "Dr. Karwan Mustafa",
        reason: "Follow-up - Chest Pain",
        conductedBy: "Admin Ali",
        forms: [
            { type: "Cardiac Intake", completed: true, lastUpdate: "02:30 PM", doctor: "Dr. Karwan Mustafa" },
            { type: "Echocardiogram", completed: false, lastUpdate: "—", doctor: "Pending" },
            { type: "Prescription", completed: true, lastUpdate: "02:45 PM", doctor: "Dr. Karwan Mustafa" }
        ]
    }
];

export default function PatientVisitPage() {
    const params = useParams();
    const router = useRouter();
    const [visits, setVisits] = useState(VISIT_HISTORY);

    return (
        <div className="max-w-6xl mx-auto space-y-8 pb-20 mt-4 px-4 sm:px-0">
            {/* Professional Navigation Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-slate-200">
                <div className="flex items-center gap-5">
                    <button
                        onClick={() => router.back()}
                        className="p-2.5 hover:bg-slate-100 rounded-lg text-slate-400 hover:text-slate-600 transition-all border border-slate-200"
                    >
                        <ArrowLeft className="w-5 h-5" />
                    </button>
                    <div>
                        <div className="flex items-center gap-3">
                            <h1 className="text-2xl font-semibold text-slate-900 tracking-tight">Clinical Encounter</h1>
                            <div className="flex items-center gap-1.5 px-2 py-0.5 bg-blue-50 text-blue-700 rounded-md border border-blue-100">
                                <span className="w-1 h-1 bg-blue-600 rounded-full animate-pulse" />
                                <span className="text-[10px] font-bold uppercase tracking-wider">Live Session</span>
                            </div>
                        </div>
                        <p className="text-sm text-slate-500 font-medium mt-0.5">Manage patient intake and diagnostic documentation</p>
                    </div>
                </div>

                {/* Patient Information Bar - Clean and Professional */}
                <div className="bg-white px-6 py-4 rounded-xl border border-slate-200 shadow-sm flex flex-col sm:flex-row sm:items-center gap-x-8 gap-y-3">
                    <div className="flex flex-col min-w-[140px]">
                        <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-0.5">Patient Name</span>
                        <span className="text-sm font-bold text-slate-800">John Doe</span>
                    </div>
                    <div className="flex flex-col min-w-[100px]">
                        <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-0.5">Demographics</span>
                        <span className="text-sm font-semibold text-slate-600">63y • Male</span>
                    </div>
                    <div className="flex flex-col min-w-[160px]">
                        <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-0.5">Address</span>
                        <span className="text-sm font-medium text-slate-600 italic">Ankawa, Erbil, Iraq</span>
                    </div>
                    <div className="flex flex-col min-w-[80px]">
                        <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-0.5">Internal ID</span>
                        <span className="text-sm font-mono font-bold text-slate-500">{params.id || "APT-100"}</span>
                    </div>
                </div>
            </div>

            {/* Clinical Actions Grid - Subdued but efficient */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <VisitActionCard
                    title="Cardiac Intake"
                    description="Medical history, symptoms, and cardiovascular risk factors screening."
                    icon={ClipboardList}
                    theme="slate"
                    onClick={() => router.push(`/appointments/${params.id}/visit/clinical-assessment`)}
                />
                <VisitActionCard
                    title="Echocardiogram"
                    description="Ventricular measurements, chamber analysis, and clinical findings."
                    icon={Activity}
                    theme="blue"
                    onClick={() => router.push(`/appointments/${params.id}/visit/treatment-plan`)}
                />
                <VisitActionCard
                    title="Prescription"
                    description="Medication orders, dosage instructions, and clinical pharmacy notes."
                    icon={FileText}
                    theme="slate"
                    onClick={() => router.push(`/appointments/${params.id}/visit/prescription`)}
                />
            </div>

            {/* History Section - Sober & Refined */}
            <div className="space-y-6 pt-6">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-slate-900 text-white rounded-lg shadow-sm">
                        <History className="w-5 h-5" />
                    </div>
                    <h2 className="text-xl font-semibold text-slate-900 tracking-tight">Clinical Encounter History</h2>
                </div>

                <div className="space-y-4">
                    {visits.map((visit) => (
                        <div key={visit.id} className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden group hover:border-slate-300 transition-all">
                            <div className="flex flex-col lg:flex-row divide-y lg:divide-y-0 lg:divide-x border-slate-200">
                                {/* Visit Details Header */}
                                <div className="p-6 lg:w-[30%] bg-slate-50/50">
                                    <div className="flex items-center gap-3 mb-4">
                                        <div className="p-2.5 bg-white border border-slate-200 rounded-lg shadow-sm">
                                            <Calendar className="w-5 h-5 text-slate-600" />
                                        </div>
                                        <div>
                                            <p className="text-base font-bold text-slate-800">{visit.date}</p>
                                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{visit.time}</p>
                                        </div>
                                    </div>
                                    <div className="mb-4">
                                        <label className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-1 block">Primary Consultation</label>
                                        <p className="text-sm font-semibold text-slate-700 italic">"{visit.reason}"</p>
                                    </div>
                                    <div className="flex items-center gap-2 px-3 py-1.5 bg-white border border-slate-200 rounded-lg w-max shadow-sm">
                                        <div className="w-1.5 h-1.5 bg-blue-500 rounded-full" />
                                        <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Clinical Encounter</span>
                                    </div>
                                </div>

                                {/* Forms Breakdown */}
                                <div className="p-6 flex-1 bg-white">
                                    <div className="flex items-center gap-2 mb-4">
                                        <Files className="w-4 h-4 text-slate-400" />
                                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Encounter Documentation</span>
                                    </div>
                                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                                        {visit.forms.map((form) => (
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
                                                    "flex items-center gap-3 p-3 rounded-xl border transition-all text-left group/form",
                                                    form.completed
                                                        ? "bg-emerald-50/20 border-emerald-100 hover:border-emerald-200 hover:bg-emerald-50/40"
                                                        : "bg-slate-50 border-slate-100 hover:border-slate-200 hover:bg-white"
                                                )}
                                            >
                                                <div className={cn(
                                                    "w-8 h-8 rounded-lg flex items-center justify-center border transition-all group-hover/form:scale-110",
                                                    form.completed ? "bg-white border-emerald-100 text-emerald-600" : "bg-white border-slate-200 text-slate-400"
                                                )}>
                                                    {form.completed ? <CheckCircle className="w-4 h-4" /> : <PenTool className="w-4 h-4" />}
                                                </div>
                                                <div className="flex flex-col">
                                                    <span className="text-[10px] font-bold text-slate-700">{form.type}</span>
                                                    <span className="text-[9px] font-bold text-blue-600/80 uppercase">
                                                        {form.doctor}
                                                    </span>
                                                    <span className="text-[8px] font-semibold text-slate-400 italic">
                                                        {form.completed ? `Sync ${form.lastUpdate}` : "Awaiting entry"}
                                                    </span>
                                                </div>
                                            </button>
                                        ))}
                                    </div>

                                    <div className="mt-6 flex items-center justify-between pt-4 border-t border-slate-50">
                                        <span className="text-[9px] font-semibold text-slate-400 uppercase">Registered by {visit.conductedBy}</span>
                                        <div className="h-1 w-1 bg-slate-200 rounded-full" />
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

function VisitActionCard({ title, description, icon: Icon, theme, onClick }: any) {
    const isBlue = theme === 'blue';

    return (
        <button
            onClick={onClick}
            className={cn(
                "group p-8 rounded-xl border shadow-sm transition-all text-left flex flex-col items-start gap-4",
                isBlue
                    ? "bg-slate-900 border-slate-900 text-white hover:bg-slate-800"
                    : "bg-white border-slate-200 text-slate-800 hover:border-slate-300"
            )}
        >
            <div className={cn(
                "w-12 h-12 rounded-lg flex items-center justify-center border transition-all",
                isBlue ? "bg-slate-800 border-slate-700 text-blue-400" : "bg-slate-50 border-slate-100 text-slate-500"
            )}>
                <Icon className="w-6 h-6" />
            </div>

            <div className="space-y-2">
                <h3 className={cn("text-lg font-bold tracking-tight", isBlue ? "text-white" : "text-slate-900")}>{title}</h3>
                <p className={cn("text-xs font-medium leading-relaxed", isBlue ? "text-slate-400" : "text-slate-500")}>{description}</p>
            </div>

            <div className={cn(
                "mt-2 flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest",
                isBlue ? "text-blue-400" : "text-slate-400 group-hover:text-slate-900 transition-colors"
            )}>
                Initialize Entry <Plus className="w-3.5 h-3.5" />
            </div>
        </button>
    );
}
