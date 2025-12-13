"use client";

import Link from "next/link";
import { Button } from "@/src/shared/components/ui";
import { 
  Calendar, 
  FileText, 
  User, 
  Phone, 
  Mail,
  ExternalLink
} from "lucide-react";
import { Journey } from "../types";

interface JourneyQuickActionsProps {
  journey: Journey;
}

export function JourneyQuickActions({ journey }: JourneyQuickActionsProps) {
  const actions = [
    {
      label: "View Patient Profile",
      icon: User,
      href: `/patients/${journey.patientId}`,
      color: "text-blue-600 hover:bg-blue-50",
      show: !!journey.patientId,
    },
    {
      label: "View Lead Profile",
      icon: User,
      href: `/leads/${journey.leadId}`,
      color: "text-purple-600 hover:bg-purple-50",
      show: !!journey.leadId && !journey.patientId,
    },
    {
      label: "Book Appointment",
      icon: Calendar,
      href: `/appointments/create?${journey.patientId ? `patientId=${journey.patientId}` : `name=${journey.name}`}`,
      color: "text-green-600 hover:bg-green-50",
      show: true,
    },
    {
      label: "Send Email",
      icon: Mail,
      href: `mailto:${journey.email}`,
      color: "text-orange-600 hover:bg-orange-50",
      show: true,
    },
    {
      label: "Make Call",
      icon: Phone,
      href: `tel:${journey.email}`,
      color: "text-indigo-600 hover:bg-indigo-50",
      show: true,
    },
  ];

  const visibleActions = actions.filter(a => a.show);

  return (
    <div className="bg-white border-2 border-gray-200 rounded-xl p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
      <div className="space-y-2">
        {visibleActions.map((action) => {
          const Icon = action.icon;
          return (
            <Link
              key={action.label}
              href={action.href}
              className={`flex items-center gap-3 p-3 rounded-lg border border-gray-200 ${action.color} transition-all hover:shadow-sm group`}
            >
              <Icon className="w-5 h-5 flex-shrink-0" />
              <span className="font-medium text-sm flex-1">{action.label}</span>
              <ExternalLink className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
            </Link>
          );
        })}
      </div>
    </div>
  );
}

