import { NextRequest, NextResponse } from 'next/server';
import { TradeOfferEngine, createMockData } from '@/lib/trade-offers/engine';

export async function GET(request: NextRequest) {
  const walletAddress = request.headers.get('x-wallet-address');

  // For demo purposes, generate offers even without wallet
  // In production, you'd require authentication

  try {
    // Create mock data (in production, fetch from actual sources)
    const { portfolio, marketData } = createMockData();

    // If wallet is provided, use it
    if (walletAddress) {
      portfolio.walletAddress = walletAddress;
    }

    // Generate trade offers
    const engine = new TradeOfferEngine(portfolio, marketData);
    const offers = engine.generateDailyOffers();

    // Convert Date objects to ISO strings for JSON serialization
    const serializedOffers = offers.map(offer => ({
      ...offer,
      expiresAt: offer.expiresAt.toISOString(),
    }));

    return NextResponse.json({
      offers: serializedOffers,
      generatedAt: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Error generating trade offers:', error);
    return NextResponse.json(
      { error: 'Failed to generate trade offers' },
      { status: 500 }
    );
  }
}
