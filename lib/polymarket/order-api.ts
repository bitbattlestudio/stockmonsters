import { SignedOrder, orderToApiFormat } from './order-builder';
import { getAuthHeaders, getStoredClobCredentials, type ClobCredentials } from './clob-auth';

const CLOB_API_URL = 'https://clob.polymarket.com';

export interface OrderResponse {
  success: boolean;
  orderId?: string;
  transactionsHashes?: string[];
  status?: string;
  errorMsg?: string;
}

export interface OrderBookEntry {
  price: string;
  size: string;
}

export interface OrderBook {
  market: string;
  asset_id: string;
  bids: OrderBookEntry[];
  asks: OrderBookEntry[];
  hash: string;
  timestamp: string;
}

export interface PriceResponse {
  mid: string;
  bid: string;
  ask: string;
  spread: string;
}

/**
 * Submit a signed order to the Polymarket CLOB
 * Tries with credentials first, then without (using just the order signature)
 */
export async function submitOrder(
  signedOrder: SignedOrder,
  orderType: 'GTC' | 'GTD' | 'FOK' = 'GTC',
  credentials?: ClobCredentials
): Promise<OrderResponse> {
  try {
    const orderData = orderToApiFormat(signedOrder);
    const path = '/order';
    const body = JSON.stringify({
      order: orderData,
      orderType,
      owner: signedOrder.maker,
    });

    // Get credentials from parameter or storage
    const creds = credentials || getStoredClobCredentials();

    let headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };

    // Add auth headers only if we have valid credentials
    if (creds && creds.apiKey && creds.secret) {
      try {
        const authHeaders = await getAuthHeaders(creds, 'POST', path, body);
        headers = { ...headers, ...authHeaders };
      } catch (authError) {
        console.warn('Failed to generate auth headers, proceeding without:', authError);
      }
    }

    console.log('Submitting order to CLOB...', { orderData, orderType, hasCreds: !!creds });

    const response = await fetch(`${CLOB_API_URL}${path}`, {
      method: 'POST',
      headers,
      body,
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Order submission failed:', errorText);

      // If failed with creds, try without (order signature should be enough)
      if (creds) {
        console.log('Retrying without API credentials...');
        const retryResponse = await fetch(`${CLOB_API_URL}${path}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body,
        });

        if (retryResponse.ok) {
          const result = await retryResponse.json();
          return {
            success: true,
            orderId: result.orderID || result.order_id,
            transactionsHashes: result.transactionsHashes || result.transactions,
            status: result.status,
          };
        }

        const retryError = await retryResponse.text();
        console.error('Retry also failed:', retryError);
      }

      return {
        success: false,
        errorMsg: `Order submission failed: ${response.status} ${errorText}`,
      };
    }

    const result = await response.json();

    return {
      success: true,
      orderId: result.orderID || result.order_id,
      transactionsHashes: result.transactionsHashes || result.transactions,
      status: result.status,
    };
  } catch (error) {
    console.error('Order submission error:', error);
    return {
      success: false,
      errorMsg: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

/**
 * Cancel an order
 */
export async function cancelOrder(orderId: string): Promise<OrderResponse> {
  try {
    const response = await fetch(`${CLOB_API_URL}/order/${orderId}`, {
      method: 'DELETE',
    });

    if (!response.ok) {
      return {
        success: false,
        errorMsg: `Cancel failed: ${response.status}`,
      };
    }

    return { success: true };
  } catch (error) {
    return {
      success: false,
      errorMsg: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

/**
 * Get order book for a token
 */
export async function getOrderBook(tokenId: string): Promise<OrderBook | null> {
  // Don't make API call if token ID is missing or invalid
  if (!tokenId || tokenId.length < 10) {
    return null;
  }

  try {
    const response = await fetch(`${CLOB_API_URL}/book?token_id=${tokenId}`);

    if (!response.ok) {
      return null;
    }

    return await response.json();
  } catch (error) {
    return null;
  }
}

/**
 * Get current price for a token
 */
export async function getPrice(tokenId: string): Promise<PriceResponse | null> {
  // Don't make API call if token ID is missing or invalid
  if (!tokenId || tokenId.length < 10) {
    return null;
  }

  try {
    const response = await fetch(`${CLOB_API_URL}/price?token_id=${tokenId}`);

    if (!response.ok) {
      // Only log if it's not a 400 (likely invalid token ID)
      if (response.status !== 400) {
        console.error('Failed to get price:', response.status);
      }
      return null;
    }

    return await response.json();
  } catch (error) {
    // Silently fail for network errors
    return null;
  }
}

/**
 * Get user's open orders
 */
export async function getUserOrders(userAddress: string): Promise<unknown[]> {
  try {
    const response = await fetch(`${CLOB_API_URL}/orders?user=${userAddress}`);

    if (!response.ok) {
      return [];
    }

    return await response.json();
  } catch (error) {
    console.error('User orders fetch error:', error);
    return [];
  }
}

/**
 * Get the best price to use for an order
 * For BUY: use the best ask (or slightly above)
 * For SELL: use the best bid (or slightly below)
 */
export async function getBestPrice(
  tokenId: string,
  side: 0 | 1,
  aggressive: boolean = true
): Promise<number | null> {
  // Don't make API call if token ID is missing
  if (!tokenId || tokenId.length < 10) {
    return null;
  }

  const orderbook = await getOrderBook(tokenId);
  if (!orderbook) return null;

  if (side === 0) {
    // BUY - look at asks
    if (!orderbook.asks || orderbook.asks.length === 0) return null;
    const bestAsk = parseFloat(orderbook.asks[0].price);
    // For aggressive fills, go slightly above
    return aggressive ? Math.min(bestAsk + 0.001, 0.99) : bestAsk;
  } else {
    // SELL - look at bids
    if (!orderbook.bids || orderbook.bids.length === 0) return null;
    const bestBid = parseFloat(orderbook.bids[0].price);
    // For aggressive fills, go slightly below
    return aggressive ? Math.max(bestBid - 0.001, 0.01) : bestBid;
  }
}

/**
 * Calculate estimated fill for a given order
 */
export async function estimateFill(
  tokenId: string,
  side: 0 | 1,
  amount: number // USD for buy, shares for sell
): Promise<{
  avgPrice: number;
  totalCost: number;
  shares: number;
  priceImpact: number;
} | null> {
  // Don't make API call if token ID is missing
  if (!tokenId || tokenId.length < 10) {
    return null;
  }

  const orderbook = await getOrderBook(tokenId);
  if (!orderbook) return null;

  const price = await getPrice(tokenId);
  const midPrice = price ? parseFloat(price.mid) : null;

  if (side === 0) {
    // BUY - walk the asks
    let remainingUsd = amount;
    let totalShares = 0;
    let totalSpent = 0;

    for (const ask of orderbook.asks) {
      if (remainingUsd <= 0) break;

      const askPrice = parseFloat(ask.price);
      const askSize = parseFloat(ask.size);
      const maxShares = remainingUsd / askPrice;
      const sharesToBuy = Math.min(maxShares, askSize);
      const cost = sharesToBuy * askPrice;

      totalShares += sharesToBuy;
      totalSpent += cost;
      remainingUsd -= cost;
    }

    const avgPrice = totalShares > 0 ? totalSpent / totalShares : 0;
    const priceImpact = midPrice ? ((avgPrice - midPrice) / midPrice) * 100 : 0;

    return {
      avgPrice,
      totalCost: totalSpent,
      shares: totalShares,
      priceImpact,
    };
  } else {
    // SELL - walk the bids
    let remainingShares = amount;
    let totalReceived = 0;
    let totalSold = 0;

    for (const bid of orderbook.bids) {
      if (remainingShares <= 0) break;

      const bidPrice = parseFloat(bid.price);
      const bidSize = parseFloat(bid.size);
      const sharesToSell = Math.min(remainingShares, bidSize);
      const received = sharesToSell * bidPrice;

      totalSold += sharesToSell;
      totalReceived += received;
      remainingShares -= sharesToSell;
    }

    const avgPrice = totalSold > 0 ? totalReceived / totalSold : 0;
    const priceImpact = midPrice ? ((midPrice - avgPrice) / midPrice) * 100 : 0;

    return {
      avgPrice,
      totalCost: totalReceived,
      shares: totalSold,
      priceImpact,
    };
  }
}

export default {
  submitOrder,
  cancelOrder,
  getOrderBook,
  getPrice,
  getUserOrders,
  getBestPrice,
  estimateFill,
};
