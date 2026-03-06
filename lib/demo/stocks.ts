// lib/demo/stocks.ts
// Demo stock data for development without Polymarket/Robinhood connection

import { getStateFromPerformance, getStateName, getStateColor } from '@/lib/sigils';

export interface DemoStock {
  ticker: string;
  name: string;
  price: number;
  change: number; // percentage
  changeAmount: number; // dollar amount
  sprite: string;
  state: number;
  stateName: string;
  stateColor: string;
}

// Demo stocks with various performance states
export const DEMO_STOCKS: DemoStock[] = [
  {
    ticker: 'TSLA',
    name: 'Tesla, Inc.',
    price: 248.50,
    change: 5.2,
    changeAmount: 12.30,
    sprite: '/sprites/generated/stock_TSLA_4.png',
    state: 4,
    stateName: 'up',
    stateColor: '#10B981',
  },
  {
    ticker: 'PLTR',
    name: 'Palantir Technologies',
    price: 24.85,
    change: 8.5,
    changeAmount: 1.95,
    sprite: '/sprites/generated/stock_PLTR_5.png',
    state: 5,
    stateName: 'mooning',
    stateColor: '#10B981',
  },
  {
    ticker: 'NFLX',
    name: 'Netflix, Inc.',
    price: 485.20,
    change: 1.2,
    changeAmount: 5.75,
    sprite: '/sprites/generated/stock_NFLX_3.png',
    state: 3,
    stateName: 'neutral',
    stateColor: '#6B7280',
  },
  {
    ticker: 'AMZN',
    name: 'Amazon.com, Inc.',
    price: 178.25,
    change: -3.5,
    changeAmount: -6.45,
    sprite: '/sprites/generated/stock_AMZN_2.png',
    state: 2,
    stateName: 'down',
    stateColor: '#EF4444',
  },
  {
    ticker: 'AMD',
    name: 'Advanced Micro Devices',
    price: 156.80,
    change: -2.1,
    changeAmount: -3.35,
    sprite: '/sprites/generated/stock_AMD_2.png',
    state: 2,
    stateName: 'down',
    stateColor: '#EF4444',
  },
];

export function getDemoStocks(): DemoStock[] {
  return DEMO_STOCKS;
}

export function getDemoStock(ticker: string): DemoStock | undefined {
  return DEMO_STOCKS.find((s) => s.ticker === ticker.toUpperCase());
}

// Generate a random demo stock for testing
export function getRandomDemoStock(): DemoStock {
  const index = Math.floor(Math.random() * DEMO_STOCKS.length);
  return DEMO_STOCKS[index];
}
