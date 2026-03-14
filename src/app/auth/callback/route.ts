import { NextResponse } from 'next/server'

// This route is now a no-op in testing mode.
export async function GET(request: Request) {
  const { origin } = new URL(request.url)
  return NextResponse.redirect(origin)
}

