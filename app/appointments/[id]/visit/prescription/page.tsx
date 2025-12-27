"use client";

import React from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";

export default function PrescriptionPage() {
    const router = useRouter();

    return (
        <div className="max-w-4xl mx-auto space-y-8 pb-20 mt-4 px-4 sm:px-0">
            <div className="flex items-center gap-5 pb-6 border-b border-slate-200">
                <button
                    onClick={() => router.back()}
                    className="p-2.5 hover:bg-slate-100 rounded-lg text-slate-400 hover:text-slate-600 transition-all border border-slate-200 bg-white"
                >
                    <ArrowLeft className="w-5 h-5" />
                </button>
                <div>
                    <h1 className="text-2xl font-semibold text-slate-900 tracking-tight">Prescription</h1>
                </div>
            </div>

            <div className="bg-white rounded-3xl border border-slate-100 py-40 flex flex-col items-center justify-center text-center">
                <p className="text-slate-400 font-medium tracking-wide uppercase text-[10px]">Under Development</p>
                <h2 className="text-lg font-semibold text-slate-700 mt-2 italic opacity-60">Module coming soon.</h2>
            </div>
        </div>
    );
}
