import { useState, useEffect, useCallback, useMemo } from 'react';
import { Appointment } from '../types';
import { appointmentsService } from '../services/appointments-service';
import { AppointmentStatus } from '@/src/shared/types';

interface UseAppointmentsOptions {
  doctorFilter?: string;
  statusFilter?: AppointmentStatus | "all";
}

export function useAppointments(options: UseAppointmentsOptions = {}) {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAppointments = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const data = await appointmentsService.getAppointments({
        doctor: options.doctorFilter !== "all" ? options.doctorFilter : undefined,
      });
      setAppointments(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch appointments');
      console.error("Error fetching appointments:", err);
    } finally {
      setIsLoading(false);
    }
  }, [options.doctorFilter]);

  useEffect(() => {
    fetchAppointments();
  }, [fetchAppointments]);

  const filteredAppointments = useMemo(() => {
    let filtered = [...appointments];

    if (options.statusFilter && options.statusFilter !== "all") {
      filtered = filtered.filter(apt => apt.status === options.statusFilter);
    }

    return filtered;
  }, [appointments, options.statusFilter]);

  const getAppointmentsForDay = useCallback((date: Date) => {
    return filteredAppointments.filter(apt => {
      const aptDate = new Date(apt.date);
      return (
        aptDate.getDate() === date.getDate() &&
        aptDate.getMonth() === date.getMonth() &&
        aptDate.getFullYear() === date.getFullYear()
      );
    });
  }, [filteredAppointments]);

  const deleteAppointment = async (appointmentId: string) => {
    setAppointments(appointments.filter(a => a.id !== appointmentId));
    
    try {
      await appointmentsService.deleteAppointment(appointmentId);
      fetchAppointments();
    } catch (error) {
      console.error("Error deleting appointment:", error);
      fetchAppointments();
    }
  };

  return {
    appointments: filteredAppointments,
    allAppointments: appointments,
    isLoading,
    error,
    getAppointmentsForDay,
    deleteAppointment,
    refetch: fetchAppointments,
    refreshAppointments: fetchAppointments,
  };
}
