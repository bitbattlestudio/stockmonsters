# Robinhood Chain Testnet Integration
## Instructions for Claude Code

---

## Network Configuration

```typescript
// lib/chains/robinhood.ts

export const ROBINHOOD_CHAIN_TESTNET = {
  id: 46630,
  name: 'Robinhood Chain Testnet',
  network: 'robinhood-testnet',
  nativeCurrency: {
    name: 'Ethereum',
    symbol: 'ETH',
    decimals: 18,
  },
  rpcUrls: {
    default: {
      http: ['https://rpc.testnet.chain.robinhood.com'],
      webSocket: ['wss://feed.testnet.chain.robinhood.com'],
    },
    public: {
      http: ['https://rpc.testnet.chain.robinhood.com'],
    },
  },
  blockExplorers: {
    default: {
      name: 'Robinhood Explorer',
      url: 'https://explorer.testnet.chain.robinhood.com',
    },
  },
  testnet: true,
} as const;
```

---

## Available Stock Tokens

| Token | Company | Faucet |
|-------|---------|--------|
| TSLA | Tesla | ✅ 5 tokens/day |
| AMZN | Amazon | ✅ 5 tokens/day |
| PLTR | Palantir | ✅ 5 tokens/day |
| NFLX | Netflix | ✅ 5 tokens/day |
| AMD | AMD | ✅ 5 tokens/day |

Get tokens at: https://faucet.testnet.chain.robinhood.com

---

## Step 1: Install Dependencies

```bash
npm install viem wagmi @tanstack/react-query
```

---

## Step 2: Define the Chain (Viem/Wagmi)

```typescript
// lib/chains/robinhood.ts

import { defineChain } from 'viem';

export const robinhoodTestnet = defineChain({
  id: 46630,
  name: 'Robinhood Chain Testnet',
  nativeCurrency: {
    name: 'Ethereum',
    symbol: 'ETH',
    decimals: 18,
  },
  rpcUrls: {
    default: {
      http: ['https://rpc.testnet.chain.robinhood.com'],
    },
  },
  blockExplorers: {
    default: {
      name: 'Blockscout',
      url: 'https://explorer.testnet.chain.robinhood.com',
    },
  },
  testnet: true,
});
```

---

## Step 3: Configure Wagmi

```typescript
// lib/wallet/config.ts

import { createConfig, http } from 'wagmi';
import { walletConnect, injected } from 'wagmi/connectors';
import { robinhoodTestnet } from '../chains/robinhood';

export const wagmiConfig = createConfig({
  chains: [robinhoodTestnet],
  connectors: [
    walletConnect({
      projectId: process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID!,
      metadata: {
        name: 'Stocklings',
        description: 'Your holdings, alive',
        url: 'https://stocklings.app',
        icons: ['https://stocklings.app/icon.png'],
      },
    }),
    injected(),
  ],
  transports: {
    [robinhoodTestnet.id]: http('https://rpc.testnet.chain.robinhood.com'),
  },
});
```

---

## Step 4: Create Viem Public Client

```typescript
// lib/clients/robinhood.ts

import { createPublicClient, http } from 'viem';
import { robinhoodTestnet } from '../chains/robinhood';

export const robinhoodClient = createPublicClient({
  chain: robinhoodTestnet,
  transport: http('https://rpc.testnet.chain.robinhood.com'),
});
```

---

## Step 5: Stock Token Contract Interaction

Stock tokens are ERC-20 contracts. You'll need to discover the contract addresses from the explorer or faucet.

```typescript
// lib/contracts/stock-tokens.ts

import { formatUnits } from 'viem';
import { robinhoodClient } from '../clients/robinhood';

// ERC-20 ABI (minimal for balanceOf)
const ERC20_ABI = [
  {
    name: 'balanceOf',
    type: 'function',
    stateMutability: 'view',
    inputs: [{ name: 'account', type: 'address' }],
    outputs: [{ name: '', type: 'uint256' }],
  },
  {
    name: 'decimals',
    type: 'function',
    stateMutability: 'view',
    inputs: [],
    outputs: [{ name: '', type: 'uint8' }],
  },
  {
    name: 'symbol',
    type: 'function',
    stateMutability: 'view',
    inputs: [],
    outputs: [{ name: '', type: 'string' }],
  },
  {
    name: 'name',
    type: 'function',
    stateMutability: 'view',
    inputs: [],
    outputs: [{ name: '', type: 'string' }],
  },
] as const;

// Stock token addresses (GET THESE FROM EXPLORER OR FAUCET)
// These are placeholders - Claude Code should discover the real addresses
export const STOCK_TOKEN_ADDRESSES: Record<string, `0x${string}`> = {
  TSLA: '0x...', // Find on https://explorer.testnet.chain.robinhood.com
  AMZN: '0x...',
  PLTR: '0x...',
  NFLX: '0x...',
  AMD: '0x...',
};

// Fetch balance for a single token
export async function getTokenBalance(
  tokenAddress: `0x${string}`,
  walletAddress: `0x${string}`
): Promise<{ balance: bigint; formatted: string; decimals: number }> {
  const [balance, decimals] = await Promise.all([
    robinhoodClient.readContract({
      address: tokenAddress,
      abi: ERC20_ABI,
      functionName: 'balanceOf',
      args: [walletAddress],
    }),
    robinhoodClient.readContract({
      address: tokenAddress,
      abi: ERC20_ABI,
      functionName: 'decimals',
    }),
  ]);

  return {
    balance,
    decimals,
    formatted: formatUnits(balance, decimals),
  };
}

// Fetch all stock token balances for a wallet
export async function getAllStockBalances(
  walletAddress: `0x${string}`
): Promise<Record<string, { balance: string; symbol: string }>> {
  const results: Record<string, { balance: string; symbol: string }> = {};

  for (const [symbol, address] of Object.entries(STOCK_TOKEN_ADDRESSES)) {
    try {
      const { formatted } = await getTokenBalance(address, walletAddress);
      if (parseFloat(formatted) > 0) {
        results[symbol] = {
          balance: formatted,
          symbol,
        };
      }
    } catch (error) {
      console.error(`Failed to fetch ${symbol} balance:`, error);
    }
  }

  return results;
}
```

---

## Step 6: Discover Token Addresses from Explorer

Claude Code should:

1. Go to https://explorer.testnet.chain.robinhood.com
2. Search for "TSLA" or look at the faucet contract interactions
3. Find the ERC-20 token contract addresses
4. Update STOCK_TOKEN_ADDRESSES

Or use this script to discover from a known wallet that received faucet tokens:

```typescript
// scripts/discover-tokens.ts

import { robinhoodClient } from '../lib/clients/robinhood';

// Known faucet address or a wallet that claimed tokens
const FAUCET_ADDRESS = '0x...'; // Get from faucet page

async function discoverTokens() {
  // Fetch recent transactions from faucet
  // Parse for token transfer events
  // Extract token contract addresses
  
  console.log('Discovering token addresses from explorer...');
  
  // Use the Blockscout API
  const response = await fetch(
    `https://explorer.testnet.chain.robinhood.com/api/v2/addresses/${FAUCET_ADDRESS}/token-transfers`
  );
  const data = await response.json();
  
  const tokens = new Map<string, string>();
  for (const transfer of data.items) {
    if (transfer.token?.symbol) {
      tokens.set(transfer.token.symbol, transfer.token.address);
    }
  }
  
  console.log('Discovered tokens:');
  for (const [symbol, address] of tokens) {
    console.log(`  ${symbol}: '${address}'`);
  }
}

discoverTokens();
```

---

## Step 7: React Hook for Positions

```typescript
// hooks/useRobinhoodPositions.ts

import { useQuery } from '@tanstack/react-query';
import { useAccount } from 'wagmi';
import { getAllStockBalances } from '@/lib/contracts/stock-tokens';

export interface StockPosition {
  symbol: string;
  balance: string;
  // Add price data from oracle later
}

export function useRobinhoodPositions() {
  const { address, isConnected } = useAccount();

  return useQuery({
    queryKey: ['robinhood-positions', address],
    queryFn: async (): Promise<StockPosition[]> => {
      if (!address) return [];
      
      const balances = await getAllStockBalances(address);
      
      return Object.entries(balances).map(([symbol, data]) => ({
        symbol,
        balance: data.balance,
      }));
    },
    enabled: isConnected && !!address,
    refetchInterval: 30000, // Refresh every 30s
  });
}
```

---

## Step 8: Price Data (Chainlink Integration)

Robinhood Chain uses Chainlink oracles. To get real prices:

```typescript
// lib/oracles/chainlink.ts

// Chainlink Price Feed ABI
const PRICE_FEED_ABI = [
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
] as const;

// Price feed addresses (find on Chainlink docs for RH Chain)
const PRICE_FEEDS: Record<string, `0x${string}`> = {
  'TSLA/USD': '0x...', // Discover from Chainlink or RH docs
  'AMZN/USD': '0x...',
  // etc.
};

export async function getStockPrice(symbol: string): Promise<number> {
  const feedAddress = PRICE_FEEDS[`${symbol}/USD`];
  if (!feedAddress) throw new Error(`No price feed for ${symbol}`);

  const [, answer] = await robinhoodClient.readContract({
    address: feedAddress,
    abi: PRICE_FEED_ABI,
    functionName: 'latestRoundData',
  });

  // Chainlink prices have 8 decimals
  return Number(answer) / 1e8;
}
```

---

## Step 9: Complete Position with Price

```typescript
// lib/positions/robinhood.ts

import { getAllStockBalances } from '../contracts/stock-tokens';
import { getStockPrice } from '../oracles/chainlink';

export interface Position {
  symbol: string;
  shares: number;
  currentPrice: number;
  value: number;
  // For Sigil generation
  percentChange: number; // Would need historical data
}

export async function getPositions(walletAddress: `0x${string}`): Promise<Position[]> {
  const balances = await getAllStockBalances(walletAddress);
  const positions: Position[] = [];

  for (const [symbol, data] of Object.entries(balances)) {
    try {
      const price = await getStockPrice(symbol);
      const shares = parseFloat(data.balance);
      
      positions.push({
        symbol,
        shares,
        currentPrice: price,
        value: shares * price,
        percentChange: 0, // TODO: Calculate from historical
      });
    } catch (error) {
      console.error(`Failed to get price for ${symbol}:`, error);
    }
  }

  return positions;
}
```

---

## Step 10: Provider Setup

```typescript
// app/providers.tsx

'use client';

import { WagmiProvider } from 'wagmi';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { wagmiConfig } from '@/lib/wallet/config';

const queryClient = new QueryClient();

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <WagmiProvider config={wagmiConfig}>
      <QueryClientProvider client={queryClient}>
        {children}
      </QueryClientProvider>
    </WagmiProvider>
  );
}
```

---

## Testing Checklist

1. [ ] Get testnet ETH from faucet
2. [ ] Get stock tokens (TSLA, AMZN, etc.) from faucet
3. [ ] Connect wallet (MetaMask or WalletConnect)
4. [ ] Verify chain ID 46630 is selected
5. [ ] Fetch token balances
6. [ ] Display positions in app
7. [ ] Generate Sigils for each position

---

## Environment Variables

```env
# .env.local
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=your_project_id
```

---

## Quick Start for Claude Code

```
1. Read this file and set up the Robinhood Chain testnet integration
2. Create lib/chains/robinhood.ts with the chain definition
3. Create lib/wallet/config.ts with Wagmi configuration  
4. Go to https://explorer.testnet.chain.robinhood.com and discover the 
   stock token contract addresses (TSLA, AMZN, PLTR, NFLX, AMD)
5. Create lib/contracts/stock-tokens.ts with the ERC-20 interaction code
6. Create hooks/useRobinhoodPositions.ts to fetch user holdings
7. Test by connecting a wallet and displaying balances
```

---

## Resources

| Resource | URL |
|----------|-----|
| RPC Endpoint | https://rpc.testnet.chain.robinhood.com |
| Chain ID | 46630 |
| Block Explorer | https://explorer.testnet.chain.robinhood.com |
| Faucet | https://faucet.testnet.chain.robinhood.com |
| Docs | https://docs.robinhood.com/chain |

---

## Notes

- This is a **testnet** — all tokens have no real value
- Stock tokens are ERC-20 compatible
- Use Chainlink oracles for price data
- Mainnet expected later in 2026
- 4M+ transactions already on testnet (as of Feb 2026)
