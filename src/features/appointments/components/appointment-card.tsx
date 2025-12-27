"use client";

import { useState } from "react";
import Link from "next/link";
import { Clock, User, Calendar, Bell, Edit, MoreVertical, ExternalLink, CheckCircle, Stethoscope } from "lucide-react";
import { Appointment } from "../types";
import { Badge } from "@/src/shared/components/ui";
import { AppointmentReminderModal } from "./appointment-reminder-modal";
import { QuickActionsModal } from "./quick-actions-modal";
import { AppointmentStatus } from "@/src/shared/types";

interface AppointmentCardProps {
  appointment: Appointment;
  view: "calendar" | "list";
  onUpdateStatus?: (appointmentId: string, status: AppointmentStatus) => Promise<void>;
  onReschedule?: (appointmentId: string, newDate: string, newTime: string) => Promise<void>;
  onAddNote?: (appointmentId: string, note: string) => Promise<void>;
  isSelected?: boolean;
  onSelect?: (appointmentId: string) => void;
}

function getStatusColor(status: string) {
  switch (status) {
    case "scheduled":
      return "bg-blue-50 text-blue-700 border-blue-200";
    case "confirmed":
      return "bg-green-50 text-green-700 border-green-200";
    case "completed":
      return "bg-gray-50 text-gray-700 border-gray-200";
    case "cancelled":
      return "bg-red-50 text-red-700 border-red-200";
    default:
      return "bg-gray-50 text-gray-700 border-gray-200";
  }
}

function formatTime(dateString: string): string {
  return new Date(dateString).toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true
  });
}

function formatDate(dateString: string): string {
  const date = new Date(dateString);
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  if (date.toDateString() === today.toDateString()) return "Today";
  if (date.toDateString() === tomorrow.toDateString()) return "Tomorrow";

  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

export function AppointmentCard({
  appointment,
  view,
  onUpdateStatus = async () => { },
  onReschedule = async () => { },
  onAddNote = async () => { },
  isSelected = false,
  onSelect
}: AppointmentCardProps) {
  const [showReminderModal, setShowReminderModal] = useState(false);
  const [showQuickActions, setShowQuickActions] = useState(false);
  const statusColor = getStatusColor(appointment.status);

  const handleSendReminder = async (type: "sms" | "whatsapp", apt: Appointment) => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    console.log(`Sending ${type} reminder for appointment ${apt.id}`);
  };

  if (view === "calendar") {
    return (
      <Link href={`/appointments/${appointment.id}`}>
        <div className="group bg-white border-l-4 border-l-blue-500 rounded-md p-2 shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer">
          <div className="flex items-start gap-2 mb-1.5">
            <Clock className="w-3.5 h-3.5 text-blue-600 flex-shrink-0 mt-0.5" />
            <div className="flex-1 min-w-0">
              <p className="text-xs font-bold text-gray-900 truncate leading-tight">{appointment.patientName}</p>
              <p className="text-[10px] text-gray-600 mt-0.5">{formatTime(appointment.date)}</p>
            </div>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <User className="w-3 h-3 text-gray-400" />
              <span className="text-[10px] text-gray-600 truncate">{appointment.doctor}</span>
            </div>
            <Badge className={`${statusColor} border text-[10px] font-medium px-1.5 py-0.5`}>
              {appointment.status}
            </Badge>
          </div>
        </div>
      </Link>
    );
  }

  // List view
  return (
    <>
      <div className={`group bg-white border-2 rounded-xl p-5 hover:shadow-lg transition-all duration-200 ${isSelected ? "border-blue-500 bg-blue-50" : "border-gray-200 hover:border-blue-300"
        }`}>
        <div className="flex items-start gap-4">
          {onSelect && (
            <div className="flex items-center pt-1">
              <input
                type="checkbox"
                checked={isSelected}
                onChange={() => onSelect(appointment.id)}
                className="w-5 h-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                onClick={(e) => e.stopPropagation()}
              />
            </div>
          )}

          <Link href={`/appointments/${appointment.id}`} className="flex items-start gap-4 flex-1 min-w-0">
            <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center flex-shrink-0 shadow-lg">
              <Calendar className="w-7 h-7 text-white" />
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-3 mb-2">
                <h3 className="font-bold text-gray-900 text-lg">{appointment.patientName}</h3>
                <Badge className={`${statusColor} border font-medium`}>
                  {appointment.status}
                </Badge>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-sm">
                <div className="flex items-center gap-2 text-gray-600">
                  <Clock className="w-4 h-4 text-gray-400" />
                  <span className="font-medium">{formatTime(appointment.date)}</span>
                  <span className="text-gray-400">•</span>
                  <span>{formatDate(appointment.date)}</span>
                </div>

                <div className="flex items-center gap-2 text-gray-600">
                  <User className="w-4 h-4 text-gray-400" />
                  <span>{appointment.doctor}</span>
                </div>

                <div className="flex items-center gap-2 text-gray-600">
                  <span className="text-gray-400">Type:</span>
                  <span className="font-medium">{appointment.type}</span>
                </div>
              </div>
            </div>
          </Link>

          <div className="flex items-center gap-2 flex-shrink-0">
            <Link
              href={`/patients/${appointment.patientName.toLowerCase().replace(/\s+/g, '-')}`}
              className="p-2 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors"
              title="View patient profile"
              onClick={(e) => e.stopPropagation()}
            >
              <ExternalLink className="w-5 h-5" />
            </Link>

            <button
              onClick={(e) => {
                e.stopPropagation();
                setShowReminderModal(true);
              }}
              className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
              title="Send reminder"
            >
              <Bell className="w-5 h-5" />
            </button>

            <button
              onClick={(e) => {
                e.stopPropagation();
                setShowQuickActions(true);
              }}
              className="p-2 text-gray-400 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-colors"
              title="Quick actions"
            >
              <MoreVertical className="w-5 h-5" />
            </button>

            {appointment.status === "confirmed" && (
              <Link
                href={`/appointments/${appointment.id}/visit`}
                className="p-2 text-emerald-500 hover:text-emerald-700 hover:bg-emerald-50 rounded-lg transition-colors border border-emerald-100 bg-emerald-50/20"
                title="Patient Visit Form"
                onClick={(e) => e.stopPropagation()}
              >
                <Stethoscope className="w-5 h-5" />
              </Link>
            )}
          </div>
        </div>
      </div>

      <AppointmentReminderModal
        isOpen={showReminderModal}
        appointment={appointment}
        onClose={() => setShowReminderModal(false)}
        onSendReminder={handleSendReminder}
      />

      <QuickActionsModal
        isOpen={showQuickActions}
        appointment={appointment}
        onClose={() => setShowQuickActions(false)}
        onUpdateStatus={onUpdateStatus}
        onReschedule={onReschedule}
        onAddNote={onAddNote}
      />
    </>
  );
}

