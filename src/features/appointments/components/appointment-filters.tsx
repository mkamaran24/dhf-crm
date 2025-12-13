"use client";

import { Search, X } from "lucide-react";
import { Select, Button, Input } from "@/src/shared/components/ui";
import { DOCTORS, DEPARTMENTS, TIME_FILTERS } from "@/src/shared/constants";
import { AppointmentStatus } from "@/src/shared/types";

interface AppointmentFiltersProps {
  searchQuery: string;
  doctorFilter: string;
  departmentFilter: string;
  statusFilter: AppointmentStatus | "all";
  timeFilter: string;
  onSearchChange: (query: string) => void;
  onDoctorChange: (doctor: string) => void;
  onDepartmentChange: (department: string) => void;
  onStatusChange: (status: AppointmentStatus | "all") => void;
  onTimeFilterChange: (time: string) => void;
  onClearFilters: () => void;
  showDoctorFilter?: boolean;
}

const STATUS_OPTIONS = [
  { label: "All Status", value: "all" },
  { label: "Scheduled", value: "scheduled" },
  { label: "Confirmed", value: "confirmed" },
  { label: "Completed", value: "completed" },
  { label: "Cancelled", value: "cancelled" },
];

const DOCTOR_OPTIONS = [
  { label: "All Doctors", value: "all" },
  ...DOCTORS.map(d => ({ label: d.label, value: d.value })),
];

const DEPARTMENT_OPTIONS = [
  { label: "All Departments", value: "all" },
  ...DEPARTMENTS.map(d => ({ label: d.label, value: d.value })),
];

export function AppointmentFilters({
  searchQuery,
  doctorFilter,
  departmentFilter,
  statusFilter,
  timeFilter,
  onSearchChange,
  onDoctorChange,
  onDepartmentChange,
  onStatusChange,
  onTimeFilterChange,
  onClearFilters,
  showDoctorFilter = true,
}: AppointmentFiltersProps) {
  const hasActiveFilters = 
    searchQuery.trim() !== "" ||
    (showDoctorFilter && doctorFilter !== "all") || 
    departmentFilter !== "all" ||
    statusFilter !== "all" ||
    timeFilter !== "all";

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        {TIME_FILTERS.map((filter) => (
          <button
            key={filter.value}
            onClick={() => onTimeFilterChange(filter.value)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              timeFilter === filter.value
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
            <div className={`grid gap-4 flex-1 ${showDoctorFilter ? 'grid-cols-1 sm:grid-cols-3' : 'grid-cols-1 sm:grid-cols-2'}`}>
              {showDoctorFilter && (
                <Select
                  label="Doctor"
                  value={doctorFilter}
                  onChange={(e) => onDoctorChange(e.target.value)}
                  options={DOCTOR_OPTIONS}
                />
              )}

              <Select
                label="Department"
                value={departmentFilter}
                onChange={(e) => onDepartmentChange(e.target.value)}
                options={DEPARTMENT_OPTIONS}
              />

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

