import { NextRequest, NextResponse } from 'next/server';
import { requireUser } from '@/lib/auth';
import { connectDB } from '@/lib/db';
import Order from '@/lib/models/order';

function isValidUtr(utr?: string): utr is string {
  if (!utr) return false;
  const trimmed = utr.trim();
  return trimmed.length >= 6 && trimmed.length <= 35;
}

export async function POST(req: NextRequest) {
  await connectDB();
  const userOrResponse = await requireUser(req);
  if (userOrResponse instanceof Response) return userOrResponse;

  try {
    const { orderId, utr } = await req.json();

    if (!orderId || !isValidUtr(utr)) {
      return NextResponse.json({ message: 'Provide a valid orderId and UTR' }, { status: 400 });
    }

    const order = await Order.findOne({ orderId, user: userOrResponse._id });
    if (!order) {
      return NextResponse.json({ message: 'Order not found' }, { status: 404 });
    }

    if (order.status !== 'pending') {
      return NextResponse.json({ message: `Order already ${order.status}` }, { status: 400 });
    }

    if (order.utr) {
      return NextResponse.json({ message: 'UTR already submitted for this order' }, { status: 400 });
    }

    const trimmedUtr = utr.trim();
    const duplicate = await Order.findOne({ utr: trimmedUtr });
    if (duplicate && duplicate.orderId !== order.orderId) {
      return NextResponse.json({ message: 'This UTR is already linked to another order' }, { status: 409 });
    }

    order.utr = trimmedUtr;
    order.status = 'pending';
    await order.save();

    // Reflect pending status on the user profile for compatibility with event gating
    userOrResponse.paymentStatus = 'pending';
    userOrResponse.transactionId = trimmedUtr;
    userOrResponse.paymentAmount = order.amount;
    await userOrResponse.save();

    return NextResponse.json({
      message: 'UTR submitted. Awaiting manual verification.',
      order: {
        orderId: order.orderId,
        status: order.status,
        utr: order.utr,
        amount: order.amount,
        createdAt: order.createdAt,
      },
    });
  } catch (error) {
    return NextResponse.json(
      { message: 'Payment error', error: (error as Error).message },
      { status: 500 }
    );
  }
}
