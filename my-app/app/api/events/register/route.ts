import { NextRequest, NextResponse } from 'next/server';
import { requireUser } from '@/lib/auth';
import { connectDB } from '@/lib/db';
import { AVAILABLE_EVENTS, isPaymentRequired } from '@/lib/events';
import Order from '@/lib/models/order';

export async function POST(req: NextRequest) {
  await connectDB();
  const userOrResponse = await requireUser(req);
  if (userOrResponse instanceof Response) return userOrResponse;

  try {
    const { eventName } = await req.json();

    if (!eventName) {
      return NextResponse.json({ message: 'Event name is required' }, { status: 400 });
    }

    if (!AVAILABLE_EVENTS.includes(eventName)) {
      return NextResponse.json(
        { message: `Invalid event. Available events: ${AVAILABLE_EVENTS.join(', ')}` },
        { status: 400 }
      );
    }

    const paymentNeeded = isPaymentRequired(eventName);

    if (paymentNeeded) {
      const paidOrder = await Order.findOne({ user: userOrResponse._id, status: 'paid' });

      if (!paidOrder && userOrResponse.paymentStatus !== 'completed') {
        return NextResponse.json(
          { message: 'Payment must be completed before registering for this event' },
          { status: 400 }
        );
      }
    }

    userOrResponse.registerForEvent(eventName);
    await userOrResponse.save();

    return NextResponse.json({
      message: `Successfully registered for ${eventName}`,
      registeredEvents: userOrResponse.registeredEvents,
    });
  } catch (error) {
    const message = (error as Error).message;
    if (message.includes('Already registered')) {
      return NextResponse.json({ message }, { status: 409 });
    }

    return NextResponse.json(
      { message: 'Event registration error', error: message },
      { status: 500 }
    );
  }
}
