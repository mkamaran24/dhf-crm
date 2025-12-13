"use client";

import { useState } from "react";
import { Modal, ModalHeader, ModalContent, ModalFooter, Button } from "@/src/shared/components/ui";
import { Bell, MessageSquare, Phone, Calendar, Clock } from "lucide-react";
import { Appointment } from "../types";

interface AppointmentReminderModalProps {
  isOpen: boolean;
  appointment: Appointment | null;
  onClose: () => void;
  onSendReminder: (type: "sms" | "whatsapp", appointment: Appointment) => Promise<void>;
}

export function AppointmentReminderModal({
  isOpen,
  appointment,
  onClose,
  onSendReminder,
}: AppointmentReminderModalProps) {
  const [isSending, setIsSending] = useState(false);
  const [selectedType, setSelectedType] = useState<"sms" | "whatsapp" | null>(null);

  if (!appointment) return null;

  const handleSend = async () => {
    if (!selectedType) return;

    setIsSending(true);
    try {
      await onSendReminder(selectedType, appointment);
      onClose();
      setSelectedType(null);
    } catch (error) {
      console.error("Error sending reminder:", error);
    } finally {
      setIsSending(false);
    }
  };

  const appointmentDate = new Date(appointment.date);
  const formattedDate = appointmentDate.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
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
          <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center">
            <Bell className="w-6 h-6 text-blue-600" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900">Send Appointment Reminder</h2>
            <p className="text-sm text-gray-500 mt-1">Notify patient about upcoming appointment</p>
          </div>
        </div>
      </ModalHeader>

      <ModalContent>
        <div className="space-y-6">
          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border-2 border-blue-200 rounded-xl p-5">
            <h3 className="font-semibold text-gray-900 mb-3">Appointment Details</h3>
            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2 text-gray-700">
                <Calendar className="w-4 h-4 text-gray-500" />
                <span className="font-medium">{formattedDate}</span>
              </div>
              <div className="flex items-center gap-2 text-gray-700">
                <Clock className="w-4 h-4 text-gray-500" />
                <span className="font-medium">{formattedTime}</span>
              </div>
              <div className="flex items-center gap-2 text-gray-700">
                <span className="font-medium">Patient:</span>
                <span>{appointment.patientName}</span>
              </div>
              <div className="flex items-center gap-2 text-gray-700">
                <span className="font-medium">Doctor:</span>
                <span>{appointment.doctor}</span>
              </div>
            </div>
          </div>

          <div>
            <h3 className="font-semibold text-gray-900 mb-3">Select Reminder Method</h3>
            <div className="grid grid-cols-2 gap-4">
              <button
                onClick={() => setSelectedType("sms")}
                className={`p-5 rounded-xl border-2 transition-all text-left ${
                  selectedType === "sms"
                    ? "border-blue-500 bg-blue-50 shadow-md"
                    : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                }`}
              >
                <div className="flex items-center gap-3 mb-2">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                    selectedType === "sms" ? "bg-blue-600" : "bg-gray-200"
                  }`}>
                    <MessageSquare className={`w-5 h-5 ${
                      selectedType === "sms" ? "text-white" : "text-gray-600"
                    }`} />
                  </div>
                  <span className="font-bold text-gray-900">SMS</span>
                </div>
                <p className="text-xs text-gray-600">Send text message reminder</p>
              </button>

              <button
                onClick={() => setSelectedType("whatsapp")}
                className={`p-5 rounded-xl border-2 transition-all text-left ${
                  selectedType === "whatsapp"
                    ? "border-green-500 bg-green-50 shadow-md"
                    : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                }`}
              >
                <div className="flex items-center gap-3 mb-2">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                    selectedType === "whatsapp" ? "bg-green-600" : "bg-gray-200"
                  }`}>
                    <Phone className={`w-5 h-5 ${
                      selectedType === "whatsapp" ? "text-white" : "text-gray-600"
                    }`} />
                  </div>
                  <span className="font-bold text-gray-900">WhatsApp</span>
                </div>
                <p className="text-xs text-gray-600">Send WhatsApp message</p>
              </button>
            </div>
          </div>
        </div>
      </ModalContent>

      <ModalFooter>
        <Button
          variant="outlined"
          onClick={onClose}
          disabled={isSending}
        >
          Cancel
        </Button>
        <Button
          onClick={handleSend}
          isLoading={isSending}
          disabled={!selectedType}
        >
          <Bell className="w-4 h-4 mr-2" />
          Send Reminder
        </Button>
      </ModalFooter>
    </Modal>
  );
}

