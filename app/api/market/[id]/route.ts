import { NextRequest, NextResponse } from 'next/server';
import { fetchMarket, fetchMarketByConditionId } from '@/lib/polymarket/gamma-api';
import { fetchPriceHistory, fetchBestPrices } from '@/lib/polymarket/clob-api';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  if (!id) {
    return NextResponse.json(
      { error: 'Market ID is required' },
      { status: 400 }
    );
  }

  try {
    // Try to fetch by slug first, then by condition ID
    let market = await fetchMarket(id);

    if (!market && id.startsWith('0x')) {
      market = await fetchMarketByConditionId(id);
    }

    if (!market) {
      return NextResponse.json(
        { error: 'Market not found' },
        { status: 404 }
      );
    }

    // Fetch price history for the Yes token
    const yesToken = market.tokens.find(t => t.outcome === 'Yes');
    let priceHistory: Array<{ timestamp: number; price: number }> = [];
    let bestPrices: { bestBid: number; bestAsk: number; spread: number } | null = null;

    if (yesToken) {
      try {
        priceHistory = await fetchPriceHistory(yesToken.token_id, '1d', 100);
      } catch {
        // Price history not available
      }

      try {
        bestPrices = await fetchBestPrices(yesToken.token_id);
      } catch {
        // Best prices not available
      }
    }

    return NextResponse.json({
      market,
      priceHistory,
      bestPrices,
    });
  } catch (error) {
    console.error('Error fetching market:', error);
    return NextResponse.json(
      { error: 'Failed to fetch market data' },
      { status: 500 }
    );
  }
}
