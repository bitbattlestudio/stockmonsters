# TRADE OFFERS FEATURE
## "Trainer Battles" for Your Stocklings

---

## OVERVIEW

Daily trade offers appear in the app suggesting:
1. **BUY** - Add a new Stockling to your habitat
2. **SWAP** - Trade one Stockling for another (sell + buy in one transaction)

Each offer is backed by **proven financial models** and includes educational content explaining WHY the trade makes sense mathematically.

---

## THE 4 TRADE TYPES (Based on Proven Models)

### 1. 🔄 TAX-LOSS HARVEST SWAP
**Model:** Tax-Loss Harvesting (IRS-compliant strategy)
**Trigger:** User holds a stock down ≥10% AND there's a similar stock in the same sector

**The Math:**
- Sell losing position to realize capital loss
- Loss offsets capital gains (saves 15-20% tax on gains)
- Buy similar (but not "substantially identical") stock to maintain sector exposure
- Must wait 30 days to rebuy same stock (wash sale rule)

**Example Offer:**
```
🔄 EVOLUTION TRADE

Your AMD (-15%) wants to evolve!

SELL: AMD (5 shares @ $168.90 = $844.50)
       Loss: -$149.03

BUY:  NVDA (0.8 shares @ $1,050 = $844.50)
       Same chip sector exposure

💰 TAX BENEFIT: Your $149 loss can offset gains
   At 15% cap gains rate = ~$22 saved

WHY? Both are chip makers. You stay in the 
semiconductor sector while capturing a tax loss.
The IRS allows this - they're different companies!

[EXECUTE TRADE] [LEARN MORE] [DISMISS]
```

**Formula:**
```typescript
interface TaxLossHarvestOffer {
  type: 'tax_loss_harvest';
  trigger: {
    holdingLossPercent: number;      // ≥ 10%
    holdingLossAbsolute: number;     // ≥ $100
    sectorMatch: boolean;            // Same sector available
    washSaleCheck: boolean;          // Not bought in last 30 days
  };
  taxBenefit: {
    lossAmount: number;
    estimatedTaxSavings: number;     // loss × 0.15 (cap gains rate)
  };
}

// Trigger conditions
const shouldOfferTaxLoss = (holding: Holding, alternatives: Stock[]): boolean => {
  const lossPercent = ((holding.currentPrice - holding.avgCost) / holding.avgCost) * 100;
  const lossAbsolute = (holding.avgCost - holding.currentPrice) * holding.shares;
  
  return (
    lossPercent <= -10 &&                    // Down at least 10%
    lossAbsolute >= 100 &&                   // At least $100 loss
    hasLastPurchaseOver30DaysAgo(holding) && // Wash sale safe
    hasSectorAlternative(holding, alternatives)
  );
};
```

---

### 2. ⚖️ REBALANCE TRADE
**Model:** Bernstein's 5/25 Rule (Portfolio Rebalancing)
**Trigger:** Any position grows to >25% of portfolio OR drifts 5%+ from target

**The Math:**
- When one stock dominates, portfolio risk increases
- Sell overweight position, buy underweight positions
- "Sell high" (the winner) to "buy low" (the laggers)
- Maintains target allocation and risk profile

**Example Offer:**
```
⚖️ HABITAT BALANCE

TSLA has taken over your habitat! (42% of portfolio)

SELL: TSLA (2 shares @ $248.50 = $497)
       Reduces to healthier 25%

BUY:  Spread across your other Stocklings:
       +$166 AMZN
       +$166 NFLX  
       +$165 PLTR

📊 REBALANCING BENEFIT:
   - Reduces concentration risk
   - Locks in some TSLA gains
   - "Sell high, buy low" automatically

WHY? The 5/25 Rule says rebalance when any
position drifts 5%+ from target. TSLA grew
from 25% → 42%. Time to trim the winner!

[EXECUTE TRADE] [LEARN MORE] [DISMISS]
```

**Formula:**
```typescript
interface RebalanceOffer {
  type: 'rebalance';
  trigger: {
    overweightStock: string;
    currentWeight: number;           // e.g., 42%
    targetWeight: number;            // e.g., 25%
    driftAmount: number;             // e.g., 17%
  };
  rebalancePlan: {
    sell: { ticker: string; amount: number };
    buy: { ticker: string; amount: number }[];
  };
}

// 5/25 Rule Implementation
const shouldOfferRebalance = (portfolio: Portfolio): RebalanceOffer | null => {
  const totalValue = portfolio.holdings.reduce((sum, h) => sum + h.value, 0);
  
  for (const holding of portfolio.holdings) {
    const currentWeight = (holding.value / totalValue) * 100;
    const targetWeight = 100 / portfolio.holdings.length; // Equal weight default
    const drift = currentWeight - targetWeight;
    
    // 5% absolute rule for positions ≥20%
    if (targetWeight >= 20 && Math.abs(drift) >= 5) {
      return createRebalanceOffer(holding, drift, portfolio);
    }
    
    // 25% relative rule for smaller positions
    if (targetWeight < 20) {
      const relativeDrift = (drift / targetWeight) * 100;
      if (Math.abs(relativeDrift) >= 25) {
        return createRebalanceOffer(holding, drift, portfolio);
      }
    }
  }
  
  return null;
};
```

---

### 3. 📉 OVERSOLD OPPORTUNITY (BUY)
**Model:** Relative Strength Index (RSI)
**Trigger:** A stock in watchlist/available has RSI ≤ 30 (oversold)

**The Math:**
- RSI measures momentum on 0-100 scale
- RSI ≤ 30 = oversold (potentially undervalued)
- RSI ≥ 70 = overbought (potentially overvalued)
- Mean reversion: oversold stocks tend to bounce back

**Example Offer:**
```
📉 OVERSOLD ALERT

NFLX is on sale! RSI: 28 (Oversold)

The RSI indicator shows NFLX has been 
beaten down and may be due for a bounce.

CURRENT PRICE: $178.48 (down 18% this month)
RSI: 28 / 100 (below 30 = oversold)

📊 HISTORICAL CONTEXT:
   Last 5 times NFLX hit RSI 28:
   - Bounced +12% within 2 weeks (3 times)
   - Continued down (2 times)
   
WHY? When RSI drops below 30, it often signals
the selling is overdone. Not guaranteed, but
historically a good entry point.

[BUY $100 WORTH] [BUY $500 WORTH] [DISMISS]
```

**Formula:**
```typescript
interface OversoldOffer {
  type: 'oversold_opportunity';
  trigger: {
    ticker: string;
    currentRSI: number;              // ≤ 30
    priceDropPercent: number;        // Recent decline
    historicalBounceRate: number;    // % of times it bounced
  };
}

// RSI Calculation (14-day standard)
const calculateRSI = (prices: number[]): number => {
  const period = 14;
  const changes = prices.slice(1).map((p, i) => p - prices[i]);
  
  let gains = 0, losses = 0;
  for (let i = 0; i < period; i++) {
    if (changes[i] > 0) gains += changes[i];
    else losses += Math.abs(changes[i]);
  }
  
  const avgGain = gains / period;
  const avgLoss = losses / period;
  const rs = avgGain / avgLoss;
  const rsi = 100 - (100 / (1 + rs));
  
  return rsi;
};

const shouldOfferOversold = (stock: Stock): boolean => {
  const rsi = calculateRSI(stock.priceHistory);
  return rsi <= 30;
};
```

---

### 4. 🔀 PAIRS TRADE (CONVERGENCE SWAP)
**Model:** Pairs Trading / Statistical Arbitrage
**Trigger:** Two correlated stocks diverge beyond 2 standard deviations

**The Math:**
- Find stocks that historically move together (correlation >0.8)
- When they diverge, bet on convergence (mean reversion)
- Sell the outperformer, buy the underperformer
- Profit when spread returns to normal

**Example Offer:**
```
🔀 CONVERGENCE TRADE

AMZN and GOOGL usually move together, but 
GOOGL is lagging behind!

SPREAD ANALYSIS:
Normal spread: AMZN trades 5% above GOOGL
Current spread: AMZN trades 15% above GOOGL
Deviation: 2.3 standard deviations (unusual!)

TRADE:
SELL: AMZN (you own 5 shares)
BUY:  GOOGL (similar value)

📊 HISTORICAL CONVERGENCE:
   When spread exceeds 2σ, it returned to 
   normal within 30 days 78% of the time.

WHY? These are both mega-cap tech stocks that
compete in cloud, ads, and AI. When one gets
ahead, the other usually catches up.

[EXECUTE SWAP] [LEARN MORE] [DISMISS]
```

**Formula:**
```typescript
interface PairsTradeOffer {
  type: 'pairs_trade';
  trigger: {
    stockA: string;                  // User holds this (outperformer)
    stockB: string;                  // Suggested swap target (underperformer)
    correlation: number;             // Historical correlation (>0.8)
    currentSpread: number;           // Current price ratio
    historicalMeanSpread: number;    // Average price ratio
    standardDeviation: number;       // Spread volatility
    zScore: number;                  // How many SDs from mean (>2)
  };
  convergenceStats: {
    historicalConvergenceRate: number;  // % of times spread normalized
    avgDaysToConverge: number;
  };
}

// Z-Score calculation for spread
const calculateSpreadZScore = (
  pricesA: number[], 
  pricesB: number[],
  lookback: number = 60
): number => {
  const spreads = pricesA.slice(-lookback).map((a, i) => a / pricesB[i]);
  const mean = spreads.reduce((sum, s) => sum + s, 0) / spreads.length;
  const variance = spreads.reduce((sum, s) => sum + Math.pow(s - mean, 2), 0) / spreads.length;
  const stdDev = Math.sqrt(variance);
  
  const currentSpread = pricesA[pricesA.length - 1] / pricesB[pricesB.length - 1];
  const zScore = (currentSpread - mean) / stdDev;
  
  return zScore;
};

const shouldOfferPairsTrade = (
  holdingA: Holding, 
  stockB: Stock,
  correlation: number
): boolean => {
  if (correlation < 0.8) return false;
  
  const zScore = calculateSpreadZScore(
    holdingA.priceHistory, 
    stockB.priceHistory
  );
  
  return Math.abs(zScore) >= 2; // 2 standard deviations
};
```

---

## CORRELATED PAIRS DATABASE

Pre-computed pairs for the testnet stocks:

```typescript
const CORRELATED_PAIRS: Record<string, { pair: string; correlation: number }[]> = {
  'TSLA': [
    { pair: 'NVDA', correlation: 0.72 },  // Both growth/tech
  ],
  'AMZN': [
    { pair: 'GOOGL', correlation: 0.85 }, // Mega-cap tech
    { pair: 'MSFT', correlation: 0.82 },
  ],
  'NFLX': [
    { pair: 'DIS', correlation: 0.68 },   // Streaming
  ],
  'AMD': [
    { pair: 'NVDA', correlation: 0.88 },  // Semiconductors
    { pair: 'INTC', correlation: 0.75 },
  ],
  'PLTR': [
    { pair: 'SNOW', correlation: 0.71 },  // Data/analytics
  ],
};

const SECTOR_ALTERNATIVES: Record<string, string[]> = {
  'semiconductors': ['AMD', 'NVDA', 'INTC', 'QCOM', 'AVGO'],
  'mega_tech': ['AMZN', 'GOOGL', 'MSFT', 'META', 'AAPL'],
  'streaming': ['NFLX', 'DIS', 'WBD', 'PARA'],
  'ev_growth': ['TSLA', 'RIVN', 'LCID', 'NIO'],
  'data_analytics': ['PLTR', 'SNOW', 'MDB', 'DDOG'],
};
```

---

## UI SPECIFICATION

### Trade Offer Bell (Top Right)

```tsx
// components/TradeOfferBell.tsx

interface TradeOfferBellProps {
  offers: TradeOffer[];
  onOpen: () => void;
}

export function TradeOfferBell({ offers, onOpen }: TradeOfferBellProps) {
  const hasOffers = offers.length > 0;
  
  return (
    <button 
      onClick={onOpen}
      className="relative p-2 rounded-full hover:bg-gray-100"
    >
      {/* Bell Icon */}
      <BellIcon className="w-6 h-6" />
      
      {/* Notification Badge */}
      {hasOffers && (
        <span className="absolute -top-1 -right-1 bg-red-500 text-white 
                         text-xs rounded-full w-5 h-5 flex items-center justify-center">
          {offers.length}
        </span>
      )}
      
      {/* Pulse Animation for New Offers */}
      {hasOffers && (
        <span className="absolute -top-1 -right-1 bg-red-500 rounded-full 
                         w-5 h-5 animate-ping opacity-75" />
      )}
    </button>
  );
}
```

### Trade Offer Modal

```tsx
// components/TradeOfferModal.tsx

interface TradeOfferModalProps {
  offer: TradeOffer;
  onExecute: () => void;
  onDismiss: () => void;
  onLearnMore: () => void;
}

export function TradeOfferModal({ offer, onExecute, onDismiss, onLearnMore }: TradeOfferModalProps) {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl max-w-md w-full mx-4 overflow-hidden">
        
        {/* Header with Trade Type Icon */}
        <div className={`p-4 ${getTradeTypeColor(offer.type)}`}>
          <div className="flex items-center gap-3">
            {getTradeTypeIcon(offer.type)}
            <div>
              <h2 className="text-lg font-bold text-white">
                {getTradeTypeTitle(offer.type)}
              </h2>
              <p className="text-white/80 text-sm">
                {getTradeTypeSubtitle(offer.type)}
              </p>
            </div>
          </div>
        </div>
        
        {/* Trade Details */}
        <div className="p-4 space-y-4">
          
          {/* What You're Trading */}
          {offer.sell && (
            <div className="flex items-center gap-3 p-3 bg-red-50 rounded-lg">
              <SigilImage ticker={offer.sell.ticker} percentChange={-5} size={48} />
              <div className="flex-1">
                <div className="font-medium">SELL {offer.sell.ticker}</div>
                <div className="text-sm text-gray-500">
                  {offer.sell.shares} shares @ ${offer.sell.price}
                </div>
              </div>
              <div className="text-red-600 font-bold">
                -${offer.sell.total.toFixed(2)}
              </div>
            </div>
          )}
          
          {/* Arrow */}
          <div className="flex justify-center">
            <ArrowDownIcon className="w-6 h-6 text-gray-400" />
          </div>
          
          {/* What You're Getting */}
          <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
            <SigilImage ticker={offer.buy.ticker} percentChange={5} size={48} />
            <div className="flex-1">
              <div className="font-medium">BUY {offer.buy.ticker}</div>
              <div className="text-sm text-gray-500">
                {offer.buy.shares.toFixed(2)} shares @ ${offer.buy.price}
              </div>
            </div>
            <div className="text-green-600 font-bold">
              +${offer.buy.total.toFixed(2)}
            </div>
          </div>
          
          {/* Educational Box */}
          <div className="p-3 bg-blue-50 rounded-lg">
            <div className="flex items-start gap-2">
              <LightbulbIcon className="w-5 h-5 text-blue-500 mt-0.5" />
              <div>
                <div className="font-medium text-blue-900">Why This Trade?</div>
                <p className="text-sm text-blue-700 mt-1">
                  {offer.explanation}
                </p>
              </div>
            </div>
          </div>
          
          {/* Stats/Benefits */}
          {offer.stats && (
            <div className="grid grid-cols-2 gap-2">
              {offer.stats.map((stat, i) => (
                <div key={i} className="p-2 bg-gray-50 rounded text-center">
                  <div className="text-lg font-bold">{stat.value}</div>
                  <div className="text-xs text-gray-500">{stat.label}</div>
                </div>
              ))}
            </div>
          )}
        </div>
        
        {/* Actions */}
        <div className="p-4 border-t space-y-2">
          <button
            onClick={onExecute}
            className="w-full py-3 bg-green-500 text-white rounded-lg font-medium
                       hover:bg-green-600 transition-colors"
          >
            Execute Trade
          </button>
          <div className="flex gap-2">
            <button
              onClick={onLearnMore}
              className="flex-1 py-2 border rounded-lg text-gray-600 hover:bg-gray-50"
            >
              Learn More
            </button>
            <button
              onClick={onDismiss}
              className="flex-1 py-2 border rounded-lg text-gray-600 hover:bg-gray-50"
            >
              Not Now
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// Helper functions
function getTradeTypeColor(type: TradeType): string {
  switch (type) {
    case 'tax_loss_harvest': return 'bg-purple-500';
    case 'rebalance': return 'bg-blue-500';
    case 'oversold_opportunity': return 'bg-green-500';
    case 'pairs_trade': return 'bg-orange-500';
  }
}

function getTradeTypeTitle(type: TradeType): string {
  switch (type) {
    case 'tax_loss_harvest': return '🔄 Evolution Trade';
    case 'rebalance': return '⚖️ Habitat Balance';
    case 'oversold_opportunity': return '📉 Catch Opportunity';
    case 'pairs_trade': return '🔀 Convergence Trade';
  }
}
```

---

## TRADE OFFER ENGINE

```typescript
// lib/trade-offers/engine.ts

import { Portfolio, Holding, Stock, TradeOffer } from './types';

export class TradeOfferEngine {
  private portfolio: Portfolio;
  private marketData: Map<string, Stock>;
  
  constructor(portfolio: Portfolio, marketData: Map<string, Stock>) {
    this.portfolio = portfolio;
    this.marketData = marketData;
  }
  
  generateDailyOffers(): TradeOffer[] {
    const offers: TradeOffer[] = [];
    
    // 1. Check for Tax-Loss Harvest opportunities
    const taxLossOffer = this.checkTaxLossHarvest();
    if (taxLossOffer) offers.push(taxLossOffer);
    
    // 2. Check for Rebalance needs
    const rebalanceOffer = this.checkRebalance();
    if (rebalanceOffer) offers.push(rebalanceOffer);
    
    // 3. Check for Oversold opportunities
    const oversoldOffers = this.checkOversoldOpportunities();
    offers.push(...oversoldOffers.slice(0, 2)); // Max 2
    
    // 4. Check for Pairs Trade opportunities
    const pairsOffer = this.checkPairsTrades();
    if (pairsOffer) offers.push(pairsOffer);
    
    // Limit to 3 offers per day
    return this.prioritizeOffers(offers).slice(0, 3);
  }
  
  private checkTaxLossHarvest(): TradeOffer | null {
    for (const holding of this.portfolio.holdings) {
      const lossPercent = this.calculateLossPercent(holding);
      const lossAbsolute = this.calculateLossAbsolute(holding);
      
      if (lossPercent <= -10 && lossAbsolute >= 100) {
        const alternative = this.findSectorAlternative(holding.ticker);
        if (alternative && !this.isWashSaleRisk(holding)) {
          return {
            id: `tlh-${holding.ticker}-${Date.now()}`,
            type: 'tax_loss_harvest',
            priority: 1, // High priority
            sell: {
              ticker: holding.ticker,
              shares: holding.shares,
              price: holding.currentPrice,
              total: holding.shares * holding.currentPrice,
            },
            buy: {
              ticker: alternative.ticker,
              shares: (holding.shares * holding.currentPrice) / alternative.price,
              price: alternative.price,
              total: holding.shares * holding.currentPrice,
            },
            explanation: `Your ${holding.ticker} is down ${Math.abs(lossPercent).toFixed(1)}%. 
              Swap to ${alternative.ticker} to capture a $${Math.abs(lossAbsolute).toFixed(0)} 
              tax loss while staying in the ${alternative.sector} sector.`,
            stats: [
              { label: 'Tax Loss', value: `$${Math.abs(lossAbsolute).toFixed(0)}` },
              { label: 'Est. Tax Savings', value: `$${(Math.abs(lossAbsolute) * 0.15).toFixed(0)}` },
            ],
            expiresAt: this.getEndOfDay(),
          };
        }
      }
    }
    return null;
  }
  
  private checkRebalance(): TradeOffer | null {
    const totalValue = this.portfolio.holdings.reduce((sum, h) => 
      sum + (h.shares * h.currentPrice), 0
    );
    
    for (const holding of this.portfolio.holdings) {
      const currentWeight = (holding.shares * holding.currentPrice) / totalValue * 100;
      const targetWeight = 100 / this.portfolio.holdings.length;
      const drift = currentWeight - targetWeight;
      
      // 5/25 Rule: Rebalance if >5% drift for large positions
      if (currentWeight >= 20 && Math.abs(drift) >= 5) {
        const excessValue = (drift / 100) * totalValue;
        const underweightHoldings = this.portfolio.holdings
          .filter(h => {
            const weight = (h.shares * h.currentPrice) / totalValue * 100;
            return weight < targetWeight;
          });
        
        return {
          id: `rebal-${holding.ticker}-${Date.now()}`,
          type: 'rebalance',
          priority: 2,
          sell: {
            ticker: holding.ticker,
            shares: excessValue / holding.currentPrice,
            price: holding.currentPrice,
            total: excessValue,
          },
          buy: {
            ticker: underweightHoldings[0]?.ticker || 'CASH',
            shares: excessValue / (underweightHoldings[0]?.currentPrice || 1),
            price: underweightHoldings[0]?.currentPrice || 0,
            total: excessValue,
          },
          explanation: `${holding.ticker} has grown to ${currentWeight.toFixed(0)}% of your 
            portfolio (target: ${targetWeight.toFixed(0)}%). Trim the winner to reduce risk.`,
          stats: [
            { label: 'Current Weight', value: `${currentWeight.toFixed(0)}%` },
            { label: 'Drift from Target', value: `+${drift.toFixed(0)}%` },
          ],
          expiresAt: this.getEndOfDay(),
        };
      }
    }
    return null;
  }
  
  private checkOversoldOpportunities(): TradeOffer[] {
    const offers: TradeOffer[] = [];
    const availableStocks = Array.from(this.marketData.values())
      .filter(s => !this.portfolio.holdings.find(h => h.ticker === s.ticker));
    
    for (const stock of availableStocks) {
      const rsi = this.calculateRSI(stock.priceHistory);
      
      if (rsi <= 30) {
        offers.push({
          id: `oversold-${stock.ticker}-${Date.now()}`,
          type: 'oversold_opportunity',
          priority: 3,
          buy: {
            ticker: stock.ticker,
            shares: 100 / stock.price, // $100 default
            price: stock.price,
            total: 100,
          },
          explanation: `${stock.ticker} has RSI of ${rsi.toFixed(0)} (below 30 = oversold). 
            Historically, stocks at this level bounce back ${this.getHistoricalBounceRate(stock.ticker)}% of the time.`,
          stats: [
            { label: 'RSI', value: rsi.toFixed(0) },
            { label: 'Historical Bounce Rate', value: `${this.getHistoricalBounceRate(stock.ticker)}%` },
          ],
          expiresAt: this.getEndOfDay(),
        });
      }
    }
    
    return offers.sort((a, b) => 
      this.calculateRSI(this.marketData.get(a.buy!.ticker)!.priceHistory) -
      this.calculateRSI(this.marketData.get(b.buy!.ticker)!.priceHistory)
    );
  }
  
  private checkPairsTrades(): TradeOffer | null {
    for (const holding of this.portfolio.holdings) {
      const pairs = CORRELATED_PAIRS[holding.ticker] || [];
      
      for (const { pair, correlation } of pairs) {
        const pairStock = this.marketData.get(pair);
        if (!pairStock || correlation < 0.8) continue;
        
        const zScore = this.calculateSpreadZScore(
          [holding.currentPrice], // Simplified
          [pairStock.price]
        );
        
        if (zScore >= 2) { // Holding outperforming pair
          return {
            id: `pairs-${holding.ticker}-${pair}-${Date.now()}`,
            type: 'pairs_trade',
            priority: 2,
            sell: {
              ticker: holding.ticker,
              shares: holding.shares,
              price: holding.currentPrice,
              total: holding.shares * holding.currentPrice,
            },
            buy: {
              ticker: pair,
              shares: (holding.shares * holding.currentPrice) / pairStock.price,
              price: pairStock.price,
              total: holding.shares * holding.currentPrice,
            },
            explanation: `${holding.ticker} and ${pair} usually move together (${(correlation * 100).toFixed(0)}% correlated), 
              but ${holding.ticker} is ahead. The spread is ${zScore.toFixed(1)} standard deviations wide - 
              historically this converges within 30 days.`,
            stats: [
              { label: 'Correlation', value: `${(correlation * 100).toFixed(0)}%` },
              { label: 'Spread Z-Score', value: zScore.toFixed(1) },
            ],
            expiresAt: this.getEndOfDay(),
          };
        }
      }
    }
    return null;
  }
  
  private prioritizeOffers(offers: TradeOffer[]): TradeOffer[] {
    return offers.sort((a, b) => a.priority - b.priority);
  }
  
  // Helper methods
  private calculateLossPercent(holding: Holding): number {
    return ((holding.currentPrice - holding.avgCost) / holding.avgCost) * 100;
  }
  
  private calculateLossAbsolute(holding: Holding): number {
    return (holding.avgCost - holding.currentPrice) * holding.shares;
  }
  
  private calculateRSI(prices: number[]): number {
    // Implementation from above
    return 50; // Placeholder
  }
  
  private calculateSpreadZScore(pricesA: number[], pricesB: number[]): number {
    // Implementation from above
    return 0; // Placeholder
  }
  
  private findSectorAlternative(ticker: string): Stock | null {
    // Find a stock in the same sector that's not the same stock
    const sector = this.getSector(ticker);
    const alternatives = SECTOR_ALTERNATIVES[sector] || [];
    
    for (const alt of alternatives) {
      if (alt !== ticker && this.marketData.has(alt)) {
        return this.marketData.get(alt)!;
      }
    }
    return null;
  }
  
  private getSector(ticker: string): string {
    const sectorMap: Record<string, string> = {
      'AMD': 'semiconductors',
      'NVDA': 'semiconductors',
      'INTC': 'semiconductors',
      'AMZN': 'mega_tech',
      'GOOGL': 'mega_tech',
      'TSLA': 'ev_growth',
      'NFLX': 'streaming',
      'PLTR': 'data_analytics',
    };
    return sectorMap[ticker] || 'general';
  }
  
  private isWashSaleRisk(holding: Holding): boolean {
    // Check if bought in last 30 days
    const thirtyDaysAgo = Date.now() - (30 * 24 * 60 * 60 * 1000);
    return holding.lastPurchaseDate > thirtyDaysAgo;
  }
  
  private getHistoricalBounceRate(ticker: string): number {
    // Placeholder - would be calculated from historical data
    return 72;
  }
  
  private getEndOfDay(): Date {
    const now = new Date();
    now.setHours(23, 59, 59, 999);
    return now;
  }
}
```

---

## API ROUTES

```typescript
// app/api/trade-offers/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { TradeOfferEngine } from '@/lib/trade-offers/engine';
import { getPortfolio, getMarketData } from '@/lib/data';

export async function GET(request: NextRequest) {
  const walletAddress = request.headers.get('x-wallet-address');
  if (!walletAddress) {
    return NextResponse.json({ error: 'No wallet connected' }, { status: 401 });
  }
  
  const portfolio = await getPortfolio(walletAddress);
  const marketData = await getMarketData();
  
  const engine = new TradeOfferEngine(portfolio, marketData);
  const offers = engine.generateDailyOffers();
  
  return NextResponse.json({ offers });
}

// app/api/trade-offers/[id]/execute/route.ts

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const walletAddress = request.headers.get('x-wallet-address');
  const { offerId } = params;
  
  // 1. Validate offer still valid
  // 2. Execute the trade on Robinhood Chain
  // 3. Update portfolio
  // 4. Mark offer as completed
  
  return NextResponse.json({ success: true, txHash: '0x...' });
}
```

---

## REACT HOOK

```typescript
// hooks/useTradeOffers.ts

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAccount } from 'wagmi';

export function useTradeOffers() {
  const { address } = useAccount();
  const queryClient = useQueryClient();
  
  const { data: offers, isLoading } = useQuery({
    queryKey: ['trade-offers', address],
    queryFn: async () => {
      const res = await fetch('/api/trade-offers', {
        headers: { 'x-wallet-address': address! },
      });
      const data = await res.json();
      return data.offers;
    },
    enabled: !!address,
    refetchInterval: 60000, // Refresh every minute
  });
  
  const executeTrade = useMutation({
    mutationFn: async (offerId: string) => {
      const res = await fetch(`/api/trade-offers/${offerId}/execute`, {
        method: 'POST',
        headers: { 'x-wallet-address': address! },
      });
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['trade-offers'] });
      queryClient.invalidateQueries({ queryKey: ['portfolio'] });
    },
  });
  
  const dismissOffer = useMutation({
    mutationFn: async (offerId: string) => {
      const res = await fetch(`/api/trade-offers/${offerId}/dismiss`, {
        method: 'POST',
        headers: { 'x-wallet-address': address! },
      });
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['trade-offers'] });
    },
  });
  
  return {
    offers: offers || [],
    isLoading,
    executeTrade,
    dismissOffer,
    hasOffers: (offers?.length || 0) > 0,
  };
}
```

---

## GAMIFICATION LANGUAGE

| Financial Term | Stocklings Term | Explanation |
|----------------|-----------------|-------------|
| Tax-Loss Harvest | Evolution Trade | "Your Stockling evolves into a similar creature!" |
| Rebalance | Habitat Balance | "Keep your habitat in harmony" |
| Oversold (RSI<30) | Catch Opportunity | "A wild Stockling appeared! It's weakened!" |
| Pairs Trade | Convergence Trade | "Trade with another trainer for a better match" |
| Wash Sale Rule | 30-Day Cooldown | "You must wait before re-catching this Stockling" |
| Standard Deviation | Spread Width | "How far apart the pair has drifted" |

---

## DISCLAIMERS (Required)

Every trade offer must include:

```tsx
<p className="text-xs text-gray-400 mt-4">
  This is not financial advice. Past performance does not guarantee future results. 
  All trades involve risk of loss. The indicators shown (RSI, correlation, etc.) are 
  educational and should not be the sole basis for investment decisions. Consider 
  consulting a financial advisor. Tax implications vary by jurisdiction.
</p>
```

---

## IMPLEMENTATION ORDER

1. **Phase 1: Data Layer**
   - Add RSI calculation to market data
   - Add correlation data for stock pairs
   - Track user purchase dates (wash sale)

2. **Phase 2: Trade Engine**
   - Implement TradeOfferEngine class
   - Create offer generation logic for each type
   - Add prioritization and limits

3. **Phase 3: UI Components**
   - TradeOfferBell (notification icon)
   - TradeOfferModal (offer detail + execution)
   - Learn More pages for each strategy

4. **Phase 4: Execution**
   - Connect to Robinhood Chain for trades
   - Implement atomic swap (sell + buy)
   - Transaction confirmation flow

5. **Phase 5: Polish**
   - Animations (offer appearing, trade executing)
   - Sound effects (Pokemon trade sounds?)
   - Achievement system ("First Evolution Trade!")

---

## START COMMAND FOR CLAUDE CODE

```
Read docs/TRADE_OFFERS_SPEC.md and implement the Trade Offers feature.

Start with:
1. Create lib/trade-offers/engine.ts with the TradeOfferEngine class
2. Implement the 4 trade types (tax-loss, rebalance, oversold, pairs)
3. Create the UI components (TradeOfferBell, TradeOfferModal)
4. Add the API routes
5. Wire up the useTradeOffers hook

The trade logic must follow the formulas in the spec - these are based on 
real financial models (5/25 Rule, RSI, Pairs Trading, Tax-Loss Harvesting).
```
