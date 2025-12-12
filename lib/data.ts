
export interface Appointment {
  id: string;
  patientName: string;
  doctor: string;
  date: string; // ISO string
  type: string;
  status: string;
  notes?: string;
}

export let appointments: Appointment[] = [
  {
    id: '1',
    patientName: 'John Doe',
    doctor: 'Dr. Smith',
    date: '2025-12-15T10:00:00',
    type: 'Check-up',
    status: 'scheduled',
    notes: 'Routine check-up'
  },
  {
    id: '2',
    patientName: 'Jane Smith',
    doctor: 'Dr. Jones',
    date: '2025-12-16T14:30:00',
    type: 'Consultation',
    status: 'scheduled',
    notes: 'New patient consultation'
  },
  {
    id: '3',
    patientName: 'Alice Johnson',
    doctor: 'Dr. Smith',
    date: '2025-12-15T11:30:00',
    type: 'Follow-up',
    status: 'confirmed',
    notes: 'Follow up on blood work'
  }
];

export const addAppointment = (apt: Appointment) => {
  appointments.push(apt);
};

export const updateAppointment = (id: string, updates: Partial<Appointment>) => {
  appointments = appointments.map(apt => apt.id === id ? { ...apt, ...updates } : apt);
};

export const deleteAppointment = (id: string) => {
  appointments = appointments.filter(apt => apt.id !== id);
};

export const getAppointment = (id: string) => {
  return appointments.find(apt => apt.id === id);
};

export interface Task {
  id: string;
  title: string;
  assignee: string;
  status: 'Pending' | 'Done';
  priority: 'Low' | 'Medium' | 'High';
  dueDate: string;
  relatedTo?: {
    type: 'Lead' | 'Patient';
    name: string;
    id?: string;
  };
}

export let tasks: Task[] = [
  {
    id: '1',
    title: 'Follow up with New Lead',
    assignee: 'Sarah Wilson',
    status: 'Pending',
    priority: 'High',
    dueDate: '2025-12-14',
    relatedTo: { type: 'Lead', name: 'Michael Scott', id: '1' }
  },
  {
    id: '2',
    title: 'Prepare Treatment Plan',
    assignee: 'Dr. Smith',
    status: 'Pending',
    priority: 'Medium',
    dueDate: '2025-12-16',
    relatedTo: { type: 'Patient', name: 'Jim Halpert', id: '2' }
  },
  {
    id: '3',
    title: 'Post-op Call',
    assignee: 'Nurse Joy',
    status: 'Done',
    priority: 'High',
    dueDate: '2025-12-10',
    relatedTo: { type: 'Patient', name: 'Pam Beesly', id: '3' }
  }
];

export const addTask = (task: Task) => {
  tasks.push(task);
};

export const updateTask = (id: string, updates: Partial<Task>) => {
  tasks = tasks.map(t => t.id === id ? { ...t, ...updates } : t);
};

export const deleteTask = (id: string) => {
  tasks = tasks.filter(t => t.id !== id);
};

// --- LEADS ---
export type LeadStatus = "New" | "Contacted" | "Converted";

export interface Lead {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  source: string;
  status: LeadStatus;
  createdAt: string;
}

const generateMockLeads = (): Lead[] => {
  const firstNames = ["Alice", "Bob", "Charlie", "Diana", "Edward", "Fiona", "George", "Hannah", "Ian", "Julia"];
  const lastNames = ["Smith", "Johnson", "Williams", "Brown", "Jones", "Garcia", "Miller", "Davis", "Rodriguez", "Martinez"];
  const sources = ["Website", "Referral", "Ad Campaign", "Social Media", "Cold Call", "Event"];
  const statuses: LeadStatus[] = ["New", "Contacted", "Converted"];
  
  const leads: Lead[] = [];
  
  for (let i = 1; i <= 50; i++) {
    leads.push({
      id: i.toString(),
      firstName: firstNames[Math.floor(Math.random() * firstNames.length)],
      lastName: lastNames[Math.floor(Math.random() * lastNames.length)],
      email: `user${i}@example.com`,
      phone: `555-${String(i).padStart(4, '0')}`,
      source: sources[Math.floor(Math.random() * sources.length)],
      status: statuses[Math.floor(Math.random() * statuses.length)],
      createdAt: new Date(Date.now() - Math.random() * 90 * 24 * 60 * 60 * 1000).toISOString(),
    });
  }
  return leads;
};

export let leads: Lead[] = generateMockLeads();

export const addLead = (lead: Lead) => leads.push(lead);
export const updateLead = (id: string, updates: Partial<Lead>) => {
  leads = leads.map(l => l.id === id ? { ...l, ...updates } : l);
  return leads.find(l => l.id === id);
};
export const deleteLead = (id: string) => {
  leads = leads.filter(l => l.id !== id);
};

// --- PATIENTS ---
export interface Patient {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  dob: string;
  gender: string;
  address: string;
  lastVisit: string;
  nextVisit?: string;
  status: 'Active' | 'Inactive' | 'Archived';
  balance: number;
  visits?: {
    id: string;
    date: string;
    doctor: string;
    reason: string;
    notes: string;
  }[];
  documents?: {
    id: string;
    name: string;
    type: string;
    size: string;
    uploadedAt: string;
  }[];
}

export let patients: Patient[] = [
  {
    id: '1',
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@example.com',
    phone: '555-0101',
    dob: '1985-05-15',
    gender: 'Male',
    address: '123 Main St, Springfield',
    lastVisit: '2025-11-20',
    nextVisit: '2025-12-15',
    status: 'Active',
    balance: 150.00,
    visits: [
      {
        id: 'v1',
        date: '2025-11-20',
        doctor: 'Dr. Smith',
        reason: 'Regular Checkup',
        notes: 'Patient reported mild sensitivity. No cavities found.'
      }
    ],
    documents: [
      {
        id: 'd1',
        name: 'X-Ray results.pdf',
        type: 'PDF',
        size: '2.4 MB',
        uploadedAt: '2025-11-20'
      }
    ]
  },
  {
    id: '2',
    firstName: 'Jane',
    lastName: 'Smith',
    email: 'jane.smith@example.com',
    phone: '555-0102',
    dob: '1990-08-22',
    gender: 'Female',
    address: '456 Oak Ave, Springfield',
    lastVisit: '2025-10-10',
    status: 'Active',
    balance: 0.00,
    visits: [],
    documents: []
  },
  {
    id: '3',
    firstName: 'Robert',
    lastName: 'Johnson',
    email: 'bob.j@example.com',
    phone: '555-0103',
    dob: '1978-03-30',
    gender: 'Male',
    address: '789 Pine Ln, Springfield',
    lastVisit: '2025-09-05',
    status: 'Inactive',
    balance: 0.00,
    visits: [],
    documents: []
  }
];

export const addPatient = (patient: Patient) => patients.push(patient);
export const updatePatient = (id: string, updates: Partial<Patient>) => {
  patients = patients.map(p => p.id === id ? { ...p, ...updates } : p);
};
export const deletePatient = (id: string) => {
  patients = patients.filter(p => p.id !== id);
};
export const getPatient = (id: string) => patients.find(p => p.id === id);

// --- AUTH USER ---
export interface User {
  id: string;
  name: string;
  email: string;
  avatar: string;
  role: 'Admin' | 'Doctor' | 'Staff';
}

export const currentUser: User = {
  id: 'u1',
  name: 'Dr. Emily Brown',
  email: 'emily.brown@clinic.com',
  avatar: 'https://ui-avatars.com/api/?name=Emily+Brown&background=0D8ABC&color=fff',
  role: 'Doctor'
};
