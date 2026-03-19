import { NextRequest, NextResponse } from 'next/server';
import QRCode from 'qrcode';
import crypto from 'crypto';
import { connectDB } from '@/lib/db';
import { requireUser } from '@/lib/auth';
import Order from '@/lib/models/order';

function ensureEnv(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`${name} is not configured`);
  }
  return value;
}

function buildUpiLink(orderId: string, amount: number): string {
  const upiId = encodeURIComponent(ensureEnv('UPI_ID'));
  const payeeName = encodeURIComponent(ensureEnv('UPI_NAME'));
  const am = encodeURIComponent(amount.toFixed(2));
  const tr = encodeURIComponent(orderId);
  return `upi://pay?pa=${upiId}&pn=${payeeName}&am=${am}&cu=INR&tr=${tr}`;
}

export async function POST(req: NextRequest) {
  await connectDB();
  const userOrResponse = await requireUser(req);
  if (userOrResponse instanceof Response) return userOrResponse;

  try {
    const body = await req.json().catch(() => ({}));

    const envAmountRaw = process.env.UPI_AMOUNT;
    const envAmount = envAmountRaw ? Number(envAmountRaw) : NaN;
    const amount = body.amount !== undefined ? Number(body.amount) : envAmount;

    if (!amount || Number.isNaN(amount) || amount <= 0) {
      return NextResponse.json(
        { message: 'Payment amount is invalid. Set UPI_AMOUNT in env or pass a positive amount.' },
        { status: 400 }
      );
    }

    // Reuse any existing pending order for this user to avoid duplicate UTR submissions
    const existing = await Order.findOne({ user: userOrResponse._id, status: 'pending' });
    if (existing) {
      // If the configured amount changed, update the pending order to match the latest amount
      if (existing.amount !== amount) {
        existing.amount = amount;
        await existing.save();
      }

      const upiLink = buildUpiLink(existing.orderId, existing.amount);
      const qrDataUrl = await QRCode.toDataURL(upiLink);
      return NextResponse.json({
        orderId: existing.orderId,
        amount: existing.amount,
        upiLink,
        qrDataUrl,
        status: existing.status,
      });
    }

    const orderId = crypto.randomUUID();
    const upiLink = buildUpiLink(orderId, amount);
    const qrDataUrl = await QRCode.toDataURL(upiLink);

    await Order.create({
      orderId,
      amount,
      status: 'pending',
      user: userOrResponse._id,
    });

    return NextResponse.json({ orderId, amount, upiLink, qrDataUrl, status: 'pending' });
  } catch (error) {
    return NextResponse.json({ message: 'Could not create order', error: (error as Error).message }, { status: 500 });
  }
}
