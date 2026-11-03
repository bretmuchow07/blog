import { NextResponse } from 'next/server';

export async function POST() {
  const response = NextResponse.redirect(new URL('/admin/login', process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000'));
  response.cookies.set('__blog_session', '', {
    httpOnly: true,
    sameSite: 'strict',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: 0,
  });
  return response;
}
