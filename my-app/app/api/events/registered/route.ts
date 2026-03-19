import { NextRequest, NextResponse } from 'next/server';
import { requireUser } from '@/lib/auth';
import { connectDB } from '@/lib/db';

export async function GET(req: NextRequest) {
  await connectDB();
  const userOrResponse = await requireUser(req);
  if (userOrResponse instanceof Response) return userOrResponse;

  const registeredEvents = userOrResponse.registeredEvents;
  return NextResponse.json({ registeredEvents, totalEvents: registeredEvents.length });
}
