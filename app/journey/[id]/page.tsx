"use client";

import { useEffect, useState, use } from "react";
import Link from "next/link";
import { ArrowLeft, UserPlus, Phone, Calendar, CheckCircle } from "lucide-react";
import { MaterialCard } from "@/components/MaterialCard";
import { MaterialButton } from "@/components/MaterialButton";
import { MaterialStepper, Step } from "@/components/MaterialStepper";
import { MaterialTimeline } from "@/components/MaterialTimeline";
import { Journey, JourneyStage } from "@/types/journey";

const STAGES: JourneyStage[] = ["Lead", "Contacted", "Converted", "Onboarding", "Active Patient"];

export default function JourneyPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [journey, setJourney] = useState<Journey | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetch("/api/journey")
      .then((res) => res.json())
      .then((data) => {
        // Mock finding by ID
        const found = data.find((j: Journey) => j.id === id);
        setJourney(found || null);
        setIsLoading(false);
      });
  }, [id]);

  if (isLoading) return <div className="p-8 text-center text-gray-500">Loading journey...</div>;
  if (!journey) return <div className="p-8 text-center text-red-500">Journey not found</div>;

  // Calculate steps for stepper
  const currentStageIndex = STAGES.indexOf(journey.currentStage);
  const steps: Step[] = STAGES.map((stage, index) => ({
    id: stage,
    label: stage,
    status: index < currentStageIndex ? "completed" : index === currentStageIndex ? "current" : "upcoming"
  }));

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-12">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/leads">
             <MaterialButton variant="text" size="sm" className="pl-0 hover:pl-1 transition-all">
              <ArrowLeft className="w-4 h-4 mr-1" />
              Back
            </MaterialButton>
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Patient Journey</h1>
            <p className="text-sm text-gray-500">Tracking lifecycle for {journey.name}</p>
          </div>
        </div>
        <div className="flex gap-2">
          {journey.currentStage === "Lead" && (
             <MaterialButton variant="filled" className="bg-green-600 hover:bg-green-700">
               <Phone className="w-4 h-4 mr-2" />
               Log Contact
             </MaterialButton>
          )}
          {journey.currentStage === "Contacted" && (
             <MaterialButton variant="filled">
               <Calendar className="w-4 h-4 mr-2" />
               Schedule Consult
             </MaterialButton>
          )}
        </div>
      </div>

      {/* Progress Stepper */}
      <MaterialCard className="py-8 px-8">
        <MaterialStepper steps={steps} />
      </MaterialCard>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Timeline */}
        <div className="lg:col-span-2 space-y-6">
          <h2 className="text-xl font-bold text-gray-800">Activity Timeline</h2>
          <MaterialTimeline events={journey.events} />
        </div>

        {/* Sidebar Actions & Stats */}
        <div className="space-y-6">
           <MaterialCard title="Quick Actions" className="p-6">
              <div className="space-y-3">
                <MaterialButton variant="outlined" className="w-full justify-start">
                  <UserPlus className="w-4 h-4 mr-2 text-blue-500" />
                  Update Stage
                </MaterialButton>
                <MaterialButton variant="outlined" className="w-full justify-start">
                  <CheckCircle className="w-4 h-4 mr-2 text-green-500" />
                  Convert to Patient
                </MaterialButton>
              </div>
           </MaterialCard>

           <MaterialCard title="Journey Stats" className="p-6">
              <div className="space-y-4">
                <div className="flex justify-between items-center border-b border-gray-100 pb-2">
                  <span className="text-gray-500 text-sm">Total Duration</span>
                  <span className="font-semibold text-gray-700">14 Days</span>
                </div>
                <div className="flex justify-between items-center border-b border-gray-100 pb-2">
                   <span className="text-gray-500 text-sm">Interactions</span>
                   <span className="font-semibold text-gray-700">{journey.events.length}</span>
                </div>
                <div className="flex justify-between items-center">
                   <span className="text-gray-500 text-sm">Next Step</span>
                   <span className="font-semibold text-blue-600 text-right">Follow-up Call</span>
                </div>
              </div>
           </MaterialCard>
        </div>
      </div>
    </div>
  );
}
