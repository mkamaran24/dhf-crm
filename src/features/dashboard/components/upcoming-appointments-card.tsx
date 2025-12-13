import Link from "next/link";
import { Calendar, Clock, User } from "lucide-react";
import { Card, CardHeader, CardContent, Button } from "@/src/shared/components/ui";
import { UpcomingAppointment } from "../types";

interface UpcomingAppointmentsCardProps {
  appointments: UpcomingAppointment[];
}

export function UpcomingAppointmentsCard({ appointments }: UpcomingAppointmentsCardProps) {
  return (
    <Card>
      <CardHeader className="border-b border-gray-100">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-800">Upcoming Appointments</h2>
          <Link href="/appointments">
            <Button variant="text" size="sm">
              View All
            </Button>
          </Link>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <div className="divide-y divide-gray-100">
          {appointments.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              No upcoming appointments
            </div>
          ) : (
            appointments.map((appointment) => (
              <Link
                key={appointment.id}
                href={`/appointments/${appointment.id}`}
                className="block p-4 hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 text-center bg-blue-50 p-2.5 rounded-lg border border-blue-100">
                    <span className="block text-xs font-bold text-blue-600 uppercase">
                      {new Date(appointment.date).toLocaleDateString('en-US', { month: 'short' })}
                    </span>
                    <span className="block text-lg font-bold text-gray-900">
                      {new Date(appointment.date).getDate()}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-gray-900 mb-1">
                      {appointment.patientName}
                    </p>
                    <div className="flex items-center gap-2 text-xs text-gray-600 mb-1">
                      <User className="w-3.5 h-3.5" />
                      <span>{appointment.doctor}</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-gray-600">
                      <Clock className="w-3.5 h-3.5" />
                      <span>{appointment.time}</span>
                      <span className="text-gray-400">•</span>
                      <span>{appointment.type}</span>
                    </div>
                  </div>
                </div>
              </Link>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
}

