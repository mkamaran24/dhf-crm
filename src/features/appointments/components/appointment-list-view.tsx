"use client";

import { Calendar } from "lucide-react";
import { Appointment } from "../types";
import { AppointmentCard } from "./appointment-card";
import { Card, CardContent } from "@/src/shared/components/ui";
import { AppointmentStatus } from "@/src/shared/types";

interface AppointmentListViewProps {
  appointments: Appointment[];
  onUpdateStatus?: (appointmentId: string, status: AppointmentStatus) => Promise<void>;
  onReschedule?: (appointmentId: string, newDate: string, newTime: string) => Promise<void>;
  onAddNote?: (appointmentId: string, note: string) => Promise<void>;
  selectedIds?: string[];
  onSelect?: (appointmentId: string) => void;
}

export function AppointmentListView({ 
  appointments, 
  onUpdateStatus, 
  onReschedule, 
  onAddNote,
  selectedIds = [],
  onSelect
}: AppointmentListViewProps) {
  if (appointments.length === 0) {
    return (
      <Card>
        <CardContent className="p-16 text-center">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Calendar className="w-8 h-8 text-gray-400" />
          </div>
          <p className="text-gray-900 font-semibold mb-1">No appointments found</p>
          <p className="text-sm text-gray-500">Try adjusting your filters or create a new appointment</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {appointments.map((appointment) => (
        <AppointmentCard
          key={appointment.id}
          appointment={appointment}
          view="list"
          onUpdateStatus={onUpdateStatus}
          onReschedule={onReschedule}
          onAddNote={onAddNote}
          isSelected={selectedIds.includes(appointment.id)}
          onSelect={onSelect}
        />
      ))}
    </div>
  );
}

