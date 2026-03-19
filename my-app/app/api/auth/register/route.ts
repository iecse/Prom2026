import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { generateToken } from '@/lib/jwt';
import User from '@/lib/models/user';

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
    } = await req.json();

    if (
      !firstName ||
      !lastName ||
      !email ||
      !phone ||
      !password ||
      !passwordConfirm
    ) {
      return NextResponse.json({ message: 'Please provide all required fields' }, { status: 400 });
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

    const newUser = await User.create({
      firstName,
      lastName,
      email,
      phone,
      password,
    });

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
    return NextResponse.json(
      { message: 'Registration error', error: (error as Error).message },
      { status: 500 }
    );
  }
}
