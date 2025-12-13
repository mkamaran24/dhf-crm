"use client";

import { Loader2, Inbox } from "lucide-react";
import { Card, CardContent } from "@/src/shared/components/ui";
import { JourneyCard, JourneyFilters, JourneyStats } from "@/src/features/journey/components";
import { useJourneys } from "@/src/features/journey/hooks/use-journey";

export default function JourneyPage() {
  const {
    journeys,
    allJourneys,
    isLoading,
    error,
    searchQuery,
    stageFilter,
    setSearchQuery,
    setStageFilter,
    clearFilters,
  } = useJourneys();

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <p className="text-red-600 font-semibold mb-2">Error loading journeys</p>
          <p className="text-gray-500 text-sm">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Patient Journey Tracking</h1>
        <p className="text-sm text-gray-500 mt-1">Monitor and track patient journeys from lead to active patient</p>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center min-h-[400px]">
          <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
        </div>
      ) : (
        <>
          <JourneyStats journeys={allJourneys} />

          <JourneyFilters
            searchQuery={searchQuery}
            stageFilter={stageFilter}
            onSearchChange={setSearchQuery}
            onStageChange={setStageFilter}
            onClearFilters={clearFilters}
          />

          {journeys.length === 0 ? (
            <Card>
              <CardContent className="p-16 text-center">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Inbox className="w-8 h-8 text-gray-400" />
                </div>
                <p className="text-gray-900 font-semibold mb-1">
                  {searchQuery || stageFilter !== "all" ? "No journeys found" : "No journeys yet"}
                </p>
                <p className="text-sm text-gray-500">
                  {searchQuery || stageFilter !== "all"
                    ? "Try adjusting your search or filters"
                    : "Patient journeys will appear here once created"}
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {journeys.map((journey) => (
                <JourneyCard key={journey.id} journey={journey} />
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}
