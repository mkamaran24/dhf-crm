import { JourneyStage } from '@/src/shared/types';

export interface JourneyEvent {
  id: string;
  date: string;
  title: string;
  description?: string;
  type: "info" | "success" | "warning" | "error";
  icon?: string;
}

export interface Journey {
  id: string;
  leadId?: string;
  patientId?: string;
  name: string;
  email: string;
  currentStage: JourneyStage;
  progress: number;
  events: JourneyEvent[];
  createdAt: string;
  updatedAt: string;
}

