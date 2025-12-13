"use client";

import { useState } from "react";
import { Button, Badge } from "@/src/shared/components/ui";
import { 
  UserCheck, 
  Phone, 
  Calendar, 
  FileText, 
  CheckCircle2,
  ArrowRight,
  Loader2
} from "lucide-react";
import { Journey } from "../types";
import { JourneyStage } from "@/src/shared/types";

interface JourneyActionsProps {
  journey: Journey;
  onStageUpdate: (newStage: JourneyStage) => Promise<void>;
}

const STAGE_ACTIONS: Record<JourneyStage, { label: string; nextStage: JourneyStage | null; icon: any; color: string }> = {
  "Lead": {
    label: "Mark as Contacted",
    nextStage: "Contacted",
    icon: Phone,
    color: "bg-purple-600 hover:bg-purple-700",
  },
  "Contacted": {
    label: "Convert to Patient",
    nextStage: "Converted",
    icon: UserCheck,
    color: "bg-green-600 hover:bg-green-700",
  },
  "Converted": {
    label: "Start Onboarding",
    nextStage: "Onboarding",
    icon: FileText,
    color: "bg-indigo-600 hover:bg-indigo-700",
  },
  "Onboarding": {
    label: "Activate Patient",
    nextStage: "Active Patient",
    icon: CheckCircle2,
    color: "bg-blue-600 hover:bg-blue-700",
  },
  "Active Patient": {
    label: "Journey Complete",
    nextStage: null,
    icon: CheckCircle2,
    color: "bg-green-600",
  },
};

export function JourneyActions({ journey, onStageUpdate }: JourneyActionsProps) {
  const [isUpdating, setIsUpdating] = useState(false);
  const currentAction = STAGE_ACTIONS[journey.currentStage];
  const Icon = currentAction.icon;

  const handleStageUpdate = async () => {
    if (!currentAction.nextStage) return;
    
    setIsUpdating(true);
    try {
      await onStageUpdate(currentAction.nextStage);
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border-2 border-blue-200 rounded-xl p-6">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-1">Next Action</h3>
          <p className="text-sm text-gray-600">Move journey to next stage</p>
        </div>
        <Badge 
          variant={journey.progress === 100 ? "success" : "info"} 
          className="text-sm font-semibold"
        >
          {journey.currentStage}
        </Badge>
      </div>

      {journey.progress === 100 ? (
        <div className="flex items-center justify-center gap-3 py-4 text-green-700">
          <CheckCircle2 className="w-6 h-6" />
          <span className="font-semibold">Journey Complete</span>
        </div>
      ) : (
        <div className="space-y-3">
          <Button
            onClick={handleStageUpdate}
            disabled={isUpdating || !currentAction.nextStage}
            className={`w-full ${currentAction.color} text-white shadow-lg`}
            size="lg"
          >
            {isUpdating ? (
              <>
                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                Updating...
              </>
            ) : (
              <>
                <Icon className="w-5 h-5 mr-2" />
                {currentAction.label}
                {currentAction.nextStage && <ArrowRight className="w-4 h-4 ml-2" />}
              </>
            )}
          </Button>

          <div className="grid grid-cols-2 gap-2">
            <Button
              variant="outlined"
              size="sm"
              className="text-sm"
              onClick={() => window.location.href = `/appointments/create?patientId=${journey.patientId || ''}`}
              disabled={!journey.patientId}
            >
              <Calendar className="w-4 h-4 mr-1.5" />
              Book Appointment
            </Button>
            <Button
              variant="outlined"
              size="sm"
              className="text-sm"
              onClick={() => window.location.href = `/patients/${journey.patientId || ''}`}
              disabled={!journey.patientId}
            >
              <FileText className="w-4 h-4 mr-1.5" />
              View Profile
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

