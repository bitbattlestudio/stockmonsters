// lib/sigils/index.ts

import { generateSigilPrompt, generateSimplePrompt } from './generator';
import { generateWithPixelLab, getDownloadUrl } from './pixellab';
import { getCachedSigil, cacheSigil, cacheSigilFromBase64 } from './cache';
import { getStateFromPerformance, PerformanceState, getStateName, getStateColor } from './states';
import { getObjectConfig, detectMarketCategory, STOCK_MAPPINGS, MARKET_CATEGORY_MAPPINGS } from './mappings';

// Re-export types and utilities
export * from './mappings';
export * from './prompts';
export * from './states';
export * from './generator';
export * from './pixellab';
export * from './cache';

export interface GetSigilParams {
  identifier: string; // Ticker or market ID
  percentChange: number; // -50 to +100 etc
  type?: 'stock' | 'market';
  marketTitle?: string; // For prediction markets
  forceRegenerate?: boolean;
}

export interface SigilInfo {
  identifier: string;
  state: PerformanceState;
  stateName: string;
  stateColor: string;
  prompt: string;
  cached: boolean;
  url?: string;
}

/**
 * Get sigil URL, generating if needed
 */
export async function getSigilUrl(params: GetSigilParams): Promise<string> {
  const {
    identifier,
    percentChange,
    type = 'stock',
    marketTitle,
    forceRegenerate = false,
  } = params;

  // Calculate state from performance
  const state = getStateFromPerformance(percentChange);

  // Check cache first
  if (!forceRegenerate) {
    const cached = await getCachedSigil(identifier, state, type);
    if (cached) {
      console.log(`Cache hit: ${identifier} state ${state}`);
      return cached;
    }
  }

  // Generate new sigil
  console.log(`Generating: ${identifier} state ${state}`);
  const prompt = generateSigilPrompt(identifier, state, type, marketTitle);
  const pixelLabUrl = await generateWithPixelLab(prompt);

  // Cache and return
  const cachedUrl = await cacheSigil(identifier, state, type, pixelLabUrl);
  return cachedUrl;
}

/**
 * Get sigil info without generating
 */
export function getSigilInfo(params: Omit<GetSigilParams, 'forceRegenerate'>): SigilInfo {
  const { identifier, percentChange, type = 'stock', marketTitle } = params;

  const state = getStateFromPerformance(percentChange);
  const prompt = generateSimplePrompt(identifier, state, type, marketTitle);

  return {
    identifier,
    state,
    stateName: getStateName(state),
    stateColor: getStateColor(state),
    prompt,
    cached: false, // Would need async check
  };
}

/**
 * Batch generation for pre-generating top stocks
 */
export async function preGenerateSigils(
  tickers: string[],
  states: PerformanceState[] = [1, 2, 3, 4, 5]
): Promise<void> {
  for (const ticker of tickers) {
    for (const state of states) {
      try {
        console.log(`\n=== Generating ${ticker} state ${state} ===`);
        const prompt = generateSigilPrompt(ticker, state, 'stock');
        const url = await generateWithPixelLab(prompt);
        await cacheSigil(ticker, state, 'stock', url);
        console.log(`Done: ${ticker} state ${state}`);

        // Rate limiting - wait between generations
        await new Promise((r) => setTimeout(r, 10000));
      } catch (error) {
        console.error(`Failed: ${ticker} state ${state}`, error);
      }
    }
  }
}

/**
 * Get all available stock mappings
 */
export function getAvailableStocks(): string[] {
  return Object.keys(STOCK_MAPPINGS);
}

/**
 * Get all market categories
 */
export function getMarketCategories(): string[] {
  return Object.keys(MARKET_CATEGORY_MAPPINGS);
}

/**
 * Check if a stock has a custom mapping
 */
export function hasCustomMapping(ticker: string): boolean {
  return ticker.toUpperCase() in STOCK_MAPPINGS;
}
