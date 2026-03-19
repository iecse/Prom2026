import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import Order from '@/lib/models/order';

function isAuthorizedAdmin(req: NextRequest): boolean {
  const secret = process.env.ADMIN_SECRET;
  const provided = req.headers.get('x-admin-secret');
  return Boolean(secret && provided && provided === secret);
}

export async function GET(req: NextRequest) {
  await connectDB();

  if (!isAuthorizedAdmin(req)) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  try {
    const status = req.nextUrl.searchParams.get('status');
    const filter: Record<string, unknown> = status ? { status } : {};
    const orders = await Order.find(filter)
      .sort({ createdAt: -1 })
      .populate({ path: 'user', select: 'firstName lastName email phone' });

    return NextResponse.json({ orders });
  } catch (error) {
    return NextResponse.json(
      { message: 'Could not fetch orders', error: (error as Error).message },
      { status: 500 }
    );
  }
}
