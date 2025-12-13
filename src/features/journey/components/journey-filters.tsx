"use client";

import { Search, X } from "lucide-react";
import { Input, Select, Button } from "@/src/shared/components/ui";
import { JourneyStage } from "@/src/shared/types";

interface JourneyFiltersProps {
  searchQuery: string;
  stageFilter: JourneyStage | "all";
  onSearchChange: (query: string) => void;
  onStageChange: (stage: JourneyStage | "all") => void;
  onClearFilters: () => void;
}

const STAGE_OPTIONS = [
  { label: "All Stages", value: "all" },
  { label: "Lead", value: "Lead" },
  { label: "Contacted", value: "Contacted" },
  { label: "Converted", value: "Converted" },
  { label: "Onboarding", value: "Onboarding" },
  { label: "Active Patient", value: "Active Patient" },
];

export function JourneyFilters({
  searchQuery,
  stageFilter,
  onSearchChange,
  onStageChange,
  onClearFilters,
}: JourneyFiltersProps) {
  const hasActiveFilters = searchQuery || stageFilter !== "all";

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-4">
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1">
          <Input
            label="Search journeys"
            placeholder="Search by name or email..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            icon={<Search className="w-4 h-4" />}
          />
        </div>

        <div className="md:w-64">
          <Select
            label="Filter by Stage"
            value={stageFilter}
            onChange={(e) => onStageChange(e.target.value as JourneyStage | "all")}
            options={STAGE_OPTIONS}
          />
        </div>

        {hasActiveFilters && (
          <div className="flex items-end">
            <Button
              variant="outlined"
              onClick={onClearFilters}
              className="whitespace-nowrap"
            >
              <X className="w-4 h-4 mr-2" />
              Clear Filters
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}

