import { api } from '@/src/shared/services/api';
import { PaginationInfo } from '@/src/shared/types';
import { Patient, PatientFilters, PatientFormData } from '../types';

interface PatientsResponse {
  patients: Patient[];
  pagination: PaginationInfo;
}

export const patientsService = {
  async getPatients(params: PatientFilters & { page?: number; limit?: number }): Promise<PatientsResponse> {
    const searchParams = new URLSearchParams();
    
    if (params.page) searchParams.append('page', params.page.toString());
    if (params.limit) searchParams.append('limit', params.limit.toString());
    if (params.status) searchParams.append('status', params.status);
    if (params.search) searchParams.append('search', params.search);
    
    const queryString = searchParams.toString();
    const url = `/api/patients${queryString ? `?${queryString}` : ''}`;
    
    return api.get<PatientsResponse>(url);
  },

  async getPatient(id: string): Promise<Patient> {
    return api.get<Patient>(`/api/patients/${id}`);
  },

  async createPatient(data: PatientFormData): Promise<Patient> {
    return api.post<Patient>('/api/patients', data);
  },

  async updatePatient(id: string, data: Partial<PatientFormData>): Promise<Patient> {
    return api.patch<Patient>(`/api/patients/${id}`, data);
  },

  async deletePatient(id: string): Promise<void> {
    return api.delete<void>(`/api/patients/${id}`);
  },
};

