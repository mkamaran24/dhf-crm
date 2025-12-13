import { TaskPriority, TaskStatus } from '@/src/shared/types';

export interface Task {
  id: string;
  title: string;
  assignee: string;
  status: TaskStatus;
  priority: TaskPriority;
  dueDate: string;
  relatedTo?: {
    type: 'Lead' | 'Patient';
    name: string;
    id?: string;
  };
}

export interface TaskFormData {
  title: string;
  assignee: string;
  priority: TaskPriority;
  dueDate: string;
  relatedTo?: {
    type: 'Lead' | 'Patient';
    name: string;
    id?: string;
  };
}

