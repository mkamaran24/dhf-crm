import { LucideIcon, TrendingUp, TrendingDown } from "lucide-react";
import { Card } from "@/src/shared/components/ui";

interface KPICardProps {
  label: string;
  value: string | number;
  icon: LucideIcon;
  trend?: number;
  color: string;
  bgColor: string;
}

export function KPICard({ label, value, icon: Icon, trend, color, bgColor }: KPICardProps) {
  const hasTrend = trend !== undefined;
  const isPositive = trend && trend > 0;

  return (
    <Card className="p-6 hover:shadow-lg transition-all duration-200">
      <div className="flex items-center justify-between mb-4">
        <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${bgColor}`}>
          <Icon className={`w-6 h-6 ${color}`} />
        </div>
        {hasTrend && (
          <div className={`flex items-center gap-1 text-xs font-semibold px-2 py-1 rounded-full ${
            isPositive ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'
          }`}>
            {isPositive ? (
              <TrendingUp className="w-3 h-3" />
            ) : (
              <TrendingDown className="w-3 h-3" />
            )}
            {Math.abs(trend!)}%
          </div>
        )}
      </div>
      <div>
        <p className="text-sm font-medium text-gray-500 mb-1">{label}</p>
        <h3 className="text-3xl font-bold text-gray-900">{value}</h3>
      </div>
    </Card>
  );
}

