import { NextResponse } from "next/server";
import { getJourney, updateJourneyStage } from "@/src/shared/services/data-store";

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const journey = getJourney(params.id);
  
  if (!journey) {
    return NextResponse.json(
      { error: "Journey not found" },
      { status: 404 }
    );
  }

  return NextResponse.json(journey);
}

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const { currentStage } = body;

    if (!currentStage) {
      return NextResponse.json(
        { error: "Current stage is required" },
        { status: 400 }
      );
    }

    const updatedJourney = updateJourneyStage(params.id, currentStage);

    if (!updatedJourney) {
      return NextResponse.json(
        { error: "Journey not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(updatedJourney);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to update journey" },
      { status: 500 }
    );
  }
}

