
import React from "react";
import { mockLeadsProgress } from "../../data/mock-progress-data";
import { Users, UserX, CheckCircle, TrendingUp } from "lucide-react";

export function LeadSummaryCards() {
    const total = mockLeadsProgress.length;
    const lost = mockLeadsProgress.filter(l => l.lost).length;
    const converted = mockLeadsProgress.filter(l => l.currentStage === "Converted").length;
    const active = total - lost - converted;

    const stats = [
        {
            label: "Total Leads",
            value: total,
            icon: Users,
            color: "blue",
            description: "Total acquired leads"
        },
        {
            label: "Active",
            value: active,
            icon: TrendingUp,
            color: "amber",
            description: "Waitlisted / Booked"
        },
        {
            label: "Converted",
            value: converted,
            icon: CheckCircle,
            color: "emerald",
            description: "Lead to Patient"
        },
        {
            label: "Lost",
            value: lost,
            icon: UserX,
            color: "red",
            description: "Dropped / Canceled"
        }
    ];

    const colorMap: Record<string, string> = {
        blue: "bg-blue-50 text-blue-600 border-blue-100",
        amber: "bg-amber-50 text-amber-600 border-amber-100",
        emerald: "bg-emerald-50 text-emerald-600 border-emerald-100",
        red: "bg-red-50 text-red-600 border-red-100",
    };

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map((stat) => (
                <div
                    key={stat.label}
                    className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex flex-col gap-4 hover:shadow-md transition-all duration-300 group"
                >
                    <div className="flex justify-between items-start">
                        <div className={`p-3 rounded-xl border ${colorMap[stat.color]} transition-transform group-hover:scale-110 duration-300 shadow-sm`}>
                            <stat.icon className="w-6 h-6" />
                        </div>
                        <div className="text-right">
                            <div className="text-2xl font-bold text-slate-800 tracking-tight">{stat.value}</div>
                            <div className="text-[10px] font-semibold text-slate-400 uppercase tracking-widest">{stat.label}</div>
                        </div>
                    </div>
                    <div className="pt-4 border-t border-slate-50 flex items-center justify-between">
                        <span className="text-xs text-slate-500 font-medium">{stat.description}</span>
                        <div className={`w-1.5 h-1.5 rounded-full ${stat.color === 'emerald' ? 'bg-emerald-500 animate-pulse' : 'bg-slate-200'}`} />
                    </div>
                </div>
            ))}
        </div>
    );
}
