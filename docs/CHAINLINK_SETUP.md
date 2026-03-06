# Chainlink Price Feed Setup for Robinhood Chain Testnet

## Overview

This app integrates **Chainlink Price Oracles** to fetch real-time stock prices from Robinhood Chain Testnet. Chainlink is the official oracle partner for Robinhood Chain.

## Current Status

✅ **Integration Complete** - Code is ready to use Chainlink price feeds
⚠️ **Configuration Needed** - Price feed contract addresses need to be updated

## How It Works

1. **Token Balances**: Fetched directly from stock token contracts on Robinhood Chain
2. **Stock Prices**: Fetched from Chainlink Price Feed oracles
3. **Price Updates**: Automatically refreshed every 30 seconds
4. **Fallback**: Uses mock prices if Chainlink feeds are not configured

## Finding Chainlink Price Feed Addresses

### Option 1: Chainlink Documentation
Visit the official Chainlink documentation:
- [Chainlink Price Feeds](https://docs.chain.link/data-feeds/price-feeds/addresses)
- Look for "Robinhood Chain Testnet" or "Arbitrum-based testnets"
- Find the price feed addresses for:
  - TSLA / USD
  - AMZN / USD
  - PLTR / USD
  - NFLX / USD
  - AMD / USD
  - AAPL / USD
  - NVDA / USD
  - META / USD

### Option 2: Robinhood Chain Documentation
Check Robinhood Chain's official docs:
- [Robinhood Chain Testnet](https://docs.robinhood.com/chain) (if available)
- Look for "Oracle Integration" or "Price Feeds"

### Option 3: Block Explorer
Use the Robinhood Chain Testnet explorer:
- Visit: https://explorer.testnet.chain.robinhood.com
- Search for "Chainlink" or "Price Feed"
- Look for deployed Chainlink aggregator contracts

### Option 4: Contact Robinhood Support
Reach out to Robinhood Chain developer support for testnet documentation

## Updating Price Feed Addresses

Once you have the Chainlink price feed addresses, update them in:

**File**: `lib/contracts/price-oracle.ts`

```typescript
export const PRICE_FEED_ADDRESSES: Record<string, `0x${string}`> = {
  TSLA: '0xYOUR_TSLA_PRICE_FEED_ADDRESS',  // Tesla / USD
  AMZN: '0xYOUR_AMZN_PRICE_FEED_ADDRESS',  // Amazon / USD
  PLTR: '0xYOUR_PLTR_PRICE_FEED_ADDRESS',  // Palantir / USD
  NFLX: '0xYOUR_NFLX_PRICE_FEED_ADDRESS',  // Netflix / USD
  AMD: '0xYOUR_AMD_PRICE_FEED_ADDRESS',    // AMD / USD
  AAPL: '0xYOUR_AAPL_PRICE_FEED_ADDRESS',  // Apple / USD
  NVDA: '0xYOUR_NVDA_PRICE_FEED_ADDRESS',  // NVIDIA / USD
  META: '0xYOUR_META_PRICE_FEED_ADDRESS',  // Meta / USD
};
```

## Testing the Integration

### 1. Check if price feeds are configured:
```typescript
import { hasPriceFeed } from '@/lib/contracts/price-oracle';

console.log('TSLA has price feed:', hasPriceFeed('TSLA'));
```

### 2. Fetch a single price:
```typescript
import { getStockPrice } from '@/lib/contracts/price-oracle';

const tslaPrice = await getStockPrice('TSLA');
console.log('TSLA Price:', tslaPrice);
```

### 3. Fetch multiple prices:
```typescript
import { getStockPrices } from '@/lib/contracts/price-oracle';

const prices = await getStockPrices(['TSLA', 'AMZN', 'NVDA']);
console.log('Prices:', prices);
```

## Fallback Behavior

If Chainlink price feeds are not configured (addresses are `0x0000...0000`), the app will:
1. Log a warning to the console
2. Use fallback/mock prices
3. Display a warning indicator (future feature)

## Architecture

```
User Wallet
    ↓
Token Balance (Robinhood Chain)
    ↓
Chainlink Price Oracle (Robinhood Chain)
    ↓
Real-time Stock Price
    ↓
Display in UI
```

## Related Files

- `lib/contracts/price-oracle.ts` - Chainlink integration
- `lib/contracts/stock-tokens.ts` - Token balance fetching
- `hooks/useRobinhoodPositions.ts` - Combines balances + prices

## References

- [Robinhood Chain Testnet Announcement](https://robinhood.com/us/en/newsroom/robinhood-chain-launches-public-testnet/)
- [Chainlink Documentation](https://docs.chain.link/data-feeds)
- [Robinhood selects Chainlink partnership](https://bitcoinethereumnews.com/finance/robinhood-selects-chainlink-to-power-robinhood-chain-testnet/)
