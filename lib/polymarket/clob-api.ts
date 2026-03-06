import { CLOB_API_BASE } from '@/lib/utils/constants';
import type { PricePoint } from '@/types';
import type { CLOBPriceResponse, CLOBPriceHistoryPoint, CLOBOrderBookResponse } from './types';

/**
 * Fetch current price for a token
 */
export async function fetchCurrentPrice(tokenId: string): Promise<number> {
  const response = await fetch(
    `${CLOB_API_BASE}/price?token_id=${tokenId}`,
    {
      headers: {
        'Accept': 'application/json',
      },
      next: { revalidate: 10 }, // Cache for 10 seconds
    }
  );

  if (!response.ok) {
    throw new Error(`Failed to fetch price: ${response.status}`);
  }

  const data: CLOBPriceResponse = await response.json();
  return parseFloat(data.price) || 0;
}

/**
 * Fetch price history for a market
 * @param tokenId - The token/market ID
 * @param interval - Time interval: '1m', '5m', '1h', '1d'
 * @param fidelity - Number of data points (default 100)
 */
export async function fetchPriceHistory(
  tokenId: string,
  interval: '1m' | '5m' | '1h' | '1d' = '1d',
  fidelity: number = 100
): Promise<PricePoint[]> {
  const response = await fetch(
    `${CLOB_API_BASE}/prices-history?market=${tokenId}&interval=${interval}&fidelity=${fidelity}`,
    {
      headers: {
        'Accept': 'application/json',
      },
      next: { revalidate: 60 }, // Cache for 1 minute
    }
  );

  if (!response.ok) {
    throw new Error(`Failed to fetch price history: ${response.status}`);
  }

  const data: { history: CLOBPriceHistoryPoint[] } = await response.json();

  return (data.history || []).map((point) => ({
    timestamp: point.t,
    price: parseFloat(point.p) || 0,
  }));
}

/**
 * Fetch order book for a token
 */
export async function fetchOrderBook(tokenId: string): Promise<{
  bids: Array<{ price: number; size: number }>;
  asks: Array<{ price: number; size: number }>;
}> {
  const response = await fetch(
    `${CLOB_API_BASE}/book?token_id=${tokenId}`,
    {
      headers: {
        'Accept': 'application/json',
      },
      next: { revalidate: 5 }, // Cache for 5 seconds
    }
  );

  if (!response.ok) {
    throw new Error(`Failed to fetch order book: ${response.status}`);
  }

  const data: CLOBOrderBookResponse = await response.json();

  return {
    bids: (data.bids || []).map((b) => ({
      price: parseFloat(b.price) || 0,
      size: parseFloat(b.size) || 0,
    })),
    asks: (data.asks || []).map((a) => ({
      price: parseFloat(a.price) || 0,
      size: parseFloat(a.size) || 0,
    })),
  };
}

/**
 * Get best bid/ask prices
 */
export async function fetchBestPrices(tokenId: string): Promise<{
  bestBid: number;
  bestAsk: number;
  spread: number;
}> {
  const orderBook = await fetchOrderBook(tokenId);

  const bestBid = orderBook.bids[0]?.price || 0;
  const bestAsk = orderBook.asks[0]?.price || 1;
  const spread = bestAsk - bestBid;

  return { bestBid, bestAsk, spread };
}
