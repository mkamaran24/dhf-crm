
import { NextResponse } from "next/server";
import { leads, updateLead, deleteLead } from "@/lib/data";

export async function GET(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
  ) {
  const id = (await params).id;
  const lead = leads.find(l => l.id === id);

  if (!lead) {
     return NextResponse.json({ error: "Lead not found" }, { status: 404 });
  }

  return NextResponse.json(lead);
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const id = (await params).id;
  const body = await request.json();
  const updatedLead = updateLead(id, body);
  
  if (updatedLead) {
    return NextResponse.json(updatedLead);
  }
  
  return NextResponse.json({ error: "Lead not found" }, { status: 404 });
}

export async function DELETE(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
  ) {
  const id = (await params).id;
  deleteLead(id);
  // Also check if deleted? simplify for mock.
  return NextResponse.json({ success: true });
}