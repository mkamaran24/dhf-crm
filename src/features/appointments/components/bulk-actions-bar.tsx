"use client";

import { X, CheckCircle, XCircle, Calendar, Trash2, Download } from "lucide-react";
import { Button } from "@/src/shared/components/ui";
import { AppointmentStatus } from "@/src/shared/types";

interface BulkActionsBarProps {
  selectedCount: number;
  onClearSelection: () => void;
  onBulkStatusUpdate: (status: AppointmentStatus) => Promise<void>;
  onBulkDelete: () => Promise<void>;
  onBulkExport: () => void;
}

export function BulkActionsBar({
  selectedCount,
  onClearSelection,
  onBulkStatusUpdate,
  onBulkDelete,
  onBulkExport,
}: BulkActionsBarProps) {
  if (selectedCount === 0) return null;

  return (
    <div className="fixed bottom-8 left-1/2 transform -translate-x-1/2 z-50">
      <div className="bg-gray-900 text-white rounded-xl shadow-2xl px-6 py-4 flex items-center gap-6">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center font-bold text-sm">
            {selectedCount}
          </div>
          <span className="font-medium">
            {selectedCount} appointment{selectedCount > 1 ? 's' : ''} selected
          </span>
        </div>

        <div className="h-8 w-px bg-gray-700" />

        <div className="flex items-center gap-2">
          <Button
            size="sm"
            variant="text"
            onClick={() => onBulkStatusUpdate("confirmed")}
            className="bg-green-600 hover:bg-green-700 text-white"
          >
            <CheckCircle className="w-4 h-4 mr-2" />
            Confirm
          </Button>

          <Button
            size="sm"
            variant="text"
            onClick={() => onBulkStatusUpdate("cancelled")}
            className="bg-red-600 hover:bg-red-700 text-white"
          >
            <XCircle className="w-4 h-4 mr-2" />
            Cancel
          </Button>

          <Button
            size="sm"
            variant="text"
            onClick={onBulkExport}
            className="bg-blue-600 hover:bg-blue-700 text-white"
          >
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>

          <Button
            size="sm"
            variant="text"
            onClick={onBulkDelete}
            className="bg-gray-700 hover:bg-gray-600 text-white"
          >
            <Trash2 className="w-4 h-4 mr-2" />
            Delete
          </Button>
        </div>

        <div className="h-8 w-px bg-gray-700" />

        <button
          onClick={onClearSelection}
          className="p-2 hover:bg-gray-800 rounded-lg transition-colors"
          title="Clear selection"
        >
          <X className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}

