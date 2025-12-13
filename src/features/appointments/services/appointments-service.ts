import { api } from '@/src/shared/services/api';
import { Appointment } from '../types';

interface AppointmentsResponse {
  appointments: Appointment[];
}

export const appointmentsService = {
  async getAppointments(params?: { doctor?: string }): Promise<Appointment[]> {
    const searchParams = new URLSearchParams();
    
    if (params?.doctor && params.doctor !== 'All Doctors') {
      searchParams.append('doctor', params.doctor);
    }
    
    const query = searchParams.toString();
    return api.get<Appointment[]>(`/api/appointments${query ? `?${query}` : ''}`);
  },

  async getAppointment(id: string): Promise<Appointment> {
    return api.get<Appointment>(`/api/appointments/${id}`);
  },

  async createAppointment(data: Omit<Appointment, 'id'>): Promise<Appointment> {
    return api.post<Appointment>('/api/appointments', data);
  },

  async updateAppointment(id: string, data: Partial<Appointment>): Promise<void> {
    return api.put<void>(`/api/appointments/${id}`, data);
  },

  async deleteAppointment(id: string): Promise<void> {
    return api.delete<void>(`/api/appointments/${id}`);
  },
};

