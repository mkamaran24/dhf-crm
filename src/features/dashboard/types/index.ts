export interface DashboardKPI {
  leadConversionRate: number;
  totalLeads: number;
  totalPatients: number;
  totalAppointments: number;
  appointmentsToday: number;
  noShowRate: number;
  totalRevenue: number;
  revenueGrowth: number;
  pendingTasks: number;
  overdueTasks: number;
}

export interface RecentActivity {
  id: string;
  type: 'lead' | 'patient' | 'appointment' | 'task';
  title: string;
  description: string;
  timestamp: string;
  user?: string;
  relatedId?: string;
}

export interface UpcomingAppointment {
  id: string;
  patientName: string;
  doctor: string;
  date: string;
  type: string;
  time: string;
}

