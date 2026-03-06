import { DATA_API_BASE } from '@/lib/utils/constants';
import type { Position, Trade } from '@/types';
import type { DataAPIPosition, DataAPITrade } from './types';

/**
 * Fetch current positions for a wallet address
 */
export async function fetchPositions(walletAddress: string): Promise<Position[]> {
  const response = await fetch(
    `${DATA_API_BASE}/positions?user=${walletAddress}`,
    {
      headers: {
        'Accept': 'application/json',
      },
      next: { revalidate: 30 }, // Cache for 30 seconds
    }
  );

  if (!response.ok) {
    if (response.status === 404) {
      return []; // No positions found
    }
    throw new Error(`Failed to fetch positions: ${response.status}`);
  }

  const data: DataAPIPosition[] = await response.json();

  return data.map(transformPosition);
}

/**
 * Fetch trade history for a wallet address
 */
export async function fetchTrades(walletAddress: string): Promise<Trade[]> {
  const response = await fetch(
    `${DATA_API_BASE}/trades?user=${walletAddress}`,
    {
      headers: {
        'Accept': 'application/json',
      },
      next: { revalidate: 60 },
    }
  );

  if (!response.ok) {
    if (response.status === 404) {
      return [];
    }
    throw new Error(`Failed to fetch trades: ${response.status}`);
  }

  const data: DataAPITrade[] = await response.json();

  return data.map(transformTrade);
}

/**
 * Fetch closed/resolved positions for a wallet address
 */
export async function fetchClosedPositions(walletAddress: string): Promise<Position[]> {
  const response = await fetch(
    `${DATA_API_BASE}/closed-positions?user=${walletAddress}`,
    {
      headers: {
        'Accept': 'application/json',
      },
      next: { revalidate: 300 }, // Cache longer since closed positions don't change
    }
  );

  if (!response.ok) {
    if (response.status === 404) {
      return [];
    }
    throw new Error(`Failed to fetch closed positions: ${response.status}`);
  }

  const data: DataAPIPosition[] = await response.json();

  return data.map(transformPosition);
}

/**
 * Transform API response to internal Position type
 */
function transformPosition(apiPosition: DataAPIPosition): Position {
  const size = parseFloat(apiPosition.size) || 0;
  const avgPrice = parseFloat(apiPosition.avgPrice) || 0;
  const currPrice = parseFloat(apiPosition.curPrice) || 0;
  const currentValue = parseFloat(apiPosition.currentValue) || 0;
  const totalBought = size * avgPrice;
  const totalPnl = parseFloat(apiPosition.pnl) || 0;
  const realizedPnl = parseFloat(apiPosition.realizedPnl) || 0;
  const cashPnl = currentValue - totalBought;

  return {
    proxyWallet: apiPosition.proxyWallet,
    asset: apiPosition.asset,
    conditionId: apiPosition.conditionId,
    avgPrice,
    size,
    currPrice,
    currentValue,
    cashPnl,
    totalBought,
    realizedPnl,
    totalPnl,
    outcome: apiPosition.outcome as 'Yes' | 'No',
    outcomeIndex: parseInt(apiPosition.outcomeIndex) || 0,
    title: apiPosition.title,
    slug: apiPosition.slug,
    icon: apiPosition.icon,
    eventSlug: apiPosition.eventSlug,
  };
}

/**
 * Transform API response to internal Trade type
 */
function transformTrade(apiTrade: DataAPITrade): Trade {
  return {
    id: apiTrade.id,
    timestamp: parseInt(apiTrade.timestamp) || Date.now(),
    side: apiTrade.side,
    size: parseFloat(apiTrade.size) || 0,
    price: parseFloat(apiTrade.price) || 0,
    outcome: apiTrade.outcome,
    marketSlug: apiTrade.marketSlug,
  };
}
