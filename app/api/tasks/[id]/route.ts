
import { NextResponse } from 'next/server';
import { updateTask, deleteTask, tasks } from '@/lib/data';

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const id = (await params).id;
  const body = await request.json();

  updateTask(id, body);

  return NextResponse.json({ success: true });
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const id = (await params).id;
  deleteTask(id);

  return NextResponse.json({ success: true });
}
