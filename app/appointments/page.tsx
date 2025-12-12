
"use client";

import { useState, useEffect } from "react";
import { MaterialCard } from "@/components/MaterialCard";
import { MaterialButton } from "@/components/MaterialButton";
import { ChevronLeft, ChevronRight, Plus, Calendar as CalendarIcon, Filter, Clock } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface Appointment {
  id: string;
  patientName: string;
  doctor: string;
  date: string; // ISO string
  type: string;
  status: string;
  notes?: string;
}

const DOCTORS = ["Dr. Smith", "Dr. Jones", "Dr. Emily Brown"];

export default function AppointmentsPage() {
  const router = useRouter();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDoctor, setSelectedDoctor] = useState("All Doctors");
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch appointments
  useEffect(() => {
    async function fetchAppointments() {
      setLoading(true);
      try {
        const query = selectedDoctor !== "All Doctors" ? `?doctor=${encodeURIComponent(selectedDoctor)}` : "";
        const res = await fetch(`/api/appointments${query}`);
        if (!res.ok) throw new Error("Failed to fetch");
        const data = await res.json();
        setAppointments(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchAppointments();
  }, [selectedDoctor]);

  // Calendar Logic
  const getDaysInMonth = (year: number, month: number) => new Date(year, month + 1, 0).getDate();
  const getFirstDayOfMonth = (year: number, month: number) => new Date(year, month, 1).getDay();

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const daysInMonth = getDaysInMonth(year, month);
  const firstDay = getFirstDayOfMonth(year, month);
  
  const days = [];
  // Empty slots for previous month
  for (let i = 0; i < firstDay; i++) {
    days.push(null);
  }
  // Days of current month
  for (let i = 1; i <= daysInMonth; i++) {
    days.push(new Date(year, month, i));
  }

  const navigateMonth = (direction: "prev" | "next") => {
    setCurrentDate(new Date(year, direction === "next" ? month + 1 : month - 1, 1));
  };

  const getAppointmentsForDay = (date: Date) => {
    return appointments.filter(apt => {
      const aptDate = new Date(apt.date);
      return (
        aptDate.getDate() === date.getDate() &&
        aptDate.getMonth() === date.getMonth() &&
        aptDate.getFullYear() === date.getFullYear()
      );
    });
  };

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="min-h-screen bg-gray-50/50 p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Appointments</h1>
          <p className="text-gray-500 text-sm">Manage your schedule and patient visits</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative">
            <select
              value={selectedDoctor}
              onChange={(e) => setSelectedDoctor(e.target.value)}
              className="appearance-none bg-white border border-gray-200 text-gray-700 py-2.5 pl-4 pr-10 rounded-lg text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-shadow cursor-pointer shadow-sm hover:border-gray-300"
            >
              <option>All Doctors</option>
              {DOCTORS.map(doc => <option key={doc} value={doc}>{doc}</option>)}
            </select>
            <Filter className="w-4 h-4 text-gray-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>
          <Link href="/appointments/create">
            <MaterialButton className="bg-blue-600 hover:bg-blue-700 text-white shadow-md shadow-blue-600/20">
              <Plus className="w-4 h-4 mr-2" />
              New Appointment
            </MaterialButton>
          </Link>
        </div>
      </div>

      {/* Calendar Controls */}
      <div className="flex items-center justify-between bg-white p-4 rounded-xl shadow-sm border border-gray-100">
        <h2 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
          <CalendarIcon className="w-5 h-5 text-blue-600" />
          {currentDate.toLocaleDateString("en-US", { month: "long", year: "numeric" })}
        </h2>
        <div className="flex items-center gap-1">
          <button 
            onClick={() => navigateMonth("prev")}
            className="p-2 hover:bg-gray-100 rounded-full text-gray-600 transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button 
            onClick={() => { setCurrentDate(new Date()) }}
            className="px-3 py-1 text-sm font-medium text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
          >
            Today
          </button>
          <button 
            onClick={() => navigateMonth("next")}
            className="p-2 hover:bg-gray-100 rounded-full text-gray-600 transition-colors"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Calendar Grid */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        {/* Days Header */}
        <div className="grid grid-cols-7 border-b border-gray-100 bg-gray-50/50">
          {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(day => (
            <div key={day} className="py-3 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider">
              {day}
            </div>
          ))}
        </div>

        {/* Calendar Cells */}
        <div className="grid grid-cols-7 auto-rows-fr bg-gray-100 gap-px">
          {days.map((date, index) => {
            if (!date) {
              return <div key={`empty-${index}`} className="bg-gray-50/30 min-h-[140px]" />;
            }
            
            const isToday = new Date().toDateString() === date.toDateString();
            const dayAppointments = getAppointmentsForDay(date);

            return (
              <div 
                key={date.toISOString()} 
                className={`bg-white min-h-[140px] p-2 hover:bg-gray-50 transition-colors group relative ${
                  isToday ? "bg-blue-50/30" : ""
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span 
                    className={`text-sm font-medium w-7 h-7 flex items-center justify-center rounded-full ${
                      isToday 
                        ? "bg-blue-600 text-white shadow-sm" 
                        : "text-gray-700 group-hover:text-blue-600"
                    }`}
                  >
                    {date.getDate()}
                  </span>
                  {isToday && <span className="text-[10px] font-bold text-blue-600 uppercase tracking-wide mr-1">Today</span>}
                </div>

                <div className="space-y-1.5">
                  {dayAppointments.map(apt => (
                    <Link href={`/appointments/${apt.id}`} key={apt.id}>
                      <div 
                        className="bg-white border border-l-4 border-gray-100 border-l-blue-500 rounded shadow-sm hover:shadow-md transition-all p-1.5 cursor-pointer group/card"
                      >
                        <div className="flex items-center gap-1.5 mb-0.5">
                           <div className="bg-blue-100 p-0.5 rounded">
                              <Clock className="w-3 h-3 text-blue-600" />
                           </div>
                           <span className="text-xs font-semibold text-gray-900">{formatTime(apt.date)}</span>
                        </div>
                        <div className="text-xs text-gray-700 font-medium truncate pl-1">{apt.patientName}</div>
                        <div className="text-[10px] text-gray-500 truncate pl-1 flex items-center gap-1">
                          <span className="w-1 h-1 rounded-full bg-gray-400"></span>
                          {apt.doctor.split(' ').pop()}
                        </div>
                      </div>
                    </Link>
                  ))}
                  {/* Placeholder for "Add" visual on empty slots if needed, or just keep cleaner */}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
