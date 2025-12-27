
"use client";

import { Suspense } from "react";
import { LeadSummaryCards } from "@/src/features/leads/components/progress/LeadSummaryCards";
import { LeadProgressList } from "@/src/features/leads/components/progress/LeadProgressList";

export default function LeadProgressPage() {
    return (
        <div className="space-y-8 p-6">
            <div className="flex flex-col gap-2">
                <h1 className="text-3xl font-black text-gray-900 tracking-tight">Lead Progress Tracker</h1>
                <p className="text-gray-500 font-medium">Monitor your sales pipeline and lead conversion journey.</p>
            </div>

            <Suspense fallback={<div className="h-32 bg-gray-50 animate-pulse rounded-2xl" />}>
                <LeadSummaryCards />
            </Suspense>

            <Suspense fallback={<div className="h-64 bg-gray-50 animate-pulse rounded-2xl" />}>
                <LeadProgressList />
            </Suspense>
        </div>
    );
}
