export type LeadStatus = "New" | "Contacted" | "Converted";

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

export const LEAD_STATUSES: LeadStatus[] = ["New", "Contacted", "Converted"];
