import { Appointment } from "../types";

export interface ConflictResult {
  hasConflict: boolean;
  conflictingAppointments: Appointment[];
  message?: string;
}

export function detectAppointmentConflicts(
  appointments: Appointment[],
  newAppointment: {
    date: string;
    doctor: string;
    duration?: number;
  }
): ConflictResult {
  const newDate = new Date(newAppointment.date);
  const duration = newAppointment.duration || 30;
  const newEndTime = new Date(newDate.getTime() + duration * 60000);

  const conflicting = appointments.filter(apt => {
    if (apt.status === "cancelled") return false;
    if (apt.doctor !== newAppointment.doctor) return false;

    const aptDate = new Date(apt.date);
    const aptDuration = 30;
    const aptEndTime = new Date(aptDate.getTime() + aptDuration * 60000);

    const isOverlapping = 
      (newDate >= aptDate && newDate < aptEndTime) ||
      (newEndTime > aptDate && newEndTime <= aptEndTime) ||
      (newDate <= aptDate && newEndTime >= aptEndTime);

    return isOverlapping;
  });

  if (conflicting.length > 0) {
    return {
      hasConflict: true,
      conflictingAppointments: conflicting,
      message: `Doctor ${newAppointment.doctor} already has ${conflicting.length} appointment(s) at this time.`
    };
  }

  return {
    hasConflict: false,
    conflictingAppointments: []
  };
}

export function getDoctorAvailability(
  appointments: Appointment[],
  doctor: string,
  date: Date
): { available: boolean; busySlots: string[] } {
  const dateStr = date.toISOString().split('T')[0];
  
  const doctorAppointments = appointments.filter(apt => 
    apt.doctor === doctor &&
    apt.status !== "cancelled" &&
    apt.date.startsWith(dateStr)
  );

  const busySlots = doctorAppointments.map(apt => {
    const time = new Date(apt.date);
    return time.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
  });

  return {
    available: doctorAppointments.length < 12,
    busySlots
  };
}

