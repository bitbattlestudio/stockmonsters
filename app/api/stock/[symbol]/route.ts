// app/api/stock/[symbol]/route.ts
// API route to fetch real stock data from Finnhub

import { NextRequest, NextResponse } from 'next/server';

const FINNHUB_API_KEY = process.env.FINNHUB_API_KEY || '';
const BASE_URL = 'https://finnhub.io/api/v1';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ symbol: string }> }
) {
  const { symbol } = await params;
  const { searchParams } = new URL(request.url);
  const period = searchParams.get('period') || '1D';

  if (!symbol) {
    return NextResponse.json({ error: 'Symbol required' }, { status: 400 });
  }

  if (!FINNHUB_API_KEY) {
    // Return mock data if no API key
    return NextResponse.json({
      symbol: symbol.toUpperCase(),
      quote: null,
      candles: null,
      profile: null,
      usingMockData: true,
    });
  }

  try {
    // Calculate time range based on period
    const now = Math.floor(Date.now() / 1000);
    let from: number;
    let resolution: string;

    switch (period) {
      case '1D':
        from = now - 24 * 60 * 60;
        resolution = '5';
        break;
      case '1W':
        from = now - 7 * 24 * 60 * 60;
        resolution = '60';
        break;
      case '1M':
        from = now - 30 * 24 * 60 * 60;
        resolution = 'D';
        break;
      default:
        from = now - 24 * 60 * 60;
        resolution = '5';
    }

    // Fetch quote, candles, and profile in parallel
    const [quoteRes, candlesRes, profileRes] = await Promise.all([
      fetch(`${BASE_URL}/quote?symbol=${symbol}&token=${FINNHUB_API_KEY}`),
      fetch(`${BASE_URL}/stock/candle?symbol=${symbol}&resolution=${resolution}&from=${from}&to=${now}&token=${FINNHUB_API_KEY}`),
      fetch(`${BASE_URL}/stock/profile2?symbol=${symbol}&token=${FINNHUB_API_KEY}`),
    ]);

    const [quote, candles, profile] = await Promise.all([
      quoteRes.ok ? quoteRes.json() : null,
      candlesRes.ok ? candlesRes.json() : null,
      profileRes.ok ? profileRes.json() : null,
    ]);

    // Transform candles to chart-friendly format
    let chartData = null;
    if (candles && candles.s === 'ok' && candles.c) {
      chartData = candles.c.map((price: number, i: number) => ({
        time: candles.t[i],
        price: price,
        high: candles.h[i],
        low: candles.l[i],
        open: candles.o[i],
        volume: candles.v[i],
      }));
    }

    return NextResponse.json({
      symbol: symbol.toUpperCase(),
      quote,
      chartData,
      profile,
      usingMockData: false,
    });
  } catch (error) {
    console.error('Error fetching stock data:', error);
    return NextResponse.json(
      { error: 'Failed to fetch stock data' },
      { status: 500 }
    );
  }
}
