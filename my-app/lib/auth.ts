import { NextRequest } from 'next/server';
import { connectDB } from './db';
import { verifyToken } from './jwt';
import User, { IUser } from './models/user';

export async function getUserFromRequest(req: NextRequest): Promise<IUser | null> {
  const header = req.headers.get('authorization');
  const token = header?.startsWith('Bearer ') ? header.split(' ')[1] : null;

  if (!token) return null;

  const decoded = verifyToken(token);
  if (!decoded?.id) return null;

  await connectDB();
  const user = await User.findById(decoded.id);
  return user;
}

export async function requireUser(req: NextRequest): Promise<IUser | Response> {
  const user = await getUserFromRequest(req);

  if (!user) {
    return new Response(JSON.stringify({ message: 'Unauthorized' }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  return user;
}
