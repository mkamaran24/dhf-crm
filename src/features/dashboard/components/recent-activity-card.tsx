import Link from "next/link";
import { UserPlus, Calendar, CheckSquare, Users, Clock } from "lucide-react";
import { Card, CardHeader, CardContent } from "@/src/shared/components/ui";
import { RecentActivity } from "../types";

interface RecentActivityCardProps {
  activities: RecentActivity[];
}

function getActivityIcon(type: string) {
  switch (type) {
    case 'lead':
      return UserPlus;
    case 'appointment':
      return Calendar;
    case 'task':
      return CheckSquare;
    case 'patient':
      return Users;
    default:
      return Clock;
  }
}

function getActivityColor(type: string) {
  switch (type) {
    case 'lead':
      return 'bg-blue-100 text-blue-600';
    case 'appointment':
      return 'bg-purple-100 text-purple-600';
    case 'task':
      return 'bg-green-100 text-green-600';
    case 'patient':
      return 'bg-orange-100 text-orange-600';
    default:
      return 'bg-gray-100 text-gray-600';
  }
}

function getRelativeTime(timestamp: string): string {
  const now = new Date();
  const then = new Date(timestamp);
  const diffInSeconds = Math.floor((now.getTime() - then.getTime()) / 1000);

  if (diffInSeconds < 60) return 'Just now';
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
  return `${Math.floor(diffInSeconds / 86400)}d ago`;
}

export function RecentActivityCard({ activities }: RecentActivityCardProps) {
  return (
    <Card>
      <CardHeader className="border-b border-gray-100">
        <h2 className="text-lg font-semibold text-gray-800">Recent Activity</h2>
      </CardHeader>
      <CardContent className="p-0">
        <div className="divide-y divide-gray-100">
          {activities.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              No recent activity
            </div>
          ) : (
            activities.map((activity) => {
              const Icon = getActivityIcon(activity.type);
              const colorClass = getActivityColor(activity.type);

              return (
                <div
                  key={activity.id}
                  className="p-4 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-start gap-3">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${colorClass}`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900">{activity.title}</p>
                      <p className="text-sm text-gray-600 truncate">{activity.description}</p>
                      <p className="text-xs text-gray-400 mt-1">
                        {getRelativeTime(activity.timestamp)}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </CardContent>
    </Card>
  );
}

