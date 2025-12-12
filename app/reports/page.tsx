
"use client";

import { useState, useEffect } from "react";
import { MaterialCard } from "@/components/MaterialCard";
import { MaterialButton } from "@/components/MaterialButton";
import { Download, Users, Calendar, DollarSign, AlertCircle, TrendingUp, ArrowUpRight, ArrowDownRight, Loader2 } from "lucide-react";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart, 
  Pie, 
  Cell,
  LineChart,
  Line
} from "recharts";

interface ReportData {
  kpi: {
    leadConversionRate: number;
    totalAppointments: number;
    noShowRate: number;
    totalRevenue: number;
    revenueGrowth: number;
  };
  charts: {
    appointments: any[];
    leadSources: any[];
    revenue: any[];
  };
  table: any[];
}

const COLORS = ["#3b82f6", "#10b981", "#f59e0b", "#ef4444"];

export default function ReportsPage() {
  const [data, setData] = useState<ReportData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch("/api/reports");
        const json = await res.json();
        setData(json);
      } catch (err) {
        console.error("Failed to fetch reports", err);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  const handleExport = () => {
    // Mock export
    alert("Downloading report...");
  };

  if (loading || !data) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50/50 p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Reports & Analytics</h1>
          <p className="text-gray-500 text-sm">Key performance indicators and business metrics</p>
        </div>
        <MaterialButton 
          onClick={handleExport}
          className="bg-white border-gray-200 text-gray-700 hover:bg-gray-50 shadow-sm"
        >
          <Download className="w-4 h-4 mr-2" />
          Export Report
        </MaterialButton>
      </div>

      {/* KPI Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <MaterialCard className="p-5 border-0 shadow-md shadow-blue-500/5 bg-gradient-to-br from-white to-blue-50/50">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-blue-100 rounded-lg text-blue-600">
              <Users className="w-5 h-5" />
            </div>
            <span className="flex items-center text-xs font-medium text-green-600 bg-green-50 px-2 py-1 rounded-full">
              <ArrowUpRight className="w-3 h-3 mr-1" />
              +2.5%
            </span>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Lead Conversion</p>
            <h3 className="text-2xl font-bold text-gray-900">{data.kpi.leadConversionRate}%</h3>
          </div>
        </MaterialCard>

        <MaterialCard className="p-5 border-0 shadow-md shadow-purple-500/5 bg-gradient-to-br from-white to-purple-50/50">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-purple-100 rounded-lg text-purple-600">
              <Calendar className="w-5 h-5" />
            </div>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Appointments</p>
            <h3 className="text-2xl font-bold text-gray-900">{data.kpi.totalAppointments}</h3>
          </div>
        </MaterialCard>

        <MaterialCard className="p-5 border-0 shadow-md shadow-red-500/5 bg-gradient-to-br from-white to-red-50/50">
          <div className="flex items-center justify-between mb-4">
             <div className="p-2 bg-red-100 rounded-lg text-red-600">
              <AlertCircle className="w-5 h-5" />
            </div>
             <span className="flex items-center text-xs font-medium text-red-600 bg-red-50 px-2 py-1 rounded-full">
              <ArrowDownRight className="w-3 h-3 mr-1" />
              -0.4%
            </span>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">No-Show Rate</p>
            <h3 className="text-2xl font-bold text-gray-900">{data.kpi.noShowRate}%</h3>
          </div>
        </MaterialCard>

        <MaterialCard className="p-5 border-0 shadow-md shadow-green-500/5 bg-gradient-to-br from-white to-green-50/50">
           <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-green-100 rounded-lg text-green-600">
              <DollarSign className="w-5 h-5" />
            </div>
             <span className="flex items-center text-xs font-medium text-green-600 bg-green-50 px-2 py-1 rounded-full">
              <TrendingUp className="w-3 h-3 mr-1" />
              +{data.kpi.revenueGrowth}%
            </span>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Total Revenue</p>
            <h3 className="text-2xl font-bold text-gray-900">${data.kpi.totalRevenue.toLocaleString()}</h3>
          </div>
        </MaterialCard>
      </div>

      {/* Charts Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <MaterialCard className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Revenue Trend</h3>
          <div className="h-[300px]">
             <ResponsiveContainer width="100%" height="100%">
               <LineChart data={data.charts.revenue}>
                 <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                 <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#6B7280', fontSize: 12}} dy={10} />
                 <YAxis axisLine={false} tickLine={false} tick={{fill: '#6B7280', fontSize: 12}} />
                 <Tooltip 
                   contentStyle={{ backgroundColor: '#fff', borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                 />
                 <Line type="monotone" dataKey="value" stroke="#10b981" strokeWidth={3} dot={{r: 4, fill: '#10b981', strokeWidth: 2, stroke: '#fff'}} />
               </LineChart>
             </ResponsiveContainer>
          </div>
        </MaterialCard>

        <MaterialCard className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Appointments this Week</h3>
          <div className="h-[300px]">
             <ResponsiveContainer width="100%" height="100%">
               <BarChart data={data.charts.appointments}>
                 <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                 <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#6B7280', fontSize: 12}} dy={10} />
                 <YAxis axisLine={false} tickLine={false} tick={{fill: '#6B7280', fontSize: 12}} />
                 <Tooltip 
                    cursor={{fill: '#F3F4F6'}}
                    contentStyle={{ backgroundColor: '#fff', borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                 />
                 <Bar dataKey="value" fill="#3b82f6" radius={[4, 4, 0, 0]} barSize={32} />
               </BarChart>
             </ResponsiveContainer>
          </div>
        </MaterialCard>
      </div>

       {/* Charts Row 2 & Table */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Pie Chart */}
        <MaterialCard className="p-6 lg:col-span-1">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Lead Sources</h3>
          <div className="h-[300px] flex flex-col items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data.charts.leadSources}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {data.charts.leadSources.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
             <div className="flex flex-wrap gap-4 justify-center mt-2">
              {data.charts.leadSources.map((entry, index) => (
                <div key={entry.name} className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }} />
                  <span className="text-xs text-gray-500">{entry.name}</span>
                </div>
              ))}
            </div>
          </div>
        </MaterialCard>

        {/* Recent Transactions Table */}
        <MaterialCard className="p-0 overflow-hidden lg:col-span-2">
          <div className="p-4 border-b border-gray-100 flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900">Recent Activity</h3>
            <MaterialButton variant="text" size="sm">View All</MaterialButton>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-gray-500 uppercase bg-gray-50">
                <tr>
                  <th className="px-6 py-3 font-medium">Date</th>
                  <th className="px-6 py-3 font-medium">Type</th>
                  <th className="px-6 py-3 font-medium">Description</th>
                  <th className="px-6 py-3 font-medium text-right">Amount</th>
                  <th className="px-6 py-3 font-medium">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {data.table.map((row) => (
                  <tr key={row.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-6 py-4 text-gray-500 whitespace-nowrap">{row.date}</td>
                    <td className="px-6 py-4 font-medium text-gray-900">{row.type}</td>
                    <td className="px-6 py-4 text-gray-500">{row.description}</td>
                    <td className="px-6 py-4 text-right font-medium text-gray-900">
                      {row.amount > 0 ? `$${row.amount}` : '-'}
                    </td>
                    <td className="px-6 py-4">
                       <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                        ${row.status === 'Completed' ? 'bg-green-100 text-green-800' : 
                          row.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' : 
                          row.status === 'New' ? 'bg-blue-100 text-blue-800' :
                          'bg-gray-100 text-gray-800'
                        }
                       `}>
                        {row.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </MaterialCard>
      </div>
    </div>
  );
}
