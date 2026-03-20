import jwt, { JwtPayload } from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || '';

if (!JWT_SECRET) {
  throw new Error('JWT_SECRET is not defined in environment variables');
}

interface TokenPayload {
  id: string;
}

export function generateToken(userId: string) {
  return jwt.sign({ id: userId }, JWT_SECRET, { expiresIn: '7d' });
}

export function verifyToken(token: string): (JwtPayload & TokenPayload) | null {
  try {
    return jwt.verify(token, JWT_SECRET) as JwtPayload & TokenPayload;
  } catch {
    return null;
  }
}
