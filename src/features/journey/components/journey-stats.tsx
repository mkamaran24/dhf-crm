"use client";

import { Users, TrendingUp, Clock, CheckCircle2 } from "lucide-react";
import { Card, CardContent } from "@/src/shared/components/ui";
import { Journey } from "../types";

interface JourneyStatsProps {
  journeys: Journey[];
}

export function JourneyStats({ journeys }: JourneyStatsProps) {
  const activePatients = journeys.filter(j => j.currentStage === 'Active Patient').length;
  const completed = journeys.filter(j => j.progress === 100).length;
  const inProgress = journeys.filter(j => j.progress > 0 && j.progress < 100).length;
  const totalEvents = journeys.reduce((sum, j) => sum + j.events.length, 0);

  const stats = [
    {
      label: "Total Journeys",
      value: journeys.length,
      icon: Users,
      color: "text-blue-600",
      bgColor: "bg-blue-100",
    },
    {
      label: "Active Patients",
      value: activePatients,
      icon: CheckCircle2,
      color: "text-green-600",
      bgColor: "bg-green-100",
    },
    {
      label: "In Progress",
      value: inProgress,
      icon: TrendingUp,
      color: "text-purple-600",
      bgColor: "bg-purple-100",
    },
    {
      label: "Total Events",
      value: totalEvents,
      icon: Clock,
      color: "text-orange-600",
      bgColor: "bg-orange-100",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat) => {
        const Icon = stat.icon;
        return (
          <Card key={stat.label} className="hover:shadow-lg transition-all duration-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-500 mb-1">{stat.label}</p>
                  <h3 className="text-3xl font-bold text-gray-900">{stat.value}</h3>
                </div>
                <div className={`w-14 h-14 rounded-xl ${stat.bgColor} flex items-center justify-center`}>
                  <Icon className={`w-7 h-7 ${stat.color}`} />
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}

