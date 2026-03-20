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

function buildUpiLink(orderId: string): string {
  const upiId = encodeURIComponent(ensureEnv('UPI_ID'));
  const payeeName = encodeURIComponent(ensureEnv('UPI_NAME'));
  const tr = encodeURIComponent(orderId);
  return `upi://pay?pa=${upiId}&pn=${payeeName}&cu=INR&tr=${tr}`;
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

    // Always look at the latest order for this user
    const latest = await Order.findOne({ user: userOrResponse._id }).sort({ createdAt: -1 });

    if (latest) {
      if (latest.status === 'pending') {
        if (latest.amount !== amount) {
          latest.amount = amount;
          await latest.save();
        }

        const upiLink = buildUpiLink(latest.orderId);
        const qrDataUrl = await QRCode.toDataURL(upiLink);
        return NextResponse.json({
          orderId: latest.orderId,
          amount: latest.amount,
          upiLink,
          qrDataUrl,
          status: latest.status,
          utr: latest.utr,
        });
      }

      if (latest.status === 'paid') {
        const upiLink = buildUpiLink(latest.orderId);
        const qrDataUrl = await QRCode.toDataURL(upiLink);
        return NextResponse.json({
          orderId: latest.orderId,
          amount: latest.amount,
          upiLink,
          qrDataUrl,
          status: latest.status,
          utr: latest.utr,
        });
      }
      // If rejected, fall through to create a fresh pending order
    }

    const orderId = crypto.randomUUID();
    const upiLink = buildUpiLink(orderId);
    const qrDataUrl = await QRCode.toDataURL(upiLink);

    await Order.create({
      orderId,
      amount,
      status: 'pending',
      user: userOrResponse._id,
    });

    return NextResponse.json({ orderId, amount, upiLink, qrDataUrl, status: 'pending', utr: null });
  } catch (error) {
    return NextResponse.json({ message: 'Could not create order', error: (error as Error).message }, { status: 500 });
  }
}
