import { LeadStatus } from '@/src/shared/types';

export interface Lead {
  id: string;
  name: string;
  phone: string;
  phoneSecondary?: string;
  status: LeadStatus;
  followUpDate?: string;
  notes?: string;
  dob?: string;
  gender?: string;
  maritalStatus?: string;
  language?: string;
  country?: string;
  city?: string;
  address?: string;
  patientType?: string;
  documents?: Array<{ id: string; name: string; type: string; size: string; uploadedAt: string }>;
  budgetMin?: number;
  budgetMax?: number;
  referralSource?: string;
  referralPersonName?: string;
  referralPersonPhone?: string;
  previousDoctors?: string;
  sharedEducationalMaterials?: boolean;
  sharedEducationalMaterialsNotes?: string;
  sharedEducationalMaterialsFiles?: Array<{ id: string; name: string; type: string; size: string; uploadedAt: string }>;
  hasCompetitorsConsidered?: boolean;
  competitorsConsidered?: string[];
  decisionInfluencers?: string[];
  painPoints?: string[];
  knowledgeRating?: number;
  commitLevel?: number;
  createdAt: string;
}

export interface LeadFilters {
  status?: LeadStatus;
  search?: string;
  dateRange?: 'today' | 'week' | 'month' | 'all';
}

export interface LeadFormData {
  name: string;
  phone: string;
  phoneSecondary?: string;
  status: LeadStatus;
  followUpDate?: string;
  notes?: string;
  dob?: string;
  gender?: string;
  maritalStatus?: string;
  language?: string;
  country?: string;
  city?: string;
  address?: string;
  patientType?: string;
  documents?: Array<{ id: string; name: string; type: string; size: string; uploadedAt: string }>;
  budgetMin?: number;
  budgetMax?: number;
  referralSource?: string;
  referralPersonName?: string;
  referralPersonPhone?: string;
  previousDoctors?: string;
  sharedEducationalMaterials?: boolean;
  sharedEducationalMaterialsNotes?: string;
  sharedEducationalMaterialsFiles?: Array<{ id: string; name: string; type: string; size: string; uploadedAt: string }>;
  hasCompetitorsConsidered?: boolean;
  competitorsConsidered?: string[];
  decisionInfluencers?: string[];
  painPoints?: string[];
  knowledgeRating?: number;
  commitLevel?: number;
}
