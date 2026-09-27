import { timingSafeEqual } from 'crypto';
import type { NextFunction, Request, Response } from 'express';

function matchesSecret(token: string, secret: string): boolean {
  const a = Buffer.from(token);
  const b = Buffer.from(secret);
  return a.length === b.length && timingSafeEqual(a, b);
}

/**
 * Guards admin-only endpoints. Callers must send `Authorization: Bearer <ADMIN_SESSION_SECRET>`,
 * the same secret the storefront uses for admin sessions. The Next.js server attaches it for
 * admin pages, and browser requests reach us through its login-checked relay, so the secret
 * never leaves the servers. Without the secret configured every admin request is refused.
 */
export function requireAdmin(req: Request, res: Response, next: NextFunction) {
  const secret = process.env.ADMIN_SESSION_SECRET;

  if (!secret) {
    return res.status(503).json({ message: 'Admin access is not configured on the server.' });
  }

  const header = req.get('authorization') ?? '';
  const token = header.startsWith('Bearer ') ? header.slice('Bearer '.length) : '';

  if (!token || !matchesSecret(token, secret)) {
    return res.status(401).json({ message: 'Admin login required.' });
  }

  next();
}
