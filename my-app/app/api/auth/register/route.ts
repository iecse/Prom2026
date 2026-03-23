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
      username,
      phone,
      password,
      passwordConfirm,
      regNo,
      memberId,
    } = await req.json();

    const cleanFirst = typeof firstName === 'string' ? firstName.trim() : '';
    const cleanLast = typeof lastName === 'string' ? lastName.trim() : '';
    const cleanUsername = typeof username === 'string' ? username.trim().toLowerCase() : '';
    const cleanPhone = typeof phone === 'string' ? phone.trim() : '';
    const cleanRegNo = typeof regNo === 'string' ? regNo.trim() : '';
    const cleanMemberId = typeof memberId === 'string' ? memberId.trim() : '';

    if (!cleanFirst || !cleanLast || !cleanUsername || !cleanPhone || !cleanRegNo || !password || !passwordConfirm) {
      return NextResponse.json({ message: 'Please provide all required fields' }, { status: 400 });
    }

    if (!/^[a-zA-Z0-9_]{3,30}$/.test(cleanUsername)) {
      return NextResponse.json(
        { message: 'Username must be 3-30 characters and contain only letters, numbers, or underscores' },
        { status: 400 }
      );
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

    const existingUser = await User.findOne({ $or: [{ username: cleanUsername }, { phone: cleanPhone }] });
    if (existingUser) {
      return NextResponse.json(
        { message: 'User with this username or phone already exists' },
        { status: 409 }
      );
    }

    let freePass = false;
    let claimedCode: { regno: string; memberId: string } | null = null;

    // New logic: check reg_no and member_id pair
    if (cleanMemberId && cleanRegNo) {
      // Normalize for case-insensitive matching
      const normRegNo = cleanRegNo.toUpperCase();
      const normMemberId = cleanMemberId.toUpperCase();
      // Find and mark as used atomically
      const reserved = await AccessCode.findOneAndUpdate(
        {
          regno: normRegNo,
          memberId: normMemberId,
          used: false,
        },
        {
          used: true,
          usedAt: new Date(),
          usedByUsername: cleanUsername,
        },
        { returnDocument: 'after' }
      );

      if (!reserved) {
        // Check if the pair exists but is used, or doesn't exist at all
        const exists = await AccessCode.findOne({ regno: normRegNo, memberId: normMemberId }).lean();
        return NextResponse.json(
          { message: exists ? 'This reg no + member id has already been used' : 'Invalid reg no or member id' },
          { status: exists ? 409 : 400 }
        );
      }

      freePass = true;
      claimedCode = { regno: normRegNo, memberId: normMemberId };
    }

    let newUser;
    try {
      newUser = await User.create({
        firstName: cleanFirst,
        lastName: cleanLast,
        username: cleanUsername,
        phone: cleanPhone,
        password,
        regNo: cleanRegNo,
        memberId: cleanMemberId || undefined,
        freePass,
      });
    } catch (err) {
      // rollback claimed code if user creation fails
      if (claimedCode) {
        await AccessCode.updateOne(
          { regno: claimedCode.regno, memberId: claimedCode.memberId },
          { used: false, usedBy: null, usedAt: null, usedByUsername: null }
        );
      }
      const error = err as Error & { code?: number; keyPattern?: Record<string, number>; keyValue?: Record<string, unknown> };
      if (error?.code === 11000) {
        const field = Object.keys(error.keyPattern ?? {})[0] ?? 'unknown';
        if (field === 'memberId') {
          // memberId unique index in MongoDB is not sparse — multiple nulls clash.
          // Fix: run db.users.dropIndex('memberId_1') and re-create with { sparse: true }.
          return NextResponse.json(
            { message: 'Registration failed due to a database index conflict on memberId. Please contact support.' },
            { status: 500 }
          );
        }
        return NextResponse.json(
          { message: `User with this ${field} already exists` },
          { status: 409 }
        );
      }
      throw err;
    }

    if (claimedCode) {
      await AccessCode.updateOne(
        { regno: claimedCode.regno, memberId: claimedCode.memberId },
        { used: true, usedBy: newUser._id, usedAt: new Date(), usedByUsername: cleanUsername }
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
          username: newUser.username,
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
