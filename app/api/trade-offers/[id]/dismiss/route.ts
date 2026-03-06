import { NextRequest, NextResponse } from 'next/server';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id: offerId } = await params;
  const walletAddress = request.headers.get('x-wallet-address');

  try {
    // In production, this would:
    // 1. Mark the offer as dismissed for this user
    // 2. Store in database so it doesn't show again today
    // 3. Track analytics for offer effectiveness

    return NextResponse.json({
      success: true,
      offerId,
      dismissedAt: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Error dismissing trade offer:', error);
    return NextResponse.json(
      { error: 'Failed to dismiss offer' },
      { status: 500 }
    );
  }
}
