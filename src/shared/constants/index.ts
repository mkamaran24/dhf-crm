export const REFERRAL_SOURCES = [
  { value: "Friend", label: "Friend", isPerson: true },
  { value: "Family Member", label: "Family Member", isPerson: true },
  { value: "Colleague", label: "Colleague", isPerson: true },
  { value: "Doctor Referral", label: "Doctor Referral", isPerson: true },
  { value: "Patient Referral", label: "Patient Referral", isPerson: true },
  { value: "Facebook", label: "Facebook", isPerson: false },
  { value: "Instagram", label: "Instagram", isPerson: false },
  { value: "Twitter", label: "Twitter", isPerson: false },
  { value: "LinkedIn", label: "LinkedIn", isPerson: false },
  { value: "Website", label: "Website", isPerson: false },
  { value: "Google Search", label: "Google Search", isPerson: false },
  { value: "Advertisement", label: "Advertisement", isPerson: false },
  { value: "Event", label: "Event", isPerson: false },
  { value: "Other", label: "Other", isPerson: false },
] as const;

export const LEAD_STATUSES = ["Contacted", "Converted"] as const;

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

export const DEPARTMENTS_RAW = [
  "General Dentistry",
  "Orthodontics",
  "Oral Surgery",
  "Pediatric Dentistry",
  "Endodontics",
  "Periodontics"
] as const;

export const DEPARTMENTS = DEPARTMENTS_RAW.map(dept => ({
  label: dept,
  value: dept
}));

export const TIME_FILTERS = [
  { label: "Today", value: "today" },
  { label: "This Week", value: "week" },
  { label: "This Month", value: "month" }
] as const;

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

export const IRAQI_CITIES = [
  { name: "Baghdad", addresses: ["Karrada, Baghdad, Iraq", "Al-Mansour, Baghdad, Iraq", "Al-Karada, Baghdad, Iraq", "Al-Jadriya, Baghdad, Iraq"] },
  { name: "Basra", addresses: ["Al-Ashar, Basra, Iraq", "Al-Maqal, Basra, Iraq", "Al-Tanuma, Basra, Iraq"] },
  { name: "Mosul", addresses: ["Al-Majmoua Al-Thaqafiya, Mosul, Iraq", "Al-Muthanna, Mosul, Iraq", "Al-Zahra, Mosul, Iraq"] },
  { name: "Erbil", addresses: ["Ankawa, Erbil, Iraq", "Ainkawa, Erbil, Iraq", "Erbil City Center, Erbil, Iraq"] },
  { name: "Najaf", addresses: ["Al-Mishraq, Najaf, Iraq", "Al-Kufa, Najaf, Iraq", "Al-Sadr City, Najaf, Iraq"] },
  { name: "Karbala", addresses: ["Al-Hussein, Karbala, Iraq", "Al-Abbas, Karbala, Iraq", "Al-Mukhayam, Karbala, Iraq"] },
  { name: "Sulaymaniyah", addresses: ["Bakhtiyari, Sulaymaniyah, Iraq", "Sarchinar, Sulaymaniyah, Iraq", "Azadi, Sulaymaniyah, Iraq"] },
  { name: "Kirkuk", addresses: ["Al-Quds, Kirkuk, Iraq", "Al-Hawija, Kirkuk, Iraq", "Al-Rashad, Kirkuk, Iraq"] },
  { name: "Nasiriyah", addresses: ["Al-Hay, Nasiriyah, Iraq", "Al-Shatra, Nasiriyah, Iraq", "Al-Rifai, Nasiriyah, Iraq"] },
  { name: "Amarah", addresses: ["Al-Majidiyah, Amarah, Iraq", "Al-Kahla, Amarah, Iraq", "Al-Maimouna, Amarah, Iraq"] },
  { name: "Ramadi", addresses: ["Al-Andalus, Ramadi, Iraq", "Al-Taamim, Ramadi, Iraq", "Al-Habbaniyah, Ramadi, Iraq"] },
  { name: "Baqubah", addresses: ["Al-Muallimin, Baqubah, Iraq", "Al-Khalis, Baqubah, Iraq", "Al-Muqdadiyah, Baqubah, Iraq"] },
  { name: "Samarra", addresses: ["Al-Askari, Samarra, Iraq", "Al-Dour, Samarra, Iraq", "Al-Tikriti, Samarra, Iraq"] },
  { name: "Fallujah", addresses: ["Al-Jumhuriya, Fallujah, Iraq", "Al-Nuaimiya, Fallujah, Iraq", "Al-Saqlawiya, Fallujah, Iraq"] },
  { name: "Dohuk", addresses: ["Zakho Road, Dohuk, Iraq", "Dohuk City Center, Dohuk, Iraq", "Simele, Dohuk, Iraq"] },
  { name: "Kut", addresses: ["Al-Shaheed, Kut, Iraq", "Al-Hay, Kut, Iraq", "Al-Nu'maniyah, Kut, Iraq"] },
  { name: "Hillah", addresses: ["Babylon, Hillah, Iraq", "Al-Musayyib, Hillah, Iraq", "Al-Hashimiyah, Hillah, Iraq"] },
  { name: "Diwaniyah", addresses: ["Al-Qadisiyah, Diwaniyah, Iraq", "Al-Shamiyah, Diwaniyah, Iraq", "Al-Hamza, Diwaniyah, Iraq"] },
  { name: "Samawah", addresses: ["Al-Muthanna, Samawah, Iraq", "Al-Rumaitha, Samawah, Iraq", "Al-Salman, Samawah, Iraq"] },
  { name: "Tikrit", addresses: ["Al-Qadisiya, Tikrit, Iraq", "Al-Dour, Tikrit, Iraq", "Al-Alam, Tikrit, Iraq"] },
] as const;

