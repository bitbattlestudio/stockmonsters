import { NextRequest, NextResponse } from 'next/server';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id: offerId } = await params;
  const walletAddress = request.headers.get('x-wallet-address');

  if (!walletAddress) {
    return NextResponse.json(
      { error: 'Wallet address required' },
      { status: 401 }
    );
  }

  try {
    // In production, this would:
    // 1. Validate the offer still exists and hasn't expired
    // 2. Execute the trade on Robinhood Chain
    // 3. Update portfolio state
    // 4. Mark offer as completed

    // For demo, simulate a successful trade
    const mockTxHash = `0x${Math.random().toString(16).slice(2)}${Math.random().toString(16).slice(2)}`;

    // Simulate processing time
    await new Promise(resolve => setTimeout(resolve, 1500));

    return NextResponse.json({
      success: true,
      offerId,
      txHash: mockTxHash,
      executedAt: new Date().toISOString(),
      message: 'Trade executed successfully!',
    });
  } catch (error) {
    console.error('Error executing trade:', error);
    return NextResponse.json(
      { error: 'Failed to execute trade' },
      { status: 500 }
    );
  }
}
