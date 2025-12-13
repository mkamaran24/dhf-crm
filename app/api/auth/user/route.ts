import { NextResponse } from "next/server";
import { currentUser } from "@/src/shared/services/data-store";

export async function GET() {
  return NextResponse.json(currentUser);
}
