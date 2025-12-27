"use client";

import { Search, X } from "lucide-react";
import { Select, Button, Input } from "@/src/shared/components/ui";
import { DOCTORS, DEPARTMENTS, TIME_FILTERS } from "@/src/shared/constants";
import { AppointmentStatus } from "@/src/shared/types";

interface AppointmentFiltersProps {
  searchQuery: string;
  statusFilter: AppointmentStatus | "all";
  timeFilter: string;
  onSearchChange: (query: string) => void;
  onStatusChange: (status: AppointmentStatus | "all") => void;
  onTimeFilterChange: (time: string) => void;
  onClearFilters: () => void;
}

const STATUS_OPTIONS = [
  { label: "All Status", value: "all" },
  { label: "Scheduled", value: "scheduled" },
  { label: "Confirmed", value: "confirmed" },
  { label: "Completed", value: "completed" },
  { label: "Cancelled", value: "cancelled" },
];

export function AppointmentFilters({
  searchQuery,
  statusFilter,
  timeFilter,
  onSearchChange,
  onStatusChange,
  onTimeFilterChange,
  onClearFilters,
}: AppointmentFiltersProps) {
  const hasActiveFilters =
    searchQuery.trim() !== "" ||
    statusFilter !== "all" ||
    timeFilter !== "all";

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        {TIME_FILTERS.map((filter) => (
          <button
            key={filter.value}
            onClick={() => onTimeFilterChange(filter.value)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${timeFilter === filter.value
                ? "bg-blue-600 text-white shadow-md"
                : "bg-white text-gray-600 border border-gray-200 hover:border-gray-300 hover:bg-gray-50"
              }`}
          >
            {filter.label}
          </button>
        ))}
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1">
            <Input
              placeholder="Search by patient name, phone, or type..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              icon={<Search className="w-4 h-4" />}
            />
          </div>

          <div className="flex flex-col md:flex-row gap-4 items-end">
            <div className="grid gap-4 flex-1 grid-cols-1">
              <Select
                label="Status"
                value={statusFilter}
                onChange={(e) => onStatusChange(e.target.value as AppointmentStatus | "all")}
                options={STATUS_OPTIONS}
              />
            </div>

            {hasActiveFilters && (
              <Button
                variant="outlined"
                onClick={onClearFilters}
                size="sm"
                className="whitespace-nowrap h-[42px]"
              >
                <X className="w-4 h-4 mr-2" />
                Clear All
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

