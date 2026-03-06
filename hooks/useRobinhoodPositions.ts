// hooks/useRobinhoodPositions.ts
// Hook to fetch stock token balances from Robinhood Chain Testnet

import { useQuery } from '@tanstack/react-query';
import { useAccount } from 'wagmi';
import { getAllStockBalances, TokenBalance } from '@/lib/contracts/stock-tokens';
import { getStockPrices, hasPriceFeed, PriceData } from '@/lib/contracts/price-oracle';

export interface StockPosition {
  symbol: string;
  name: string;
  company: string;
  shares: number;
  price: number;
  change: number;
  changeAmount: number;
  value: number;
  lastUpdated?: number;
}

// Fallback prices (used only if Chainlink price feeds are not configured)
const FALLBACK_PRICES: Record<string, { price: number; change: number }> = {
  TSLA: { price: 248.50, change: 5.2 },
  AMZN: { price: 178.25, change: -2.1 },
  PLTR: { price: 24.80, change: 8.5 },
  NFLX: { price: 892.40, change: 1.2 },
  AMD: { price: 168.90, change: -4.3 },
  AAPL: { price: 178.25, change: 0.8 },
  NVDA: { price: 875.30, change: 12.5 },
  META: { price: 485.20, change: 1.2 },
};

// Store previous prices for change calculation
const previousPrices: Record<string, number> = {};

function tokenBalanceToPosition(
  token: TokenBalance,
  priceData: PriceData | null
): StockPosition {
  let price: number;
  let change: number;
  let lastUpdated: number | undefined;

  if (priceData) {
    // Use real Chainlink price data
    price = priceData.price;
    lastUpdated = priceData.updatedAt;

    // Calculate change from previous price (if available)
    const prevPrice = previousPrices[token.symbol];
    if (prevPrice && prevPrice !== price) {
      change = ((price - prevPrice) / prevPrice) * 100;
    } else {
      // No previous price, use fallback or assume 0 change
      change = FALLBACK_PRICES[token.symbol]?.change || 0;
    }

    // Store current price for next comparison
    previousPrices[token.symbol] = price;
  } else {
    // Fallback to mock prices if Chainlink feed not available
    const fallback = FALLBACK_PRICES[token.symbol] || { price: 100, change: 0 };
    price = fallback.price;
    change = fallback.change;
    console.warn(
      `Using fallback price for ${token.symbol}. Configure Chainlink price feed for real data.`
    );
  }

  const value = token.shares * price;
  const changeAmount = (change / 100) * price * token.shares;

  return {
    symbol: token.symbol,
    name: token.name,
    company: token.company,
    shares: token.shares,
    price,
    change,
    changeAmount,
    value,
    lastUpdated,
  };
}

export function useRobinhoodPositions() {
  const { address, isConnected } = useAccount();

  const query = useQuery({
    queryKey: ['robinhood-positions', address],
    queryFn: async (): Promise<StockPosition[]> => {
      if (!address) return [];

      // Fetch token balances from Robinhood Chain
      const balances = await getAllStockBalances(address);

      if (balances.length === 0) return [];

      // Fetch prices from Chainlink oracles for all tokens
      const symbols = balances.map((b) => b.symbol);
      const prices = await getStockPrices(symbols);

      // Combine balance data with price data
      return balances.map((token) =>
        tokenBalanceToPosition(token, prices[token.symbol] || null)
      );
    },
    enabled: isConnected && !!address,
    refetchInterval: 30000, // Refresh every 30 seconds
    staleTime: 10000, // Consider data fresh for 10 seconds
  });

  // Calculate totals
  const positions = query.data || [];
  const totalValue = positions.reduce((sum, p) => sum + p.value, 0);
  const totalChange =
    positions.length > 0
      ? positions.reduce((sum, p) => sum + p.change, 0) / positions.length
      : 0;

  return {
    positions,
    totalValue,
    totalChange,
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
    refetch: query.refetch,
    isConnected,
    address,
  };
}
