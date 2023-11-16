import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// See "Matching Paths" below to learn more
export const config = {
  matcher: '/api/:function*',
};

export function middleware(request: NextRequest) {
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set('Authorization', 'abcdefghijklmnopqrstuvwxyz');

  // You can also set request headers in NextResponse.rewrite
  const response = NextResponse.next({
    request: {
      // New request headers
      headers: requestHeaders,
    },
  });

  return response;
}
