import { Card } from "@/components/Card";
import { Users, DollarSign, TrendingUp, Calendar } from "lucide-react";

const stats = [
  { label: "Total Patients", value: "1,294", icon: Users, change: "+12%", color: "text-blue-600", bg: "bg-blue-100" },
  { label: "Revenue", value: "$42,500", icon: DollarSign, change: "+8%", color: "text-green-600", bg: "bg-green-100" },
  { label: "Growth", value: "24.5%", icon: TrendingUp, change: "+2.1%", color: "text-purple-600", bg: "bg-purple-100" },
  { label: "Appointments", value: "48", icon: Calendar, change: "-4%", color: "text-orange-600", bg: "bg-orange-100" },
];

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-800">Dashboard Overview</h1>
        <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium shadow-sm transition-colors">
          Download Report
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <Card key={stat.label} className="flex items-center gap-4 transition-transform hover:-translate-y-1 duration-200">
            <div className={`w-12 h-12 rounded-full flex items-center justify-center ${stat.bg} ${stat.color}`}>
              <stat.icon className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm text-gray-500 font-medium">{stat.label}</p>
              <h3 className="text-2xl font-bold text-gray-900">{stat.value}</h3>
              <span className={`text-xs font-medium ${stat.change.startsWith("+") ? "text-green-600" : "text-red-500"}`}>
                {stat.change} last month
              </span>
            </div>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <h2 className="text-lg font-bold text-gray-800 mb-4">Recent Activity</h2>
          <div className="space-y-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="flex items-center gap-4 py-3 border-b border-gray-50 last:border-0 hover:bg-gray-50 px-2 rounded-lg transition-colors">
                <div className="w-10 h-10 rounded-full bg-gray-200 flex-shrink-0" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">New patient registration</p>
                  <p className="text-xs text-gray-500">2 hours ago</p>
                </div>
                <button className="text-sm text-blue-600 font-medium hover:underline">View</button>
              </div>
            ))}
          </div>
        </Card>

        <Card>
          <h2 className="text-lg font-bold text-gray-800 mb-4">Upcoming Appointments</h2>
          <div className="space-y-4">
             {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg border border-gray-100">
                <div className="text-center bg-white p-2 rounded border border-gray-200 shadow-sm">
                  <span className="block text-xs font-bold text-gray-500">DEC</span>
                  <span className="block text-lg font-bold text-gray-800">12</span>
                </div>
                <div>
                  <p className="text-sm font-bold text-gray-900">Dr. Smith Consultation</p>
                  <p className="text-xs text-gray-500">10:00 AM - 11:00 AM</p>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
