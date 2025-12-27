import { Lead } from '@/src/features/leads/types';
import { LeadStatus } from '@/src/shared/types';
import { Patient } from '@/src/features/patients/types';
import { Appointment } from '@/src/features/appointments/types';
import { Task } from '@/src/features/tasks/types';

import { User } from '@/src/shared/types/user';

import { IRAQI_CITIES, REFERRAL_SOURCES } from '@/src/shared/constants';

const generateMockLeads = (): Lead[] => {
  /* New Lead Data Structure */
  const firstNames = ["Alice", "Bob", "Charlie", "Diana", "Edward", "Fiona", "George", "Hannah", "Ian", "Julia"];
  const lastNames = ["Smith", "Johnson", "Williams", "Brown", "Jones", "Garcia", "Miller", "Davis", "Rodriguez", "Martinez"];
  const genders = ["Male", "Female"];
  const maritalStatuses = ["Single", "Married", "Divorced", "Widowed"];
  const languages = ["English", "Arabic", "Kurdish"];
  const patientTypes = ["Cardiac", "Cardiology"];
  const commitLevels: number[] = [15, 40, 65, 90];
  const decisionInfluencers = ["Family", "Insurance", "Online Reviews", "Physician Referral"];
  const painPoints = ["Cost", "Waiting Time", "Trust", "Proximity", "Service Quality"];

  const leads: Lead[] = [];

  for (let i = 1; i <= 50; i++) {
    const randomInfluencers = decisionInfluencers.filter(() => Math.random() > 0.5);
    const randomPainPoints = painPoints.filter(() => Math.random() > 0.5);
    const randomCompetitors = Math.random() > 0.7 ? ["Competitor A", "Competitor B"] : [];
    const referralSource = REFERRAL_SOURCES[Math.floor(Math.random() * REFERRAL_SOURCES.length)];
    const isPersonReferral = referralSource.isPerson;
    const budgetMinOptions = [1000000, 2000000, 3000000, 5000000, 7000000, 10000000];
    const budgetMin = budgetMinOptions[Math.floor(Math.random() * budgetMinOptions.length)];
    const budgetMaxOptions = [5000000, 7000000, 10000000, 15000000, 20000000, 30000000, 50000000, 70000000, 100000000];
    const validMaxOptions = budgetMaxOptions.filter(max => max > budgetMin);
    const budgetMax = validMaxOptions.length > 0
      ? validMaxOptions[Math.floor(Math.random() * validMaxOptions.length)]
      : budgetMin + 5000000;

    const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
    const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];

    const statuses: LeadStatus[] = ["New", "Contacted", "Follow-up", "Ready", "Appointment Booked", "Converted"];
    const status = statuses[Math.floor(Math.random() * statuses.length)];

    // Set followUpDate for specific statuses
    let followUpDate: string | undefined = undefined;
    if (["Follow-up", "Ready", "Appointment Booked"].includes(status)) {
      const futureDate = new Date();
      futureDate.setDate(futureDate.getDate() + Math.floor(Math.random() * 14));
      followUpDate = futureDate.toISOString().split('T')[0];
    }

    // Distribute createdAt dates for testing filters:
    // 1-5: Today
    // 6-15: This week
    // 16-30: This month
    // 31-50: Older
    let createdAtDate: Date;
    if (i <= 5) {
      createdAtDate = new Date(); // Today
    } else if (i <= 15) {
      createdAtDate = new Date();
      createdAtDate.setDate(createdAtDate.getDate() - Math.floor(Math.random() * 6)); // This week
    } else if (i <= 30) {
      createdAtDate = new Date();
      createdAtDate.setDate(createdAtDate.getDate() - Math.floor(Math.random() * 25)); // This month
    } else {
      createdAtDate = new Date(Date.now() - (31 + Math.random() * 60) * 24 * 60 * 60 * 1000); // Older
    }

    leads.push({
      id: i.toString(),
      name: `${firstName} ${lastName}`,
      phone: `+964 750 ${String(i).padStart(7, '0')}`,
      phoneSecondary: Math.random() > 0.7 ? `+964 770 ${String(i).padStart(7, '0')}` : undefined,
      status,
      followUpDate,
      dob: new Date(1950 + Math.floor(Math.random() * 50), Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1).toISOString().split('T')[0],
      gender: genders[Math.floor(Math.random() * genders.length)],
      maritalStatus: maritalStatuses[Math.floor(Math.random() * maritalStatuses.length)],
      language: languages[Math.floor(Math.random() * languages.length)],
      country: "Iraq",
      city: IRAQI_CITIES[Math.floor(Math.random() * IRAQI_CITIES.length)].name,
      address: (() => {
        const selectedCity = IRAQI_CITIES[Math.floor(Math.random() * IRAQI_CITIES.length)];
        return selectedCity.addresses[Math.floor(Math.random() * selectedCity.addresses.length)];
      })(),
      patientType: patientTypes[Math.floor(Math.random() * patientTypes.length)],
      budgetMin,
      budgetMax,
      referralSource: referralSource.value,
      referralPersonName: isPersonReferral ? `${firstNames[Math.floor(Math.random() * firstNames.length)]} ${lastNames[Math.floor(Math.random() * lastNames.length)]}` : undefined,
      referralPersonPhone: isPersonReferral ? `+964 750 ${String(Math.floor(Math.random() * 10000000)).padStart(7, '0')}` : undefined,
      previousDoctors: Math.random() > 0.6 ? `Dr. ${firstNames[Math.floor(Math.random() * firstNames.length)]}` : "",
      sharedEducationalMaterials: Math.random() > 0.5,
      competitorsConsidered: randomCompetitors,
      decisionInfluencers: randomInfluencers.length > 0 ? randomInfluencers : [],
      painPoints: randomPainPoints.length > 0 ? randomPainPoints : [],
      knowledgeRating: Math.floor(Math.random() * 5) + 1,
      commitLevel: commitLevels[Math.floor(Math.random() * commitLevels.length)],
      createdAt: createdAtDate.toISOString(),
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

export const getLead = (id: string) => leads.find(l => l.id === id);

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
    createdAt: '2024-01-15T10:00:00Z',
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
    createdAt: '2024-02-20T10:00:00Z',
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
    createdAt: '2024-03-10T10:00:00Z',
    visits: [],
    documents: []
  }
];

export const addPatient = (patient: Patient) => patients.push(patient);

export const updatePatient = (id: string, updates: Partial<Patient>) => {
  patients = patients.map(p => p.id === id ? { ...p, ...updates } : p);
  return patients.find(p => p.id === id);
};

export const deletePatient = (id: string) => {
  patients = patients.filter(p => p.id !== id);
};

export const getPatient = (id: string) => patients.find(p => p.id === id);

const getRelativeDate = (days: number, hours: number = 10): string => {
  const d = new Date();
  d.setDate(d.getDate() + days);
  d.setHours(hours, 0, 0, 0);
  return d.toISOString().replace('Z', '');
};

export let appointments: Appointment[] = [
  {
    id: '1',
    patientName: 'John Doe',
    doctor: 'Dr. Smith',
    date: getRelativeDate(0, 9), // Today 9:00 AM
    type: 'Check-up',
    status: 'confirmed',
    notes: 'Routine check-up'
  },
  {
    id: '2',
    patientName: 'Jane Smith',
    doctor: 'Dr. Jones',
    date: getRelativeDate(0, 14), // Today 2:00 PM
    type: 'Consultation',
    status: 'scheduled',
    notes: 'New patient consultation'
  },
  {
    id: '3',
    patientName: 'Alice Johnson',
    doctor: 'Dr. Emily Brown',
    date: getRelativeDate(1, 11), // Tomorrow 11:00 AM
    type: 'Follow-up',
    status: 'confirmed',
    notes: 'Follow up on blood work'
  },
  {
    id: '4',
    patientName: 'Michael Wilson',
    doctor: 'Dr. Smith',
    date: getRelativeDate(2, 10), // 2 days from now
    type: 'Teeth Cleaning',
    status: 'scheduled',
    notes: 'Regular scaling'
  },
  {
    id: '5',
    patientName: 'Sarah Connor',
    doctor: 'Dr. Emily Brown',
    date: getRelativeDate(-1, 15), // Yesterday
    type: 'Emergency',
    status: 'completed',
    notes: 'Toothache management'
  },
  {
    id: '6',
    patientName: 'Robert Brown',
    doctor: 'Dr. Jones',
    date: getRelativeDate(3, 9), // 3 days from now
    type: 'Consultation',
    status: 'scheduled',
    notes: 'Initial evaluation'
  },
  {
    id: 'walkin-1',
    patientName: 'Zanyar Ahmed',
    doctor: 'Dr. Smith',
    date: getRelativeDate(0, 11), // Today 11:00 AM
    type: 'Check-up',
    status: 'confirmed',
    notes: 'Walk-in patient'
  },
  {
    id: 'hist-1',
    patientName: 'Omar Hassan',
    doctor: 'Dr. Karwan Mustafa',
    date: getRelativeDate(-20, 10), // Dec 5
    type: 'Consultation',
    status: 'completed',
    notes: 'Initial evaluation'
  },
  {
    id: 'hist-2',
    patientName: 'Lana Khalid',
    doctor: 'Dr. Ahmed Yasin',
    date: getRelativeDate(-13, 14), // Dec 12
    type: 'Check-up',
    status: 'completed',
    notes: 'Teeth cleaning'
  },
  {
    id: 'hist-3',
    patientName: 'Yousif Salar',
    doctor: 'Dr. Smith',
    date: getRelativeDate(-7, 16), // Dec 18
    type: 'Follow-up',
    status: 'completed',
    notes: 'X-ray review'
  },
  {
    id: 'hist-4',
    patientName: 'Darya Mohammed',
    doctor: 'Dr. Jones',
    date: getRelativeDate(-2, 11), // Dec 23
    type: 'Check-up',
    status: 'completed',
    notes: 'Standard check'
  }
];

export const addAppointment = (apt: Appointment) => appointments.push(apt);

export const updateAppointment = (id: string, updates: Partial<Appointment>) => {
  appointments = appointments.map(apt => apt.id === id ? { ...apt, ...updates } : apt);
  return appointments.find(apt => apt.id === id);
};

export const deleteAppointment = (id: string) => {
  appointments = appointments.filter(apt => apt.id !== id);
};

export const getAppointment = (id: string) => appointments.find(apt => apt.id === id);

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

export const addTask = (task: Task) => tasks.push(task);

export const updateTask = (id: string, updates: Partial<Task>) => {
  tasks = tasks.map(t => t.id === id ? { ...t, ...updates } : t);
  return tasks.find(t => t.id === id);
};

export const deleteTask = (id: string) => {
  tasks = tasks.filter(t => t.id !== id);
};

export const getTask = (id: string) => tasks.find(t => t.id === id);



export const currentUser: User = {
  id: 'u1',
  name: 'Dr. Emily Brown',
  email: 'emily.brown@clinic.com',
  avatar: 'https://ui-avatars.com/api/?name=Emily+Brown&background=0D8ABC&color=fff',
  role: 'Doctor'
};
