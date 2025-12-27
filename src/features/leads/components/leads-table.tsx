"use client";

import Link from "next/link";
import { Mail, Phone, Calendar, Edit, Trash2, Map, Loader2, FileText } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/src/shared/components/ui";
import { Lead } from "../types";
import { LeadStatus } from "@/src/shared/types";

interface LeadsTableProps {
  leads: (Lead & { followUpDate?: string })[];
  isLoading: boolean;
  hasActiveFilters: boolean;
  onStatusChange: (leadId: string, status: LeadStatus, followUpDate?: string) => void;
  onDelete: (leadId: string, leadName: string) => void;
  currentStatusFilter?: LeadStatus | "all";
}

const LEAD_STATUSES: LeadStatus[] = ["New", "Contacted", "Follow-up", "Ready", "Appointment Booked", "Converted"];

function getStatusBadgeColor(status: LeadStatus) {
  switch (status) {
    case "New":
      return "bg-slate-100 text-slate-700 border-slate-200";
    case "Contacted":
      return "bg-blue-100 text-blue-700 border-blue-200";
    case "Follow-up":
      return "bg-amber-100 text-amber-700 border-amber-200";
    case "Ready":
      return "bg-indigo-100 text-indigo-700 border-indigo-200";
    case "Appointment Booked":
      return "bg-purple-100 text-purple-700 border-purple-200";
    case "Converted":
      return "bg-emerald-100 text-emerald-700 border-emerald-200";
    default:
      return "bg-gray-100 text-gray-700";
  }
}

import { useState } from "react";
import { Modal, ModalHeader, ModalContent, ModalFooter, Button, Input } from "@/src/shared/components/ui";

export function LeadsTable({
  leads,
  isLoading,
  hasActiveFilters,
  onStatusChange,
  onDelete,
  currentStatusFilter,
}: LeadsTableProps) {
  const [followUpModal, setFollowUpModal] = useState<{ leadId: string; status: LeadStatus } | null>(null);
  const [selectedDate, setSelectedDate] = useState("");

  const handleStatusChangeClick = (leadId: string, status: LeadStatus) => {
    if (["Follow-up", "Ready", "Appointment Booked"].includes(status)) {
      setFollowUpModal({ leadId, status });
    } else {
      onStatusChange(leadId, status);
    }
  };

  const isScheduleView = currentStatusFilter && ["Follow-up", "Ready", "Appointment Booked"].includes(currentStatusFilter);

  const confirmFollowUp = () => {
    if (followUpModal && selectedDate) {
      onStatusChange(followUpModal.leadId, followUpModal.status, selectedDate);
      setFollowUpModal(null);
      setSelectedDate("");
    }
  };
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
              {isScheduleView && (
                <th className="px-6 py-3 text-left text-xs font-semibold text-blue-600 uppercase tracking-wider">
                  Schedule Date
                </th>
              )}
              {!isScheduleView && (
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Budget Range
                </th>
              )}
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
                    onChange={(e) => handleStatusChangeClick(lead.id, e.target.value as LeadStatus)}
                    className={`text-[10px] px-2.5 py-1 rounded-full font-bold uppercase tracking-tighter cursor-pointer border shadow-sm transition-all hover:shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500/20 ${getStatusBadgeColor(lead.status)}`}
                  >
                    {LEAD_STATUSES.map(status => (
                      <option key={status} value={status}>{status}</option>
                    ))}
                  </select>
                </td>
                {isScheduleView && (
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-2 text-sm font-bold text-blue-700 bg-blue-50 px-3 py-1 rounded-lg border border-blue-100">
                      <Calendar className="w-3.5 h-3.5" />
                      {lead.followUpDate || "No Date Set"}
                    </div>
                  </td>
                )}
                {!isScheduleView && (
                  <td className="px-6 py-4 whitespace-nowrap">
                    {lead.budgetMin !== undefined && lead.budgetMax !== undefined ? (
                      <span className="text-sm text-gray-600">
                        {lead.budgetMin.toLocaleString()} - {lead.budgetMax.toLocaleString()} IQD
                      </span>
                    ) : (
                      <span className="text-sm text-gray-400">Not set</span>
                    )}
                  </td>
                )}
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <Calendar className="w-3.5 h-3.5 text-gray-400" />
                    <span>{new Date(lead.createdAt).toLocaleDateString()}</span>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right">
                  <div className="flex items-center justify-end gap-1">
                    <Link href={`/leads/progress/${lead.id}`}>
                      <button
                        className="p-2 text-gray-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-all"
                        title="Check Lead Progress"
                      >
                        <Map className="w-4 h-4" />
                      </button>
                    </Link>

                    {["Contacted", "Follow-up", "Ready", "Appointment Booked"].includes(lead.status) && (
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

      <Modal isOpen={!!followUpModal} onClose={() => setFollowUpModal(null)} size="sm">
        <ModalHeader>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center border border-blue-100 shadow-sm">
              <Calendar className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-800">Set Schedule Date</h3>
              <p className="text-xs text-slate-500">Scheduled for: {followUpModal?.status}</p>
            </div>
          </div>
        </ModalHeader>
        <ModalContent>
          <div className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Target Date</label>
              <Input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="rounded-xl border-slate-200 focus:border-blue-500 focus:ring-blue-500/10"
              />
            </div>
          </div>
        </ModalContent>
        <ModalFooter>
          <Button variant="outlined" onClick={() => setFollowUpModal(null)} className="rounded-xl font-bold">Cancel</Button>
          <Button
            onClick={confirmFollowUp}
            disabled={!selectedDate}
            className="rounded-xl bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-100 font-bold"
          >
            Update Lead Stage
          </Button>
        </ModalFooter>
      </Modal>
    </div>
  );
}

