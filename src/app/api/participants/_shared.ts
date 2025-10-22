import { NextRequest, NextResponse } from 'next/server';

export function unauthorizedResponse() {
  return NextResponse.json(
    { ok: false, error: 'Unauthorized' },
    { status: 401 }
  );
}

export function ensureAdminAuthorized(request: NextRequest) {
  const adminToken = process.env.ADMIN_TOKEN?.trim();
  if (!adminToken) {
    return NextResponse.json(
      { ok: false, error: 'ADMIN_TOKEN is not configured' },
      { status: 500 }
    );
  }

  const header = request.headers.get('authorization');
  if (!header) return unauthorizedResponse();

  const [scheme, token] = header.split(' ');
  if (scheme?.toLowerCase() !== 'bearer' || token !== adminToken) {
    return unauthorizedResponse();
  }

  return null;
}
