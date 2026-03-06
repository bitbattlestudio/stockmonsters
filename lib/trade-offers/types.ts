// Trade Offer Types

export type TradeType =
  | 'tax_loss_harvest'
  | 'rebalance'
  | 'oversold_opportunity'
  | 'pairs_trade';

export interface TradeLeg {
  ticker: string;
  shares: number;
  price: number;
  total: number;
}

export interface TradeStat {
  label: string;
  value: string;
}

export interface TradeOffer {
  id: string;
  type: TradeType;
  priority: number; // 1 = highest
  sell?: TradeLeg;
  buy: TradeLeg;
  explanation: string;
  stats: TradeStat[];
  expiresAt: Date;
}

export interface Holding {
  ticker: string;
  shares: number;
  avgCost: number;
  currentPrice: number;
  lastPurchaseDate: number; // Unix timestamp
  priceHistory: number[];
}

export interface Portfolio {
  walletAddress: string;
  holdings: Holding[];
  totalValue: number;
}

export interface Stock {
  ticker: string;
  name: string;
  price: number;
  priceHistory: number[];
  sector: string;
}

// Correlated pairs for pairs trading
export const CORRELATED_PAIRS: Record<string, { pair: string; correlation: number }[]> = {
  'TSLA': [
    { pair: 'NVDA', correlation: 0.72 },
  ],
  'AMZN': [
    { pair: 'GOOGL', correlation: 0.85 },
    { pair: 'MSFT', correlation: 0.82 },
  ],
  'NFLX': [
    { pair: 'DIS', correlation: 0.68 },
  ],
  'AMD': [
    { pair: 'NVDA', correlation: 0.88 },
    { pair: 'INTC', correlation: 0.75 },
  ],
  'NVDA': [
    { pair: 'AMD', correlation: 0.88 },
  ],
  'PLTR': [
    { pair: 'SNOW', correlation: 0.71 },
  ],
  'AAPL': [
    { pair: 'MSFT', correlation: 0.78 },
  ],
};

export const SECTOR_ALTERNATIVES: Record<string, string[]> = {
  'semiconductors': ['AMD', 'NVDA', 'INTC', 'QCOM', 'AVGO'],
  'mega_tech': ['AMZN', 'GOOGL', 'MSFT', 'META', 'AAPL'],
  'streaming': ['NFLX', 'DIS', 'WBD', 'PARA'],
  'ev_growth': ['TSLA', 'RIVN', 'LCID', 'NIO'],
  'data_analytics': ['PLTR', 'SNOW', 'MDB', 'DDOG'],
  'consumer_tech': ['AAPL', 'MSFT', 'GOOGL'],
};

export const TICKER_TO_SECTOR: Record<string, string> = {
  'AMD': 'semiconductors',
  'NVDA': 'semiconductors',
  'INTC': 'semiconductors',
  'AMZN': 'mega_tech',
  'GOOGL': 'mega_tech',
  'MSFT': 'mega_tech',
  'META': 'mega_tech',
  'AAPL': 'consumer_tech',
  'TSLA': 'ev_growth',
  'NFLX': 'streaming',
  'DIS': 'streaming',
  'PLTR': 'data_analytics',
};

// Gamification language mapping
export const TRADE_TYPE_NAMES: Record<TradeType, string> = {
  'tax_loss_harvest': 'Evolution Trade',
  'rebalance': 'Habitat Balance',
  'oversold_opportunity': 'Catch Opportunity',
  'pairs_trade': 'Convergence Trade',
};

export const TRADE_TYPE_SUBTITLES: Record<TradeType, string> = {
  'tax_loss_harvest': 'Your Stockling wants to evolve!',
  'rebalance': 'Keep your habitat in harmony',
  'oversold_opportunity': 'A wild Stockling appeared!',
  'pairs_trade': 'Trade with another trainer',
};

import type { IconName } from '@/components/PixelIcon';

export const TRADE_TYPE_ICONS: Record<TradeType, IconName> = {
  'tax_loss_harvest': 'swap',
  'rebalance': 'balance',
  'oversold_opportunity': 'trending-down',
  'pairs_trade': 'swap',
};

export const TRADE_TYPE_COLORS: Record<TradeType, string> = {
  'tax_loss_harvest': 'bg-purple-500',
  'rebalance': 'bg-blue-500',
  'oversold_opportunity': 'bg-green-500',
  'pairs_trade': 'bg-orange-500',
};
