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

    const trimmedUtr = utr.trim();
    const duplicate = await Order.findOne({ utr: trimmedUtr });
    if (duplicate && duplicate.orderId !== order.orderId) {
      return NextResponse.json({ message: 'This UTR is already linked to another order' }, { status: 409 });
    }

    // Allow idempotent submit when already paid with same UTR
    if (order.status === 'paid' && order.utr === trimmedUtr) {
      return NextResponse.json({
        message: 'Payment already marked as paid.',
        order: {
          orderId: order.orderId,
          status: order.status,
          utr: order.utr,
          amount: order.amount,
          createdAt: order.createdAt,
          userPaymentStatus: userOrResponse.paymentStatus,
        },
      });
    }

    // Auto-complete payment: attach UTR and mark order paid
    try {
      await Order.updateOne(
        { _id: order._id },
        {
          $set: {
            utr: trimmedUtr,
            status: 'paid',
          },
        }
      );
      order.utr = trimmedUtr;
      order.status = 'paid';
    } catch (err) {
      const message = (err as Error).message || '';
      if (message.includes('duplicate key') || message.includes('E11000')) {
        return NextResponse.json({ message: 'This UTR is already linked to another order' }, { status: 409 });
      }
      throw err;
    }

    // Reflect paid status on the user profile for event gating
    await userOrResponse.updateOne({
      $set: {
        paymentStatus: 'paid',
        transactionId: trimmedUtr,
        paymentAmount: order.amount,
        paymentDate: new Date(),
      },
    });
    userOrResponse.paymentStatus = 'paid';
    userOrResponse.transactionId = trimmedUtr;
    userOrResponse.paymentAmount = order.amount;
    userOrResponse.paymentDate = new Date();

    return NextResponse.json({
      message: 'Payment marked as paid.',
      order: {
        orderId: order.orderId,
        status: order.status,
        utr: order.utr,
        amount: order.amount,
        createdAt: order.createdAt,
        userPaymentStatus: userOrResponse.paymentStatus,
      },
    });
  } catch (error) {
    return NextResponse.json(
      { message: 'Payment error', error: (error as Error).message },
      { status: 500 }
    );
  }
}
