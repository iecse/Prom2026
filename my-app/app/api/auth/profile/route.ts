import { NextRequest, NextResponse } from 'next/server';
import { requireUser } from '@/lib/auth';
import { connectDB } from '@/lib/db';

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
    const { firstName, lastName, phone } = await req.json();

    if (firstName) userOrResponse.firstName = firstName;
    if (lastName) userOrResponse.lastName = lastName;
    if (phone) userOrResponse.phone = phone;

    await userOrResponse.save();

    return NextResponse.json({
      message: 'Profile updated successfully',
      user: userOrResponse,
    });
  } catch (error) {
    return NextResponse.json(
      { message: 'Update error', error: (error as Error).message },
      { status: 500 }
    );
  }
}
