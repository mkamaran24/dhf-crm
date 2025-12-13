"use client";

import { use, useState } from "react";
import Link from "next/link";
import { ChevronLeft, Loader2, Mail, User, Calendar, Clock, Phone, MapPin } from "lucide-react";
import { Card, CardHeader, CardContent, Badge, Button } from "@/src/shared/components/ui";
import { 
  JourneyProgress, 
  JourneyActions,
  JourneyStageManager,
  JourneyQuickActions
} from "@/src/features/journey/components";
import { useJourney } from "@/src/features/journey/hooks/use-journey";
import { JourneyStage } from "@/src/shared/types";

export default function JourneyDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { journey, isLoading, error } = useJourney(id);
  const [optimisticStage, setOptimisticStage] = useState<JourneyStage | null>(null);

  const handleStageUpdate = async (newStage: JourneyStage) => {
    setOptimisticStage(newStage);
    
    try {
      const res = await fetch(`/api/journey/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ currentStage: newStage }),
      });

      if (!res.ok) throw new Error('Failed to update stage');
      
      window.location.reload();
    } catch (error) {
      console.error('Error updating stage:', error);
      setOptimisticStage(null);
    }
  };

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <p className="text-red-600 font-semibold mb-2">Error loading journey</p>
          <p className="text-gray-500 text-sm mb-4">{error}</p>
          <Link href="/journey">
            <Button variant="outlined">
              <ChevronLeft className="w-4 h-4 mr-2" />
              Back to Journeys
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  if (isLoading || !journey) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
      </div>
    );
  }

  const displayStage = optimisticStage || journey.currentStage;
  const isComplete = journey.progress === 100;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div className="flex items-center gap-4">
          <Link href="/journey">
            <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
              <ChevronLeft className="w-5 h-5 text-gray-600" />
            </button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Patient Journey</h1>
            <p className="text-sm text-gray-500 mt-1">Manage and track patient journey progress</p>
          </div>
        </div>
        <JourneyStageManager
          currentStage={displayStage}
          onStageUpdate={handleStageUpdate}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1 space-y-6">
          <Card>
            <CardHeader className="border-b border-gray-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center">
                  <User className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-gray-900">Patient Info</h2>
                  <p className="text-sm text-gray-500">Contact details</p>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-6 space-y-6">
              <div className="flex items-center gap-4 pb-4 border-b border-gray-100">
                <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white font-bold text-3xl shadow-lg">
                  {journey.name.charAt(0).toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-gray-900 text-xl mb-1.5">{journey.name}</h3>
                  <Badge variant={isComplete ? "success" : "info"} className="font-medium">
                    {displayStage}
                  </Badge>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                  <Mail className="w-5 h-5 text-gray-500 mt-0.5 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-gray-500 font-medium mb-0.5">Email</p>
                    <p className="text-sm text-gray-900 font-medium truncate">{journey.email}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <Calendar className="w-5 h-5 text-gray-500 flex-shrink-0" />
                  <div className="flex-1">
                    <p className="text-xs text-gray-500 font-medium mb-0.5">Created</p>
                    <p className="text-sm text-gray-900 font-medium">
                      {new Date(journey.createdAt).toLocaleDateString('en-US', { 
                        month: 'short', 
                        day: 'numeric', 
                        year: 'numeric' 
                      })}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <Clock className="w-5 h-5 text-gray-500 flex-shrink-0" />
                  <div className="flex-1">
                    <p className="text-xs text-gray-500 font-medium mb-0.5">Last Updated</p>
                    <p className="text-sm text-gray-900 font-medium">
                      {new Date(journey.updatedAt).toLocaleDateString('en-US', { 
                        month: 'short', 
                        day: 'numeric', 
                        year: 'numeric' 
                      })}
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <JourneyQuickActions journey={journey} />
        </div>

        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader className="border-b border-gray-100">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center">
                    <MapPin className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h2 className="text-lg font-semibold text-gray-900">Journey Progress</h2>
                    <p className="text-sm text-gray-500">Track stage progression</p>
                  </div>
                </div>
                {isComplete && (
                  <Badge variant="success" className="text-sm font-semibold px-3 py-1.5">
                    Journey Complete
                  </Badge>
                )}
              </div>
            </CardHeader>
            <CardContent className="p-8">
              <JourneyProgress
                currentStage={displayStage}
                progress={journey.progress}
              />
            </CardContent>
          </Card>

          <JourneyActions journey={journey} onStageUpdate={handleStageUpdate} />
        </div>
      </div>
    </div>
  );
}
