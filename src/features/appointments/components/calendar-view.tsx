"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon } from "lucide-react";
import { Button } from "@/src/shared/components/ui";
import { Appointment } from "../types";
import { AppointmentCard } from "./appointment-card";

interface CalendarViewProps {
  appointments: Appointment[];
  getAppointmentsForDay: (date: Date) => Appointment[];
}

export function CalendarView({ appointments, getAppointmentsForDay }: CalendarViewProps) {
  const [currentDate, setCurrentDate] = useState(new Date());

  const getDaysInMonth = (year: number, month: number) => new Date(year, month + 1, 0).getDate();
  const getFirstDayOfMonth = (year: number, month: number) => new Date(year, month, 1).getDay();

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const daysInMonth = getDaysInMonth(year, month);
  const firstDay = getFirstDayOfMonth(year, month);
  
  const days: (Date | null)[] = [];
  for (let i = 0; i < firstDay; i++) {
    days.push(null);
  }
  for (let i = 1; i <= daysInMonth; i++) {
    days.push(new Date(year, month, i));
  }

  const navigateMonth = (direction: "prev" | "next") => {
    setCurrentDate(new Date(year, direction === "next" ? month + 1 : month - 1, 1));
  };

  const goToToday = () => {
    setCurrentDate(new Date());
  };

  const monthName = currentDate.toLocaleDateString("en-US", { month: "long", year: "numeric" });
  const today = new Date();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between bg-white p-5 rounded-xl border border-gray-200 shadow-sm">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-lg">
            <CalendarIcon className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900">{monthName}</h2>
            <p className="text-sm text-gray-500">Calendar view of all appointments</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outlined"
            onClick={() => navigateMonth("prev")}
            size="sm"
          >
            <ChevronLeft className="w-4 h-4" />
          </Button>
          <Button
            variant="outlined"
            onClick={goToToday}
            size="sm"
            className="min-w-[80px]"
          >
            Today
          </Button>
          <Button
            variant="outlined"
            onClick={() => navigateMonth("next")}
            size="sm"
          >
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="grid grid-cols-7 border-b border-gray-200 bg-gray-50">
          {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(day => (
            <div key={day} className="py-3 text-center border-r border-gray-200 last:border-r-0">
              <span className="text-xs font-semibold text-gray-600 uppercase tracking-wide">
                {day}
              </span>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-7 border-t border-gray-200">
          {days.map((date, index) => {
            if (!date) {
              return (
                <div 
                  key={`empty-${index}`} 
                  className="bg-white min-h-[140px] border-r border-b border-gray-200"
                />
              );
            }
            
            const isToday = date.toDateString() === today.toDateString();
            const dayAppointments = getAppointmentsForDay(date);
            const isPast = date < today && !isToday;

            return (
              <div 
                key={date.toISOString()} 
                className={`bg-white min-h-[140px] p-2 border-r border-b border-gray-200 ${
                  isToday 
                    ? "bg-blue-50/30" 
                    : isPast
                    ? "bg-gray-50/30"
                    : ""
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span 
                    className={`text-sm font-semibold ${
                      isToday 
                        ? "text-blue-600" 
                        : "text-gray-700"
                    }`}
                  >
                    {date.getDate()}
                  </span>
                  {dayAppointments.length > 0 && (
                    <div className="w-5 h-5 rounded-full bg-blue-500 flex items-center justify-center">
                      <span className="text-xs font-bold text-white">
                        {dayAppointments.length}
                      </span>
                    </div>
                  )}
                </div>

                <div className="space-y-1.5">
                  {dayAppointments.map(apt => (
                    <AppointmentCard
                      key={apt.id}
                      appointment={apt}
                      view="calendar"
                    />
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
