import { keccak256, encodePacked, toHex, pad } from 'viem';

// Contract addresses on Polygon
export const POLYGON_CONTRACTS = {
  USDC: '0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174' as `0x${string}`,
  CTF_EXCHANGE: '0x4bFb41d5B3570DeFd03C39a9A4D8dE6Bd8B8982E' as `0x${string}`,
  CONDITIONAL_TOKENS: '0x4D97DCd97eC945f40cF65F87097ACe5EA0476045' as `0x${string}`,
  NEG_RISK_EXCHANGE: '0xC5d563A36AE78145C45a50134d48A1215220f80a' as `0x${string}`,
} as const;

// EIP-712 Domain for Polymarket CTF Exchange
export const CTF_EXCHANGE_DOMAIN = {
  name: 'Polymarket CTF Exchange',
  version: '1',
  chainId: 137,
  verifyingContract: POLYGON_CONTRACTS.CTF_EXCHANGE,
} as const;

// Order side constants
export const Side = {
  BUY: 0,
  SELL: 1,
} as const;

// Signature types
export const SignatureType = {
  EOA: 0,        // Standard EOA signature
  POLY_PROXY: 1, // Polymarket proxy signature
  POLY_GNOSIS_SAFE: 2,
} as const;

// EIP-712 Type definitions for Order
export const ORDER_TYPES = {
  Order: [
    { name: 'salt', type: 'uint256' },
    { name: 'maker', type: 'address' },
    { name: 'signer', type: 'address' },
    { name: 'taker', type: 'address' },
    { name: 'tokenId', type: 'uint256' },
    { name: 'makerAmount', type: 'uint256' },
    { name: 'takerAmount', type: 'uint256' },
    { name: 'expiration', type: 'uint256' },
    { name: 'nonce', type: 'uint256' },
    { name: 'feeRateBps', type: 'uint256' },
    { name: 'side', type: 'uint8' },
    { name: 'signatureType', type: 'uint8' },
  ],
} as const;

export interface OrderData {
  salt: bigint;
  maker: `0x${string}`;
  signer: `0x${string}`;
  taker: `0x${string}`;
  tokenId: bigint;
  makerAmount: bigint;
  takerAmount: bigint;
  expiration: bigint;
  nonce: bigint;
  feeRateBps: bigint;
  side: number;
  signatureType: number;
}

export interface SignedOrder extends OrderData {
  signature: `0x${string}`;
}

export interface CreateOrderParams {
  tokenId: string;
  price: number;      // 0-1 (e.g., 0.55 for 55 cents)
  size: number;       // Number of shares
  side: 0 | 1;        // 0 = BUY, 1 = SELL
  maker: `0x${string}`;
  signer?: `0x${string}`;
  expirationSeconds?: number;
  nonce?: bigint;
  feeRateBps?: number;
}

// USDC has 6 decimals
const USDC_DECIMALS = 6;
const USDC_MULTIPLIER = BigInt(10 ** USDC_DECIMALS);

// Conditional tokens have 6 decimals on Polymarket
const CT_DECIMALS = 6;
const CT_MULTIPLIER = BigInt(10 ** CT_DECIMALS);

/**
 * Generate a random salt for the order
 */
export function generateSalt(): bigint {
  const randomBytes = new Uint8Array(32);
  crypto.getRandomValues(randomBytes);
  return BigInt('0x' + Array.from(randomBytes).map(b => b.toString(16).padStart(2, '0')).join(''));
}

/**
 * Calculate maker and taker amounts based on price and size
 *
 * For BUY orders:
 *   - makerAmount = USDC to spend
 *   - takerAmount = shares to receive
 *
 * For SELL orders:
 *   - makerAmount = shares to sell
 *   - takerAmount = USDC to receive
 */
export function calculateAmounts(
  price: number,
  size: number,
  side: 0 | 1
): { makerAmount: bigint; takerAmount: bigint } {
  // Convert to proper decimals
  const sizeInUnits = BigInt(Math.floor(size * Number(CT_MULTIPLIER)));
  const priceInUnits = BigInt(Math.floor(price * Number(USDC_MULTIPLIER)));

  if (side === Side.BUY) {
    // BUY: spend USDC (maker) to get shares (taker)
    const usdcAmount = (sizeInUnits * priceInUnits) / CT_MULTIPLIER;
    return {
      makerAmount: usdcAmount,
      takerAmount: sizeInUnits,
    };
  } else {
    // SELL: give shares (maker) to get USDC (taker)
    const usdcAmount = (sizeInUnits * priceInUnits) / CT_MULTIPLIER;
    return {
      makerAmount: sizeInUnits,
      takerAmount: usdcAmount,
    };
  }
}

/**
 * Build an unsigned order from parameters
 */
export function buildOrder(params: CreateOrderParams): OrderData {
  const {
    tokenId,
    price,
    size,
    side,
    maker,
    signer = maker,
    expirationSeconds = 60 * 60 * 24 * 30, // 30 days default
    nonce = BigInt(0),
    feeRateBps = 0,
  } = params;

  const { makerAmount, takerAmount } = calculateAmounts(price, size, side);

  return {
    salt: generateSalt(),
    maker,
    signer,
    taker: '0x0000000000000000000000000000000000000000' as `0x${string}`, // Open order
    tokenId: BigInt(tokenId),
    makerAmount,
    takerAmount,
    expiration: BigInt(Math.floor(Date.now() / 1000) + expirationSeconds),
    nonce,
    feeRateBps: BigInt(feeRateBps),
    side,
    signatureType: SignatureType.EOA,
  };
}

/**
 * Get the EIP-712 typed data for signing
 */
export function getOrderTypedData(order: OrderData) {
  return {
    domain: CTF_EXCHANGE_DOMAIN,
    types: ORDER_TYPES,
    primaryType: 'Order' as const,
    message: {
      salt: order.salt,
      maker: order.maker,
      signer: order.signer,
      taker: order.taker,
      tokenId: order.tokenId,
      makerAmount: order.makerAmount,
      takerAmount: order.takerAmount,
      expiration: order.expiration,
      nonce: order.nonce,
      feeRateBps: order.feeRateBps,
      side: order.side,
      signatureType: order.signatureType,
    },
  };
}

/**
 * Convert order to API format for submission
 */
export function orderToApiFormat(signedOrder: SignedOrder): Record<string, string | number> {
  return {
    salt: signedOrder.salt.toString(),
    maker: signedOrder.maker,
    signer: signedOrder.signer,
    taker: signedOrder.taker,
    tokenId: signedOrder.tokenId.toString(),
    makerAmount: signedOrder.makerAmount.toString(),
    takerAmount: signedOrder.takerAmount.toString(),
    expiration: signedOrder.expiration.toString(),
    nonce: signedOrder.nonce.toString(),
    feeRateBps: signedOrder.feeRateBps.toString(),
    side: signedOrder.side,
    signatureType: signedOrder.signatureType,
    signature: signedOrder.signature,
  };
}

/**
 * Calculate the order hash (for tracking)
 */
export function getOrderHash(order: OrderData): `0x${string}` {
  // This is a simplified hash - the actual hash is computed by the contract
  const encoded = encodePacked(
    ['uint256', 'address', 'address', 'uint256', 'uint256', 'uint256'],
    [order.salt, order.maker, order.signer, order.tokenId, order.makerAmount, order.takerAmount]
  );
  return keccak256(encoded);
}

export default {
  POLYGON_CONTRACTS,
  CTF_EXCHANGE_DOMAIN,
  ORDER_TYPES,
  Side,
  SignatureType,
  generateSalt,
  calculateAmounts,
  buildOrder,
  getOrderTypedData,
  orderToApiFormat,
  getOrderHash,
};
