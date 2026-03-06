// lib/contracts/stock-tokens.ts
// ERC-20 stock token interactions for Robinhood Chain Testnet

import { createPublicClient, http, formatUnits } from 'viem';
import { robinhoodTestnet } from '../chains/robinhood';

// Create a public client for read operations
export const robinhoodClient = createPublicClient({
  chain: robinhoodTestnet,
  transport: http('https://rpc.testnet.chain.robinhood.com'),
});

// ERC-20 ABI (minimal for reading balances)
export const ERC20_ABI = [
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

// Stock token contract addresses on Robinhood Chain Testnet
// Discovered from: https://explorer.testnet.chain.robinhood.com
export const STOCK_TOKEN_ADDRESSES: Record<string, `0x${string}`> = {
  TSLA: '0xC9f9c86933092BbbfFF3CCb4b105A4A94bf3Bd4E',
  AMZN: '0x5884aD2f920c162CFBbACc88C9C51AA75eC09E02',
  PLTR: '0x1FBE1a0e43594b3455993B5dE5Fd0A7A266298d0',
  NFLX: '0x3b8262A63d25f0477c4DDE23F83cfe22Cb768C93',
  AMD: '0x71178BAc73cBeb415514eB542a8995b82669778d',
};

// Stock metadata (name, company info)
export const STOCK_METADATA: Record<string, { name: string; company: string }> = {
  TSLA: { name: 'Tesla', company: 'Tesla, Inc.' },
  AMZN: { name: 'Amazon', company: 'Amazon.com, Inc.' },
  PLTR: { name: 'Palantir', company: 'Palantir Technologies Inc.' },
  NFLX: { name: 'Netflix', company: 'Netflix, Inc.' },
  AMD: { name: 'AMD', company: 'Advanced Micro Devices, Inc.' },
};

export interface TokenBalance {
  symbol: string;
  name: string;
  company: string;
  address: `0x${string}`;
  balance: bigint;
  decimals: number;
  formatted: string;
  shares: number;
}

// Fetch balance for a single token
export async function getTokenBalance(
  tokenAddress: `0x${string}`,
  walletAddress: `0x${string}`
): Promise<{ balance: bigint; decimals: number; formatted: string }> {
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
): Promise<TokenBalance[]> {
  const results: TokenBalance[] = [];

  // Fetch all balances in parallel
  const balancePromises = Object.entries(STOCK_TOKEN_ADDRESSES).map(
    async ([symbol, address]) => {
      try {
        const { balance, decimals, formatted } = await getTokenBalance(
          address,
          walletAddress
        );

        const shares = parseFloat(formatted);

        // Only include tokens with non-zero balance
        if (shares > 0) {
          const metadata = STOCK_METADATA[symbol] || { name: symbol, company: symbol };
          return {
            symbol,
            name: metadata.name,
            company: metadata.company,
            address,
            balance,
            decimals,
            formatted,
            shares,
          };
        }
        return null;
      } catch (error) {
        console.error(`Failed to fetch ${symbol} balance:`, error);
        return null;
      }
    }
  );

  const balances = await Promise.all(balancePromises);

  // Filter out null results
  for (const balance of balances) {
    if (balance) {
      results.push(balance);
    }
  }

  return results;
}

// Get list of all supported stock symbols
export function getSupportedStocks(): string[] {
  return Object.keys(STOCK_TOKEN_ADDRESSES);
}
