import { AppointmentStatus } from '@/src/shared/types';

export interface Appointment {
  id: string;
  patientName: string;
  doctor: string;
  date: string;
  type: string;
  status: AppointmentStatus;
  notes?: string;
}

export interface AppointmentFormData {
  patientName: string;
  doctor: string;
  date: string;
  type: string;
  status: AppointmentStatus;
  notes?: string;
}

