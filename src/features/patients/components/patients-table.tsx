"use client";

import Link from "next/link";
import { Phone, Calendar, Edit, Trash2, Loader2, History, Stethoscope, CheckCircle2, Clock } from "lucide-react";
import { Patient } from "../types";
import { Badge } from "@/src/shared/components/ui";
import { cn } from "@/src/shared/lib/utils";

interface PatientsTableProps {
  patients: Patient[];
  isLoading: boolean;
  hasActiveFilters: boolean;
  onDelete: (patientId: string, patientName: string) => void;
}

function getStatusVariant(status: string): "default" | "success" | "warning" | "error" {
  switch (status) {
    case "Active":
      return "success";
    case "Inactive":
      return "warning";
    case "Archived":
      return "error";
    default:
      return "default";
  }
}

export function PatientsTable({
  patients,
  isLoading,
  hasActiveFilters,
  onDelete,
}: PatientsTableProps) {
  if (isLoading) {
    return (
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="p-12 flex justify-center">
          <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
        </div>
      </div>
    );
  }

  if (patients.length === 0) {
    return (
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="p-12 text-center text-gray-500">
          {hasActiveFilters ? "No patients match your filters" : "No patients found"}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Contact
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Next Appointment
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {patients.map((patient) => (
              <tr key={patient.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4 whitespace-nowrap">
                  <Link href={`/patients/${patient.id}`} className="group">
                    <div className="font-medium text-gray-900 group-hover:text-blue-600 transition-colors">
                      {patient.firstName} {patient.lastName}
                    </div>
                  </Link>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2 text-sm text-gray-700 font-medium">
                    <Phone className="w-3.5 h-3.5 text-blue-500" />
                    <span>{patient.phone}</span>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {patient.appointmentDate ? (
                    <div className="space-y-1.5">
                      <div className="flex items-center gap-2 text-xs font-bold text-slate-700">
                        <Calendar className="w-3.5 h-3.5 text-blue-500" />
                        <span>{new Date(patient.appointmentDate).toLocaleDateString()}</span>
                      </div>
                      <div className={cn(
                        "flex items-center gap-1.5 px-2 py-0.5 rounded-md border w-max text-[9px] font-black uppercase tracking-wider",
                        patient.appointmentStatus === 'confirmed'
                          ? "bg-emerald-50 text-emerald-700 border-emerald-100"
                          : "bg-amber-50 text-amber-700 border-amber-100"
                      )}>
                        {patient.appointmentStatus === 'confirmed' && <CheckCircle2 className="w-2.5 h-2.5" />}
                        {patient.appointmentStatus || 'Scheduled'}
                      </div>
                    </div>
                  ) : (
                    <span className="text-[10px] font-bold text-slate-300 uppercase tracking-widest italic leading-none">Not Set</span>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <Badge variant={getStatusVariant(patient.status)}>
                    {patient.status}
                  </Badge>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right">
                  <div className="flex items-center justify-end gap-2">
                    {patient.appointmentStatus === 'confirmed' && (
                      <Link href={`/appointments/${patient.activeAppointmentId || '123'}/visit`}>
                        <button
                          className="p-2 text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-all shadow-sm hover:shadow-blue-100 group/btn animate-in fade-in zoom-in duration-300"
                          title="Start Clinical Encounter"
                        >
                          <Stethoscope className="w-4 h-4 group-hover/btn:scale-110 transition-transform" />
                        </button>
                      </Link>
                    )}
                    <Link href={`/patients/${patient.id}?tab=visits`}>
                      <button
                        className="p-2 text-gray-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors"
                        title="Visit history"
                      >
                        <History className="w-4 h-4" />
                      </button>
                    </Link>
                    <Link href={`/patients/${patient.id}`}>
                      <button
                        className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        title="Edit patient"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                    </Link>
                    <button
                      onClick={() => onDelete(patient.id, `${patient.firstName} ${patient.lastName}`)}
                      className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      title="Delete patient"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

