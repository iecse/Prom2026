import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { generateToken } from '@/lib/jwt';
import User from '@/lib/models/user';
import AccessCode from '@/lib/models/accessCode';

export async function POST(req: NextRequest) {
  await connectDB();

  try {
    const {
      firstName,
      lastName,
      email,
      phone,
      password,
      passwordConfirm,
      regNo,
      memberId,
    } = await req.json();

    const cleanFirst = typeof firstName === 'string' ? firstName.trim() : '';
    const cleanLast = typeof lastName === 'string' ? lastName.trim() : '';
    const cleanEmail = typeof email === 'string' ? email.trim() : '';
    const cleanPhone = typeof phone === 'string' ? phone.trim() : '';
    const cleanRegNo = typeof regNo === 'string' ? regNo.trim() : '';
    const cleanMemberId = typeof memberId === 'string' ? memberId.trim() : '';

    if (!cleanFirst || !cleanLast || !cleanEmail || !cleanPhone || !cleanRegNo || !password || !passwordConfirm) {
      return NextResponse.json({ message: 'Please provide all required fields' }, { status: 400 });
    }

    if (!/.+@.+\.com$/i.test(cleanEmail)) {
      return NextResponse.json({ message: 'Email must contain @ and end with .com' }, { status: 400 });
    }

    if (!/^\d{10}$/.test(cleanPhone)) {
      return NextResponse.json({ message: 'Phone number must be 10 digits' }, { status: 400 });
    }

    if (!/^\d{9}(\d{3})?$/.test(cleanRegNo)) {
      return NextResponse.json({ message: 'Reg No must be 9 or 12 digits' }, { status: 400 });
    }

    if (!/^[A-Za-z0-9]{8,}$/.test(password)) {
      return NextResponse.json({ message: 'Password must be at least 8 letters or digits' }, { status: 400 });
    }

    if (password !== passwordConfirm) {
      return NextResponse.json({ message: 'Passwords do not match' }, { status: 400 });
    }

    const existingUser = await User.findOne({ $or: [{ email }, { phone }] });
    if (existingUser) {
      return NextResponse.json(
        { message: 'User with this email or phone already exists' },
        { status: 409 }
      );
    }

    let freePass = false;
    let claimedCode: string | null = null;

    if (cleanMemberId) {
      const normalizedCode = cleanMemberId.toUpperCase();
      const reserved = await AccessCode.findOneAndUpdate(
        { code: normalizedCode, used: false },
        { used: true, usedAt: new Date() },
        { returnDocument: 'after' }
      );

      if (!reserved) {
        const exists = await AccessCode.findOne({ code: normalizedCode }).lean();
        return NextResponse.json(
          { message: exists ? 'This member ID has already been used' : 'Invalid member ID' },
          { status: exists ? 409 : 400 }
        );
      }

      freePass = true;
      claimedCode = normalizedCode;
    }

    let newUser;
    try {
      newUser = await User.create({
        firstName: cleanFirst,
        lastName: cleanLast,
        email: cleanEmail,
        phone: cleanPhone,
        password,
        regNo: cleanRegNo,
        memberId: cleanMemberId || undefined,
        freePass,
      });
    } catch (err) {
      // rollback claimed code if user creation fails
      if (claimedCode) {
        await AccessCode.updateOne({ code: claimedCode }, { used: false, usedBy: null, usedAt: null });
      }
      const error = err as Error & { code?: number; message: string };
      if (error?.code === 11000) {
        return NextResponse.json(
          { message: 'User with this email or phone already exists' },
          { status: 409 }
        );
      }
      throw err;
    }

    if (claimedCode) {
      await AccessCode.updateOne(
        { code: claimedCode },
        { used: true, usedBy: newUser._id, usedAt: new Date() }
      );
    }

    const token = generateToken(newUser._id.toString());

    return NextResponse.json(
      {
        message: 'User registered successfully',
        user: {
          id: newUser._id,
          firstName: newUser.firstName,
          lastName: newUser.lastName,
          email: newUser.email,
          phone: newUser.phone,
        },
        token,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('[auth/register] error', error);
    const message = (error as Error)?.message || 'Registration error';
    return NextResponse.json(
      { message: 'Registration error', error: message },
      { status: 500 }
    );
  }
}
