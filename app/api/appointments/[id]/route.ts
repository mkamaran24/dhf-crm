import { NextResponse } from 'next/server';
import { getAppointment, updateAppointment, deleteAppointment } from '@/src/shared/services/data-store';

export async function GET(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
  ) {
    const id = (await params).id;
    const appointment = getAppointment(id);

    if (!appointment) {
        return NextResponse.json({ error: 'Appointment not found' }, { status: 404 });
    }

    return NextResponse.json(appointment);
}

export async function PUT(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
  ) {
    const id = (await params).id;
    const body = await request.json();

    updateAppointment(id, body);

    return NextResponse.json({ success: true });
}

export async function DELETE(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
  ) {
    const id = (await params).id;
    deleteAppointment(id);

    return NextResponse.json({ success: true });
}
