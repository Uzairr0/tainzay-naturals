import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { ADMIN_SESSION_COOKIE, isAdminConfigured } from '@/lib/admin-auth';

export async function GET() {
  if (!isAdminConfigured()) {
    return NextResponse.json(
      { message: 'Admin login is not configured.' },
      { status: 503 },
    );
  }

  const cookieStore = await cookies();
  const session = cookieStore.get(ADMIN_SESSION_COOKIE)?.value;

  if (session !== process.env.ADMIN_SESSION_SECRET) {
    return NextResponse.json({ message: 'Unauthorized.' }, { status: 401 });
  }

  return NextResponse.json({ token: session });
}
