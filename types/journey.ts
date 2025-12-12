export type JourneyStage = "Lead" | "Contacted" | "Converted" | "Onboarding" | "Active Patient";

export interface JourneyEvent {
  id: string;
  date: string;
  title: string;
  description?: string;
  type: "info" | "success" | "warning" | "error";
  icon?: string; // string identifier for lucide icon
}

export interface Journey {
  id: string;
  leadId?: string;
  patientId?: string;
  name: string;
  email: string;
  currentStage: JourneyStage;
  progress: number; // 0-100
  events: JourneyEvent[];
  createdAt: string;
  updatedAt: string;
}
