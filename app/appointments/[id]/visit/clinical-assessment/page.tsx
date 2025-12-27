"use client";

import React, { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
    ArrowLeft,
    Save,
    ClipboardList,
    History as CardiacHistory,
    Activity,
    ShieldAlert,
    Stethoscope,
    Check
} from "lucide-react";
import { Button, Input } from "@/src/shared/components/ui";
import { cn } from "@/src/shared/lib/utils";

export default function CardiacIntakePage() {
    const params = useParams();
    const router = useRouter();
    const [isSubmitting, setIsSubmitting] = useState(false);

    const [formData, setFormData] = useState({
        chiefComplaint: "",
        historyPresentingIllness: "",
        cardiacSymptoms: {
            chestPain: false,
            dyspnea: false,
            palpitations: false,
            dizziness: false,
            legSwelling: false,
            fatigue: false,
            orthopnea: false
        },
        riskFactors: {
            hypertension: false,
            diabetes: false,
            hba1c: "",
            dyslipidemia: false,
            smoking: false,
            obesity: false,
            familyHistoryIHD: false,
            alcoholic: false
        },
        pastMedicalHistory: "",
        pastSurgicalHistory: "",
        surgicalIndication: ""
    });

    const toggleSymptom = (key: keyof typeof formData.cardiacSymptoms) => {
        setFormData({
            ...formData,
            cardiacSymptoms: { ...formData.cardiacSymptoms, [key]: !formData.cardiacSymptoms[key] }
        });
    };

    const toggleRiskFactor = (key: string) => {
        if (key === 'hba1c') return;
        setFormData({
            ...formData,
            riskFactors: {
                ...formData.riskFactors,
                [key]: !formData.riskFactors[key as keyof typeof formData.riskFactors]
            }
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        setTimeout(() => {
            setIsSubmitting(false);
            router.back();
        }, 800);
    };

    return (
        <div className="max-w-5xl mx-auto space-y-6 pb-20 mt-4 px-4 sm:px-0">
            {/* Elegant Hospital Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-slate-200">
                <div className="flex items-center gap-4">
                    <button
                        onClick={() => router.back()}
                        className="p-2 hover:bg-slate-100 rounded-lg text-slate-500 transition-colors"
                    >
                        <ArrowLeft className="w-5 h-5" />
                    </button>
                    <div>
                        <h1 className="text-2xl font-semibold text-slate-900 tracking-tight">Cardiac Intake Form</h1>
                        <p className="text-sm text-slate-500 font-medium">Internal Patient Medical Record</p>
                    </div>
                </div>

                <div className="flex flex-wrap items-center gap-y-4 gap-x-12">
                    <div className="flex flex-col">
                        <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-0.5">Patient Name</span>
                        <span className="text-sm font-bold text-slate-800">John Doe</span>
                    </div>
                    <div className="flex flex-col">
                        <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-0.5">Case ID</span>
                        <span className="text-sm font-mono font-bold text-slate-500">{params.id || "APT-100"}</span>
                    </div>
                    <div className="flex flex-col">
                        <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-0.5">Age / Gender</span>
                        <span className="text-sm font-semibold text-slate-600">63y • Male</span>
                    </div>
                    <div className="flex flex-col">
                        <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-0.5">Address</span>
                        <span className="text-sm font-medium text-slate-600 italic">Ankawa, Erbil, Iraq</span>
                    </div>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-8">
                {/* Section 1: Clinical Narrative */}
                <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                    <div className="bg-slate-50/50 px-6 py-3 border-b border-slate-200">
                        <h2 className="text-sm font-bold text-slate-600 uppercase tracking-wider flex items-center gap-2">
                            <ClipboardList className="w-4 h-4" /> Clinical Narrative
                        </h2>
                    </div>
                    <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="space-y-2">
                            <label className="text-xs font-semibold text-slate-600 ml-1">Chief Complaint & Duration</label>
                            <textarea
                                className="w-full p-4 rounded-lg border border-slate-200 focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500 transition-all min-h-[100px] text-sm text-slate-700 bg-white placeholder:text-slate-300"
                                placeholder="..."
                                value={formData.chiefComplaint}
                                onChange={(e) => setFormData({ ...formData, chiefComplaint: e.target.value })}
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-semibold text-slate-600 ml-1">History of Presenting Illness</label>
                            <textarea
                                className="w-full p-4 rounded-lg border border-slate-200 focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500 transition-all min-h-[100px] text-sm text-slate-700 bg-white placeholder:text-slate-300"
                                placeholder="..."
                                value={formData.historyPresentingIllness}
                                onChange={(e) => setFormData({ ...formData, historyPresentingIllness: e.target.value })}
                            />
                        </div>
                    </div>
                </div>

                {/* Section 2: Clinical Screening */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Cardiac Symptoms */}
                    <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                        <div className="bg-slate-50/50 px-6 py-3 border-b border-slate-200">
                            <h2 className="text-sm font-bold text-slate-600 uppercase tracking-wider flex items-center gap-2">
                                <Activity className="w-4 h-4" /> Cardiac Symptoms
                            </h2>
                        </div>
                        <div className="p-6 grid grid-cols-1 gap-1">
                            {[
                                { key: 'chestPain', label: 'Chest pain' },
                                { key: 'dyspnea', label: 'Dyspnea' },
                                { key: 'palpitations', label: 'Palpitations' },
                                { key: 'dizziness', label: 'Dizziness / Syncope' },
                                { key: 'legSwelling', label: 'Leg swelling' },
                                { key: 'fatigue', label: 'Fatigue' },
                                { key: 'orthopnea', label: 'Orthopnea / PND' }
                            ].map((item) => (
                                <button
                                    key={item.key}
                                    type="button"
                                    onClick={() => toggleSymptom(item.key as any)}
                                    className={cn(
                                        "flex items-center justify-between p-3 rounded-lg border border-transparent hover:bg-slate-50 transition-colors text-left",
                                        formData.cardiacSymptoms[item.key as keyof typeof formData.cardiacSymptoms] && "bg-blue-50/50"
                                    )}
                                >
                                    <span className={cn("text-sm font-medium", formData.cardiacSymptoms[item.key as keyof typeof formData.cardiacSymptoms] ? "text-blue-700" : "text-slate-600")}>
                                        {item.label}
                                    </span>
                                    <div className={cn(
                                        "w-5 h-5 rounded border transition-colors flex items-center justify-center",
                                        formData.cardiacSymptoms[item.key as keyof typeof formData.cardiacSymptoms]
                                            ? "bg-blue-600 border-blue-600 text-white"
                                            : "border-slate-300 bg-white"
                                    )}>
                                        {formData.cardiacSymptoms[item.key as keyof typeof formData.cardiacSymptoms] && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                                    </div>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Risk Factors */}
                    <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                        <div className="bg-slate-50/50 px-6 py-3 border-b border-slate-200">
                            <h2 className="text-sm font-bold text-slate-600 uppercase tracking-wider flex items-center gap-2">
                                <ShieldAlert className="w-4 h-4" /> Risk Factors
                            </h2>
                        </div>
                        <div className="p-6 grid grid-cols-1 gap-1">
                            {[
                                { key: 'hypertension', label: 'Hypertension' },
                                { key: 'diabetes', label: 'Diabetes' },
                                { key: 'dyslipidemia', label: 'Dyslipidemia' },
                                { key: 'smoking', label: 'Smoking Status' },
                                { key: 'obesity', label: 'Obesity' },
                                { key: 'familyHistoryIHD', label: 'Family History of IHD' },
                                { key: 'alcoholic', label: 'Alcoholic' }
                            ].map((item) => (
                                <div key={item.key} className="space-y-2">
                                    <button
                                        type="button"
                                        onClick={() => toggleRiskFactor(item.key as any)}
                                        className={cn(
                                            "w-full flex items-center justify-between p-3 rounded-lg border border-transparent hover:bg-slate-50 transition-colors text-left",
                                            formData.riskFactors[item.key as keyof typeof formData.riskFactors] && "bg-slate-50"
                                        )}
                                    >
                                        <span className={cn("text-sm font-medium", formData.riskFactors[item.key as keyof typeof formData.riskFactors] ? "text-slate-900" : "text-slate-600")}>
                                            {item.label}
                                        </span>
                                        <div className={cn(
                                            "w-9 h-5 rounded-full transition-colors relative border",
                                            formData.riskFactors[item.key as keyof typeof formData.riskFactors]
                                                ? "bg-blue-600 border-blue-600"
                                                : "bg-slate-200 border-slate-300 shadow-inner"
                                        )}>
                                            <div className={cn(
                                                "absolute top-0.5 w-3.5 h-3.5 rounded-full bg-white shadow transition-transform",
                                                formData.riskFactors[item.key as keyof typeof formData.riskFactors] ? "translate-x-4.5" : "translate-x-0.5"
                                            )} />
                                        </div>
                                    </button>
                                    {item.key === 'diabetes' && formData.riskFactors.diabetes && (
                                        <div className="px-3 pb-2 animate-in slide-in-from-top-1 duration-200">
                                            <div className="flex items-center gap-4 bg-slate-50 p-3 rounded-lg border border-slate-200">
                                                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">HBA1C Value (%)</span>
                                                <input
                                                    className="w-20 h-8 px-2 rounded border border-slate-300 text-xs font-bold text-center focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500"
                                                    value={formData.riskFactors.hba1c}
                                                    onChange={(e) => setFormData({
                                                        ...formData,
                                                        riskFactors: { ...formData.riskFactors, hba1c: e.target.value }
                                                    })}
                                                />
                                            </div>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Section 3: History & Indications */}
                <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                    <div className="bg-slate-50/50 px-6 py-3 border-b border-slate-200">
                        <h2 className="text-sm font-bold text-slate-600 uppercase tracking-wider flex items-center gap-2">
                            <Stethoscope className="w-4 h-4" /> Medical History & Indications
                        </h2>
                    </div>
                    <div className="p-8 space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="space-y-2">
                                <label className="text-xs font-semibold text-slate-600 ml-1">Past Medical History</label>
                                <textarea
                                    className="w-full p-4 rounded-lg border border-slate-200 focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500 transition-all min-h-[80px] text-sm text-slate-700"
                                    placeholder="Medical history summary..."
                                    value={formData.pastMedicalHistory}
                                    onChange={(e) => setFormData({ ...formData, pastMedicalHistory: e.target.value })}
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-semibold text-slate-600 ml-1">Past Surgical History</label>
                                <textarea
                                    className="w-full p-4 rounded-lg border border-slate-200 focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500 transition-all min-h-[80px] text-sm text-slate-700"
                                    placeholder="Surgical history summary..."
                                    value={formData.pastSurgicalHistory}
                                    onChange={(e) => setFormData({ ...formData, pastSurgicalHistory: e.target.value })}
                                />
                            </div>
                        </div>
                        <div className="space-y-2 pt-2">
                            <label className="text-xs font-semibold text-slate-600 ml-1">Surgical Indication</label>
                            <input
                                className="w-full h-12 px-4 rounded-lg border border-slate-200 focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500 transition-all text-sm font-medium"
                                placeholder="..."
                                value={formData.surgicalIndication}
                                onChange={(e) => setFormData({ ...formData, surgicalIndication: e.target.value })}
                            />
                        </div>
                    </div>
                </div>

                {/* Footer Actions */}
                <div className="flex items-center justify-end gap-3 pt-4">
                    <Button
                        type="button"
                        variant="outlined"
                        onClick={() => router.back()}
                        className="rounded-lg h-11 px-6 border-slate-300 text-slate-600 font-semibold"
                    >
                        Discard
                    </Button>
                    <Button
                        type="submit"
                        isLoading={isSubmitting}
                        className="rounded-lg h-11 px-10 bg-slate-900 hover:bg-slate-800 text-white font-semibold transition-all shadow-sm"
                    >
                        <Save className="w-4 h-4 mr-2" />
                        Save Record
                    </Button>
                </div>
            </form>
        </div>
    );
}
