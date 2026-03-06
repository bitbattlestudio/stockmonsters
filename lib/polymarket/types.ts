// Polymarket API response types

export interface DataAPIPosition {
  proxyWallet: string;
  asset: string;
  conditionId: string;
  size: string;
  avgPrice: string;
  initialValue: string;
  currentValue: string;
  cashBalance: string;
  pnl: string;
  realizedPnl: string;
  curPrice: string;
  percentPnl: string;
  outcome: string;
  outcomeIndex: string;
  title: string;
  slug: string;
  icon: string;
  eventSlug: string;
  endDate: string;
  negRisk: boolean;
}

export interface DataAPITrade {
  id: string;
  timestamp: string;
  maker: string;
  taker: string;
  side: 'BUY' | 'SELL';
  size: string;
  price: string;
  outcome: string;
  outcomeIndex: string;
  marketSlug: string;
  eventSlug: string;
  title: string;
  transactionHash: string;
}

export interface CLOBPriceResponse {
  price: string;
  spread: string;
}

export interface CLOBPriceHistoryPoint {
  t: number; // timestamp
  p: string; // price
}

export interface CLOBOrderBookResponse {
  market: string;
  asset_id: string;
  bids: Array<{ price: string; size: string }>;
  asks: Array<{ price: string; size: string }>;
  timestamp: string;
}

export interface GammaMarket {
  id: string;
  question: string;
  conditionId: string;
  slug: string;
  resolutionSource: string;
  endDate: string;
  liquidity: string;
  volume: string;
  volumeNum: number;
  outcomes: string;
  outcomePrices: string;
  clob_token_ids: string;
  active: boolean;
  closed: boolean;
  archived: boolean;
  new: boolean;
  featured: boolean;
  restricted: boolean;
  groupItemTitle: string;
  groupItemThreshold: string;
  image: string;
  icon: string;
  description: string;
  tags: string[];
  createdAt: string;
  updatedAt: string;
  competitive: number;
  volume24hr: number;
  enableOrderBook: boolean;
  liquidityNum: number;
  spread: number;
  oneDayPriceChange: number;
  negRisk: boolean;
}

export interface GammaEvent {
  id: string;
  ticker: string;
  slug: string;
  title: string;
  description: string;
  startDate: string;
  endDate: string;
  image: string;
  icon: string;
  active: boolean;
  closed: boolean;
  archived: boolean;
  new: boolean;
  featured: boolean;
  restricted: boolean;
  liquidity: number;
  volume: number;
  markets: GammaMarket[];
  tags: string[];
  createdAt: string;
  updatedAt: string;
  competitive: number;
  volume24hr: number;
  enableOrderBook: boolean;
  negRisk: boolean;
}
