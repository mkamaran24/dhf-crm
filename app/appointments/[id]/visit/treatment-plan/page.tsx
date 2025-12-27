"use client";

import React, { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
    ArrowLeft,
    Activity,
    Save,
    Clipboard,
    FileText,
    CheckCircle2,
    Calendar,
    Stethoscope
} from "lucide-react";
import { Button } from "@/src/shared/components/ui";
import { cn } from "@/src/shared/lib/utils";

export default function EchocardiogramReportPage() {
    const params = useParams();
    const router = useRouter();
    const [isSubmitting, setIsSubmitting] = useState(false);

    const [formData, setFormData] = useState({
        echoNo: "ECHO-2025-001",
        date: "2025-12-26",
        measurements: {
            lvidd: "48",
            lvids: "38",
            ivs: "11",
            pw: "11",
            lvef: "55",
            rightAtrium: "Normal",
            aorticRoot: "Normal",
            rvBase: "Normal",
            tapse: "Normal",
            pasp: "32",
            meanPap: "Normal"
        },
        findings: {
            lv: "Mild anteroseptal hypokinesia preserved LV systolic function",
            la: "Normal",
            ra: "Normal",
            rv: "Normal",
            mitralValve: "Mild MR",
            aorticValve: "Normal",
            tricuspidValve: "Mild TR PASP 32mmhg",
            pulmonaryValve: "Normal",
            pericardium: "Normal"
        },
        conclusion: "IHD, preserved LV systolic function",
        specialist: "Dr. Saud Sherwan",
        specialistTitle: "Interventional Cardiologist"
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        setTimeout(() => {
            setIsSubmitting(false);
            router.back();
        }, 800);
    };

    return (
        <div className="max-w-6xl mx-auto space-y-6 pb-20 mt-4 px-4 sm:px-0">
            {/* Professional Medical Report Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-slate-200">
                <div className="space-y-4">
                    <button
                        onClick={() => router.back()}
                        className="flex items-center gap-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest hover:text-slate-700 transition-colors"
                    >
                        <ArrowLeft className="w-3.5 h-3.5" /> Back to Patient Record
                    </button>
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-lg bg-slate-900 flex items-center justify-center text-white shadow-sm">
                            <Activity className="w-6 h-6" />
                        </div>
                        <div>
                            <h1 className="text-2xl font-semibold text-slate-900 tracking-tight">Echocardiography Report</h1>
                            <p className="text-sm text-slate-500 font-medium italic">Diagnostic Cardiac Imaging Services</p>
                        </div>
                    </div>
                </div>

                <div className="flex flex-wrap items-center gap-y-4 gap-x-10 bg-slate-50 p-4 px-6 rounded-xl border border-slate-200">
                    <div className="flex flex-col pr-6 md:border-r border-slate-200">
                        <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-0.5">Echo Number</span>
                        <span className="text-sm font-mono font-bold text-slate-700">{formData.echoNo}</span>
                    </div>
                    <div className="flex flex-col pr-6 md:border-r border-slate-200">
                        <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-0.5">Exam Date</span>
                        <span className="text-sm font-bold text-slate-700">{formData.date}</span>
                    </div>
                    <div className="flex flex-col pr-6 md:border-r border-slate-200">
                        <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-0.5">Patient Details</span>
                        <span className="text-sm font-bold text-slate-800">John Doe (63y • M)</span>
                    </div>
                    <div className="flex flex-col">
                        <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-0.5">Address</span>
                        <span className="text-sm font-medium text-slate-600 italic">Ankawa, Erbil, Iraq</span>
                    </div>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden flex flex-col lg:flex-row">

                    {/* Measurement Specifications Table */}
                    <div className="lg:w-[40%] bg-slate-50/50 p-8 border-b lg:border-b-0 lg:border-r border-slate-200">
                        <div className="flex items-center gap-2 mb-8">
                            <h2 className="text-sm font-bold text-slate-600 uppercase tracking-wider">Echocardiographic Measurements</h2>
                        </div>

                        <div className="space-y-8">
                            {/* Left Ventricle Metrics */}
                            <div className="space-y-4">
                                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest italic flex items-center gap-2">
                                    <span className="w-1 h-2.5 bg-slate-400 rounded-full" /> Left Ventricle Structure
                                </div>
                                <div className="grid grid-cols-2 gap-3">
                                    {[
                                        { key: 'lvidd', label: 'LVIDd (mm)' },
                                        { key: 'lvids', label: 'LVIDs (mm)' },
                                        { key: 'ivs', label: 'IVS (mm)' },
                                        { key: 'pw', label: 'PW (mm)' }
                                    ].map((m) => (
                                        <div key={m.key} className="bg-white p-3 rounded-lg border border-slate-200 shadow-sm">
                                            <label className="text-[9px] font-bold text-slate-500 uppercase block mb-1">{m.label}</label>
                                            <input
                                                className="w-full text-base font-bold text-slate-700 bg-transparent border-none p-0 focus:ring-0 tabular-nums"
                                                value={formData.measurements[m.key as keyof typeof formData.measurements]}
                                                onChange={(e) => setFormData({ ...formData, measurements: { ...formData.measurements, [m.key]: e.target.value } })}
                                            />
                                        </div>
                                    ))}
                                </div>

                                <div className="p-5 rounded-xl border border-blue-100 bg-blue-50/30 flex items-center justify-between">
                                    <div className="space-y-0.5">
                                        <span className="text-[10px] font-bold text-blue-600 uppercase tracking-widest">LV Ejection Fraction</span>
                                        <div className="flex items-baseline gap-1">
                                            <input
                                                className="w-12 text-3xl font-bold text-blue-900 bg-transparent border-none p-0 focus:ring-0 tabular-nums"
                                                value={formData.measurements.lvef}
                                                onChange={(e) => setFormData({ ...formData, measurements: { ...formData.measurements, lvef: e.target.value } })}
                                            />
                                            <span className="text-lg font-bold text-blue-900/50">%</span>
                                        </div>
                                    </div>
                                    <div className="p-2.5 bg-white rounded-lg border border-blue-100 shadow-sm">
                                        <Activity className="w-5 h-5 text-blue-600" />
                                    </div>
                                </div>
                            </div>

                            {/* Additional Parameters */}
                            <div className="space-y-4">
                                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest italic flex items-center gap-2">
                                    <span className="w-1 h-2.5 bg-slate-400 rounded-full" /> Hemodynamic Data
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    {[
                                        { key: 'rightAtrium', label: 'Right Atrium' },
                                        { key: 'aorticRoot', label: 'Aortic Root' },
                                        { key: 'rvBase', label: 'RV Base' },
                                        { key: 'tapse', label: 'TAPSE' },
                                        { key: 'pasp', label: 'PASP (mmHg)' },
                                        { key: 'meanPap', label: 'Mean PAP' }
                                    ].map((m) => (
                                        <div key={m.key} className="space-y-1">
                                            <label className="text-[9px] font-bold text-slate-500 uppercase ml-1">{m.label}</label>
                                            <input
                                                className="w-full h-8 px-3 rounded-lg border border-slate-200 bg-white text-xs font-bold text-slate-700"
                                                value={formData.measurements[m.key as keyof typeof formData.measurements]}
                                                onChange={(e) => setFormData({ ...formData, measurements: { ...formData.measurements, [m.key]: e.target.value } })}
                                            />
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Observational Findings Narrative */}
                    <div className="flex-1 p-8 space-y-8">
                        <div className="space-y-6">
                            <h2 className="text-sm font-bold text-slate-600 uppercase tracking-wider">Clinical Observations</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                                {[
                                    { key: 'lv', label: 'Left Ventricle' },
                                    { key: 'la', label: 'Left Atrium' },
                                    { key: 'ra', label: 'Right Atrium' },
                                    { key: 'rv', label: 'Right Ventricle' },
                                    { key: 'mitralValve', label: 'Mitral Valve' },
                                    { key: 'aorticValve', label: 'Aortic Valve' },
                                    { key: 'tricuspidValve', label: 'Tricuspid Valve' },
                                    { key: 'pulmonaryValve', label: 'Pulmonary Valve' },
                                    { key: 'pericardium', label: 'Pericardium' }
                                ].map((f) => (
                                    <div key={f.key} className="space-y-1">
                                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">{f.label}</label>
                                        <input
                                            value={formData.findings[f.key as keyof typeof formData.findings]}
                                            onChange={(e) => setFormData({
                                                ...formData,
                                                findings: { ...formData.findings, [f.key]: e.target.value }
                                            })}
                                            className="w-full h-10 px-4 rounded-lg bg-slate-50 border border-slate-200 text-sm font-medium text-slate-700 focus:bg-white focus:ring-2 focus:ring-blue-500/10 transition-all shadow-none"
                                            placeholder="..."
                                        />
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Final Synthesis */}
                        <div className="pt-8 border-t border-slate-200 space-y-4">
                            <h2 className="text-sm font-bold text-slate-600 uppercase tracking-wider italic">Diagnostic Conclusion</h2>
                            <textarea
                                className="w-full p-6 rounded-xl border border-slate-200 focus:ring-2 focus:ring-slate-900/5 focus:border-slate-900 transition-all font-semibold text-lg leading-relaxed text-slate-800 bg-slate-50/50 min-h-[120px]"
                                placeholder="Final diagnostic interpretation..."
                                value={formData.conclusion}
                                onChange={(e) => setFormData({ ...formData, conclusion: e.target.value })}
                            />
                        </div>

                        {/* Specialist Attribution */}
                        <div className="flex items-center gap-4 pt-8 px-2">
                            <div className="w-12 h-12 rounded-lg border border-slate-200 flex items-center justify-center bg-slate-50">
                                <Stethoscope className="w-6 h-6 text-slate-400" />
                            </div>
                            <div className="space-y-0.5">
                                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Medical Specialist</p>
                                <p className="text-lg font-bold text-slate-800">{formData.specialist}</p>
                                <p className="text-[10px] font-semibold text-slate-500 italic">{formData.specialistTitle}</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Report Actions */}
                <div className="flex items-center justify-end gap-3 pt-4">
                    <Button
                        type="button"
                        onClick={() => router.back()}
                        className="rounded-lg h-11 px-8 border-slate-300 bg-white text-slate-600 font-semibold"
                        variant="outlined"
                    >
                        Discard
                    </Button>
                    <Button
                        type="submit"
                        disabled={isSubmitting}
                        className="rounded-lg h-11 px-10 bg-slate-900 hover:bg-slate-800 text-white font-semibold transition-all shadow-sm"
                    >
                        <Save className="w-4 h-4 mr-2" />
                        Finalize Report
                    </Button>
                </div>
            </form>
        </div>
    );
}
