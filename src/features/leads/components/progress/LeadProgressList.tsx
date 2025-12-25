
"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import {
    mockLeadsProgress,
    STAGES
} from "../../data/mock-progress-data";
import { LeadProgressBar } from "./LeadProgressBar";
import {
    Search,
    Filter,
    ArrowUpDown,
    MoreHorizontal,
    User,
    Calendar
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
            <div className="flex flex-col md:flex-row gap-4 justify-between items-center bg-white p-4 rounded-xl border border-gray-100 shadow-sm">

                {/* Search */}
                <div className="relative w-full md:w-64">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <input
                        type="text"
                        placeholder="Search leads..."
                        className="w-full pl-9 pr-4 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>

                {/* Filters */}
                <div className="flex items-center gap-3 w-full md:w-auto overflow-x-auto pb-2 md:pb-0">
                    <select
                        className="px-3 py-2 text-sm border border-gray-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value as any)}
                    >
                        <option value="all">All Status</option>
                        <option value="active">Active</option>
                        <option value="lost">Lost</option>
                    </select>

                    <select
                        className="px-3 py-2 text-sm border border-gray-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                        value={stageFilter}
                        onChange={(e) => setStageFilter(e.target.value)}
                    >
                        <option value="all">All Stages</option>
                        {STAGES.map(stage => (
                            <option key={stage.id} value={stage.label}>{stage.label}</option>
                        ))}
                    </select>
                </div>
            </div>


            {/* List */}
            <div className="space-y-4">
                {/* Header (Desktop Only) */}
                <div className="hidden md:grid grid-cols-12 gap-6 px-6 py-3 text-[11px] font-bold text-gray-400 uppercase tracking-widest">
                    <div
                        className="col-span-3 flex items-center gap-2 cursor-pointer hover:text-gray-600 transition-colors"
                        onClick={() => handleSort("name")}
                    >
                        Lead Information
                        <ArrowUpDown className="w-3 h-3" />
                    </div>
                    <div className="col-span-6">Pipeline Progress</div>
                    <div
                        className="col-span-2 flex items-center gap-2 cursor-pointer hover:text-gray-600 transition-colors"
                        onClick={() => handleSort("lastUpdated")}
                    >
                        Last Activity
                        <ArrowUpDown className="w-3 h-3" />
                    </div>
                    <div className="col-span-1 text-right">Actions</div>
                </div>

                {/* Rows as Cards */}
                {paginatedLeads.length > 0 ? (
                    paginatedLeads.map((lead) => (
                        <div
                            key={lead.id}
                            className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md hover:border-blue-100 transition-all duration-300 group overflow-hidden"
                        >
                            <div className="grid grid-cols-1 md:grid-cols-12 gap-4 md:gap-6 p-5 md:p-6 items-center">
                                {/* Lead Info Section */}
                                <div className="md:col-span-3 flex flex-col gap-1">
                                    <div className="flex items-center gap-2 flex-wrap">
                                        <h3 className="font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
                                            {lead.name}
                                        </h3>
                                        {lead.currentStage === "Converted" && (
                                            <div className="flex items-center gap-1 bg-emerald-50 text-emerald-600 px-2 py-0.5 rounded-full text-[10px] font-bold border border-emerald-100">
                                                <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full" />
                                                Patient
                                            </div>
                                        )}
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <span className="text-xs font-mono text-gray-400 bg-gray-50 px-2 py-0.5 rounded">
                                            {lead.leadId}
                                        </span>
                                        {lead.currentStage === "Converted" && (
                                            <button className="text-[10px] font-bold text-blue-500 hover:text-blue-700 underline underline-offset-2 uppercase tracking-tighter">
                                                View Profile
                                            </button>
                                        )}
                                    </div>
                                    <div className="flex items-center gap-2 mt-2 text-xs text-gray-500">
                                        <div className="w-6 h-6 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 font-bold border border-blue-100">
                                            {lead.assignedAgent?.[0] || "U"}
                                        </div>
                                        <span className="font-medium">{lead.assignedAgent || "Unassigned"}</span>
                                    </div>
                                </div>

                                {/* Progress Bar Section */}
                                <div className="md:col-span-6 bg-gray-50/50 rounded-xl px-4 py-2 border border-gray-50">
                                    <LeadProgressBar
                                        stages={lead.stages}
                                        currentStage={lead.currentStage}
                                        lost={lead.lost}
                                        lostReason={lead.lostReason}
                                    />
                                </div>

                                {/* Status & Date Section */}
                                <div className="md:col-span-2 flex flex-col md:items-start gap-1">
                                    <div className="flex items-center gap-1.5 text-xs text-gray-400 font-medium">
                                        <Calendar className="w-3.5 h-3.5" />
                                        {lead.lastUpdated ? new Date(lead.lastUpdated).toLocaleDateString(undefined, {
                                            month: 'short',
                                            day: 'numeric',
                                            year: 'numeric'
                                        }) : 'No activity'}
                                    </div>
                                    {lead.lost && (
                                        <div className="mt-2 space-y-1">
                                            <Badge variant="error" className="font-bold text-[10px] uppercase tracking-tighter">
                                                Closed Lost
                                            </Badge>
                                            {lead.lostReason && (
                                                <div className="p-2 bg-red-50 border border-red-100 rounded-lg">
                                                    <p className="text-[10px] leading-tight text-red-700 font-medium">
                                                        <span className="font-bold uppercase mr-1">Note:</span>
                                                        {lead.lostReason}
                                                    </p>
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>

                                {/* Actions Section */}
                                <div className="md:col-span-1 flex items-center justify-end gap-2">
                                    {lead.currentStage === "Contacted" && (
                                        <Link href="/appointments/create">
                                            <button
                                                className="p-2 text-blue-500 hover:bg-blue-50 rounded-xl transition-all"
                                                title="Quick Book Appointment"
                                            >
                                                <Calendar className="w-5 h-5" />
                                            </button>
                                        </Link>
                                    )}
                                    <button className="p-2.5 hover:bg-gray-50 rounded-xl text-gray-400 hover:text-gray-600 transition-all">
                                        <MoreHorizontal className="w-5 h-5" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="bg-white rounded-2xl border border-dashed border-gray-200 p-12 text-center">
                        <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Search className="w-8 h-8 text-gray-300" />
                        </div>
                        <h3 className="text-gray-900 font-bold">No leads found</h3>
                        <p className="text-gray-500 text-sm mt-1">Try adjusting your filters or search query.</p>
                    </div>
                )}
            </div>

            {/* Pagination Controls */}
            {totalPages > 1 && (
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-8 bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
                    <div className="text-xs font-medium text-gray-500 flex items-center gap-2">
                        <span className="flex items-center justify-center w-6 h-6 bg-blue-50 text-blue-600 rounded-md font-bold">
                            {paginatedLeads.length}
                        </span>
                        Leads displayed on this page
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

            <div className="text-xs text-gray-400 text-center">
                Showing {paginatedLeads.length} of {filteredAndSortedLeads.length} leads (Total: {mockLeadsProgress.length})
            </div>
        </div>
    );
}
