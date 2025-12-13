"use client";

import { useState } from "react";
import { Modal, ModalHeader, ModalContent, ModalFooter, Button, Select, Input } from "@/src/shared/components/ui";
import { Repeat, Calendar, AlertCircle } from "lucide-react";

interface RecurringAppointmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreateRecurring: (config: RecurringConfig) => Promise<void>;
}

export interface RecurringConfig {
  frequency: "daily" | "weekly" | "biweekly" | "monthly";
  occurrences: number;
  startDate: string;
  time: string;
  patientName: string;
  doctor: string;
  type: string;
}

const FREQUENCY_OPTIONS = [
  { label: "Daily", value: "daily" },
  { label: "Weekly", value: "weekly" },
  { label: "Bi-weekly", value: "biweekly" },
  { label: "Monthly", value: "monthly" },
];

export function RecurringAppointmentModal({
  isOpen,
  onClose,
  onCreateRecurring,
}: RecurringAppointmentModalProps) {
  const [frequency, setFrequency] = useState<"daily" | "weekly" | "biweekly" | "monthly">("weekly");
  const [occurrences, setOccurrences] = useState(4);
  const [startDate, setStartDate] = useState("");
  const [time, setTime] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!startDate || !time) {
      alert("Please fill in all required fields");
      return;
    }

    setIsSubmitting(true);
    try {
      await onCreateRecurring({
        frequency,
        occurrences,
        startDate,
        time,
        patientName: "Patient Name",
        doctor: "Dr. Smith",
        type: "Follow-up"
      });
      onClose();
    } catch (error) {
      console.error("Error creating recurring appointment:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const getFrequencyDescription = () => {
    switch (frequency) {
      case "daily":
        return `${occurrences} appointments, one each day`;
      case "weekly":
        return `${occurrences} appointments, one each week`;
      case "biweekly":
        return `${occurrences} appointments, one every two weeks`;
      case "monthly":
        return `${occurrences} appointments, one each month`;
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalHeader>
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center shadow-lg">
            <Repeat className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900">Create Recurring Appointment</h2>
            <p className="text-sm text-gray-500 mt-1">Schedule multiple appointments at once</p>
          </div>
        </div>
      </ModalHeader>

      <ModalContent>
        <div className="space-y-6">
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
            <div className="text-sm text-blue-700">
              <p className="font-medium mb-1">Recurring appointments help with:</p>
              <ul className="list-disc list-inside space-y-1 text-blue-600">
                <li>Regular check-ups</li>
                <li>Treatment plans</li>
                <li>Follow-up visits</li>
              </ul>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Start Date
              </label>
              <Input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                min={new Date().toISOString().split('T')[0]}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Time
              </label>
              <Input
                type="time"
                value={time}
                onChange={(e) => setTime(e.target.value)}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Frequency
            </label>
            <Select
              value={frequency}
              onChange={(e) => setFrequency(e.target.value as any)}
              options={FREQUENCY_OPTIONS}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Number of Occurrences
            </label>
            <Input
              type="number"
              min="1"
              max="52"
              value={occurrences}
              onChange={(e) => setOccurrences(Number(e.target.value))}
            />
          </div>

          <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
            <div className="flex items-center gap-2 mb-2">
              <Calendar className="w-5 h-5 text-gray-600" />
              <h4 className="font-semibold text-gray-900">Summary</h4>
            </div>
            <p className="text-sm text-gray-700">
              {getFrequencyDescription()}
            </p>
            {startDate && (
              <p className="text-sm text-gray-600 mt-1">
                Starting from {new Date(startDate).toLocaleDateString()}
              </p>
            )}
          </div>
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
          <Repeat className="w-4 h-4 mr-2" />
          Create {occurrences} Appointments
        </Button>
      </ModalFooter>
    </Modal>
  );
}

