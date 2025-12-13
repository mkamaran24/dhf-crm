"use client";

import { useState } from "react";
import { Button, Modal, ModalHeader, ModalContent, ModalFooter } from "@/src/shared/components/ui";
import { ChevronRight, Check } from "lucide-react";
import { JourneyStage } from "@/src/shared/types";

interface JourneyStageManagerProps {
  currentStage: JourneyStage;
  onStageUpdate: (newStage: JourneyStage) => Promise<void>;
}

const STAGES: { value: JourneyStage; label: string; description: string }[] = [
  { value: "Lead", label: "Lead", description: "Initial inquiry or contact" },
  { value: "Contacted", label: "Contacted", description: "First response sent" },
  { value: "Converted", label: "Converted", description: "Converted to patient" },
  { value: "Onboarding", label: "Onboarding", description: "Patient onboarding in progress" },
  { value: "Active Patient", label: "Active Patient", description: "Fully active patient" },
];

export function JourneyStageManager({ currentStage, onStageUpdate }: JourneyStageManagerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedStage, setSelectedStage] = useState<JourneyStage>(currentStage);
  const [isUpdating, setIsUpdating] = useState(false);

  const currentIndex = STAGES.findIndex(s => s.value === currentStage);
  const selectedIndex = STAGES.findIndex(s => s.value === selectedStage);

  const handleUpdate = async () => {
    if (selectedStage === currentStage) {
      setIsOpen(false);
      return;
    }

    setIsUpdating(true);
    try {
      await onStageUpdate(selectedStage);
      setIsOpen(false);
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <>
      <Button
        variant="outlined"
        onClick={() => setIsOpen(true)}
        className="border-2 border-blue-200 hover:border-blue-300 hover:bg-blue-50"
      >
        <ChevronRight className="w-4 h-4 mr-2" />
        Update Stage
      </Button>

      <Modal isOpen={isOpen} onClose={() => setIsOpen(false)}>
        <ModalHeader>
          <h2 className="text-xl font-bold text-gray-900">Update Journey Stage</h2>
          <p className="text-sm text-gray-500 mt-1">Select the new stage for this patient journey</p>
        </ModalHeader>

        <ModalContent>
          <div className="space-y-3">
            {STAGES.map((stage, index) => {
              const isSelected = selectedStage === stage.value;
              const isCurrent = currentStage === stage.value;
              const isPast = index < currentIndex;

              return (
                <button
                  key={stage.value}
                  onClick={() => setSelectedStage(stage.value)}
                  className={`w-full text-left p-4 rounded-lg border-2 transition-all ${
                    isSelected
                      ? "border-blue-500 bg-blue-50"
                      : isCurrent
                      ? "border-green-300 bg-green-50"
                      : isPast
                      ? "border-gray-200 bg-gray-50"
                      : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center font-bold ${
                      isPast || isCurrent
                        ? "bg-green-500 text-white"
                        : isSelected
                        ? "bg-blue-500 text-white"
                        : "bg-gray-200 text-gray-600"
                    }`}>
                      {isPast || isCurrent ? <Check className="w-5 h-5" /> : index + 1}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold text-gray-900">{stage.label}</h3>
                        {isCurrent && (
                          <span className="text-xs font-medium text-green-600 bg-green-100 px-2 py-0.5 rounded-full">
                            Current
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-gray-600">{stage.description}</p>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </ModalContent>

        <ModalFooter>
          <Button
            variant="outlined"
            onClick={() => setIsOpen(false)}
            disabled={isUpdating}
          >
            Cancel
          </Button>
          <Button
            onClick={handleUpdate}
            isLoading={isUpdating}
            disabled={selectedStage === currentStage}
          >
            Update Stage
          </Button>
        </ModalFooter>
      </Modal>
    </>
  );
}

