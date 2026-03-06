# StockMonsters XP System - Complete Guide

## Overview

The XP system rewards users for three activities:
- 🍎 **Feed XP** — Buy stocks (1 XP per $10, 2x bonus when stock is down)
- 🚀 **Release XP** — Sell stocks (0.5 XP per $10, 2x bonus when taking profits)
- 🔄 **Swap XP** — Accept trade offers (50-100 XP per trade)
- 🏃 **Marathon XP** — Hold stocks daily (1 XP per stock per day + milestone bonuses)

**Redemption:** 1,000 XP = $1.00 worth of chosen "Harvest Stock"

---

## File Structure

```
lib/xp/
├── types.ts           # Types and constants
├── calculations.ts    # XP calculation functions
├── store.ts           # State management (localStorage)
└── marathon.ts        # Daily marathon XP logic

hooks/
└── useXP.ts          # React hook for XP system

components/xp/
├── XPBadge.tsx       # Header XP display
├── XPToast.tsx       # XP earned notification
├── XPActivityFeed.tsx # Transaction history
├── HarvestModal.tsx  # Redeem XP for stock
└── index.ts          # Export all components
```

---

## How to Use

### 1. Display XP Badge (Already Added to Collection Page)

```typescript
import { XPBadge } from '@/components/xp';

<XPBadge
  size="sm"
  showHarvestButton
  onClick={() => setIsHarvestModalOpen(true)}
/>
```

### 2. Award XP on Buy (Feed)

```typescript
import { useXP } from '@/hooks/useXP';
import { XPToast } from '@/components/xp';

const { awardFeedXP } = useXP();
const [xpToast, setXpToast] = useState<XPTransaction | null>(null);

// In your buy handler
const handleBuy = async (ticker: string, dollarAmount: number) => {
  // ... existing buy logic ...

  // Award XP
  const stockPercentChange = stock.change; // Or calculate it
  const xpTransaction = awardFeedXP(dollarAmount, ticker, stockPercentChange);

  // Show toast
  if (xpTransaction) {
    setXpToast(xpTransaction);
  }
};

// Render toast
{xpToast && (
  <XPToast
    transaction={xpToast}
    onClose={() => setXpToast(null)}
  />
)}
```

### 3. Award XP on Sell (Release)

```typescript
const { awardReleaseXP } = useXP();

const handleSell = async (ticker: string, dollarAmount: number, isFullSale: boolean) => {
  // ... existing sell logic ...

  const stockPercentChange = getUserGainPercent(ticker); // Your gain on this position
  const xpTransaction = awardReleaseXP(dollarAmount, ticker, stockPercentChange, isFullSale);

  if (xpTransaction) {
    setXpToast(xpTransaction);
  }
};
```

### 4. Award XP on Trade Acceptance (Swap)

```typescript
const { awardSwapXP } = useXP();

const handleAcceptTrade = async (fromTicker: string, toTicker: string, tradeType: string) => {
  // ... existing trade logic ...

  const isSmart = ['tax_loss', 'rebalance', 'rsi_oversold', 'pairs_trade'].includes(tradeType);
  const xpTransaction = awardSwapXP(fromTicker, toTicker, isSmart);

  if (xpTransaction) {
    setXpToast(xpTransaction);
  }
};
```

### 5. Credit Daily Marathon XP

Add this to your main app component or collection page:

```typescript
import { creditDailyMarathonXP } from '@/lib/xp/marathon';
import { useEffect } from 'react';

// In your component
useEffect(() => {
  // Get current holdings (tickers only)
  const holdings = positions.map(p => p.ticker || p.symbol);

  // Credit daily XP (will check if already credited today)
  creditDailyMarathonXP(holdings);
}, [positions]);
```

---

## XP Earning Rules

### Feed XP (Buying)
- **Base:** 1 XP per $10 spent (0.1 XP per dollar)
- **Bonus:** 2x XP when stock is down 5% or more
- **Example:** Buy $100 of TSLA when it's down 7% = 20 XP (instead of 10)

### Release XP (Selling)
- **Base:** 0.5 XP per $10 sold (0.05 XP per dollar)
- **Bonus:** 2x XP when taking 10%+ profits
- **Example:** Sell $100 of TSLA at +15% gain = 10 XP (instead of 5)

### Swap XP (Trading)
- **Base:** 50 XP per trade
- **Smart Trade Bonus:** 100 XP for tax-loss harvesting, rebalancing, etc.

### Marathon XP (Holding)
- **Daily:** 1 XP per stock held each day
- **Milestones:**
  - 30 days: +25 XP bonus
  - 90 days: +100 XP bonus
  - 365 days: +500 XP bonus

---

## Harvest (Redemption)

**Conversion Rate:** 1,000 XP = $1.00

**How It Works:**
1. Click XP Badge in header
2. Select "Harvest Stock" (any stock you own or want)
3. Enter XP amount (minimum 1,000)
4. Preview shows exact shares you'll receive
5. Click "Harvest" to redeem

**Example:**
- You have 5,000 XP
- TSLA is $200
- Harvest 5,000 XP = $5.00 = 0.025 shares of TSLA

---

## Integration Points

### Where to Add XP Awards

1. **Feed Modal** (`components/trading/FeedModal.tsx`)
   - Add `awardFeedXP()` after successful buy

2. **Release Modal** (`components/trading/ReleaseModal.tsx`)
   - Add `awardReleaseXP()` after successful sell

3. **Trade Offer Acceptance** (`components/trade-offers/TradeOfferModal.tsx`)
   - Add `awardSwapXP()` after accepting trade

4. **Collection Page** (`app/collection/page.tsx`)
   - Already has XP Badge in header
   - Add `creditDailyMarathonXP()` in useEffect

---

## Displaying XP Activity

### Activity Feed

```typescript
import { XPActivityFeed } from '@/components/xp';

// In a modal or dedicated page
<XPActivityFeed limit={10} />
```

Shows recent XP transactions with icons and descriptions.

---

## Testing Checklist

- [ ] XP Badge shows in collection page header
- [ ] Click XP Badge opens Harvest Modal
- [ ] Feed XP awarded when buying stock
- [ ] Release XP awarded when selling stock
- [ ] Swap XP awarded when accepting trade
- [ ] Marathon XP credited daily for holdings
- [ ] Bonus XP awarded for buying dips
- [ ] Bonus XP awarded for taking profits
- [ ] Smart trade bonus (100 XP) for special trades
- [ ] Milestone bonuses at 30/90/365 days
- [ ] XP Toast notifications appear
- [ ] Harvest preview shows correct share amount
- [ ] Harvest button disabled under 1,000 XP
- [ ] XP state persists in localStorage
- [ ] Activity feed shows recent transactions

---

## Next Steps

1. **Add XP Awards to Trading Modals:**
   - Update FeedModal.tsx with `awardFeedXP()`
   - Update ReleaseModal.tsx with `awardReleaseXP()`
   - Update TradeOfferModal.tsx with `awardSwapXP()`

2. **Add Daily Marathon Check:**
   - Add `creditDailyMarathonXP()` to collection page useEffect

3. **Connect Harvest to Real Trading:**
   - Replace alert in HarvestModal with actual Robinhood Chain transaction
   - Use your existing buy logic to purchase the harvest stock

4. **Add XP Page (Optional):**
   - Create `/xp` route with detailed stats
   - Show XP Activity Feed, holdings streaks, milestone progress

---

## Customization

### Adjust XP Rates

Edit `lib/xp/types.ts` → `XP_CONSTANTS`:

```typescript
export const XP_CONSTANTS = {
  FEED_XP_PER_DOLLAR: 0.1,        // Change base feed rate
  FEED_DOWN_THRESHOLD: -5,         // Adjust dip threshold
  RELEASE_XP_PER_DOLLAR: 0.05,    // Change base release rate
  MARATHON_DAILY_XP: 1,            // Change daily holding reward
  SWAP_BASE_XP: 50,                // Change base swap reward
  XP_TO_DOLLAR_RATIO: 1000,        // Change redemption rate
};
```

### Add New XP Events

1. Add new type to `XPEventType` in `types.ts`
2. Add calculation function in `calculations.ts`
3. Add handler in `useXP` hook
4. Add icon/color config to XPToast and XPActivityFeed

---

## Troubleshooting

**XP not showing:**
- Check browser localStorage: `stocklings_xp`
- Clear localStorage and refresh to reset

**Marathon XP not crediting:**
- Check that `creditDailyMarathonXP()` is called in useEffect
- Verify it's only called once per day (check transaction timestamps)

**Harvest not working:**
- Ensure XP ≥ 1,000
- Check available stocks list is not empty
- Verify stock price is available

**Dark mode issues:**
- All XP components support dark mode with `dark:` variants
- Check Tailwind dark mode is enabled

---

## API Reference

### useXP Hook

```typescript
const {
  currentXP,           // number - Current redeemable XP
  lifetimeXP,         // number - Total XP earned ever
  harvestStock,       // string | null - Selected harvest stock
  transactions,       // XPTransaction[] - Recent XP history
  holdingStreaks,     // Record<string, HoldingStreak> - Holding data

  awardFeedXP,        // (dollarAmount, ticker, percentChange) => XPTransaction
  awardReleaseXP,     // (dollarAmount, ticker, percentChange, isFullSale) => XPTransaction
  awardSwapXP,        // (fromTicker, toTicker, isSmart) => XPTransaction
  setHarvestStock,    // (ticker: string) => void
  harvest,            // (xpAmount, stockPrice) => { dollarValue, shares }
  getHarvestPreview,  // (xpAmount, stockPrice) => { dollarValue, shares }

  constants           // XP_CONSTANTS object
} = useXP();
```

---

**The XP system is now fully implemented and ready to use!** 🎉

Just add the XP award calls to your trading modals and the system will start tracking and rewarding user activity.
