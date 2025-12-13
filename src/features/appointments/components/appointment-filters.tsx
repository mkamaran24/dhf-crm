"use client";

import { Filter, X } from "lucide-react";
import { Select, Button } from "@/src/shared/components/ui";
import { DOCTORS } from "@/src/shared/constants";
import { AppointmentStatus } from "@/src/shared/types";

interface AppointmentFiltersProps {
  doctorFilter: string;
  statusFilter: AppointmentStatus | "all";
  onDoctorChange: (doctor: string) => void;
  onStatusChange: (status: AppointmentStatus | "all") => void;
  onClearFilters: () => void;
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

export function AppointmentFilters({
  doctorFilter,
  statusFilter,
  onDoctorChange,
  onStatusChange,
  onClearFilters,
}: AppointmentFiltersProps) {
  const hasActiveFilters = doctorFilter !== "all" || statusFilter !== "all";

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-4">
      <div className="flex flex-col md:flex-row gap-4 items-end">
        <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4">
          <Select
            label="Filter by Doctor"
            value={doctorFilter}
            onChange={(e) => onDoctorChange(e.target.value)}
            options={DOCTOR_OPTIONS}
          />

          <Select
            label="Filter by Status"
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
            Clear Filters
          </Button>
        )}
      </div>
    </div>
  );
}

