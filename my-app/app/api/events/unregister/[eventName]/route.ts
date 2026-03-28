import { NextRequest, NextResponse } from 'next/server';
import { requireUser } from '@/lib/auth';
import { connectDB } from '@/lib/db';
import { canonicalizeEventName } from '@/lib/events';

type Params = Promise<{ eventName: string }>;

export async function DELETE(req: NextRequest, { params }: { params: Params }) {
  await connectDB();
  const userOrResponse = await requireUser(req);
  if (userOrResponse instanceof Response) return userOrResponse;

  try {
    const { eventName } = await params;
    const targetEventName = canonicalizeEventName(eventName) ?? eventName;
    const initialLength = userOrResponse.registeredEvents.length;

    userOrResponse.registeredEvents = userOrResponse.registeredEvents.filter(
      (event) => (canonicalizeEventName(String(event.eventName)) ?? event.eventName) !== targetEventName
    );

    if (userOrResponse.registeredEvents.length === initialLength) {
      return NextResponse.json({ message: `Not registered for ${eventName}` }, { status: 404 });
    }

    await userOrResponse.save();

    return NextResponse.json({
      message: `Successfully unregistered from ${eventName}`,
      registeredEvents: userOrResponse.registeredEvents,
    });
  } catch (error) {
    return NextResponse.json(
      { message: 'Unregister error', error: (error as Error).message },
      { status: 500 }
    );
  }
}
