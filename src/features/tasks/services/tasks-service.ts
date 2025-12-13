import { api } from '@/src/shared/services/api';
import { Task, TaskFormData } from '../types';

export const tasksService = {
  async getTasks(): Promise<Task[]> {
    return api.get<Task[]>('/api/tasks');
  },

  async createTask(data: TaskFormData): Promise<Task> {
    return api.post<Task>('/api/tasks', data);
  },

  async updateTask(id: string, data: Partial<Task>): Promise<void> {
    return api.put<void>(`/api/tasks/${id}`, data);
  },

  async deleteTask(id: string): Promise<void> {
    return api.delete<void>(`/api/tasks/${id}`);
  },
};

