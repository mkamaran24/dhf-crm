
"use client";

import React, { Suspense } from "react";
import { LeadProgressList } from "@/src/features/leads/components/progress/LeadProgressList";
import { LeadSummaryCards } from "@/src/features/leads/components/progress/LeadSummaryCards";

function LeadProgressContent() {
    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800">Lead Progress Tracker</h1>
                    <p className="text-sm text-gray-500 mt-1">Monitor lead journey and stage conversions</p>
                </div>
            </div>

            <LeadSummaryCards />

            <LeadProgressList />
        </div>
    );
}

export default function LeadProgressPage() {
    return (
        <Suspense fallback={<div className="p-8 text-center text-gray-500">Loading...</div>}>
            <LeadProgressContent />
        </Suspense>
    );
}
