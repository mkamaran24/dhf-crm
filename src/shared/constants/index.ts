export const LEAD_SOURCES = [
  "Website",
  "Referral",
  "Ad Campaign",
  "Social Media",
  "Cold Call",
  "Event"
] as const;

export const LEAD_STATUSES = ["New", "Contacted", "Converted"] as const;

export const PATIENT_STATUSES = ["Active", "Inactive", "Archived"] as const;

export const TASK_PRIORITIES = ["Low", "Medium", "High"] as const;

export const TASK_STATUSES = ["Pending", "Done"] as const;

export const APPOINTMENT_TYPES_RAW = [
  "Check-up",
  "Consultation",
  "Follow-up",
  "Treatment",
  "Emergency",
  "Teeth Cleaning",
  "Root Canal"
] as const;

export const APPOINTMENT_TYPES = APPOINTMENT_TYPES_RAW.map(type => ({
  label: type,
  value: type
}));

export const DOCTORS_RAW = [
  "Dr. Smith",
  "Dr. Jones",
  "Dr. Emily Brown"
] as const;

export const DOCTORS = DOCTORS_RAW.map(doctor => ({
  label: doctor,
  value: doctor
}));

export const APPOINTMENT_STATUSES = [
  "scheduled",
  "confirmed",
  "completed",
  "cancelled"
] as const;

export const USER_ROLES = ["Admin", "Doctor", "Staff"] as const;

export const JOURNEY_STAGES = [
  "Lead",
  "Contacted",
  "Converted",
  "Onboarding",
  "Active Patient"
] as const;

export const GENDER_OPTIONS = ["Male", "Female", "Other"] as const;

export const PAGINATION_LIMITS = {
  DEFAULT: 20,
  MIN: 10,
  MAX: 100
} as const;

