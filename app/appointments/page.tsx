"use client";

import { useState } from "react";
import Link from "next/link";
import { Plus, Loader2, Calendar, List } from "lucide-react";
import { Button } from "@/src/shared/components/ui";
import { 
  CalendarView, 
  AppointmentFilters, 
  AppointmentStats,
  AppointmentListView
} from "@/src/features/appointments/components";
import { useAppointments } from "@/src/features/appointments/hooks/use-appointments";
import { AppointmentStatus } from "@/src/shared/types";

export default function AppointmentsPage() {
  const [selectedDoctor, setSelectedDoctor] = useState("all");
  const [statusFilter, setStatusFilter] = useState<AppointmentStatus | "all">("all");
  const [viewMode, setViewMode] = useState<"calendar" | "list">("calendar");

  const {
    appointments,
    allAppointments,
    isLoading,
    error,
    getAppointmentsForDay,
  } = useAppointments({
    doctorFilter: selectedDoctor,
    statusFilter: statusFilter,
  });

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <p className="text-red-600 font-semibold mb-2">Error loading appointments</p>
          <p className="text-gray-500 text-sm">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Appointments</h1>
          <p className="text-sm text-gray-500 mt-1">Schedule and manage patient visits</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1 bg-gray-100 rounded-lg p-1">
            <button
              onClick={() => setViewMode("calendar")}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-all flex items-center gap-2 ${
                viewMode === "calendar"
                  ? "bg-white text-gray-900 shadow-sm"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              <Calendar className="w-4 h-4" />
              Calendar
            </button>
            <button
              onClick={() => setViewMode("list")}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-all flex items-center gap-2 ${
                viewMode === "list"
                  ? "bg-white text-gray-900 shadow-sm"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              <List className="w-4 h-4" />
              List
            </button>
          </div>
          <Link href="/appointments/create">
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              New Appointment
            </Button>
          </Link>
        </div>
      </div>

      <AppointmentStats appointments={allAppointments} />

      <AppointmentFilters
        doctorFilter={selectedDoctor}
        statusFilter={statusFilter}
        onDoctorChange={setSelectedDoctor}
        onStatusChange={setStatusFilter}
        onClearFilters={() => {
          setSelectedDoctor("all");
          setStatusFilter("all");
        }}
      />

      {isLoading ? (
        <div className="flex items-center justify-center min-h-[400px]">
          <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
        </div>
      ) : viewMode === "calendar" ? (
        <CalendarView
          appointments={appointments}
          getAppointmentsForDay={getAppointmentsForDay}
        />
      ) : (
        <AppointmentListView appointments={appointments} />
      )}
    </div>
  );
}
