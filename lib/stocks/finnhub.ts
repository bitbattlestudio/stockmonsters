// lib/stocks/finnhub.ts
// Finnhub API integration for real stock data

const FINNHUB_API_KEY = process.env.NEXT_PUBLIC_FINNHUB_API_KEY || '';
const BASE_URL = 'https://finnhub.io/api/v1';

export interface StockQuote {
  c: number;  // Current price
  d: number;  // Change
  dp: number; // Percent change
  h: number;  // High price of the day
  l: number;  // Low price of the day
  o: number;  // Open price of the day
  pc: number; // Previous close price
  t: number;  // Timestamp
}

export interface StockCandle {
  c: number[];  // Close prices
  h: number[];  // High prices
  l: number[];  // Low prices
  o: number[];  // Open prices
  t: number[];  // Timestamps
  v: number[];  // Volume
  s: string;    // Status
}

export interface CompanyProfile {
  country: string;
  currency: string;
  exchange: string;
  ipo: string;
  marketCapitalization: number;
  name: string;
  phone: string;
  shareOutstanding: number;
  ticker: string;
  weburl: string;
  logo: string;
  finnhubIndustry: string;
}

// Get real-time quote
export async function getQuote(symbol: string): Promise<StockQuote | null> {
  if (!FINNHUB_API_KEY) {
    console.warn('Finnhub API key not set');
    return null;
  }

  try {
    const res = await fetch(
      `${BASE_URL}/quote?symbol=${symbol}&token=${FINNHUB_API_KEY}`
    );
    if (!res.ok) throw new Error('Failed to fetch quote');
    return await res.json();
  } catch (error) {
    console.error('Error fetching quote:', error);
    return null;
  }
}

// Get historical candles
export async function getCandles(
  symbol: string,
  resolution: '1' | '5' | '15' | '30' | '60' | 'D' | 'W' | 'M',
  from: number,
  to: number
): Promise<StockCandle | null> {
  if (!FINNHUB_API_KEY) {
    console.warn('Finnhub API key not set');
    return null;
  }

  try {
    const res = await fetch(
      `${BASE_URL}/stock/candle?symbol=${symbol}&resolution=${resolution}&from=${from}&to=${to}&token=${FINNHUB_API_KEY}`
    );
    if (!res.ok) throw new Error('Failed to fetch candles');
    return await res.json();
  } catch (error) {
    console.error('Error fetching candles:', error);
    return null;
  }
}

// Get company profile
export async function getCompanyProfile(symbol: string): Promise<CompanyProfile | null> {
  if (!FINNHUB_API_KEY) {
    console.warn('Finnhub API key not set');
    return null;
  }

  try {
    const res = await fetch(
      `${BASE_URL}/stock/profile2?symbol=${symbol}&token=${FINNHUB_API_KEY}`
    );
    if (!res.ok) throw new Error('Failed to fetch profile');
    return await res.json();
  } catch (error) {
    console.error('Error fetching profile:', error);
    return null;
  }
}

// Helper to get time ranges
export function getTimeRange(period: '1D' | '1W' | '1M'): { from: number; to: number; resolution: '5' | '60' | 'D' } {
  const now = Math.floor(Date.now() / 1000);

  switch (period) {
    case '1D':
      return {
        from: now - 24 * 60 * 60, // 24 hours ago
        to: now,
        resolution: '5', // 5-minute candles
      };
    case '1W':
      return {
        from: now - 7 * 24 * 60 * 60, // 7 days ago
        to: now,
        resolution: '60', // Hourly candles
      };
    case '1M':
      return {
        from: now - 30 * 24 * 60 * 60, // 30 days ago
        to: now,
        resolution: 'D', // Daily candles
      };
  }
}
