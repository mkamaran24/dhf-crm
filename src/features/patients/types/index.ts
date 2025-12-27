import { PatientStatus, Gender } from '@/src/shared/types';

export interface Visit {
  id: string;
  date: string;
  time?: string;
  reason: string;
  notes: string;
  doctor: string;
  forms?: Array<{
    type: string;
    completed: boolean;
    lastUpdate: string;
  }>;
}

export interface PatientDocument {
  id: string;
  name: string;
  type: string;
  uploadedAt: string;
  size: string;
}

export interface Patient {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  dob: string;
  gender: Gender;
  address: string;
  lastVisit?: string;
  nextVisit?: string;
  status: PatientStatus;
  visits?: Visit[];
  documents?: PatientDocument[];
  createdAt: string;
}

export interface PatientFilters {
  status?: PatientStatus;
  search?: string;
}

export interface PatientFormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  dob: string;
  gender: Gender;
  address: string;
}

