import { LeadStatus } from '@/src/shared/types';

export interface Lead {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  status: LeadStatus;
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
  commitLevel?: 'Low' | 'Medium' | 'High' | 'Very High';
  createdAt: string;
}

export interface LeadFilters {
  status?: LeadStatus;
  search?: string;
}

export interface LeadFormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  status: LeadStatus;
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
  commitLevel?: 'Low' | 'Medium' | 'High' | 'Very High';
}

