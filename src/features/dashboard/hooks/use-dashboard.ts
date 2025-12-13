import { useState, useEffect } from 'react';
import { leads } from '@/src/shared/services/data-store';
import { patients } from '@/src/shared/services/data-store';
import { appointments } from '@/src/shared/services/data-store';
import { tasks } from '@/src/shared/services/data-store';
import { DashboardKPI, RecentActivity, UpcomingAppointment } from '../types';

export function useDashboard() {
  const [kpis, setKpis] = useState<DashboardKPI | null>(null);
  const [recentActivity, setRecentActivity] = useState<RecentActivity[]>([]);
  const [upcomingAppointments, setUpcomingAppointments] = useState<UpcomingAppointment[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadDashboardData() {
      setIsLoading(true);

      try {
        const convertedLeads = leads.filter(l => l.status === 'Converted').length;
        const conversionRate = leads.length > 0 ? (convertedLeads / leads.length) * 100 : 0;

        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const appointmentsToday = appointments.filter(apt => {
          const aptDate = new Date(apt.date);
          aptDate.setHours(0, 0, 0, 0);
          return aptDate.getTime() === today.getTime();
        }).length;

        const totalRevenue = patients.reduce((sum, p) => sum + (p.balance || 0), 0);
        
        const pendingTasks = tasks.filter(t => t.status === 'Pending').length;
        const overdueTasks = tasks.filter(t => 
          t.status === 'Pending' && new Date(t.dueDate) < new Date()
        ).length;

        setKpis({
          leadConversionRate: Math.round(conversionRate * 10) / 10,
          totalLeads: leads.length,
          totalPatients: patients.length,
          totalAppointments: appointments.length,
          appointmentsToday,
          noShowRate: 4.2,
          totalRevenue,
          revenueGrowth: 12.5,
          pendingTasks,
          overdueTasks,
        });

        const activity: RecentActivity[] = [
          ...leads.slice(0, 3).map(l => ({
            id: `lead-${l.id}`,
            type: 'lead' as const,
            title: 'New Lead Created',
            description: `${l.firstName} ${l.lastName} from ${l.source}`,
            timestamp: l.createdAt,
          })),
          ...appointments.slice(0, 2).map(apt => ({
            id: `appointment-${apt.id}`,
            type: 'appointment' as const,
            title: 'Appointment Scheduled',
            description: `${apt.patientName} with ${apt.doctor}`,
            timestamp: apt.date,
          })),
        ].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()).slice(0, 5);

        setRecentActivity(activity);

        const upcoming = appointments
          .filter(apt => new Date(apt.date) >= new Date())
          .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
          .slice(0, 5)
          .map(apt => ({
            id: apt.id,
            patientName: apt.patientName,
            doctor: apt.doctor,
            date: apt.date,
            type: apt.type,
            time: new Date(apt.date).toLocaleTimeString('en-US', { 
              hour: '2-digit', 
              minute: '2-digit' 
            }),
          }));

        setUpcomingAppointments(upcoming);
      } catch (error) {
        console.error('Error loading dashboard:', error);
      } finally {
        setIsLoading(false);
      }
    }

    loadDashboardData();
  }, []);

  return {
    kpis,
    recentActivity,
    upcomingAppointments,
    isLoading,
  };
}

