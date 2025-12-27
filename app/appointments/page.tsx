"use client";

import { useState, useMemo, useEffect, Suspense, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Plus, Loader2, Calendar, List, Repeat, Download, FileText, FileSpreadsheet, User, UserPlus } from "lucide-react";
import { Button } from "@/src/shared/components/ui";
import {
  CalendarView,
  AppointmentFilters,
  AppointmentStats,
  AppointmentListView,
  BulkActionsBar,
  RecurringAppointmentModal,
  WalkInAppointmentModal
} from "@/src/features/appointments/components";
import { useAppointments } from "@/src/features/appointments/hooks/use-appointments";
import { AppointmentStatus } from "@/src/shared/types";
import { appointmentsService } from "@/src/features/appointments/services/appointments-service";
import { exportAppointmentsToPDF, exportAppointmentsToExcel, exportAppointmentsToCSV } from "@/src/features/appointments/utils/export";
import { detectAppointmentConflicts } from "@/src/features/appointments/utils/conflict-detection";
import { RecurringConfig } from "@/src/features/appointments/components/recurring-appointment-modal";
import { useAuth } from "@/src/shared/contexts/auth-context";

function AppointmentsPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<"calendar" | "list">("calendar");
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const [showWalkInModal, setShowWalkInModal] = useState(false);
  const [statusFilter, setStatusFilter] = useState<AppointmentStatus | "all">("all");
  const [timeFilter, setTimeFilter] = useState("today");

  const {
    appointments: rawAppointments,
    allAppointments,
    isLoading,
    error,
    getAppointmentsForDay,
    refreshAppointments,
  } = useAppointments({
    doctorFilter: "all",
    statusFilter: statusFilter,
  });

  useEffect(() => {
    if (searchParams.get('refresh')) {
      refreshAppointments();
      router.replace('/appointments', { scroll: false });
    }
  }, [searchParams, refreshAppointments, router]);

  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        refreshAppointments();
      }
    };

    const handleFocus = () => {
      refreshAppointments();
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('focus', handleFocus);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('focus', handleFocus);
    };
  }, [refreshAppointments]);

  const appointments = useMemo(() => {
    let filtered = [...rawAppointments];

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(apt =>
        apt.patientName.toLowerCase().includes(query) ||
        apt.phone?.toLowerCase().includes(query) ||
        apt.type.toLowerCase().includes(query) ||
        apt.doctor.toLowerCase().includes(query)
      );
    }

    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const weekEnd = new Date(today);
    weekEnd.setDate(weekEnd.getDate() + 7);
    const monthEnd = new Date(today);
    monthEnd.setMonth(monthEnd.getMonth() + 1);

    filtered = filtered.filter(apt => {
      const aptDate = new Date(apt.date);
      const aptDay = new Date(aptDate.getFullYear(), aptDate.getMonth(), aptDate.getDate());

      switch (timeFilter) {
        case "today":
          return aptDay.getTime() === today.getTime();
        case "week": {
          const startOfWeek = new Date(today);
          startOfWeek.setDate(today.getDate() - today.getDay());
          const endOfWeek = new Date(startOfWeek);
          endOfWeek.setDate(startOfWeek.getDate() + 6);
          return aptDay >= startOfWeek && aptDay <= endOfWeek;
        }
        case "month": {
          const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
          const lastDayOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0);
          return aptDay >= firstDayOfMonth && aptDay <= lastDayOfMonth;
        }
        default:
          return true;
      }
    });

    return filtered;
  }, [rawAppointments, searchQuery, timeFilter]);

  // High-performance filtering for the Calendar component grid
  const getFilteredAppointmentsForDay = useCallback((date: Date) => {
    return rawAppointments.filter(apt => {
      // Apply search filter
      const matchesSearch = !searchQuery.trim() ||
        apt.patientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        apt.phone?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        apt.type.toLowerCase().includes(searchQuery.toLowerCase());

      if (!matchesSearch) return false;

      // Match date
      const aptDate = new Date(apt.date);
      return (
        aptDate.getDate() === date.getDate() &&
        aptDate.getMonth() === date.getMonth() &&
        aptDate.getFullYear() === date.getFullYear()
      );
    });
  }, [rawAppointments, searchQuery]);

  const handleUpdateStatus = async (appointmentId: string, status: AppointmentStatus) => {
    try {
      await appointmentsService.updateAppointment(appointmentId, { status });
      await refreshAppointments();
    } catch (error) {
      console.error("Error updating status:", error);
    }
  };

  const handleReschedule = async (appointmentId: string, newDate: string, newTime: string) => {
    try {
      const dateTime = new Date(`${newDate}T${newTime}`);

      const conflict = detectAppointmentConflicts(allAppointments, {
        date: dateTime.toISOString(),
        doctor: rawAppointments.find(a => a.id === appointmentId)?.doctor || ""
      });

      if (conflict.hasConflict) {
        if (!confirm(`Warning: ${conflict.message}\nDo you want to proceed anyway?`)) {
          return;
        }
      }

      await appointmentsService.updateAppointment(appointmentId, { date: dateTime.toISOString() });
      await refreshAppointments();
    } catch (error) {
      console.error("Error rescheduling:", error);
    }
  };

  const handleAddNote = async (appointmentId: string, note: string) => {
    try {
      await appointmentsService.updateAppointment(appointmentId, { notes: note });
      await refreshAppointments();
    } catch (error) {
      console.error("Error adding note:", error);
    }
  };

  const handleSelect = (appointmentId: string) => {
    setSelectedIds(prev =>
      prev.includes(appointmentId)
        ? prev.filter(id => id !== appointmentId)
        : [...prev, appointmentId]
    );
  };

  const handleBulkStatusUpdate = async (status: AppointmentStatus) => {
    try {
      await Promise.all(
        selectedIds.map(id => appointmentsService.updateAppointment(id, { status }))
      );
      setSelectedIds([]);
      await refreshAppointments();
    } catch (error) {
      console.error("Error updating bulk status:", error);
    }
  };

  const handleBulkDelete = async () => {
    if (!confirm(`Are you sure you want to delete ${selectedIds.length} appointment(s)?`)) {
      return;
    }

    try {
      await Promise.all(
        selectedIds.map(id => appointmentsService.deleteAppointment(id))
      );
      setSelectedIds([]);
      await refreshAppointments();
    } catch (error) {
      console.error("Error deleting appointments:", error);
    }
  };



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
    <div className="space-y-6 pb-24">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Appointments</h1>
          <p className="text-sm text-gray-500 mt-1">
            Schedule and manage patient visits
          </p>
        </div>
        <div className="flex items-center gap-3 flex-wrap">
          <div className="flex items-center gap-1 bg-gray-100 rounded-lg p-1">
            <button
              onClick={() => setViewMode("calendar")}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-all flex items-center gap-2 ${viewMode === "calendar"
                ? "bg-white text-gray-900 shadow-sm"
                : "text-gray-600 hover:text-gray-900"
                }`}
            >
              <Calendar className="w-4 h-4" />
              Calendar
            </button>
            <button
              onClick={() => setViewMode("list")}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-all flex items-center gap-2 ${viewMode === "list"
                ? "bg-white text-gray-900 shadow-sm"
                : "text-gray-600 hover:text-gray-900"
                }`}
            >
              <List className="w-4 h-4" />
              List
            </button>
          </div>

          <Button
            variant="outlined"
            onClick={() => setShowWalkInModal(true)}
            className="border-emerald-200 text-emerald-700 hover:bg-emerald-50 bg-white"
          >
            <UserPlus className="w-4 h-4 mr-2" />
            Walk-in
          </Button>

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
        searchQuery={searchQuery}
        statusFilter={statusFilter}
        timeFilter={timeFilter}
        onSearchChange={setSearchQuery}
        onStatusChange={setStatusFilter}
        onTimeFilterChange={setTimeFilter}
        onClearFilters={() => {
          setSearchQuery("");
          setStatusFilter("all");
          setTimeFilter("today");
        }}
      />

      {isLoading ? (
        <div className="flex items-center justify-center min-h-[400px]">
          <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
        </div>
      ) : viewMode === "calendar" ? (
        <CalendarView
          appointments={rawAppointments}
          viewType={timeFilter as any}
          getAppointmentsForDay={getFilteredAppointmentsForDay}
        />
      ) : (
        <AppointmentListView
          appointments={appointments}
          onUpdateStatus={handleUpdateStatus}
          onReschedule={handleReschedule}
          onAddNote={handleAddNote}
          selectedIds={selectedIds}
          onSelect={handleSelect}
        />
      )}

      <WalkInAppointmentModal
        isOpen={showWalkInModal}
        onClose={() => setShowWalkInModal(false)}
        onSuccess={async () => {
          await refreshAppointments();
        }}
      />
    </div>
  );
}

export default function AppointmentsPage() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
      </div>
    }>
      <AppointmentsPageContent />
    </Suspense>
  );
}
