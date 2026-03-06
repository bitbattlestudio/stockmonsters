// hooks/useStockData.ts
// Hook to fetch real stock data from Finnhub API

import { useQuery } from '@tanstack/react-query';

export interface ChartPoint {
  time: number;
  price: number;
  high: number;
  low: number;
  open: number;
  volume: number;
}

export interface StockQuote {
  c: number;  // Current price
  d: number;  // Change
  dp: number; // Percent change
  h: number;  // High
  l: number;  // Low
  o: number;  // Open
  pc: number; // Previous close
}

export interface CompanyProfile {
  name: string;
  ticker: string;
  exchange: string;
  finnhubIndustry: string;
  marketCapitalization: number;
  logo: string;
  weburl: string;
}

export interface StockDataResponse {
  symbol: string;
  quote: StockQuote | null;
  chartData: ChartPoint[] | null;
  profile: CompanyProfile | null;
  usingMockData: boolean;
}

export function useStockData(symbol: string, period: '1D' | '1W' | '1M' = '1D') {
  return useQuery<StockDataResponse>({
    queryKey: ['stock-data', symbol, period],
    queryFn: async () => {
      const res = await fetch(`/api/stock/${symbol}?period=${period}`);
      if (!res.ok) throw new Error('Failed to fetch stock data');
      return res.json();
    },
    staleTime: 60000, // Consider data fresh for 1 minute
    refetchInterval: 60000, // Refetch every minute
  });
}

// Format market cap
export function formatMarketCap(value: number): string {
  if (value >= 1e12) return `$${(value / 1e12).toFixed(2)}T`;
  if (value >= 1e9) return `$${(value / 1e9).toFixed(2)}B`;
  if (value >= 1e6) return `$${(value / 1e6).toFixed(2)}M`;
  return `$${value.toFixed(2)}`;
}
