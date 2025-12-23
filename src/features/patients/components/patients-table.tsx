"use client";

import Link from "next/link";
import { Mail, Phone, Calendar, Edit, Trash2, Loader2 } from "lucide-react";
import { Patient } from "../types";
import { Badge } from "@/src/shared/components/ui";

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
                Last Visit
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
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Mail className="w-3.5 h-3.5 text-gray-400" />
                      <span className="truncate max-w-[200px]">{patient.email}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Phone className="w-3.5 h-3.5 text-gray-400" />
                      <span>{patient.phone}</span>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {patient.lastVisit ? (
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Calendar className="w-3.5 h-3.5 text-gray-400" />
                      <span>{new Date(patient.lastVisit).toLocaleDateString()}</span>
                    </div>
                  ) : (
                    <span className="text-sm text-gray-400">No visits</span>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <Badge variant={getStatusVariant(patient.status)}>
                    {patient.status}
                  </Badge>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right">
                  <div className="flex items-center justify-end gap-2">
                    <Link href={`/patients/${patient.id}`}>
                      <button 
                        className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        title="View patient"
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

