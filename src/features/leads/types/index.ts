import { LeadStatus } from '@/src/shared/types';

export interface Lead {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  source: string;
  status: LeadStatus;
  notes?: string;
  createdAt: string;
}

export interface LeadFilters {
  status?: LeadStatus;
  source?: string;
  search?: string;
}

export interface LeadFormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  source: string;
  status: LeadStatus;
  notes?: string;
}

