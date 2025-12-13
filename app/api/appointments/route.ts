import { NextResponse } from 'next/server';
import { appointments, addAppointment } from '@/src/shared/services/data-store';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const doctor = searchParams.get('doctor');

  let filteredAppointments = appointments;
  
  if (doctor && doctor !== 'All Doctors') {
    filteredAppointments = appointments.filter(apt => apt.doctor === doctor);
  }

  return NextResponse.json(filteredAppointments);
}

export async function POST(request: Request) {
  const body = await request.json();
  
  const newAppointment = {
    id: Math.random().toString(36).substr(2, 9),
    ...body,
    status: 'scheduled'
  };
  
  addAppointment(newAppointment);
  
  return NextResponse.json(newAppointment, { status: 201 });
}
