import { NextRequest, NextResponse } from 'next/server';
import { timingSafeCompare, createSessionToken } from '@/lib/auth';

// In-memory rate limiting map for brute force mitigation
// Map<IP, { count: number; firstAttempt: number }>
const loginAttempts = new Map<string, { count: number; firstAttempt: number }>();
const MAX_ATTEMPTS = 5;
const WINDOW_MS = 15 * 60 * 1000; // 15 minutes
const LOCKOUT_DELAY_MS = 1200; // 1.2s delay on failed attempts to throttle attackers

function getClientIp(req: NextRequest): string {
  // In Cloudflare Workers/Edge, cf-connecting-ip is trusted and cannot be spoofed by the client
  return (
    req.headers.get('cf-connecting-ip') ||
    req.headers.get('x-real-ip') ||
    req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
    '127.0.0.1'
  );
}

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const record = loginAttempts.get(ip);

  if (!record) return true;

  if (now - record.firstAttempt > WINDOW_MS) {
    loginAttempts.delete(ip);
    return true;
  }

  return record.count < MAX_ATTEMPTS;
}

function recordFailedAttempt(ip: string) {
  const now = Date.now();
  const record = loginAttempts.get(ip);

  if (!record || now - record.firstAttempt > WINDOW_MS) {
    loginAttempts.set(ip, { count: 1, firstAttempt: now });
  } else {
    record.count += 1;
  }
}

function clearRateLimit(ip: string) {
  loginAttempts.delete(ip);
}

export async function POST(req: NextRequest) {
  const ip = getClientIp(req);

  // 1. Rate limiting check
  if (!checkRateLimit(ip)) {
    return NextResponse.json(
      { error: 'Too many failed login attempts. Locked out for 15 minutes.' },
      {
        status: 429,
        headers: { 'Retry-After': '900' },
      }
    );
  }

  let password = '';
  try {
    const body = (await req.json()) as { password?: unknown };
    if (typeof body?.password === 'string') {
      password = body.password;
    }
  } catch {
    return NextResponse.json({ error: 'Invalid request body.' }, { status: 400 });
  }

  const adminPassword = process.env.ADMIN_PASSWORD;
  if (!adminPassword) {
    return NextResponse.json({ error: 'Server misconfigured: ADMIN_PASSWORD not set.' }, { status: 500 });
  }

  // 2. Validate password
  if (!timingSafeCompare(password, adminPassword)) {
    recordFailedAttempt(ip);
    // Artificial delay to throttle brute-force automation
    await new Promise((resolve) => setTimeout(resolve, LOCKOUT_DELAY_MS));
    return NextResponse.json({ error: 'Incorrect password.' }, { status: 401 });
  }

  // Successful login: clear failed attempts
  clearRateLimit(ip);

  // 3. Issue cryptographically signed, timestamped session token (never the raw password)
  let token: string;
  try {
    token = createSessionToken();
  } catch (err) {
    console.error('[POST /api/admin/login] Failed to generate session token:', err);
    return NextResponse.json({ error: 'Authentication service error.' }, { status: 500 });
  }

  const response = NextResponse.json({ ok: true });
  response.cookies.set('__blog_session', token, {
    httpOnly: true,
    sameSite: 'strict',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: 60 * 60 * 24, // 24 hours
  });
  return response;
}
