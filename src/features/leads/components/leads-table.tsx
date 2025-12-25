"use client";

import Link from "next/link";
import { Mail, Phone, Calendar, Edit, Trash2, Map, Loader2, FileText } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/src/shared/components/ui/tooltip";
import { Lead } from "../types";
import { LeadStatus } from "@/src/shared/types";

interface LeadsTableProps {
  leads: Lead[];
  isLoading: boolean;
  hasActiveFilters: boolean;
  onStatusChange: (leadId: string, status: LeadStatus) => void;
  onDelete: (leadId: string, leadName: string) => void;
}

const LEAD_STATUSES: LeadStatus[] = ["Contacted", "Converted"];

function getStatusBadgeColor(status: LeadStatus) {
  switch (status) {
    case "Contacted":
      return "bg-yellow-100 text-yellow-700";
    case "Converted":
      return "bg-green-100 text-green-700";
    default:
      return "bg-gray-100 text-gray-700";
  }
}

export function LeadsTable({
  leads,
  isLoading,
  hasActiveFilters,
  onStatusChange,
  onDelete,
}: LeadsTableProps) {
  if (isLoading) {
    return (
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="p-12 flex justify-center">
          <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
        </div>
      </div>
    );
  }

  if (leads.length === 0) {
    return (
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="p-12 text-center text-gray-500">
          {hasActiveFilters ? "No leads match your filters" : "No leads found"}
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
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Budget Range
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Created
              </th>
              <th className="px-6 py-3 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {leads.map((lead) => (
              <tr key={lead.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center gap-2">
                    <Link href={`/leads/${lead.id}`} className="group">
                      <div className="font-medium text-gray-900 group-hover:text-blue-600 transition-colors">
                        {lead.name}
                      </div>
                    </Link>
                    {lead.notes && (
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <div className="p-1 bg-amber-50 rounded cursor-help">
                              <FileText className="w-3 h-3 text-amber-600" />
                            </div>
                          </TooltipTrigger>
                          <TooltipContent className="max-w-xs">
                            <p className="text-xs">{lead.notes}</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    )}
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Phone className="w-3.5 h-3.5 text-gray-400" />
                      <span>{lead.phone}</span>
                    </div>
                    {lead.phoneSecondary && (
                      <div className="flex items-center gap-2 text-sm text-gray-500">
                        <Phone className="w-3.5 h-3.5 text-gray-400" />
                        <span className="text-xs">{lead.phoneSecondary} (Alt)</span>
                      </div>
                    )}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <select
                    value={lead.status}
                    onChange={(e) => onStatusChange(lead.id, e.target.value as LeadStatus)}
                    className={`text-xs px-2 py-1 rounded-full font-medium cursor-pointer border-0 focus:outline-none focus:ring-2 focus:ring-blue-500 ${getStatusBadgeColor(lead.status)}`}
                  >
                    {LEAD_STATUSES.map(status => (
                      <option key={status} value={status}>{status}</option>
                    ))}
                  </select>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {lead.budgetMin !== undefined && lead.budgetMax !== undefined ? (
                    <span className="text-sm text-gray-600">
                      {lead.budgetMin.toLocaleString()} - {lead.budgetMax.toLocaleString()} IQD
                    </span>
                  ) : (
                    <span className="text-sm text-gray-400">Not set</span>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <Calendar className="w-3.5 h-3.5 text-gray-400" />
                    <span>{new Date(lead.createdAt).toLocaleDateString()}</span>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right">
                  <div className="flex items-center justify-end gap-1">
                    <Link href="/leads/progress">
                      <button
                        className="p-2 text-gray-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-all"
                        title="Check Lead Progress"
                      >
                        <Map className="w-4 h-4" />
                      </button>
                    </Link>

                    {lead.status === "Contacted" && (
                      <Link href="/appointments/create">
                        <button
                          className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
                          title="Quick Book Appointment"
                        >
                          <Calendar className="w-4 h-4" />
                        </button>
                      </Link>
                    )}

                    <div className="w-px h-4 bg-gray-200 mx-1" />

                    <Link href={`/leads/${lead.id}`}>
                      <button
                        className="p-2 text-gray-400 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition-all"
                        title="Edit lead"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                    </Link>

                    <button
                      onClick={() => onDelete(lead.id, lead.name)}
                      className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                      title="Delete lead"
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

