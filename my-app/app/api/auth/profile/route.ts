import { NextRequest, NextResponse } from 'next/server';
import { requireUser } from '@/lib/auth';
import { connectDB } from '@/lib/db';
import branches from '@/data/branches.json';

export async function GET(req: NextRequest) {
  await connectDB();
  const userOrResponse = await requireUser(req);
  if (userOrResponse instanceof Response) return userOrResponse;

  return NextResponse.json({ user: userOrResponse });
}

export async function PUT(req: NextRequest) {
  await connectDB();
  const userOrResponse = await requireUser(req);
  if (userOrResponse instanceof Response) return userOrResponse;

  try {
    const { firstName, lastName, phone, regNo, branch } = await req.json();

    const cleanFirst = typeof firstName === 'string' ? firstName.trim() : '';
    const cleanLast = typeof lastName === 'string' ? lastName.trim() : '';
    const cleanPhone = typeof phone === 'string' ? phone.trim() : '';
    const cleanRegNo = typeof regNo === 'string' ? regNo.trim() : '';
    const cleanBranch = typeof branch === 'string' ? branch.trim() : '';

    if (!cleanFirst || !cleanLast || !cleanPhone || !cleanRegNo || !cleanBranch) {
      return NextResponse.json({ message: 'All fields are required' }, { status: 400 });
    }

    if (!/^\d{10}$/.test(cleanPhone)) {
      return NextResponse.json({ message: 'Phone number must be 10 digits' }, { status: 400 });
    }

    if (!/^\d{9}$/.test(cleanRegNo)) {
      return NextResponse.json({ message: 'Reg No must be 9 digits' }, { status: 400 });
    }

    if (!branches.includes(cleanBranch)) {
      return NextResponse.json({ message: 'Select a valid branch' }, { status: 400 });
    }

    userOrResponse.firstName = cleanFirst;
    userOrResponse.lastName = cleanLast;
    userOrResponse.phone = cleanPhone;
    userOrResponse.regNo = cleanRegNo;
    userOrResponse.branch = cleanBranch;

    await userOrResponse.save();

    // Re-read to ensure we return persisted values
    const fresh = await (await import('@/lib/models/user')).default.findById(userOrResponse._id).lean();
    if (!fresh) {
      return NextResponse.json({ message: 'Could not load updated profile' }, { status: 500 });
    }

    return NextResponse.json({
      message: 'Profile updated successfully',
      user: {
        id: fresh._id?.toString?.() ?? '',
        firstName: fresh.firstName,
        lastName: fresh.lastName,
        email: fresh.email,
        phone: fresh.phone,
        regNo: fresh.regNo,
        branch: fresh.branch,
        paymentStatus: fresh.paymentStatus,
        transactionId: fresh.transactionId,
        freePass: fresh.freePass,
        memberId: fresh.memberId,
      },
    });
  } catch (error) {
    console.error('[auth/profile] update error', error);
    const err = error as Error & { code?: number; message: string };
    const message = err?.message || 'Update error';
    if (err?.code === 11000 || message.includes('E11000')) {
      return NextResponse.json({ message: 'A user with this phone already exists' }, { status: 409 });
    }
    return NextResponse.json({ message }, { status: 500 });
  }
}
