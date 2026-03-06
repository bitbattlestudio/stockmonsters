import { ClobClient } from '@polymarket/clob-client';
import type { Chain } from '@polymarket/clob-client';

// Contract addresses on Polygon
export const POLYGON_CONTRACTS = {
  USDC: '0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174',
  CTF_EXCHANGE: '0x4bfb41d5b3570defd03c39a9a4d8de6bd8b8982e',
  CONDITIONAL_TOKENS: '0x4d97dcd97ec945f40cf65f87097ace5ea0476045',
  NEG_RISK_EXCHANGE: '0xC5d563A36AE78145C45a50134d48A1215220f80a',
} as const;

// CLOB API endpoints
const CLOB_API_URL = 'https://clob.polymarket.com';
const GAMMA_API_URL = 'https://gamma-api.polymarket.com';

// Order sides
export const OrderSide = {
  BUY: 0,
  SELL: 1,
} as const;

// Order types
export type OrderType = 'GTC' | 'GTD' | 'FOK';

export interface TradeParams {
  tokenId: string;
  side: 0 | 1;
  price: number;
  size: number;
  orderType?: OrderType;
}

export interface TradeResult {
  success: boolean;
  orderId?: string;
  txHash?: string;
  error?: string;
  message?: string;
}

/**
 * Get token ID for a market position from Gamma API
 */
export async function getTokenId(marketSlug: string, outcome: 'Yes' | 'No'): Promise<string | null> {
  try {
    const response = await fetch(`${GAMMA_API_URL}/markets?slug=${marketSlug}`);
    if (!response.ok) return null;

    const markets = await response.json();
    if (!markets || markets.length === 0) return null;

    const market = markets[0];

    // The tokens array contains [YesToken, NoToken]
    if (market.tokens && market.tokens.length >= 2) {
      return outcome === 'Yes' ? market.tokens[0].token_id : market.tokens[1].token_id;
    }

    // Fallback to clobTokenIds if available
    if (market.clobTokenIds && market.clobTokenIds.length >= 2) {
      return outcome === 'Yes' ? market.clobTokenIds[0] : market.clobTokenIds[1];
    }

    return null;
  } catch (error) {
    console.error('Failed to get token ID:', error);
    return null;
  }
}

/**
 * Get current price from orderbook
 */
export async function getPrice(tokenId: string): Promise<{ bid: number; ask: number; mid: number } | null> {
  try {
    const response = await fetch(`${CLOB_API_URL}/price?token_id=${tokenId}`);
    if (!response.ok) return null;

    const data = await response.json();
    return {
      bid: parseFloat(data.bid || '0'),
      ask: parseFloat(data.ask || '0'),
      mid: parseFloat(data.mid || '0'),
    };
  } catch (error) {
    console.error('Failed to get price:', error);
    return null;
  }
}

/**
 * Get orderbook for a token
 */
export async function getOrderbook(tokenId: string): Promise<{
  bids: Array<{ price: number; size: number }>;
  asks: Array<{ price: number; size: number }>;
} | null> {
  try {
    const response = await fetch(`${CLOB_API_URL}/book?token_id=${tokenId}`);
    if (!response.ok) return null;

    const data = await response.json();
    return {
      bids: (data.bids || []).map((b: { price: string; size: string }) => ({
        price: parseFloat(b.price),
        size: parseFloat(b.size),
      })),
      asks: (data.asks || []).map((a: { price: string; size: string }) => ({
        price: parseFloat(a.price),
        size: parseFloat(a.size),
      })),
    };
  } catch (error) {
    console.error('Failed to get orderbook:', error);
    return null;
  }
}

/**
 * Create a CLOB client instance
 * Note: This requires a signer (wallet) for authenticated operations
 */
export function createClobClient(signer: unknown, proxyAddress?: string): ClobClient {
  const chain: Chain = 137; // Polygon mainnet

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return new ClobClient(
    CLOB_API_URL,
    chain,
    signer as any,
    undefined, // creds - will be derived
    undefined, // signatureType
    proxyAddress // funder address (proxy wallet)
  );
}

/**
 * Estimate the cost of a buy order
 */
export function estimateBuyCost(price: number, size: number): {
  cost: number;
  shares: number;
  avgPrice: number;
} {
  // For a market buy, you spend `cost` USDC to get `shares` tokens
  // At price P, each share costs P USDC
  const cost = price * size;
  return {
    cost,
    shares: size,
    avgPrice: price,
  };
}

/**
 * Estimate the return from a sell order
 */
export function estimateSellReturn(price: number, shares: number): {
  return: number;
  shares: number;
  avgPrice: number;
} {
  // For a market sell, you sell `shares` tokens at price P
  const returnValue = price * shares;
  return {
    return: returnValue,
    shares,
    avgPrice: price,
  };
}

/**
 * Check if approvals are needed for trading
 * Returns which approvals are required
 */
export async function checkApprovals(
  userAddress: string,
  exchangeAddress: string = POLYGON_CONTRACTS.CTF_EXCHANGE
): Promise<{
  needsUsdcApproval: boolean;
  needsCtfApproval: boolean;
}> {
  // This would check on-chain allowances
  // For now, return true to indicate approvals may be needed
  return {
    needsUsdcApproval: true,
    needsCtfApproval: true,
  };
}

/**
 * Get USDC approval transaction data
 */
export function getUsdcApprovalData(spenderAddress: string, amount?: bigint): {
  to: string;
  data: string;
} {
  // ERC20 approve function selector: 0x095ea7b3
  // Approve max amount by default
  const maxAmount = amount ?? BigInt('0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff');

  // Encode: approve(address spender, uint256 amount)
  const data = '0x095ea7b3' +
    spenderAddress.slice(2).padStart(64, '0') +
    maxAmount.toString(16).padStart(64, '0');

  return {
    to: POLYGON_CONTRACTS.USDC,
    data,
  };
}

/**
 * Get CTF (Conditional Tokens) approval transaction data
 */
export function getCtfApprovalData(operatorAddress: string): {
  to: string;
  data: string;
} {
  // ERC1155 setApprovalForAll function selector: 0xa22cb465
  // setApprovalForAll(address operator, bool approved)
  const data = '0xa22cb465' +
    operatorAddress.slice(2).padStart(64, '0') +
    '1'.padStart(64, '0'); // true

  return {
    to: POLYGON_CONTRACTS.CONDITIONAL_TOKENS,
    data,
  };
}

export default {
  POLYGON_CONTRACTS,
  OrderSide,
  getTokenId,
  getPrice,
  getOrderbook,
  createClobClient,
  estimateBuyCost,
  estimateSellReturn,
  checkApprovals,
  getUsdcApprovalData,
  getCtfApprovalData,
};
