"use client";

import { useState } from "react";
import { Modal, ModalHeader, ModalContent, ModalFooter, Button, Select, Input } from "@/src/shared/components/ui";
import { Clock, CheckCircle, XCircle, Calendar, FileText, AlertCircle } from "lucide-react";
import { Appointment } from "../types";
import { AppointmentStatus } from "@/src/shared/types";
import { APPOINTMENT_STATUSES } from "@/src/shared/constants";

interface QuickActionsModalProps {
  isOpen: boolean;
  appointment: Appointment | null;
  onClose: () => void;
  onUpdateStatus: (appointmentId: string, status: AppointmentStatus) => Promise<void>;
  onReschedule: (appointmentId: string, newDate: string, newTime: string) => Promise<void>;
  onAddNote: (appointmentId: string, note: string) => Promise<void>;
}

type ActionType = "status" | "reschedule" | "notes";

export function QuickActionsModal({
  isOpen,
  appointment,
  onClose,
  onUpdateStatus,
  onReschedule,
  onAddNote,
}: QuickActionsModalProps) {
  const [actionType, setActionType] = useState<ActionType>("status");
  const [selectedStatus, setSelectedStatus] = useState<AppointmentStatus>("scheduled");
  const [newDate, setNewDate] = useState("");
  const [newTime, setNewTime] = useState("");
  const [note, setNote] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!appointment) return null;

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      if (actionType === "status") {
        await onUpdateStatus(appointment.id, selectedStatus);
      } else if (actionType === "reschedule") {
        if (!newDate || !newTime) {
          alert("Please select both date and time");
          setIsSubmitting(false);
          return;
        }
        await onReschedule(appointment.id, newDate, newTime);
      } else if (actionType === "notes") {
        if (!note.trim()) {
          alert("Please enter a note");
          setIsSubmitting(false);
          return;
        }
        await onAddNote(appointment.id, note);
      }
      onClose();
      setNote("");
      setNewDate("");
      setNewTime("");
    } catch (error) {
      console.error("Error updating appointment:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const appointmentDate = new Date(appointment.date);
  const formattedDate = appointmentDate.toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });
  const formattedTime = appointmentDate.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit'
  });

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalHeader>
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-lg">
            {actionType === "status" && <CheckCircle className="w-6 h-6 text-white" />}
            {actionType === "reschedule" && <Calendar className="w-6 h-6 text-white" />}
            {actionType === "notes" && <FileText className="w-6 h-6 text-white" />}
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900">Quick Actions</h2>
            <p className="text-sm text-gray-500 mt-1">{appointment.patientName}</p>
          </div>
        </div>
      </ModalHeader>

      <ModalContent>
        <div className="space-y-6">
          <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
            <div className="flex items-center justify-between">
              <div className="text-sm">
                <p className="text-gray-500 mb-1">Current Appointment</p>
                <p className="font-semibold text-gray-900">{formattedDate} at {formattedTime}</p>
                <p className="text-gray-600 mt-1">{appointment.doctor} - {appointment.type}</p>
              </div>
              <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                appointment.status === "scheduled" ? "bg-blue-100 text-blue-700" :
                appointment.status === "confirmed" ? "bg-green-100 text-green-700" :
                appointment.status === "completed" ? "bg-gray-100 text-gray-700" :
                "bg-red-100 text-red-700"
              }`}>
                {appointment.status}
              </span>
            </div>
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => setActionType("status")}
              className={`flex-1 py-3 px-4 rounded-lg font-medium text-sm transition-all ${
                actionType === "status"
                  ? "bg-blue-600 text-white shadow-lg"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              <CheckCircle className="w-4 h-4 inline-block mr-2" />
              Update Status
            </button>
            <button
              onClick={() => setActionType("reschedule")}
              className={`flex-1 py-3 px-4 rounded-lg font-medium text-sm transition-all ${
                actionType === "reschedule"
                  ? "bg-blue-600 text-white shadow-lg"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              <Clock className="w-4 h-4 inline-block mr-2" />
              Reschedule
            </button>
            <button
              onClick={() => setActionType("notes")}
              className={`flex-1 py-3 px-4 rounded-lg font-medium text-sm transition-all ${
                actionType === "notes"
                  ? "bg-blue-600 text-white shadow-lg"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              <FileText className="w-4 h-4 inline-block mr-2" />
              Add Note
            </button>
          </div>

          {actionType === "status" && (
            <div>
              <Select
                label="Select New Status"
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value as AppointmentStatus)}
                options={APPOINTMENT_STATUSES.map(status => ({
                  value: status,
                  label: status.charAt(0).toUpperCase() + status.slice(1)
                }))}
              />
              {selectedStatus === "cancelled" && (
                <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-lg flex items-start gap-2">
                  <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-red-700">This will cancel the appointment. Patient will need to be notified.</p>
                </div>
              )}
            </div>
          )}

          {actionType === "reschedule" && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  New Date
                </label>
                <Input
                  type="date"
                  value={newDate}
                  onChange={(e) => setNewDate(e.target.value)}
                  min={new Date().toISOString().split('T')[0]}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  New Time
                </label>
                <Input
                  type="time"
                  value={newTime}
                  onChange={(e) => setNewTime(e.target.value)}
                />
              </div>
              <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg flex items-start gap-2">
                <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-blue-700">Patient will be notified about the reschedule.</p>
              </div>
            </div>
          )}

          {actionType === "notes" && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Appointment Note
              </label>
              <textarea
                value={note}
                onChange={(e) => setNote(e.target.value)}
                rows={4}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                placeholder="Add notes about this appointment..."
              />
              <p className="text-xs text-gray-500 mt-2">Notes are visible to all staff members</p>
            </div>
          )}
        </div>
      </ModalContent>

      <ModalFooter>
        <Button
          variant="outlined"
          onClick={onClose}
          disabled={isSubmitting}
        >
          Cancel
        </Button>
        <Button
          onClick={handleSubmit}
          isLoading={isSubmitting}
        >
          {actionType === "status" && "Update Status"}
          {actionType === "reschedule" && "Reschedule"}
          {actionType === "notes" && "Add Note"}
        </Button>
      </ModalFooter>
    </Modal>
  );
}

