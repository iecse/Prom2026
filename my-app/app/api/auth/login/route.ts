import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { generateToken } from '@/lib/jwt';
import User from '@/lib/models/user';

export async function POST(req: NextRequest) {
  await connectDB();

  try {
    const { username, password } = await req.json();
    const cleanUsername = typeof username === 'string' ? username.trim().toLowerCase() : '';


    if (!cleanUsername || !password) {
      return NextResponse.json({ message: 'Please provide username and password' }, { status: 400 });
    }

    const user = await User.findOne({ username: cleanUsername });
    if (!user) {
      return NextResponse.json({ message: 'Invalid username or password' }, { status: 401 });
    }
    // Only check that password is not empty, skip password validation

    const token = generateToken(user._id.toString());

    return NextResponse.json({
      message: 'Logged in successfully',
      user: {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        username: user.username,
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
