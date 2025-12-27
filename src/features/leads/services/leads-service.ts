import { api } from '@/src/shared/services/api';
import { PaginationInfo } from '@/src/shared/types';
import { Lead, LeadFilters, LeadFormData } from '../types';

interface LeadsResponse {
  leads: Lead[];
  pagination: PaginationInfo;
}

export const leadsService = {
  async getLeads(params: LeadFilters & { page?: number; limit?: number }): Promise<LeadsResponse> {
    const searchParams = new URLSearchParams();

    if (params.page) searchParams.append('page', params.page.toString());
    if (params.limit) searchParams.append('limit', params.limit.toString());
    if (params.status) searchParams.append('status', params.status);
    if (params.search) searchParams.append('search', params.search);
    if (params.dateRange) searchParams.append('dateRange', params.dateRange);

    return api.get<LeadsResponse>(`/api/leads?${searchParams}`);
  },

  async getLead(id: string): Promise<Lead> {
    return api.get<Lead>(`/api/leads/${id}`);
  },

  async createLead(data: LeadFormData): Promise<Lead> {
    return api.post<Lead>('/api/leads', data);
  },

  async updateLead(id: string, data: Partial<LeadFormData>): Promise<Lead> {
    return api.patch<Lead>(`/api/leads/${id}`, data);
  },

  async deleteLead(id: string): Promise<void> {
    return api.delete<void>(`/api/leads/${id}`);
  },

  async updateLeadStatus(id: string, status: string, followUpDate?: string): Promise<Lead> {
    return api.patch<Lead>(`/api/leads/${id}`, { status, followUpDate });
  },
};

