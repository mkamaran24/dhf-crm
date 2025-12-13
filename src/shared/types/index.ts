export type LeadStatus = "New" | "Contacted" | "Converted";
export type PatientStatus = "Active" | "Inactive" | "Archived";
export type TaskPriority = "Low" | "Medium" | "High";
export type TaskStatus = "Pending" | "Done";
export type AppointmentStatus = "scheduled" | "confirmed" | "completed" | "cancelled";
export type UserRole = "Admin" | "Doctor" | "Staff";
export type Gender = "Male" | "Female" | "Other";
export type JourneyStage = "Lead" | "Contacted" | "Converted" | "Onboarding" | "Active Patient";

export interface PaginationInfo {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasMore: boolean;
}

export interface ApiResponse<T> {
  data: T;
  pagination?: PaginationInfo;
  error?: string;
}

export interface FilterParams {
  page?: number;
  limit?: number;
  search?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

