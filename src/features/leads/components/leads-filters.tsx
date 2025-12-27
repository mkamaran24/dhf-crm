"use client";

import { Search, X, ChevronDown } from "lucide-react";
import { LeadStatus } from "@/src/shared/types";
import { LeadFilters } from "../types";

const LEAD_STATUSES: LeadStatus[] = ["New", "Contacted", "Follow-up", "Ready", "Appointment Booked", "Converted"];

interface LeadsFiltersProps {
  filters: LeadFilters;
  searchQuery: string;
  onSearchChange: (value: string) => void;
  onStatusChange: (value: string) => void;
  onDateRangeChange: (value: LeadFilters['dateRange']) => void;
  onClearFilters: () => void;
}

export function LeadsFilters({
  filters,
  searchQuery,
  onSearchChange,
  onStatusChange,
  onDateRangeChange,
  onClearFilters,
}: LeadsFiltersProps) {
  const hasActiveFilters = searchQuery || filters.status || filters.dateRange !== 'today';

  const dateRangeOptions: { label: string; value: LeadFilters['dateRange'] }[] = [
    { label: "Today", value: "today" },
    { label: "This Week", value: "week" },
    { label: "This Month", value: "month" },
    { label: "All Items", value: "all" },
  ];

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-1.5 shadow-sm">
      {/* Date Range Sub-nav */}
      <div className="flex bg-slate-50/50 p-1 rounded-lg mb-3 border border-slate-100">
        {dateRangeOptions.map((option) => (
          <button
            key={option.value}
            onClick={() => onDateRangeChange(option.value)}
            className={`flex-1 py-1.5 px-3 rounded-md text-xs font-medium transition-all duration-200 ${filters.dateRange === option.value
              ? "bg-white shadow-sm text-blue-600 border border-slate-200"
              : "text-slate-500 hover:text-slate-800 hover:bg-slate-100"
              }`}
          >
            {option.label}
          </button>
        ))}
      </div>

      <div className="px-2.5 pb-2.5 space-y-3">
        <div className="flex gap-3 items-center flex-wrap">
          <div className="flex-1 min-w-[250px] relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search by name or phone..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
            />
          </div>

          <div className="relative min-w-[150px]">
            <select
              value={filters.status || ""}
              onChange={(e) => onStatusChange(e.target.value)}
              className="w-full px-4 py-2 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm appearance-none bg-white cursor-pointer"
            >
              <option value="">All Statuses</option>
              {LEAD_STATUSES.map(status => (
                <option key={status} value={status}>{status}</option>
              ))}
            </select>
            <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
          </div>

          {hasActiveFilters && (
            <button
              onClick={onClearFilters}
              className="flex items-center gap-2 px-4 py-2 text-sm text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="w-4 h-4" />
              Clear
            </button>
          )}
        </div>

        {hasActiveFilters && (
          <div className="flex flex-wrap gap-2 mt-3 pt-3 border-t border-gray-100">
            <span className="text-xs text-gray-500 flex items-center h-6">Active filters:</span>
            {searchQuery && (
              <span className="text-xs bg-blue-100 text-blue-700 px-2.5 py-1 rounded-full font-medium">
                Search: "{searchQuery}"
              </span>
            )}
            {filters.status && (
              <span className="text-xs bg-purple-100 text-purple-700 px-2.5 py-1 rounded-full font-medium">
                Status: {filters.status}
              </span>
            )}
            {filters.dateRange !== 'today' && (
              <span className="text-xs bg-orange-100 text-orange-700 px-2.5 py-1 rounded-full font-medium">
                Timing: {dateRangeOptions.find(o => o.value === filters.dateRange)?.label}
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
