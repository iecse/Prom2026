import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { generateToken } from '@/lib/jwt';
import User from '@/lib/models/user';

export async function POST(req: NextRequest) {
  await connectDB();

  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json({ message: 'Please provide email and password' }, { status: 400 });
    }

    const user = await User.findOne({ email }).select('+password');

    if (!user) {
      return NextResponse.json({ message: 'Invalid email or password' }, { status: 401 });
    }

    const isMatch = await user.comparePassword(password);

    if (!isMatch) {
      return NextResponse.json({ message: 'Invalid email or password' }, { status: 401 });
    }

    const token = generateToken(user._id.toString());

    return NextResponse.json({
      message: 'Logged in successfully',
      user: {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
      },
      token,
    });
  } catch (error) {
    return NextResponse.json(
      { message: 'Login error', error: (error as Error).message },
      { status: 500 }
    );
  }
}
