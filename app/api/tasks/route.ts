
import { NextResponse } from 'next/server';
import { tasks, addTask } from '@/lib/data';

export async function GET() {
  return NextResponse.json(tasks);
}

export async function POST(request: Request) {
  const body = await request.json();

  const newTask = {
    id: Math.random().toString(36).substr(2, 9),
    ...body,
    status: 'Pending' // Default status
  };

  addTask(newTask);

  return NextResponse.json(newTask, { status: 201 });
}
