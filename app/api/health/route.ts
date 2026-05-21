import { NextResponse } from 'next/server';

const startTime = Date.now();

export async function GET() {
  return NextResponse.json({
    status: 'Healthy',
    timestamp: new Date().toISOString(),
    uptime: (Date.now() - startTime) / 1000,
  });
}
