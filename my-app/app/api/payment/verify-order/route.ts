import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import Order from '@/lib/models/order';
import User from '@/lib/models/user';

function isAuthorizedAdmin(req: NextRequest): boolean {
  const secret = process.env.ADMIN_SECRET;
  const provided = req.headers.get('x-admin-secret');
  return Boolean(secret && provided && provided === secret);
}

export async function POST(req: NextRequest) {
  await connectDB();

  if (!isAuthorizedAdmin(req)) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { orderId, status } = await req.json();
    if (!orderId || !['paid', 'rejected'].includes(status)) {
      return NextResponse.json({ message: 'Provide orderId and status paid|rejected' }, { status: 400 });
    }

    const order = await Order.findOne({ orderId });
    if (!order) {
      return NextResponse.json({ message: 'Order not found' }, { status: 404 });
    }

    order.status = status;
    await order.save();

    // Keep user profile in sync for event gating and visibility
    const user = await User.findById(order.user);
    if (user) {
      if (status === 'paid') {
        user.paymentStatus = 'paid';
        user.transactionId = order.utr;
        user.paymentAmount = order.amount;
        user.paymentDate = new Date();
      } else if (status === 'rejected') {
        user.paymentStatus = 'not_paid';
        user.transactionId = undefined;
        user.paymentAmount = 0;
        user.paymentDate = undefined;
      }
      await user.save();
    }

    return NextResponse.json({
      message: `Order ${status}`,
      order: {
        orderId: order.orderId,
        status: order.status,
        utr: order.utr,
        amount: order.amount,
        user: order.user,
      },
    });
  } catch (error) {
    return NextResponse.json(
      { message: 'Could not update order', error: (error as Error).message },
      { status: 500 }
    );
  }
}
