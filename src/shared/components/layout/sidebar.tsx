"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  LayoutDashboard, 
  Users, 
  UserPlus, 
  Calendar, 
  CheckSquare, 
  FileText, 
  Settings, 
  LogOut,
  Map
} from "lucide-react";
import { cn } from "@/src/shared/lib/utils";

const navigation = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Leads", href: "/leads", icon: UserPlus },
  { name: "Patients", href: "/patients", icon: Users },
  { name: "Journeys", href: "/journey", icon: Map },
  { name: "Appointments", href: "/appointments", icon: Calendar },
  { name: "Tasks", href: "/tasks", icon: CheckSquare },
  { name: "Reports", href: "/reports", icon: FileText },
  { name: "Settings", href: "/settings", icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-72 bg-white h-screen fixed left-0 top-0 shadow-md z-20 flex flex-col border-r border-gray-100 font-sans transition-all duration-300">
      <div className="h-16 flex items-center px-6 border-b border-gray-100 bg-white">
        <div className="text-2xl font-bold text-gray-800 flex items-center gap-3 tracking-tight">
          <div className="w-9 h-9 bg-blue-600 rounded-lg flex items-center justify-center text-white text-lg shadow-md shadow-blue-200">
            D
          </div>
          DHF CRM
        </div>
      </div>

      <div className="flex-1 py-6 px-4 space-y-1 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-200">
        <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest px-4 mb-4 font-mono">
          Main Menu
        </p>
        <div className="space-y-1.5">
          {navigation.map((item) => {
            const isActive = pathname.startsWith(item.href);
            return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-300 group relative overflow-hidden",
                  isActive
                    ? "bg-gradient-to-r from-blue-600 to-blue-500 text-white shadow-md shadow-blue-500/20"
                    : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                )}
              >
                <item.icon 
                  className={cn(
                    "w-5 h-5 transition-transform duration-300 group-hover:scale-110", 
                    isActive ? "text-white" : "text-gray-400 group-hover:text-blue-600"
                  )} 
                />
                <span className="relative z-10">{item.name}</span>
              </Link>
            );
          })}
        </div>
      </div>

      <div className="p-4 border-t border-gray-100 bg-gray-50/50">
        <Link href="/auth/login">
          <button className="flex items-center gap-3 px-3 py-3 w-full rounded-lg text-sm font-medium text-gray-600 hover:bg-red-50 hover:text-red-600 hover:shadow-sm transition-all duration-200">
            <LogOut className="w-5 h-5" />
            Sign Out
          </button>
        </Link>
      </div>
    </aside>
  );
}

