"use client";

import React, { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
    ArrowLeft,
    Plus,
    X,
    ChevronDown,
    Activity,
    ClipboardList,
    FileText,
    Stethoscope,
    Save,
    Trash2,
    Calendar,
    User
} from "lucide-react";
import { Button } from "@/src/shared/components/ui";
import { cn } from "@/src/shared/lib/utils";

export default function EchocardiogramReportPage() {
    const params = useParams();
    const router = useRouter();
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Default specialized data structure for speed entry
    const [patientInfo, setPatientInfo] = useState({
        name: "Muslih Hamad",
        age: "63",
        sex: "Male",
        id: "001234567",
        date: new Date().toISOString().split('T')[0],
        rhythm: "Sinus rhythm",
        echoNo: "E-2025-082"
    });

    const [measurements, setMeasurements] = useState([
        { name: "LV size", value: "Normal" },
        { name: "LVIDd", value: "48 mm" },
        { name: "IVS", value: "11 mm" },
        { name: "EF", value: "55-60%" },
        { name: "PASP", value: "32 mmHg" },
        { name: "LA size", value: "38 mm" }
    ]);

    const [findings, setFindings] = useState([
        { name: "LV", value: "Preserved function" },
        { name: "Walls", value: "Normal motion" },
        { name: "Valves", value: "No MR/TR" },
        { name: "IVC", value: "Normal, collapsible" }
    ]);

    const [summary, setSummary] = useState("");

    const updateMeasurement = (idx: number, field: 'name' | 'value', val: string) => {
        const newM = [...measurements];
        newM[idx][field] = val;
        setMeasurements(newM);
    };

    const updateFinding = (idx: number, field: 'name' | 'value', val: string) => {
        const newF = [...findings];
        newF[idx][field] = val;
        setFindings(newF);
    };

    const addMeasurement = () => setMeasurements([...measurements, { name: "", value: "" }]);
    const removeMeasurement = (idx: number) => setMeasurements(measurements.filter((_, i) => i !== idx));

    const addFinding = () => setFindings([...findings, { name: "", value: "" }]);
    const removeFinding = (idx: number) => setFindings(findings.filter((_, i) => i !== idx));

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        setTimeout(() => {
            setIsSubmitting(false);
            router.back();
        }, 800);
    };

    return (
        <div className="max-w-5xl mx-auto space-y-5 pb-20 mt-4 px-4 sm:px-0 font-sans">
            {/* Elegant Hospital Header (Aligned with Cardiac Intake) */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-5 border-b border-slate-200">
                <div className="flex items-center gap-4">
                    <button
                        onClick={() => router.back()}
                        className="p-2 hover:bg-slate-100 rounded-lg text-slate-500 transition-all active:scale-95"
                    >
                        <ArrowLeft className="w-5 h-5" />
                    </button>
                    <div>
                        <h1 className="text-xl font-bold text-slate-900 tracking-tight">Echocardiography Report</h1>
                        <div className="flex items-center gap-2 mt-0.5">
                            <span className="text-[10px] bg-blue-50 text-blue-600 px-1.5 py-0.5 rounded font-bold uppercase border border-blue-100">Echo#{patientInfo.echoNo}</span>
                            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Internal Cardiac Record</span>
                        </div>
                    </div>
                </div>

                <div className="flex flex-wrap items-center gap-y-3 gap-x-10">
                    <div className="flex flex-col">
                        <span className="text-[8px] font-black text-slate-400 uppercase tracking-[0.2em] mb-0.5">Patient Details</span>
                        <div className="flex items-center gap-1.5 font-bold text-slate-800 text-xs">
                            <User className="w-3 h-3 text-slate-400" />
                            {patientInfo.name} • {patientInfo.age}y • {patientInfo.sex}
                        </div>
                    </div>
                    <div className="flex flex-col">
                        <span className="text-[8px] font-black text-slate-400 uppercase tracking-[0.2em] mb-0.5">Study Date</span>
                        <div className="flex items-center gap-1.5 font-bold text-slate-800 text-xs">
                            <Calendar className="w-3 h-3 text-slate-400" />
                            {patientInfo.date}
                        </div>
                    </div>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">

                {/* 1. Study Parameters - Compact Grid */}
                <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden text-left">
                    <div className="bg-slate-50/50 px-5 py-2.5 border-b border-slate-200 flex items-center justify-between">
                        <h2 className="text-[11px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-2">
                            <ClipboardList className="w-3.5 h-3.5 text-blue-600" /> Patient Info & Rhythm
                        </h2>
                    </div>
                    <div className="p-5 grid grid-cols-1 md:grid-cols-4 gap-5">
                        <div className="space-y-1">
                            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Echo Number</label>
                            <input
                                className="w-full h-9 px-3 rounded-lg border border-slate-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/5 transition-all text-xs font-semibold bg-slate-50/50"
                                value={patientInfo.echoNo}
                                onChange={(e) => setPatientInfo({ ...patientInfo, echoNo: e.target.value })}
                            />
                        </div>
                        <div className="space-y-1">
                            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Heart Rhythm</label>
                            <div className="relative">
                                <select
                                    className="w-full h-9 pl-3 pr-8 rounded-lg border border-slate-200 focus:border-blue-500 appearance-none bg-white font-semibold text-xs cursor-pointer"
                                    value={patientInfo.rhythm}
                                    onChange={(e) => setPatientInfo({ ...patientInfo, rhythm: e.target.value })}
                                >
                                    <option>Sinus rhythm</option>
                                    <option>AFib</option>
                                    <option>Atrial flutter</option>
                                    <option>SVT</option>
                                </select>
                                <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3 h-3 text-slate-400 pointer-events-none" />
                            </div>
                        </div>
                        <div className="space-y-1">
                            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Patient ID</label>
                            <input
                                className="w-full h-9 px-3 rounded-lg border border-slate-200 focus:border-blue-500 text-xs font-mono font-bold"
                                value={patientInfo.id}
                                onChange={(e) => setPatientInfo({ ...patientInfo, id: e.target.value })}
                            />
                        </div>
                        <div className="space-y-1">
                            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Study Date</label>
                            <input
                                type="date"
                                className="w-full h-9 px-3 rounded-lg border border-slate-200 focus:border-blue-500 text-xs font-semibold"
                                value={patientInfo.date}
                                onChange={(e) => setPatientInfo({ ...patientInfo, date: e.target.value })}
                            />
                        </div>
                    </div>
                </div>

                {/* 2 & 3: Double-Column Speed Data Entry */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

                    {/* Measurement Panel */}
                    <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden text-left flex flex-col">
                        <div className="bg-slate-50/50 px-5 py-2.5 border-b border-slate-200 flex items-center justify-between">
                            <h2 className="text-[11px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-2">
                                <Activity className="w-3.5 h-3.5 text-blue-600" /> Measurements
                            </h2>
                            <button
                                type="button"
                                onClick={addMeasurement}
                                className="text-[9px] font-black text-blue-600 hover:text-blue-700 uppercase tracking-wider bg-blue-50 px-2 py-1 rounded-md transition-colors"
                            >
                                + Add Field
                            </button>
                        </div>
                        <div className="divide-y divide-slate-100 flex-1">
                            {measurements.map((m, idx) => (
                                <div key={idx} className="group flex items-center gap-3 px-5 py-2 hover:bg-slate-50/50 transition-colors">
                                    <input
                                        className="flex-[0.8] bg-transparent border-none focus:ring-0 text-xs font-bold text-slate-600 p-1 rounded hover:bg-slate-100/50"
                                        placeholder="Parameter"
                                        value={m.name}
                                        onChange={(e) => updateMeasurement(idx, 'name', e.target.value)}
                                    />
                                    <div className="w-px h-4 bg-slate-200" />
                                    <input
                                        className="flex-1 bg-transparent border-none focus:ring-0 text-xs font-semibold text-blue-700 p-1 rounded hover:bg-slate-100/50 text-right"
                                        placeholder="Result"
                                        value={m.value}
                                        onChange={(e) => updateMeasurement(idx, 'value', e.target.value)}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => removeMeasurement(idx)}
                                        className="p-1.5 text-slate-300 hover:text-rose-500 transition-colors opacity-0 group-hover:opacity-100"
                                    >
                                        <X className="w-3 h-3" />
                                    </button>
                                </div>
                            ))}
                        </div>
                        <div className="p-3 bg-slate-50/30 border-t border-slate-100">
                            <p className="text-[9px] text-slate-400 font-medium italic">* Click parameters/results to edit directly</p>
                        </div>
                    </div>

                    {/* Findings Panel */}
                    <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden text-left flex flex-col">
                        <div className="bg-slate-50/50 px-5 py-2.5 border-b border-slate-200 flex items-center justify-between">
                            <h2 className="text-[11px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-2">
                                <FileText className="w-3.5 h-3.5 text-blue-600" /> Findings
                            </h2>
                            <button
                                type="button"
                                onClick={addFinding}
                                className="text-[9px] font-black text-blue-600 hover:text-blue-700 uppercase tracking-wider bg-blue-50 px-2 py-1 rounded-md transition-colors"
                            >
                                + Add Observation
                            </button>
                        </div>
                        <div className="divide-y divide-slate-100 flex-1">
                            {findings.map((f, idx) => (
                                <div key={idx} className="group flex flex-col gap-1 px-5 py-2.5 hover:bg-slate-50/50 transition-colors relative">
                                    <div className="flex items-center justify-between">
                                        <input
                                            className="bg-transparent border-none focus:ring-0 text-[10px] font-black text-slate-400 uppercase tracking-wider p-0 w-full"
                                            placeholder="Observed Segment"
                                            value={f.name}
                                            onChange={(e) => updateFinding(idx, 'name', e.target.value)}
                                        />
                                        <button
                                            type="button"
                                            onClick={() => removeFinding(idx)}
                                            className="absolute right-2 top-2 p-1 text-slate-200 hover:text-rose-500 transition-colors opacity-0 group-hover:opacity-100"
                                        >
                                            <Trash2 className="w-3 h-3" />
                                        </button>
                                    </div>
                                    <input
                                        className="bg-transparent border-none focus:ring-0 text-xs font-semibold text-slate-700 p-0 w-full"
                                        placeholder="Detailed result..."
                                        value={f.value}
                                        onChange={(e) => updateFinding(idx, 'value', e.target.value)}
                                    />
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* 4. Interpretation / Summary */}
                <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden text-left">
                    <div className="bg-slate-50/50 px-5 py-2.5 border-b border-slate-200">
                        <h2 className="text-[11px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-2">
                            <Stethoscope className="w-3.5 h-3.5 text-blue-600" /> Clinical Diagnosis & Conclusion
                        </h2>
                    </div>
                    <div className="p-5">
                        <textarea
                            className="w-full min-h-[90px] border border-slate-200 rounded-lg p-4 text-xs font-medium outline-none focus:ring-4 focus:ring-blue-500/5 focus:border-blue-500 placeholder:text-slate-300 text-slate-700 bg-slate-50/20 transition-all resize-none"
                            placeholder="Provide diagnostic synthesis..."
                            value={summary}
                            onChange={(e) => setSummary(e.target.value)}
                        />
                    </div>
                </div>

                {/* 5. Specialist Details (Simplified per latest request) */}
                <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden text-left p-8">
                    <div className="flex flex-col md:flex-row justify-between items-center gap-6">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center border border-blue-100">
                                <Stethoscope className="w-6 h-6 text-blue-600" />
                            </div>
                            <div>
                                <h3 className="text-lg font-bold text-slate-900 leading-tight">Dr. Hussein Ali Samin</h3>
                                <p className="text-[10px] text-slate-500 font-bold uppercase tracking-[0.15em] mt-0.5">MBChB, FKBMS (Cardiology)</p>
                            </div>
                        </div>

                        <div className="bg-slate-50 rounded-lg px-6 py-3 border border-slate-100 text-center md:text-right">
                            <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest block mb-1">Authorization Date</span>
                            <span className="text-sm font-bold text-slate-700">{patientInfo.date}</span>
                        </div>
                    </div>
                </div>

                {/* Footer Controls */}
                <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
                    <Button
                        type="button"
                        variant="outlined"
                        onClick={() => router.back()}
                        className="rounded-lg h-10 px-6 border-slate-200 text-slate-500 text-xs font-bold hover:bg-slate-50"
                    >
                        Discard
                    </Button>
                    <Button
                        type="submit"
                        disabled={isSubmitting}
                        className="rounded-lg h-10 px-10 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold shadow-sm transition-all active:scale-95 flex items-center gap-2"
                    >
                        {isSubmitting ? (
                            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        ) : (
                            <>
                                <Save className="w-4 h-4" />
                                Finalize Record
                            </>
                        )}
                    </Button>
                </div>
            </form>
        </div>
    );
}
