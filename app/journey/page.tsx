"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight, Map } from "lucide-react";
import { MaterialCard } from "@/components/MaterialCard";
import { MaterialButton } from "@/components/MaterialButton";
import { MaterialTable } from "@/components/MaterialTable";
import { Journey } from "@/types/journey";

export default function JourneysPage() {
  const [journeys, setJourneys] = useState<Journey[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetch("/api/journey")
      .then((res) => res.json())
      .then((data) => {
        setJourneys(data);
        setIsLoading(false);
      });
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Patient Journeys</h1>
          <p className="text-sm text-gray-500 mt-1">Track patient lifecycle and status</p>
        </div>
      </div>

      <MaterialCard className="p-0 overflow-hidden">
        {isLoading ? (
          <div className="p-8 text-center text-gray-500">Loading journeys...</div>
        ) : (
          <MaterialTable headers={["Patient Name", "Current Stage", "Progress", "Last Update", "Actions"]}>
            {journeys.map((journey) => (
              <tr key={journey.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4 font-medium text-gray-900">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-xs font-bold">
                      {journey.name.split(" ").map(n => n[0]).join("")}
                    </div>
                    {journey.name}
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-50 text-blue-700 border border-blue-100">
                    {journey.currentStage}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="w-full bg-gray-200 rounded-full h-2 max-w-[100px]">
                    <div 
                      className="bg-blue-600 h-2 rounded-full transition-all duration-500" 
                      style={{ width: `${journey.progress}%` }}
                    />
                  </div>
                </td>
                <td className="px-6 py-4 text-gray-600">
                  {new Date(journey.updatedAt).toLocaleDateString()}
                </td>
                <td className="px-6 py-4">
                  <Link href={`/journey/${journey.id}`}>
                    <MaterialButton variant="text" size="sm" className="text-blue-600 hover:bg-blue-50">
                      View Journey
                      <ArrowRight className="w-4 h-4 ml-1" />
                    </MaterialButton>
                  </Link>
                </td>
              </tr>
            ))}
          </MaterialTable>
        )}
      </MaterialCard>
    </div>
  );
}
