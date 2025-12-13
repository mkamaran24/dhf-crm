"use client";

import { Search, X, ChevronDown } from "lucide-react";
import { PATIENT_STATUSES } from "@/src/shared/constants";
import { PatientFilters } from "../types";

interface PatientsFiltersProps {
  filters: PatientFilters;
  searchQuery: string;
  onSearchChange: (value: string) => void;
  onStatusChange: (value: string) => void;
  onClearFilters: () => void;
}

export function PatientsFilters({
  filters,
  searchQuery,
  onSearchChange,
  onStatusChange,
  onClearFilters,
}: PatientsFiltersProps) {
  const hasActiveFilters = searchQuery || filters.status;

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-4">
      <div className="flex gap-3 items-center flex-wrap">
        <div className="flex-1 min-w-[250px] relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search by name, email, or phone..."
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
            {PATIENT_STATUSES.map(status => (
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
        <div className="flex gap-2 mt-3 pt-3 border-t border-gray-100">
          <span className="text-xs text-gray-500">Active filters:</span>
          {searchQuery && (
            <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">
              Search: "{searchQuery}"
            </span>
          )}
          {filters.status && (
            <span className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded">
              Status: {filters.status}
            </span>
          )}
        </div>
      )}
    </div>
  );
}

