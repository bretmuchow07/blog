import { cookies } from 'next/headers';
import crypto from 'crypto';

const SESSION_TTL_MS = 24 * 60 * 60 * 1000; // 24 hours

function getSessionSecret(): string | null {
  return (
    process.env.ADMIN_SESSION_SECRET ||
    process.env.ADMIN_SESSION_TOKEN ||
    process.env.ADMIN_PASSWORD ||
    null
  );
}

/**
 * Creates a cryptographically signed, timestamped session token.
 * Format: <timestamp_ms>.<nonce>.<hmac_signature>
 * The administrator password is NEVER stored in or leaked via the token.
 */
export function createSessionToken(): string {
  const secret = getSessionSecret();
  if (!secret) {
    throw new Error('Authentication secret is not configured on the server.');
  }

  const timestamp = Date.now().toString();
  const nonce = crypto.randomBytes(16).toString('hex');
  const payload = `${timestamp}.${nonce}`;

  const signature = crypto
    .createHmac('sha256', secret)
    .update(payload)
    .digest('hex');

  return `${payload}.${signature}`;
}

/**
 * Validates a session token's cryptographic HMAC signature and TTL window.
 */
export function verifySessionToken(token: string): boolean {
  if (!token || typeof token !== 'string') return false;

  const secret = getSessionSecret();
  if (!secret) return false;

  const parts = token.split('.');
  if (parts.length === 3) {
    const [timestampStr, nonce, receivedSig] = parts;
    const timestamp = parseInt(timestampStr, 10);

    // Verify timestamp validity and expiration
    if (isNaN(timestamp)) return false;
    const age = Date.now() - timestamp;
    if (age < 0 || age > SESSION_TTL_MS) return false;

    // Verify HMAC signature using constant-time comparison
    const payload = `${timestampStr}.${nonce}`;
    const expectedSig = crypto
      .createHmac('sha256', secret)
      .update(payload)
      .digest('hex');

    return timingSafeCompare(receivedSig, expectedSig);
  }

  // Fallback: check static token if configured (legacy compatibility during rotation)
  const legacySecret = process.env.ADMIN_SESSION_TOKEN || process.env.ADMIN_PASSWORD;
  if (legacySecret && timingSafeCompare(token, legacySecret)) {
    return true;
  }

  return false;
}

/**
 * Validates the current request's session cookie against the configured admin secret.
 */
export async function isAuthenticated(): Promise<boolean> {
  const cookieStore = await cookies();
  const session = cookieStore.get('__blog_session');

  if (!session?.value) {
    return false;
  }

  return verifySessionToken(session.value);
}

/**
 * Constant-time comparison between two string secrets to prevent timing attacks.
 */
export function timingSafeCompare(a: string, b: string): boolean {
  if (typeof a !== 'string' || typeof b !== 'string') {
    return false;
  }
  const hashA = crypto.createHash('sha256').update(a).digest();
  const hashB = crypto.createHash('sha256').update(b).digest();
  return crypto.timingSafeEqual(hashA, hashB);
}
