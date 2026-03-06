// lib/contracts/price-oracle.ts
// Chainlink Price Feed integration for Robinhood Chain Testnet

import { robinhoodClient } from './stock-tokens';

// Chainlink Price Feed ABI (minimal for reading latest price)
export const PRICE_FEED_ABI = [
  {
    name: 'latestRoundData',
    type: 'function',
    stateMutability: 'view',
    inputs: [],
    outputs: [
      { name: 'roundId', type: 'uint80' },
      { name: 'answer', type: 'int256' },
      { name: 'startedAt', type: 'uint256' },
      { name: 'updatedAt', type: 'uint256' },
      { name: 'answeredInRound', type: 'uint80' },
    ],
  },
  {
    name: 'decimals',
    type: 'function',
    stateMutability: 'view',
    inputs: [],
    outputs: [{ name: '', type: 'uint8' }],
  },
  {
    name: 'description',
    type: 'function',
    stateMutability: 'view',
    inputs: [],
    outputs: [{ name: '', type: 'string' }],
  },
] as const;

// Chainlink Price Feed addresses on Robinhood Chain Testnet
// TODO: Update these with actual Chainlink price feed addresses from Robinhood Chain docs
// Format: Symbol -> Price Feed Contract Address
export const PRICE_FEED_ADDRESSES: Record<string, `0x${string}`> = {
  // Placeholder addresses - need to be updated with real Chainlink feeds
  // Check: https://docs.chain.link/data-feeds/price-feeds/addresses
  // or Robinhood Chain Testnet documentation
  TSLA: '0x0000000000000000000000000000000000000000', // Tesla / USD
  AMZN: '0x0000000000000000000000000000000000000000', // Amazon / USD
  PLTR: '0x0000000000000000000000000000000000000000', // Palantir / USD
  NFLX: '0x0000000000000000000000000000000000000000', // Netflix / USD
  AMD: '0x0000000000000000000000000000000000000000',  // AMD / USD
  AAPL: '0x0000000000000000000000000000000000000000', // Apple / USD
  NVDA: '0x0000000000000000000000000000000000000000', // NVIDIA / USD
  META: '0x0000000000000000000000000000000000000000', // Meta / USD
};

export interface PriceData {
  price: number;
  decimals: number;
  updatedAt: number;
  roundId: bigint;
}

/**
 * Fetch current price from Chainlink Price Feed
 */
export async function getStockPrice(symbol: string): Promise<PriceData | null> {
  const feedAddress = PRICE_FEED_ADDRESSES[symbol];

  if (!feedAddress || feedAddress === '0x0000000000000000000000000000000000000000') {
    console.warn(`No price feed configured for ${symbol}`);
    return null;
  }

  try {
    const [roundData, decimals] = await Promise.all([
      robinhoodClient.readContract({
        address: feedAddress,
        abi: PRICE_FEED_ABI,
        functionName: 'latestRoundData',
      }),
      robinhoodClient.readContract({
        address: feedAddress,
        abi: PRICE_FEED_ABI,
        functionName: 'decimals',
      }),
    ]);

    const [roundId, answer, , updatedAt] = roundData;

    // Convert answer to decimal price
    const price = Number(answer) / Math.pow(10, decimals);

    return {
      price,
      decimals,
      updatedAt: Number(updatedAt),
      roundId,
    };
  } catch (error) {
    console.error(`Failed to fetch price for ${symbol}:`, error);
    return null;
  }
}

/**
 * Fetch prices for multiple stocks in parallel
 */
export async function getStockPrices(
  symbols: string[]
): Promise<Record<string, PriceData | null>> {
  const pricePromises = symbols.map(async (symbol) => ({
    symbol,
    data: await getStockPrice(symbol),
  }));

  const results = await Promise.all(pricePromises);

  return results.reduce(
    (acc, { symbol, data }) => {
      acc[symbol] = data;
      return acc;
    },
    {} as Record<string, PriceData | null>
  );
}

/**
 * Calculate price change percentage
 * Note: For real implementation, you'd need historical price data
 * This is a simplified version that returns 0 for now
 */
export function calculatePriceChange(
  currentPrice: number,
  previousPrice: number
): { change: number; changeAmount: number } {
  const changeAmount = currentPrice - previousPrice;
  const change = (changeAmount / previousPrice) * 100;

  return { change, changeAmount };
}

/**
 * Check if price feed is configured for a symbol
 */
export function hasPriceFeed(symbol: string): boolean {
  const address = PRICE_FEED_ADDRESSES[symbol];
  return !!address && address !== '0x0000000000000000000000000000000000000000';
}
