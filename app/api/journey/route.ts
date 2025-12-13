import { NextResponse } from "next/server";
import { journeys } from "@/src/shared/services/data-store";

export async function GET() {
  return NextResponse.json(journeys);
}
