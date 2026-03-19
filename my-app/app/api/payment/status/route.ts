import { NextRequest, NextResponse } from 'next/server';
import { requireUser } from '@/lib/auth';
import { connectDB } from '@/lib/db';

export async function GET(req: NextRequest) {
  await connectDB();
  const userOrResponse = await requireUser(req);
  if (userOrResponse instanceof Response) return userOrResponse;

  return NextResponse.json({
    paymentStatus: userOrResponse.paymentStatus,
    transactionId: userOrResponse.transactionId,
    paymentAmount: userOrResponse.paymentAmount,
    paymentDate: userOrResponse.paymentDate,
  });
}
