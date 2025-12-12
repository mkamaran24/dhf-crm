
import { NextResponse } from "next/server";
import { patients, addPatient } from "@/lib/data";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const search = searchParams.get("search")?.toLowerCase() || null;
  const status = searchParams.get("status");

  let filteredPatients = [...patients];

  if (status && status !== 'All') {
      filteredPatients = filteredPatients.filter(p => p.status === status);
  }

  if (search) {
    filteredPatients = filteredPatients.filter(p => 
      p.firstName.toLowerCase().includes(search) ||
      p.lastName.toLowerCase().includes(search) ||
      p.email.toLowerCase().includes(search)
    );
  }

  return NextResponse.json(filteredPatients);
}

export async function POST(request: Request) {
  const body = await request.json();
  const newPatient = {
    id: Math.random().toString(36).substr(2, 9),
    status: 'Active',
    balance: 0,
    ...body,
  };
  addPatient(newPatient);
  return NextResponse.json(newPatient, { status: 201 });
}
