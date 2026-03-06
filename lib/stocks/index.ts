// lib/stocks/index.ts
// Stock data, positions, and price history

import { getMonsterSprite, hasMonsterSprite } from '@/lib/sprites/monsterSprites';

export * from './brands';
export { getMonsterSprite, hasMonsterSprite } from '@/lib/sprites/monsterSprites';

export type SpriteStyle = 'monster' | 'pixel' | 'auto';

export interface Position {
  shares: number;
  avgCost: number;
  totalCost: number;
  currentValue: number;
  profitLoss: number;
  profitLossPercent: number;
}

export interface PricePoint {
  time: string;
  price: number;
}

export interface StockData {
  ticker: string;
  name: string;
  price: number;
  change: number;
  changeAmount: number;
  open: number;
  high: number;
  low: number;
  volume: string;
  marketCap: string;
  position?: Position;
  priceHistory: {
    '1D': PricePoint[];
    '1W': PricePoint[];
    '1M': PricePoint[];
  };
}

// Generate realistic price history
function generatePriceHistory(
  currentPrice: number,
  changePercent: number,
  period: '1D' | '1W' | '1M'
): PricePoint[] {
  const points: PricePoint[] = [];
  let numPoints: number;
  let startPrice: number;

  switch (period) {
    case '1D':
      numPoints = 78; // 6.5 hours of trading, 5-min intervals
      startPrice = currentPrice / (1 + changePercent / 100);
      break;
    case '1W':
      numPoints = 35; // 5 days, hourly
      startPrice = currentPrice * (1 - (changePercent * 2.5) / 100);
      break;
    case '1M':
      numPoints = 22; // ~22 trading days
      startPrice = currentPrice * (1 - (changePercent * 5) / 100);
      break;
  }

  const priceRange = currentPrice - startPrice;

  for (let i = 0; i < numPoints; i++) {
    const progress = i / (numPoints - 1);
    // Add some noise for realism
    const noise = (Math.random() - 0.5) * Math.abs(priceRange) * 0.3;
    const trendPrice = startPrice + priceRange * progress;
    const price = Math.max(0.01, trendPrice + noise);

    // Generate time labels
    let time: string;
    if (period === '1D') {
      const hour = 9 + Math.floor((i * 6.5) / numPoints);
      const min = (i * 5) % 60;
      time = `${hour}:${min.toString().padStart(2, '0')}`;
    } else if (period === '1W') {
      const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'];
      time = days[Math.floor(i / 7) % 5];
    } else {
      time = `${Math.floor(i / 22 * 30) + 1}`;
    }

    points.push({ time, price: Math.round(price * 100) / 100 });
  }

  // Ensure last point is current price
  points[points.length - 1].price = currentPrice;

  return points;
}

// Demo stock data with positions and history
export const STOCK_DATA: Record<string, StockData> = {
  TSLA: {
    ticker: 'TSLA',
    name: 'Tesla, Inc.',
    price: 248.50,
    change: 5.2,
    changeAmount: 12.30,
    open: 236.20,
    high: 251.80,
    low: 235.10,
    volume: '42.3M',
    marketCap: '$790.2B',
    position: {
      shares: 5,
      avgCost: 220.00,
      totalCost: 1100.00,
      currentValue: 1242.50,
      profitLoss: 142.50,
      profitLossPercent: 12.95,
    },
    priceHistory: {
      '1D': generatePriceHistory(248.50, 5.2, '1D'),
      '1W': generatePriceHistory(248.50, 5.2, '1W'),
      '1M': generatePriceHistory(248.50, 5.2, '1M'),
    },
  },
  NVDA: {
    ticker: 'NVDA',
    name: 'NVIDIA Corporation',
    price: 875.30,
    change: 12.5,
    changeAmount: 97.25,
    open: 778.05,
    high: 882.50,
    low: 775.00,
    volume: '58.1M',
    marketCap: '$2.15T',
    position: {
      shares: 2,
      avgCost: 650.00,
      totalCost: 1300.00,
      currentValue: 1750.60,
      profitLoss: 450.60,
      profitLossPercent: 34.66,
    },
    priceHistory: {
      '1D': generatePriceHistory(875.30, 12.5, '1D'),
      '1W': generatePriceHistory(875.30, 12.5, '1W'),
      '1M': generatePriceHistory(875.30, 12.5, '1M'),
    },
  },
  AAPL: {
    ticker: 'AAPL',
    name: 'Apple Inc.',
    price: 178.25,
    change: 0.8,
    changeAmount: 1.42,
    open: 176.83,
    high: 179.50,
    low: 176.20,
    volume: '31.2M',
    marketCap: '$2.78T',
    position: {
      shares: 10,
      avgCost: 165.00,
      totalCost: 1650.00,
      currentValue: 1782.50,
      profitLoss: 132.50,
      profitLossPercent: 8.03,
    },
    priceHistory: {
      '1D': generatePriceHistory(178.25, 0.8, '1D'),
      '1W': generatePriceHistory(178.25, 0.8, '1W'),
      '1M': generatePriceHistory(178.25, 0.8, '1M'),
    },
  },
  AMZN: {
    ticker: 'AMZN',
    name: 'Amazon.com, Inc.',
    price: 178.25,
    change: -3.5,
    changeAmount: -6.45,
    open: 184.70,
    high: 185.20,
    low: 177.50,
    volume: '28.7M',
    marketCap: '$1.87T',
    position: {
      shares: 8,
      avgCost: 185.00,
      totalCost: 1480.00,
      currentValue: 1426.00,
      profitLoss: -54.00,
      profitLossPercent: -3.65,
    },
    priceHistory: {
      '1D': generatePriceHistory(178.25, -3.5, '1D'),
      '1W': generatePriceHistory(178.25, -3.5, '1W'),
      '1M': generatePriceHistory(178.25, -3.5, '1M'),
    },
  },
  PLTR: {
    ticker: 'PLTR',
    name: 'Palantir Technologies',
    price: 24.85,
    change: 8.5,
    changeAmount: 1.95,
    open: 22.90,
    high: 25.20,
    low: 22.75,
    volume: '45.6M',
    marketCap: '$54.8B',
    position: {
      shares: 50,
      avgCost: 18.50,
      totalCost: 925.00,
      currentValue: 1242.50,
      profitLoss: 317.50,
      profitLossPercent: 34.32,
    },
    priceHistory: {
      '1D': generatePriceHistory(24.85, 8.5, '1D'),
      '1W': generatePriceHistory(24.85, 8.5, '1W'),
      '1M': generatePriceHistory(24.85, 8.5, '1M'),
    },
  },
  NFLX: {
    ticker: 'NFLX',
    name: 'Netflix, Inc.',
    price: 485.20,
    change: 1.2,
    changeAmount: 5.75,
    open: 479.45,
    high: 488.30,
    low: 478.00,
    volume: '12.4M',
    marketCap: '$210.5B',
    position: {
      shares: 3,
      avgCost: 450.00,
      totalCost: 1350.00,
      currentValue: 1455.60,
      profitLoss: 105.60,
      profitLossPercent: 7.82,
    },
    priceHistory: {
      '1D': generatePriceHistory(485.20, 1.2, '1D'),
      '1W': generatePriceHistory(485.20, 1.2, '1W'),
      '1M': generatePriceHistory(485.20, 1.2, '1M'),
    },
  },
  AMD: {
    ticker: 'AMD',
    name: 'Advanced Micro Devices',
    price: 156.80,
    change: -2.1,
    changeAmount: -3.35,
    open: 160.15,
    high: 161.20,
    low: 155.90,
    volume: '38.9M',
    marketCap: '$253.4B',
    position: {
      shares: 12,
      avgCost: 145.00,
      totalCost: 1740.00,
      currentValue: 1881.60,
      profitLoss: 141.60,
      profitLossPercent: 8.14,
    },
    priceHistory: {
      '1D': generatePriceHistory(156.80, -2.1, '1D'),
      '1W': generatePriceHistory(156.80, -2.1, '1W'),
      '1M': generatePriceHistory(156.80, -2.1, '1M'),
    },
  },
};

export function getStockData(ticker: string): StockData | undefined {
  return STOCK_DATA[ticker.toUpperCase()];
}

// Get state (1-5) from percent change
export function getStateFromChange(change: number): number {
  if (change <= -10) return 1;
  if (change <= -2) return 2;
  if (change >= 10) return 5;
  if (change >= 2) return 4;
  return 3;
}

// Get pixel sprite path for a stock (state-based)
export function getPixelSprite(ticker: string, state: number): string {
  return `/sprites/generated/stock_${ticker.toUpperCase()}_${state}.png`;
}

// Get sprite path for a stock - prefers monster sprites when available
export function getSpriteForStock(
  ticker: string,
  change: number,
  style: SpriteStyle = 'auto'
): string {
  const symbol = ticker.toUpperCase();
  const state = getStateFromChange(change);

  // If style is 'monster' or 'auto', try monster sprite first
  if (style === 'monster' || style === 'auto') {
    const monsterSprite = getMonsterSprite(symbol);
    if (monsterSprite) {
      return monsterSprite;
    }
  }

  // Fall back to pixel sprites (with state)
  return getPixelSprite(symbol, state);
}
