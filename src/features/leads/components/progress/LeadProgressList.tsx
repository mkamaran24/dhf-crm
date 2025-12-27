
"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import {
    mockLeadsProgress,
    STAGES,
    LeadProgress
} from "../../data/mock-progress-data";
import { LeadProgressBar } from "./LeadProgressBar";
import {
    Search,
    Filter,
    ArrowUpDown,
    MoreHorizontal,
    User,
    Calendar,
    Map,
    History as HistoryIcon,
    Clock
} from "lucide-react";
import { cn } from "@/src/shared/lib/utils";
import { Badge, Pagination } from "@/src/shared/components/ui";

type SortField = "name" | "currentStage" | "lastUpdated";
type SortOrder = "asc" | "desc";

export function LeadProgressList() {
    const [searchQuery, setSearchQuery] = useState("");
    const [statusFilter, setStatusFilter] = useState<"all" | "active" | "lost">("all");
    const [stageFilter, setStageFilter] = useState<string>("all");
    const [sortField, setSortField] = useState<SortField>("lastUpdated");
    const [sortOrder, setSortOrder] = useState<SortOrder>("desc");
    const [page, setPage] = useState(1);
    const pageSize = 5;

    // Filter and Sort Logic
    const filteredAndSortedLeads = useMemo(() => {
        let result = [...mockLeadsProgress];

        // Search
        if (searchQuery) {
            const lowerQuery = searchQuery.toLowerCase();
            result = result.filter(lead =>
                lead.name.toLowerCase().includes(lowerQuery) ||
                lead.leadId.toLowerCase().includes(lowerQuery)
            );
        }

        // Status Filter
        if (statusFilter !== "all") {
            result = result.filter(lead =>
                statusFilter === "lost" ? lead.lost : !lead.lost
            );
        }

        // Stage Filter
        if (stageFilter !== "all") {
            result = result.filter(lead => lead.currentStage === stageFilter);
        }

        // Sort
        result.sort((a, b) => {
            let valA: string | number = a[sortField] || "";
            let valB: string | number = b[sortField] || "";

            if (sortField === "lastUpdated") {
                valA = new Date(valA as string).getTime();
                valB = new Date(valB as string).getTime();
            }

            if (valA < valB) return sortOrder === "asc" ? -1 : 1;
            if (valA > valB) return sortOrder === "asc" ? 1 : -1;
            return 0;
        });

        return result;
    }, [searchQuery, statusFilter, stageFilter, sortField, sortOrder]);

    const paginatedLeads = useMemo(() => {
        const start = (page - 1) * pageSize;
        return filteredAndSortedLeads.slice(start, start + pageSize);
    }, [filteredAndSortedLeads, page]);

    const totalPages = Math.ceil(filteredAndSortedLeads.length / pageSize);

    const handleSort = (field: SortField) => {
        if (sortField === field) {
            setSortOrder(sortOrder === "asc" ? "desc" : "asc");
        } else {
            setSortField(field);
            setSortOrder("desc"); // Default to desc for new field
        }
    };

    return (
        <div className="space-y-6">
            {/* Controls */}
            <div className="flex flex-col md:flex-row gap-4 justify-between items-center bg-white p-4 rounded-xl border border-slate-100 shadow-sm">

                {/* Search */}
                <div className="relative w-full md:w-64">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                    <input
                        type="text"
                        placeholder="Search leads..."
                        className="w-full pl-9 pr-4 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-slate-700 placeholder:text-slate-400 font-medium"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>

                {/* Filters */}
                <div className="flex items-center gap-3 w-full md:w-auto overflow-x-auto pb-2 md:pb-0">
                    <select
                        className="px-3 py-2 text-sm border border-slate-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 text-slate-700 font-semibold"
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value as any)}
                    >
                        <option value="all">All Status</option>
                        <option value="active">Active</option>
                        <option value="lost">Lost</option>
                    </select>

                    <select
                        className="px-3 py-2 text-sm border border-slate-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 text-slate-700 font-semibold"
                        value={stageFilter}
                        onChange={(e) => setStageFilter(e.target.value)}
                    >
                        <option value="all">All Stages</option>
                        {STAGES.map((stage: { id: string, label: string }) => (
                            <option key={stage.id} value={stage.label}>{stage.label}</option>
                        ))}
                    </select>
                </div>
            </div>


            {/* List */}
            <div className="space-y-4">
                {/* Header (Desktop Only) */}
                <div className="hidden md:grid grid-cols-12 gap-6 px-6 py-3 text-[11px] font-bold text-slate-400 uppercase tracking-widest">
                    <div
                        className="col-span-3 flex items-center gap-2 cursor-pointer hover:text-slate-600 transition-colors"
                        onClick={() => handleSort("name")}
                    >
                        Lead & Activity
                        <ArrowUpDown className="w-3 h-3" />
                    </div>
                    <div className="col-span-7 px-4">Pipeline Audit Timeline</div>
                    <div className="col-span-2 text-right pr-4">Actions</div>
                </div>

                {/* Rows as Cards */}
                {paginatedLeads.length > 0 ? (
                    paginatedLeads.map((lead) => {
                        const lastAction = lead.history?.[lead.history.length - 1];
                        return (
                            <div
                                key={lead.id}
                                className="bg-white rounded-3xl border border-slate-100 shadow-sm hover:shadow-lg hover:border-blue-200 transition-all duration-300 group overflow-hidden"
                            >
                                <div className="grid grid-cols-1 md:grid-cols-12 gap-4 md:gap-6 p-6 items-center">
                                    {/* Lead Info Section */}
                                    <div className="md:col-span-3 flex flex-col gap-2">
                                        <div className="flex items-center gap-2 flex-wrap">
                                            <h3 className="font-bold text-slate-800 group-hover:text-blue-600 transition-colors text-lg tracking-tight">
                                                {lead.name}
                                            </h3>
                                            {lead.currentStage === "Converted" && (
                                                <div className="flex items-center gap-1 bg-emerald-50 text-emerald-600 px-2 py-0.5 rounded-lg text-[10px] font-bold border border-emerald-100 uppercase tracking-tighter">
                                                    <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
                                                    Patient
                                                </div>
                                            )}
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <span className="text-xs font-mono font-semibold text-slate-400 bg-slate-50 px-2 py-0.5 rounded-md border border-slate-100">
                                                {lead.leadId}
                                            </span>
                                            {lead.currentStage === "Converted" && (
                                                <button className="text-[10px] font-bold text-blue-500 hover:text-blue-700 underline underline-offset-2 uppercase tracking-tighter">
                                                    View Profile
                                                </button>
                                            )}
                                        </div>

                                        {/* Most Recent Audit Info */}
                                        {lastAction && (
                                            <div className="flex items-center gap-2 mt-2 p-2 bg-slate-50/80 rounded-xl border border-slate-100/50">
                                                <div className="w-7 h-7 rounded-full bg-white flex items-center justify-center text-blue-600 font-bold border border-blue-100 shadow-sm text-xs">
                                                    {lastAction.completedBy?.[lastAction.completedBy.indexOf(' ') + 1] || lastAction.completedBy[0]}
                                                </div>
                                                <div className="flex flex-col gap-0.5 min-w-0">
                                                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none">Last Touch</span>
                                                    <span className="text-[11px] font-semibold text-slate-700 truncate">
                                                        {lastAction.completedBy}
                                                        <span className="text-slate-400 font-medium ml-1">handled {lastAction.stage}</span>
                                                    </span>
                                                </div>
                                            </div>
                                        )}
                                    </div>

                                    {/* Progress Bar Section */}
                                    <div className="md:col-span-7 bg-slate-50/30 rounded-2xl px-5 py-4 border border-slate-50 shadow-inner">
                                        <LeadProgressBar
                                            stages={lead.stages}
                                            currentStage={lead.currentStage}
                                            lost={lead.lost}
                                            lostReason={lead.lostReason}
                                            history={lead.history}
                                        />
                                    </div>

                                    {/* Actions Section */}
                                    <div className="md:col-span-2 flex items-center justify-end gap-2 pr-2">
                                        {["Contacted", "Follow-up", "Ready", "Appointment Booked"].includes(lead.currentStage) && (
                                            <Link href="/appointments/create">
                                                <button
                                                    className="p-3 text-blue-500 hover:text-blue-700 hover:bg-blue-50 rounded-2xl transition-all shadow-sm bg-white border border-slate-100 active:scale-95"
                                                    title="Quick Book Appointment"
                                                >
                                                    <Calendar className="w-5 h-5" />
                                                </button>
                                            </Link>
                                        )}
                                        <Link href={`/leads/progress/${lead.leadId}`}>
                                            <button
                                                className="p-3 text-emerald-500 hover:text-emerald-700 hover:bg-emerald-50 rounded-2xl transition-all shadow-sm bg-white border border-slate-100 active:scale-95"
                                                title="View Detailed Journey"
                                            >
                                                <Map className="w-5 h-5" />
                                            </button>
                                        </Link>
                                        <button className="p-3 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-2xl transition-all bg-white border border-slate-100 active:scale-95">
                                            <MoreHorizontal className="w-5 h-5" />
                                        </button>
                                    </div>

                                    {/* Lost Reason (Separated if exists) */}
                                    {lead.lost && (
                                        <div className="md:col-start-4 md:col-span-7 mt-[-8px] px-5 pb-4">
                                            <div className="flex items-center gap-3 p-3 bg-red-50/50 border border-red-100 rounded-2xl shadow-sm animate-in slide-in-from-top-1">
                                                <AlertCircleIcon className="w-4 h-4 text-red-500" />
                                                <p className="text-[11px] font-medium text-red-700 italic">
                                                    <span className="font-bold uppercase not-italic mr-2 tracking-widest text-[10px]">Audit Note:</span>
                                                    {lead.lostReason} — Logged by {lastAction?.completedBy}
                                                </p>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        );
                    })
                ) : (
                    <div className="bg-white rounded-3xl border border-dashed border-slate-200 p-16 text-center shadow-inner">
                        <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4 border border-slate-100 text-slate-300">
                            <Clock className="w-8 h-8" />
                        </div>
                        <h3 className="text-slate-800 font-bold text-xl">No journey history found</h3>
                        <p className="text-slate-500 text-sm mt-1 max-w-xs mx-auto font-medium">None of the Erbil leads match those specific filters. Try a broader search.</p>
                    </div>
                )}
            </div>

            {/* Pagination Controls */}
            {totalPages > 1 && (
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-8 bg-white p-5 rounded-3xl border border-slate-100 shadow-sm">
                    <div className="text-xs font-semibold text-slate-500 flex items-center gap-2">
                        <span className="flex items-center justify-center w-8 h-8 bg-blue-50 text-blue-600 rounded-xl font-bold border border-blue-100">
                            {paginatedLeads.length}
                        </span>
                        Viewing segment of {filteredAndSortedLeads.length} entries
                    </div>
                    <Pagination
                        pagination={{
                            page: page,
                            totalPages: totalPages,
                            limit: pageSize,
                            total: filteredAndSortedLeads.length,
                            hasMore: page < totalPages
                        }}
                        onPageChange={setPage}
                    />
                </div>
            )}
        </div>
    );
}

function AlertCircleIcon({ className }: { className?: string }) {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="8" x2="12" y2="12" />
            <line x1="12" y1="16" x2="12.01" y2="16" />
        </svg>
    )
}
