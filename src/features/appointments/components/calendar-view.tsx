
"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, Clock, User, CheckCircle, Plus, MoreHorizontal, X, ExternalLink, CalendarDays } from "lucide-react";
import { Button } from "@/src/shared/components/ui";
import { Appointment } from "../types";
import { AppointmentCard } from "./appointment-card";
import { cn } from "@/src/shared/lib/utils";
import { Modal, ModalHeader, ModalContent } from "@/src/shared/components/ui/modal";
import Link from "next/link";

interface CalendarViewProps {
  appointments: Appointment[];
  viewType: "today" | "week" | "month";
  getAppointmentsForDay: (date: Date) => Appointment[];
}

export function CalendarView({ appointments, viewType, getAppointmentsForDay }: CalendarViewProps) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
  const [selectedDay, setSelectedDay] = useState<{ date: Date; appointments: Appointment[] } | null>(null);

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const today = new Date();

  const navigateDate = (direction: "prev" | "next") => {
    const newDate = new Date(currentDate);
    if (viewType === "today") {
      newDate.setDate(newDate.getDate() + (direction === "next" ? 1 : -1));
    } else if (viewType === "week") {
      newDate.setDate(newDate.getDate() + (direction === "next" ? 7 : -7));
    } else {
      newDate.setMonth(newDate.getMonth() + (direction === "next" ? 1 : -1));
    }
    setCurrentDate(newDate);
  };

  const goToToday = () => {
    setCurrentDate(new Date());
  };

  const renderTodayView = () => {
    const dayAppointments = getAppointmentsForDay(currentDate);
    const formattedDate = currentDate.toLocaleDateString("en-US", { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' });

    return (
      <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-500">
        <div className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-5">
            <div className="w-16 h-16 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center border border-blue-100 shadow-sm">
              <CalendarIcon className="w-8 h-8" />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-slate-800">{formattedDate}</h3>
              <p className="text-sm font-medium text-slate-500 mt-1">Daily schedule for Erbil Clinic</p>
            </div>
          </div>
          <Badge count={dayAppointments.length} label="Today's Total" />
        </div>

        <div className="grid grid-cols-1 gap-4">
          {dayAppointments.length > 0 ? (
            dayAppointments.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()).map(apt => (
              <div key={apt.id} className="bg-white p-1 rounded-3xl border border-slate-100 shadow-sm hover:shadow-md transition-all">
                <AppointmentCard appointment={apt} view="list" />
              </div>
            ))
          ) : (
            <div className="bg-white p-20 rounded-[2.5rem] border border-dashed border-slate-200 text-center flex flex-col items-center">
              <div className="w-20 h-20 rounded-full bg-slate-50 flex items-center justify-center text-slate-300 mb-6 border border-slate-100">
                <Clock className="w-10 h-10" />
              </div>
              <h4 className="text-xl font-bold text-slate-800">Clear Schedule</h4>
              <p className="text-slate-500 font-medium mt-2 max-w-[250px]">All caught up! There are no appointments booked for this day.</p>
              <Button
                onClick={() => window.location.href = '/appointments/create'}
                className="mt-8 rounded-xl bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-200"
              >
                <Plus className="w-4 h-4 mr-2" />
                Book Now
              </Button>
            </div>
          )}
        </div>
      </div>
    );
  };

  const renderWeekView = () => {
    const startOfWeek = new Date(currentDate);
    startOfWeek.setDate(currentDate.getDate() - currentDate.getDay());

    const weekDays = Array.from({ length: 7 }, (_, i) => {
      const d = new Date(startOfWeek);
      d.setDate(startOfWeek.getDate() + i);
      return d;
    });

    const weekRange = `${weekDays[0].toLocaleDateString("en-US", { month: 'short', day: 'numeric' })} - ${weekDays[6].toLocaleDateString("en-US", { month: 'short', day: 'numeric', year: 'numeric' })}`;

    return (
      <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-500">
        <div className="flex items-center justify-between bg-white p-6 rounded-[1.5rem] border border-slate-100 shadow-sm">
          <h3 className="text-xl font-bold text-slate-800">Week Timeline: {weekRange}</h3>
          <Badge count={appointments.length} label="Weekly Load" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-7 gap-4">
          {weekDays.map((date) => {
            const dayAppointments = getAppointmentsForDay(date);
            const isToday = date.toDateString() === today.toDateString();

            return (
              <div key={date.toISOString()} className={cn(
                "flex flex-col rounded-[2rem] border min-h-[450px] overflow-hidden transition-all",
                isToday ? "bg-blue-50/30 border-blue-200 shadow-lg ring-2 ring-blue-500/5 scale-[1.02] z-10" : "bg-white border-slate-100 shadow-sm"
              )}>
                <div className={cn(
                  "p-4 text-center border-b",
                  isToday ? "bg-blue-600 text-white border-blue-700" : "bg-slate-50 border-slate-100"
                )}>
                  <p className={cn("text-[10px] font-bold uppercase tracking-widest", isToday ? "text-blue-100" : "text-slate-400")}>
                    {date.toLocaleDateString("en-US", { weekday: 'short' })}
                  </p>
                  <p className="text-2xl font-bold mt-1">{date.getDate()}</p>
                </div>
                <div className="p-3 flex-1 space-y-3 overflow-y-auto">
                  {dayAppointments.length > 0 ? (
                    dayAppointments.map(apt => (
                      <div key={apt.id} className="scale-90 origin-top -mb-4">
                        <AppointmentCard appointment={apt} view="calendar" />
                      </div>
                    ))
                  ) : (
                    <div className="h-full flex items-center justify-center opacity-10">
                      <CheckCircle className="w-8 h-8 text-slate-400" />
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  const renderMonthView = () => {
    const getDaysInMonth = (y: number, m: number) => new Date(y, m + 1, 0).getDate();
    const getFirstDayOfMonth = (y: number, m: number) => new Date(y, m, 1).getDay();

    const daysInMonth = getDaysInMonth(year, month);
    const firstDay = getFirstDayOfMonth(year, month);

    const days: (Date | null)[] = [];
    for (let i = 0; i < firstDay; i++) days.push(null);
    for (let i = 1; i <= daysInMonth; i++) days.push(new Date(year, month, i));

    const monthName = currentDate.toLocaleDateString("en-US", { month: "long", year: "numeric" });

    return (
      <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-500">
        <div className="bg-white p-6 rounded-[1.5rem] border border-slate-100 shadow-sm flex items-center justify-between">
          <h3 className="text-xl font-bold text-slate-800">{monthName}</h3>
          <Badge count={appointments.length} label="Monthly Total" />
        </div>

        <div className="bg-white rounded-[2rem] border border-slate-200 shadow-sm overflow-hidden p-4">
          <div className="grid grid-cols-7 mb-4 border-b border-slate-100 pb-4">
            {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(day => (
              <div key={day} className="text-center">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">
                  {day}
                </span>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-7 gap-2">
            {days.map((date, index) => {
              if (!date) return <div key={`empty-${index}`} className="aspect-square bg-slate-50/50 rounded-xl" />;

              const isToday = date.toDateString() === today.toDateString();
              const dayAppointments = getAppointmentsForDay(date);

              return (
                <div
                  key={date.toISOString()}
                  className={cn(
                    "aspect-square p-3 group relative rounded-2xl border transition-all cursor-default flex flex-col items-start justify-start overflow-hidden",
                    isToday
                      ? "bg-blue-600 border-blue-700 shadow-lg text-white scale-[1.05] z-10"
                      : dayAppointments.length > 0
                        ? "bg-white border-blue-100 shadow-sm ring-1 ring-blue-50 hover:ring-blue-100 hover:border-blue-200 text-slate-800"
                        : "bg-white border-slate-100 text-slate-400"
                  )}
                >
                  <div className="flex items-center justify-between w-full mb-2">
                    <span className={cn(
                      "text-xl font-bold tracking-tight",
                      isToday ? "text-white" : dayAppointments.length > 0 ? "text-slate-800" : "text-slate-300"
                    )}>
                      {date.getDate()}
                    </span>

                    {dayAppointments.length > 0 && (
                      <div className={cn(
                        "w-5 h-5 rounded-full flex items-center justify-center text-[9px] font-black",
                        isToday ? "bg-white text-blue-600 shadow-sm" : "bg-blue-600 text-white"
                      )}>
                        {dayAppointments.length}
                      </div>
                    )}
                  </div>

                  {/* Patient List in Month View */}
                  <div className="w-full space-y-1 overflow-hidden z-20">
                    {dayAppointments.slice(0, 2).map((apt, i) => (
                      <div
                        key={apt.id}
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedAppointment(apt);
                        }}
                        className={cn(
                          "px-2 py-1 rounded-lg text-[10px] font-bold truncate w-full shadow-sm cursor-pointer hover:scale-[1.02] transition-transform flex items-center gap-1",
                          isToday
                            ? "bg-white/20 text-white border border-white/10"
                            : "bg-blue-50 text-blue-700 border border-blue-100 hover:bg-blue-100"
                        )}
                      >
                        <User className="w-2.5 h-2.5 opacity-60" />
                        {apt.patientName}
                      </div>
                    ))}
                    {dayAppointments.length > 2 && (
                      <div
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedDay({ date: date, appointments: dayAppointments });
                        }}
                        className={cn(
                          "text-[9px] font-black uppercase tracking-widest pl-1 mt-0.5 opacity-60 flex items-center gap-1 cursor-pointer hover:opacity-100 transition-opacity",
                          isToday ? "text-white" : "text-slate-400"
                        )}
                      >
                        <Plus className="w-2.5 h-2.5" />
                        {dayAppointments.length - 2} More
                      </div>
                    )}
                  </div>

                  {/* Indicator Pips for very busy days at the bottom */}
                  {dayAppointments.length > 0 && (
                    <div className="absolute bottom-2 left-0 right-0 flex gap-0.5 justify-center opacity-40">
                      {dayAppointments.slice(0, 5).map((_, i) => (
                        <div key={i} className={cn(
                          "w-1 h-1 rounded-full",
                          isToday ? "bg-white" : "bg-blue-400"
                        )} />
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Simple Legend */}
        <div className="flex items-center gap-6 px-4">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-blue-600" />
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Today</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-blue-50 border border-blue-100" />
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Scheduled</span>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Navigation Toolbar */}
      <div className="flex items-center justify-between bg-white px-6 py-4 rounded-3xl border border-slate-100 shadow-sm">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigateDate("prev")}
            className="p-2 hover:bg-slate-50 rounded-xl border border-slate-100 transition-colors text-slate-500"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            onClick={goToToday}
            className="px-4 py-2 bg-slate-50 hover:bg-slate-100 rounded-xl text-[10px] font-black text-slate-600 border border-slate-200 transition-all active:scale-95"
          >
            RETURN TO TODAY
          </button>
          <button
            onClick={() => navigateDate("next")}
            className="p-2 hover:bg-slate-50 rounded-xl border border-slate-100 transition-colors text-slate-500"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>

        <div className="flex items-center gap-2">
          <div className="px-3 py-1.5 bg-slate-50 text-slate-600 rounded-xl text-[10px] font-bold uppercase tracking-widest flex items-center gap-2 border border-slate-100">
            <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
            View Mode: {viewType}
          </div>
        </div>
      </div>

      {/* Dynamic Content */}
      <div className="transition-all duration-300">
        {viewType === "today" && renderTodayView()}
        {viewType === "week" && renderWeekView()}
        {viewType === "month" && renderMonthView()}
      </div>

      {/* Appointment Detail Modal */}
      <Modal isOpen={!!selectedAppointment} onClose={() => setSelectedAppointment(null)} size="md">
        {selectedAppointment && (
          <div className="p-0 overflow-hidden">
            <ModalHeader className="bg-slate-900 text-white p-8 border-none relative overflow-hidden">
              <div className="absolute top-0 right-0 p-8 opacity-10">
                <CalendarIcon className="w-32 h-32 rotate-12" />
              </div>
              <div className="relative z-10">
                <div className="flex items-center gap-3 mb-4">
                  <div className="px-2.5 py-1 bg-blue-500 rounded-lg text-[10px] font-black tracking-widest uppercase">
                    Appointment Details
                  </div>
                  <div className={cn(
                    "px-2.5 py-1 rounded-lg text-[10px] font-black tracking-widest uppercase border",
                    selectedAppointment.status === 'confirmed' ? "bg-emerald-500 border-emerald-400" : "bg-blue-600 border-blue-500"
                  )}>
                    {selectedAppointment.status}
                  </div>
                </div>
                <h2 className="text-3xl font-bold tracking-tight">{selectedAppointment.patientName}</h2>
                <p className="text-blue-200 font-medium mt-1 leading-relaxed opacity-80">
                  Patient Intake ID: {selectedAppointment.id}
                </p>
              </div>
              <button
                onClick={() => setSelectedAppointment(null)}
                className="absolute top-6 right-6 p-2 bg-white/10 hover:bg-white/20 rounded-full transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </ModalHeader>
            <ModalContent className="p-8 space-y-8">
              <div className="grid grid-cols-2 gap-8">
                <div className="space-y-1.5">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">Consulting Doctor</span>
                  <div className="flex items-center gap-2.5 group">
                    <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center border border-slate-100 group-hover:bg-blue-50 group-hover:border-blue-100 transition-colors">
                      <User className="w-5 h-5 text-slate-400 group-hover:text-blue-500" />
                    </div>
                    <span className="text-sm font-bold text-slate-800 tracking-tight">{selectedAppointment.doctor}</span>
                  </div>
                </div>
                <div className="space-y-1.5">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">Scheduled Time</span>
                  <div className="flex items-center gap-2.5 group">
                    <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center border border-slate-100 group-hover:bg-blue-50 group-hover:border-blue-100 transition-colors">
                      <Clock className="w-5 h-5 text-slate-400 group-hover:text-blue-500" />
                    </div>
                    <span className="text-sm font-bold text-slate-800 tracking-tight">
                      {new Date(selectedAppointment.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true })}
                    </span>
                  </div>
                </div>
              </div>

              <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Appointment Summary</span>
                  <div className="px-2 py-0.5 bg-slate-200 text-slate-600 rounded text-[9px] font-bold uppercase">
                    {selectedAppointment.type}
                  </div>
                </div>
                <p className="text-sm text-slate-600 leading-relaxed font-medium">
                  Patient scheduled for {selectedAppointment.type.toLowerCase()} with {selectedAppointment.doctor}.
                  Status is currently marked as <span className="text-blue-600 font-bold">{selectedAppointment.status}</span>.
                </p>
              </div>

              <div className="flex items-center gap-3 pt-2">
                <Link href={`/appointments/${selectedAppointment.id}`} className="flex-1">
                  <Button className="w-full rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold h-12 shadow-lg shadow-slate-200">
                    Manage Appointment
                  </Button>
                </Link>
                <Link href={`/patients/${selectedAppointment.patientName.toLowerCase().replace(/\s+/g, '-')}`}>
                  <Button variant="outlined" className="w-12 h-12 rounded-xl p-0 border-slate-200">
                    <ExternalLink className="w-5 h-5 text-slate-400" />
                  </Button>
                </Link>
              </div>
            </ModalContent>
          </div>
        )}
      </Modal>

      {/* Day Summary Modal */}
      <Modal isOpen={!!selectedDay} onClose={() => setSelectedDay(null)} size="lg">
        {selectedDay && (
          <div className="p-0">
            <ModalHeader className="bg-slate-50 p-8 border-b border-slate-200 relative">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-white flex items-center justify-center border border-slate-200 shadow-sm text-slate-800">
                  <CalendarDays className="w-6 h-6" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
                    {selectedDay.date.toLocaleDateString("en-US", { weekday: 'long', month: 'long', day: 'numeric' })}
                  </h2>
                  <p className="text-sm font-medium text-slate-500 mt-0.5">
                    {selectedDay.appointments.length} Total Appointments Scheduled
                  </p>
                </div>
              </div>
              <button
                onClick={() => setSelectedDay(null)}
                className="absolute top-8 right-8 p-2 hover:bg-slate-200 rounded-xl transition-colors text-slate-400"
              >
                <X className="w-5 h-5" />
              </button>
            </ModalHeader>
            <ModalContent className="p-8 max-h-[60vh] overflow-y-auto bg-slate-50/30">
              <div className="grid grid-cols-1 gap-4">
                {selectedDay.appointments.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()).map((apt) => (
                  <div
                    key={apt.id}
                    onClick={() => {
                      setSelectedAppointment(apt);
                      setSelectedDay(null);
                    }}
                    className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md hover:border-blue-200 transition-all cursor-pointer group"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center border border-slate-100 group-hover:bg-blue-50 group-hover:border-blue-100 transition-colors">
                          <Clock className="w-5 h-5 text-slate-400 group-hover:text-blue-500" />
                        </div>
                        <div>
                          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                            {new Date(apt.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true })}
                          </p>
                          <p className="text-lg font-bold text-slate-800 group-hover:text-blue-600 transition-colors">{apt.patientName}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-6">
                        <div className="text-right hidden sm:block">
                          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Specialist</p>
                          <p className="text-xs font-bold text-slate-700">{apt.doctor}</p>
                        </div>
                        <div className={cn(
                          "px-2.5 py-1 rounded-lg text-[10px] font-black tracking-widest uppercase border",
                          apt.status === 'confirmed' ? "bg-emerald-50 text-emerald-700 border-emerald-100" : "bg-blue-50 text-blue-700 border-blue-100"
                        )}>
                          {apt.status}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </ModalContent>
          </div>
        )}
      </Modal>
    </div>
  );
}

function Badge({ count, label }: { count: number, label: string }) {
  return (
    <div className="flex items-center gap-4 bg-slate-50 px-5 py-2.5 rounded-[1.25rem] border border-slate-100 shadow-sm">
      <div className="flex flex-col items-end">
        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{label}</span>
        <span className="text-sm font-bold text-slate-800">{count} Appointments</span>
      </div>
      <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-lg border border-blue-700">
        <div className="text-sm font-black">{count}</div>
      </div>
    </div>
  );
}
