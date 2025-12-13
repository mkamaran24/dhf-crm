"use client";

import { Search, X, User } from "lucide-react";
import { Input, Select, Button } from "@/src/shared/components/ui";
import { TaskStatus, TaskPriority } from "@/src/shared/types";

interface TaskFiltersProps {
  searchQuery: string;
  statusFilter: TaskStatus | "all";
  priorityFilter: TaskPriority | "all";
  viewMode: "all" | "my";
  onSearchChange: (query: string) => void;
  onStatusChange: (status: TaskStatus | "all") => void;
  onPriorityChange: (priority: TaskPriority | "all") => void;
  onViewModeChange: (mode: "all" | "my") => void;
  onClearFilters: () => void;
}

const STATUS_OPTIONS = [
  { label: "All Status", value: "all" },
  { label: "Pending", value: "Pending" },
  { label: "Done", value: "Done" },
];

const PRIORITY_OPTIONS = [
  { label: "All Priorities", value: "all" },
  { label: "High", value: "High" },
  { label: "Medium", value: "Medium" },
  { label: "Low", value: "Low" },
];

export function TaskFilters({
  searchQuery,
  statusFilter,
  priorityFilter,
  viewMode,
  onSearchChange,
  onStatusChange,
  onPriorityChange,
  onViewModeChange,
  onClearFilters,
}: TaskFiltersProps) {
  const hasActiveFilters = searchQuery || statusFilter !== "all" || priorityFilter !== "all" || viewMode !== "all";

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-4">
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1 bg-gray-100 rounded-lg p-1">
              <button
                onClick={() => onViewModeChange("all")}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                  viewMode === "all"
                    ? "bg-white text-gray-900 shadow-sm"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                All Tasks
              </button>
              <button
                onClick={() => onViewModeChange("my")}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-all flex items-center gap-2 ${
                  viewMode === "my"
                    ? "bg-white text-gray-900 shadow-sm"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                <User className="w-4 h-4" />
                My Tasks
              </button>
            </div>
          </div>
          {hasActiveFilters && (
            <Button
              variant="outlined"
              onClick={onClearFilters}
              size="sm"
              className="whitespace-nowrap"
            >
              <X className="w-4 h-4 mr-2" />
              Clear Filters
            </Button>
          )}
        </div>

        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <Input
              label="Search tasks"
              placeholder="Search by title, assignee, or related..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              icon={<Search className="w-4 h-4" />}
            />
          </div>

          <div className="grid grid-cols-2 md:flex md:gap-4">
            <Select
              label="Status"
              value={statusFilter}
              onChange={(e) => onStatusChange(e.target.value as TaskStatus | "all")}
              options={STATUS_OPTIONS}
            />

            <Select
              label="Priority"
              value={priorityFilter}
              onChange={(e) => onPriorityChange(e.target.value as TaskPriority | "all")}
              options={PRIORITY_OPTIONS}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

