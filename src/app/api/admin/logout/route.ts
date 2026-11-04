import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  const redirectUrl = new URL('/admin/login', req.nextUrl.origin);
  const response = NextResponse.redirect(redirectUrl);
  response.cookies.set('__blog_session', '', {
    httpOnly: true,
    sameSite: 'strict',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: 0,
  });
  return response;
}
