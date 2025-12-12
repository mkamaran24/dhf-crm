
import { NextResponse } from "next/server";
import { getPatient, updatePatient, deletePatient } from "@/lib/data";

export async function GET(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
  ) {
  const id = (await params).id;
  const patient = getPatient(id);

  if (!patient) {
     return NextResponse.json({ error: "Patient not found" }, { status: 404 });
  }

  return NextResponse.json(patient);
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const id = (await params).id;
  const body = await request.json();
  
  updatePatient(id, body);
  return NextResponse.json({ success: true });
}

export async function DELETE(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
  ) {
  const id = (await params).id;
  deletePatient(id);
  return NextResponse.json({ success: true });
}
