export interface Visit {
  id: string;
  date: string;
  reason: string;
  notes: string;
  doctor: string;
}

export interface PatientDocument {
  id: string;
  name: string;
  type: string;
  uploadedAt: string;
  size: string;
}

export interface Patient {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  dob: string;
  gender: "Male" | "Female" | "Other";
  address: string;
  visits: Visit[];
  documents: PatientDocument[];
  createdAt: string;
}
