// TradeOfferEngine - Generates trade offers based on proven financial models

import {
  Portfolio,
  Holding,
  Stock,
  TradeOffer,
  CORRELATED_PAIRS,
  SECTOR_ALTERNATIVES,
  TICKER_TO_SECTOR,
} from './types';

export class TradeOfferEngine {
  private portfolio: Portfolio;
  private marketData: Map<string, Stock>;
  private idCounter: number = 0;

  constructor(portfolio: Portfolio, marketData: Map<string, Stock>) {
    this.portfolio = portfolio;
    this.marketData = marketData;
  }

  private generateId(prefix: string): string {
    this.idCounter++;
    return `${prefix}-${Date.now()}-${this.idCounter}-${Math.random().toString(36).slice(2, 8)}`;
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

    // Limit to 3 offers per day, sorted by priority
    return this.prioritizeOffers(offers).slice(0, 3);
  }

  private checkTaxLossHarvest(): TradeOffer | null {
    for (const holding of this.portfolio.holdings) {
      const lossPercent = this.calculateLossPercent(holding);
      const lossAbsolute = this.calculateLossAbsolute(holding);

      if (lossPercent <= -10 && lossAbsolute >= 100) {
        const alternative = this.findSectorAlternative(holding.ticker);
        if (alternative && !this.isWashSaleRisk(holding)) {
          const sellTotal = holding.shares * holding.currentPrice;
          return {
            id: this.generateId(`tlh-${holding.ticker}`),
            type: 'tax_loss_harvest',
            priority: 1,
            sell: {
              ticker: holding.ticker,
              shares: holding.shares,
              price: holding.currentPrice,
              total: sellTotal,
            },
            buy: {
              ticker: alternative.ticker,
              shares: sellTotal / alternative.price,
              price: alternative.price,
              total: sellTotal,
            },
            explanation: `Your ${holding.ticker} is down ${Math.abs(lossPercent).toFixed(1)}%. Swap to ${alternative.ticker} to capture a $${Math.abs(lossAbsolute).toFixed(0)} tax loss while staying in the ${this.getSector(holding.ticker)} sector.`,
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
    const totalValue = this.portfolio.holdings.reduce(
      (sum, h) => sum + h.shares * h.currentPrice,
      0
    );

    if (totalValue === 0) return null;

    for (const holding of this.portfolio.holdings) {
      const currentWeight = ((holding.shares * holding.currentPrice) / totalValue) * 100;
      const targetWeight = 100 / this.portfolio.holdings.length;
      const drift = currentWeight - targetWeight;

      // 5/25 Rule: Rebalance if >5% drift for large positions
      if (currentWeight >= 20 && Math.abs(drift) >= 5) {
        const excessValue = (drift / 100) * totalValue;
        const underweightHoldings = this.portfolio.holdings.filter((h) => {
          const weight = ((h.shares * h.currentPrice) / totalValue) * 100;
          return weight < targetWeight && h.ticker !== holding.ticker;
        });

        if (underweightHoldings.length === 0) continue;

        const buyTarget = underweightHoldings[0];
        return {
          id: this.generateId(`rebal-${holding.ticker}`),
          type: 'rebalance',
          priority: 2,
          sell: {
            ticker: holding.ticker,
            shares: excessValue / holding.currentPrice,
            price: holding.currentPrice,
            total: excessValue,
          },
          buy: {
            ticker: buyTarget.ticker,
            shares: excessValue / buyTarget.currentPrice,
            price: buyTarget.currentPrice,
            total: excessValue,
          },
          explanation: `${holding.ticker} has grown to ${currentWeight.toFixed(0)}% of your portfolio (target: ${targetWeight.toFixed(0)}%). Trim the winner to reduce concentration risk.`,
          stats: [
            { label: 'Current Weight', value: `${currentWeight.toFixed(0)}%` },
            { label: 'Drift from Target', value: `+${drift.toFixed(0)}%` },
          ],
          expiresAt: this.getEndOfDay(),
        };
      }

      // 25% relative rule for smaller positions
      if (targetWeight < 20) {
        const relativeDrift = (drift / targetWeight) * 100;
        if (Math.abs(relativeDrift) >= 25 && drift > 0) {
          const excessValue = (drift / 100) * totalValue;
          const underweightHoldings = this.portfolio.holdings.filter((h) => {
            const weight = ((h.shares * h.currentPrice) / totalValue) * 100;
            return weight < targetWeight && h.ticker !== holding.ticker;
          });

          if (underweightHoldings.length === 0) continue;

          const buyTarget = underweightHoldings[0];
          return {
            id: this.generateId(`rebal-${holding.ticker}`),
            type: 'rebalance',
            priority: 2,
            sell: {
              ticker: holding.ticker,
              shares: excessValue / holding.currentPrice,
              price: holding.currentPrice,
              total: excessValue,
            },
            buy: {
              ticker: buyTarget.ticker,
              shares: excessValue / buyTarget.currentPrice,
              price: buyTarget.currentPrice,
              total: excessValue,
            },
            explanation: `${holding.ticker} has drifted ${relativeDrift.toFixed(0)}% from its target allocation. Time to rebalance.`,
            stats: [
              { label: 'Current Weight', value: `${currentWeight.toFixed(0)}%` },
              { label: 'Relative Drift', value: `${relativeDrift.toFixed(0)}%` },
            ],
            expiresAt: this.getEndOfDay(),
          };
        }
      }
    }
    return null;
  }

  private checkOversoldOpportunities(): TradeOffer[] {
    const offers: TradeOffer[] = [];
    const holdingTickers = new Set(this.portfolio.holdings.map((h) => h.ticker));

    // Check all available stocks not in portfolio
    for (const [ticker, stock] of this.marketData) {
      if (holdingTickers.has(ticker)) continue;

      const rsi = this.calculateRSI(stock.priceHistory);

      if (rsi <= 30) {
        const bounceRate = this.getHistoricalBounceRate(ticker);
        offers.push({
          id: this.generateId(`oversold-${ticker}`),
          type: 'oversold_opportunity',
          priority: 3,
          buy: {
            ticker: stock.ticker,
            shares: 100 / stock.price,
            price: stock.price,
            total: 100,
          },
          explanation: `${stock.ticker} has RSI of ${rsi.toFixed(0)} (below 30 = oversold). Historically, stocks at this level bounce back ${bounceRate}% of the time.`,
          stats: [
            { label: 'RSI', value: rsi.toFixed(0) },
            { label: 'Historical Bounce', value: `${bounceRate}%` },
          ],
          expiresAt: this.getEndOfDay(),
        });
      }
    }

    // Sort by lowest RSI first (most oversold)
    return offers.sort((a, b) => {
      const rsiA = this.calculateRSI(this.marketData.get(a.buy.ticker)?.priceHistory || []);
      const rsiB = this.calculateRSI(this.marketData.get(b.buy.ticker)?.priceHistory || []);
      return rsiA - rsiB;
    });
  }

  private checkPairsTrades(): TradeOffer | null {
    for (const holding of this.portfolio.holdings) {
      const pairs = CORRELATED_PAIRS[holding.ticker] || [];

      for (const { pair, correlation } of pairs) {
        const pairStock = this.marketData.get(pair);
        if (!pairStock || correlation < 0.8) continue;

        // Use price history if available, otherwise use current prices
        const holdingHistory = holding.priceHistory.length > 0
          ? holding.priceHistory
          : [holding.currentPrice];
        const pairHistory = pairStock.priceHistory.length > 0
          ? pairStock.priceHistory
          : [pairStock.price];

        const zScore = this.calculateSpreadZScore(holdingHistory, pairHistory);

        if (zScore >= 2) {
          // Holding is outperforming pair
          const sellTotal = holding.shares * holding.currentPrice;
          return {
            id: this.generateId(`pairs-${holding.ticker}-${pair}`),
            type: 'pairs_trade',
            priority: 2,
            sell: {
              ticker: holding.ticker,
              shares: holding.shares,
              price: holding.currentPrice,
              total: sellTotal,
            },
            buy: {
              ticker: pair,
              shares: sellTotal / pairStock.price,
              price: pairStock.price,
              total: sellTotal,
            },
            explanation: `${holding.ticker} and ${pair} usually move together (${(correlation * 100).toFixed(0)}% correlated), but ${holding.ticker} is ahead. The spread is ${zScore.toFixed(1)} standard deviations wide - historically this converges within 30 days.`,
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

  /**
   * RSI Calculation (14-day standard)
   * RSI = 100 - (100 / (1 + RS))
   * RS = Average Gain / Average Loss
   */
  private calculateRSI(prices: number[]): number {
    if (prices.length < 15) {
      // Not enough data, return neutral
      return 50;
    }

    const period = 14;
    const changes = prices.slice(1).map((p, i) => p - prices[i]);
    const recentChanges = changes.slice(-period);

    let gains = 0;
    let losses = 0;

    for (const change of recentChanges) {
      if (change > 0) {
        gains += change;
      } else {
        losses += Math.abs(change);
      }
    }

    const avgGain = gains / period;
    const avgLoss = losses / period;

    if (avgLoss === 0) return 100; // All gains

    const rs = avgGain / avgLoss;
    const rsi = 100 - 100 / (1 + rs);

    return rsi;
  }

  /**
   * Calculate Z-Score for spread between two price series
   * Z-Score = (Current Spread - Mean Spread) / Standard Deviation
   */
  private calculateSpreadZScore(pricesA: number[], pricesB: number[]): number {
    const lookback = Math.min(60, pricesA.length, pricesB.length);
    if (lookback < 2) return 0;

    const spreads: number[] = [];
    for (let i = pricesA.length - lookback; i < pricesA.length; i++) {
      const aIndex = i;
      const bIndex = i - (pricesA.length - pricesB.length);
      if (bIndex >= 0 && bIndex < pricesB.length && pricesB[bIndex] !== 0) {
        spreads.push(pricesA[aIndex] / pricesB[bIndex]);
      }
    }

    if (spreads.length < 2) return 0;

    const mean = spreads.reduce((sum, s) => sum + s, 0) / spreads.length;
    const variance =
      spreads.reduce((sum, s) => sum + Math.pow(s - mean, 2), 0) / spreads.length;
    const stdDev = Math.sqrt(variance);

    if (stdDev === 0) return 0;

    const currentSpread = pricesA[pricesA.length - 1] / pricesB[pricesB.length - 1];
    const zScore = (currentSpread - mean) / stdDev;

    return zScore;
  }

  private findSectorAlternative(ticker: string): Stock | null {
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
    return TICKER_TO_SECTOR[ticker] || 'general';
  }

  private isWashSaleRisk(holding: Holding): boolean {
    // Check if bought in last 30 days
    const thirtyDaysAgo = Date.now() - 30 * 24 * 60 * 60 * 1000;
    return holding.lastPurchaseDate > thirtyDaysAgo;
  }

  private getHistoricalBounceRate(ticker: string): number {
    // Historical bounce rates (would be calculated from real data)
    const bounceRates: Record<string, number> = {
      NVDA: 78,
      TSLA: 65,
      AAPL: 82,
      AMZN: 75,
      NFLX: 68,
      AMD: 71,
      PLTR: 63,
    };
    return bounceRates[ticker] || 72;
  }

  private getEndOfDay(): Date {
    const now = new Date();
    now.setHours(23, 59, 59, 999);
    return now;
  }
}

// Export a function to create mock portfolio and market data for testing
export function createMockData(): { portfolio: Portfolio; marketData: Map<string, Stock> } {
  const portfolio: Portfolio = {
    walletAddress: '0x1234...5678',
    holdings: [
      {
        ticker: 'TSLA',
        shares: 10,
        avgCost: 280,
        currentPrice: 248.50,
        lastPurchaseDate: Date.now() - 60 * 24 * 60 * 60 * 1000, // 60 days ago
        priceHistory: generateMockPriceHistory(280, 248.50, 60),
      },
      {
        ticker: 'NVDA',
        shares: 5,
        avgCost: 850,
        currentPrice: 1050,
        lastPurchaseDate: Date.now() - 90 * 24 * 60 * 60 * 1000,
        priceHistory: generateMockPriceHistory(850, 1050, 60),
      },
      {
        ticker: 'AAPL',
        shares: 20,
        avgCost: 175,
        currentPrice: 182,
        lastPurchaseDate: Date.now() - 45 * 24 * 60 * 60 * 1000,
        priceHistory: generateMockPriceHistory(175, 182, 60),
      },
      {
        ticker: 'AMD',
        shares: 15,
        avgCost: 190,
        currentPrice: 155, // Down ~18%
        lastPurchaseDate: Date.now() - 35 * 24 * 60 * 60 * 1000,
        priceHistory: generateMockPriceHistory(190, 155, 60),
      },
    ],
    totalValue: 0,
  };

  portfolio.totalValue = portfolio.holdings.reduce(
    (sum, h) => sum + h.shares * h.currentPrice,
    0
  );

  const marketData = new Map<string, Stock>();

  // Add stocks to market data
  const stocks: Stock[] = [
    { ticker: 'TSLA', name: 'Tesla', price: 248.50, priceHistory: [], sector: 'ev_growth' },
    { ticker: 'NVDA', name: 'NVIDIA', price: 1050, priceHistory: [], sector: 'semiconductors' },
    { ticker: 'AAPL', name: 'Apple', price: 182, priceHistory: [], sector: 'consumer_tech' },
    { ticker: 'AMD', name: 'AMD', price: 155, priceHistory: [], sector: 'semiconductors' },
    { ticker: 'AMZN', name: 'Amazon', price: 185, priceHistory: [], sector: 'mega_tech' },
    { ticker: 'GOOGL', name: 'Google', price: 165, priceHistory: [], sector: 'mega_tech' },
    { ticker: 'NFLX', name: 'Netflix', price: 178, priceHistory: generateOversoldHistory(178), sector: 'streaming' },
    { ticker: 'PLTR', name: 'Palantir', price: 22, priceHistory: [], sector: 'data_analytics' },
    { ticker: 'MSFT', name: 'Microsoft', price: 415, priceHistory: [], sector: 'mega_tech' },
    { ticker: 'INTC', name: 'Intel', price: 32, priceHistory: [], sector: 'semiconductors' },
  ];

  for (const stock of stocks) {
    if (stock.priceHistory.length === 0) {
      stock.priceHistory = generateMockPriceHistory(stock.price * 0.95, stock.price, 60);
    }
    marketData.set(stock.ticker, stock);
  }

  return { portfolio, marketData };
}

function generateMockPriceHistory(startPrice: number, endPrice: number, days: number): number[] {
  const history: number[] = [];
  const dailyChange = (endPrice - startPrice) / days;

  for (let i = 0; i < days; i++) {
    const basePrice = startPrice + dailyChange * i;
    // Add some random noise
    const noise = basePrice * (Math.random() * 0.04 - 0.02);
    history.push(basePrice + noise);
  }
  history.push(endPrice);

  return history;
}

function generateOversoldHistory(currentPrice: number): number[] {
  // Generate history that results in RSI < 30 (consistent losses)
  const history: number[] = [];
  let price = currentPrice * 1.25; // Start 25% higher

  for (let i = 0; i < 20; i++) {
    history.push(price);
    // Consistent downward movement
    price = price * (1 - 0.01 - Math.random() * 0.01);
  }
  history.push(currentPrice);

  return history;
}
