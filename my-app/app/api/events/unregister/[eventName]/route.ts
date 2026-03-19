import { NextRequest, NextResponse } from 'next/server';
import { requireUser } from '@/lib/auth';
import { connectDB } from '@/lib/db';

interface Params {
  params: { eventName: string };
}

export async function DELETE(req: NextRequest, { params }: Params) {
  await connectDB();
  const userOrResponse = await requireUser(req);
  if (userOrResponse instanceof Response) return userOrResponse;

  try {
    const { eventName } = params;
    const initialLength = userOrResponse.registeredEvents.length;

    userOrResponse.registeredEvents = userOrResponse.registeredEvents.filter(
      (event) => event.eventName !== eventName
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
