import { AppointmentStatus } from '@/src/shared/types';

export interface Appointment {
  id: string;
  patientName: string;
  phone?: string;
  doctor: string;
  date: string;
  type: string;
  status: AppointmentStatus;
  notes?: string;
  department?: string;
}

export interface AppointmentFormData {
  patientName: string;
  doctor: string;
  date: string;
  type: string;
  status: AppointmentStatus;
  notes?: string;
}

