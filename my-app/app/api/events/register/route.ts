import { NextRequest, NextResponse } from 'next/server';
import { requireUser } from '@/lib/auth';
import { connectDB } from '@/lib/db';
import { AVAILABLE_EVENTS, canonicalizeEventName, isPaymentRequired } from '@/lib/events';
import Order from '@/lib/models/order';

export async function POST(req: NextRequest) {
  await connectDB();
  const userOrResponse = await requireUser(req);
  if (userOrResponse instanceof Response) return userOrResponse;

  try {
    const { eventName } = await req.json();
    const normalizedName = typeof eventName === 'string' ? eventName.trim() : '';

    if (!normalizedName) {
      return NextResponse.json({ message: 'Event name is required' }, { status: 400 });
    }

    const eventId = canonicalizeEventName(normalizedName);
    if (!eventId) {
      return NextResponse.json(
        { message: `Invalid event. Available events: ${AVAILABLE_EVENTS.join(', ')}` },
        { status: 400 }
      );
    }

    const paymentNeeded = isPaymentRequired(eventId) && !userOrResponse.freePass;

    if (paymentNeeded) {
      const paidOrder = await Order.findOne({ user: userOrResponse._id, status: 'paid' });
      const userPaid = userOrResponse.paymentStatus === 'paid';

      if (!paidOrder && !userPaid) {
        return NextResponse.json(
          { message: 'Payment must be completed before registering for this event' },
          { status: 400 }
        );
      }
    }

    userOrResponse.registerForEvent(eventId);
    await userOrResponse.save();

    return NextResponse.json({
      message: `Successfully registered for ${eventName}`,
      registeredEvents: userOrResponse.registeredEvents,
    });
  } catch (error) {
    const message = (error as Error)?.message || 'Event registration error';
    console.error('[register event] failed', message, error);
    if (message.includes('Already registered')) {
      return NextResponse.json({ message }, { status: 409 });
    }

    return NextResponse.json({ message, error: message }, { status: 500 });
  }
}
