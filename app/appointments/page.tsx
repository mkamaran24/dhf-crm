"use client";

import { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import { Plus, Loader2, Calendar, List, Repeat, Download, FileText, FileSpreadsheet, User } from "lucide-react";
import { Button } from "@/src/shared/components/ui";
import { 
  CalendarView, 
  AppointmentFilters, 
  AppointmentStats,
  AppointmentListView,
  BulkActionsBar,
  RecurringAppointmentModal
} from "@/src/features/appointments/components";
import { useAppointments } from "@/src/features/appointments/hooks/use-appointments";
import { AppointmentStatus } from "@/src/shared/types";
import { appointmentsService } from "@/src/features/appointments/services/appointments-service";
import { exportAppointmentsToPDF, exportAppointmentsToExcel, exportAppointmentsToCSV } from "@/src/features/appointments/utils/export";
import { detectAppointmentConflicts } from "@/src/features/appointments/utils/conflict-detection";
import { RecurringConfig } from "@/src/features/appointments/components/recurring-appointment-modal";
import { useAuth } from "@/src/shared/contexts/auth-context";

export default function AppointmentsPage() {
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<"calendar" | "list">("calendar");
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [showRecurringModal, setShowRecurringModal] = useState(false);
  const [showExportMenu, setShowExportMenu] = useState(false);
  const [viewMyAppointments, setViewMyAppointments] = useState(false);
  
  const isDoctor = user?.role === "Doctor";
  const doctorName = user?.name || "";
  
  const [selectedDoctor, setSelectedDoctor] = useState(isDoctor ? doctorName : "all");
  const [selectedDepartment, setSelectedDepartment] = useState("all");
  const [statusFilter, setStatusFilter] = useState<AppointmentStatus | "all">("all");
  const [timeFilter, setTimeFilter] = useState("all");

  useEffect(() => {
    if (isDoctor && viewMyAppointments) {
      setSelectedDoctor(doctorName);
    } else if (!viewMyAppointments) {
      setSelectedDoctor("all");
    }
  }, [viewMyAppointments, isDoctor, doctorName]);

  const {
    appointments: rawAppointments,
    allAppointments,
    isLoading,
    error,
    getAppointmentsForDay,
    refreshAppointments,
  } = useAppointments({
    doctorFilter: selectedDoctor,
    statusFilter: statusFilter,
  });

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

    if (timeFilter !== "all") {
      const now = new Date();
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);
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
          case "week":
            return aptDay >= today && aptDay < weekEnd;
          case "month":
            return aptDay >= today && aptDay < monthEnd;
          case "upcoming":
            return aptDay >= today;
          default:
            return true;
        }
      });
    }

    return filtered;
  }, [rawAppointments, searchQuery, timeFilter]);

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

  const handleBulkExport = () => {
    const selectedAppointments = appointments.filter(apt => selectedIds.includes(apt.id));
    exportAppointmentsToPDF(selectedAppointments);
  };

  const handleCreateRecurring = async (config: RecurringConfig) => {
    try {
      const dates = [];
      let currentDate = new Date(config.startDate);

      for (let i = 0; i < config.occurrences; i++) {
        const dateTime = new Date(`${currentDate.toISOString().split('T')[0]}T${config.time}`);
        dates.push(dateTime.toISOString());

        switch (config.frequency) {
          case "daily":
            currentDate.setDate(currentDate.getDate() + 1);
            break;
          case "weekly":
            currentDate.setDate(currentDate.getDate() + 7);
            break;
          case "biweekly":
            currentDate.setDate(currentDate.getDate() + 14);
            break;
          case "monthly":
            currentDate.setMonth(currentDate.getMonth() + 1);
            break;
        }
      }

      await Promise.all(
        dates.map(date =>
          appointmentsService.createAppointment({
            date,
            patientName: config.patientName,
            doctor: config.doctor,
            type: config.type,
            status: "scheduled",
            phone: ""
          })
        )
      );

      await refreshAppointments();
      alert(`${config.occurrences} appointments created successfully!`);
    } catch (error) {
      console.error("Error creating recurring appointments:", error);
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
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold text-gray-900">Appointments</h1>
            {isDoctor && viewMyAppointments && (
              <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium flex items-center gap-2">
                <User className="w-4 h-4" />
                My Appointments
              </span>
            )}
          </div>
          <p className="text-sm text-gray-500 mt-1">
            {isDoctor && viewMyAppointments 
              ? `Viewing appointments assigned to ${doctorName}`
              : "Schedule and manage patient visits"
            }
          </p>
        </div>
        <div className="flex items-center gap-3 flex-wrap">
          {isDoctor && (
            <Button
              variant={viewMyAppointments ? "filled" : "outlined"}
              onClick={() => setViewMyAppointments(!viewMyAppointments)}
              className={viewMyAppointments ? "bg-blue-600 hover:bg-blue-700" : ""}
            >
              <User className="w-4 h-4 mr-2" />
              {viewMyAppointments ? "View All" : "My Appointments"}
            </Button>
          )}
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

          <div className="relative">
            <Button
              variant="outlined"
              onClick={() => setShowExportMenu(!showExportMenu)}
            >
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
            {showExportMenu && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-xl border border-gray-200 z-50">
                <button
                  onClick={() => {
                    exportAppointmentsToPDF(appointments);
                    setShowExportMenu(false);
                  }}
                  className="w-full px-4 py-3 text-left hover:bg-gray-50 flex items-center gap-3 text-sm font-medium text-gray-700 rounded-t-lg"
                >
                  <FileText className="w-4 h-4 text-red-600" />
                  Export as PDF
                </button>
                <button
                  onClick={() => {
                    exportAppointmentsToExcel(appointments);
                    setShowExportMenu(false);
                  }}
                  className="w-full px-4 py-3 text-left hover:bg-gray-50 flex items-center gap-3 text-sm font-medium text-gray-700"
                >
                  <FileSpreadsheet className="w-4 h-4 text-green-600" />
                  Export as Excel
                </button>
                <button
                  onClick={() => {
                    exportAppointmentsToCSV(appointments);
                    setShowExportMenu(false);
                  }}
                  className="w-full px-4 py-3 text-left hover:bg-gray-50 flex items-center gap-3 text-sm font-medium text-gray-700 rounded-b-lg border-t border-gray-100"
                >
                  <Download className="w-4 h-4 text-blue-600" />
                  Export as CSV
                </button>
              </div>
            )}
          </div>

          <Button
            variant="outlined"
            onClick={() => setShowRecurringModal(true)}
          >
            <Repeat className="w-4 h-4 mr-2" />
            Recurring
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
        doctorFilter={selectedDoctor}
        departmentFilter={selectedDepartment}
        statusFilter={statusFilter}
        timeFilter={timeFilter}
        onSearchChange={setSearchQuery}
        onDoctorChange={setSelectedDoctor}
        onDepartmentChange={setSelectedDepartment}
        onStatusChange={setStatusFilter}
        onTimeFilterChange={setTimeFilter}
        onClearFilters={() => {
          setSearchQuery("");
          if (!viewMyAppointments) {
            setSelectedDoctor("all");
          }
          setSelectedDepartment("all");
          setStatusFilter("all");
          setTimeFilter("all");
        }}
        showDoctorFilter={!viewMyAppointments}
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
        <AppointmentListView
          appointments={appointments}
          onUpdateStatus={handleUpdateStatus}
          onReschedule={handleReschedule}
          onAddNote={handleAddNote}
          selectedIds={selectedIds}
          onSelect={handleSelect}
        />
      )}

      <BulkActionsBar
        selectedCount={selectedIds.length}
        onClearSelection={() => setSelectedIds([])}
        onBulkStatusUpdate={handleBulkStatusUpdate}
        onBulkDelete={handleBulkDelete}
        onBulkExport={handleBulkExport}
      />

      <RecurringAppointmentModal
        isOpen={showRecurringModal}
        onClose={() => setShowRecurringModal(false)}
        onCreateRecurring={handleCreateRecurring}
      />
    </div>
  );
}
