"use client";

import Link from "next/link";
import { 
  Users, 
  UserPlus, 
  Calendar, 
  DollarSign, 
  AlertCircle, 
  CheckSquare,
  TrendingUp,
  Download,
  Loader2
} from "lucide-react";
import { Button, Card } from "@/src/shared/components/ui";
import { KPICard, RecentActivityCard, UpcomingAppointmentsCard } from "@/src/features/dashboard/components";
import { useDashboard } from "@/src/features/dashboard/hooks/use-dashboard";
import { formatCurrency } from "@/src/shared/lib/utils";
import { exportToPDF } from "@/src/shared/lib/export";

export default function DashboardPage() {
  const { kpis, recentActivity, upcomingAppointments, isLoading } = useDashboard();

  const handleExportDashboard = () => {
    if (!kpis) return;

    const headers = ['Metric', 'Value'];
    const data = [
      ['Total Leads', kpis.totalLeads.toString()],
      ['Lead Conversion Rate', `${kpis.leadConversionRate}%`],
      ['Total Patients', kpis.totalPatients.toString()],
      ['Total Appointments', kpis.totalAppointments.toString()],
      ['Appointments Today', kpis.appointmentsToday.toString()],
      ['No-Show Rate', `${kpis.noShowRate}%`],
      ['Total Revenue', formatCurrency(kpis.totalRevenue)],
      ['Revenue Growth', `${kpis.revenueGrowth}%`],
      ['Pending Tasks', kpis.pendingTasks.toString()],
      ['Overdue Tasks', kpis.overdueTasks.toString()],
    ];

    exportToPDF('Dashboard Report', headers, data, 'dashboard-report.pdf');
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
      </div>
    );
  }

  if (!kpis) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <p className="text-gray-500">Failed to load dashboard data</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Dashboard Overview</h1>
          <p className="text-sm text-gray-500 mt-1">Key metrics and recent activity</p>
        </div>
        <Button variant="outlined" onClick={handleExportDashboard}>
          <Download className="w-4 h-4 mr-2" />
          Export Report
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <KPICard
          label="Total Leads"
          value={kpis.totalLeads}
          icon={UserPlus}
          color="text-blue-600"
          bgColor="bg-blue-100"
        />
        <KPICard
          label="Lead Conversion"
          value={`${kpis.leadConversionRate}%`}
          icon={TrendingUp}
          trend={kpis.leadConversionRate}
          color="text-green-600"
          bgColor="bg-green-100"
        />
        <KPICard
          label="Total Patients"
          value={kpis.totalPatients}
          icon={Users}
          color="text-purple-600"
          bgColor="bg-purple-100"
        />
        <KPICard
          label="Today's Appointments"
          value={kpis.appointmentsToday}
          icon={Calendar}
          color="text-orange-600"
          bgColor="bg-orange-100"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <KPICard
          label="Total Revenue"
          value={formatCurrency(kpis.totalRevenue)}
          icon={DollarSign}
          trend={kpis.revenueGrowth}
          color="text-green-600"
          bgColor="bg-green-100"
        />
        <KPICard
          label="No-Show Rate"
          value={`${kpis.noShowRate}%`}
          icon={AlertCircle}
          color="text-red-600"
          bgColor="bg-red-100"
        />
        <KPICard
          label="Pending Tasks"
          value={kpis.pendingTasks}
          icon={CheckSquare}
          color="text-blue-600"
          bgColor="bg-blue-100"
        />
        <KPICard
          label="Overdue Tasks"
          value={kpis.overdueTasks}
          icon={AlertCircle}
          color="text-red-600"
          bgColor="bg-red-100"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <RecentActivityCard activities={recentActivity} />
        </div>
        <div>
          <UpcomingAppointmentsCard appointments={upcomingAppointments} />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Link href="/leads" className="block">
          <Card className="p-6 hover:shadow-lg transition-all cursor-pointer border-l-4 border-l-blue-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 font-medium mb-1">Manage Leads</p>
                <p className="text-2xl font-bold text-gray-900">{kpis.totalLeads}</p>
              </div>
              <UserPlus className="w-8 h-8 text-blue-500" />
            </div>
          </Card>
        </Link>

        <Link href="/patients" className="block">
          <Card className="p-6 hover:shadow-lg transition-all cursor-pointer border-l-4 border-l-purple-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 font-medium mb-1">Active Patients</p>
                <p className="text-2xl font-bold text-gray-900">{kpis.totalPatients}</p>
              </div>
              <Users className="w-8 h-8 text-purple-500" />
            </div>
          </Card>
        </Link>

        <Link href="/tasks" className="block">
          <Card className="p-6 hover:shadow-lg transition-all cursor-pointer border-l-4 border-l-green-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 font-medium mb-1">Active Tasks</p>
                <p className="text-2xl font-bold text-gray-900">{kpis.pendingTasks}</p>
              </div>
              <CheckSquare className="w-8 h-8 text-green-500" />
            </div>
          </Card>
        </Link>
      </div>
    </div>
  );
}
