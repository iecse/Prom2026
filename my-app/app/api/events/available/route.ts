import { NextResponse } from 'next/server';
import { AVAILABLE_EVENTS } from '@/lib/events';

export async function GET() {
  return NextResponse.json({ availableEvents: AVAILABLE_EVENTS });
}
