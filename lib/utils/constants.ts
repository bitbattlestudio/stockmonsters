// API Base URLs
export const DATA_API_BASE = 'https://data-api.polymarket.com';
export const CLOB_API_BASE = 'https://clob.polymarket.com';
export const GAMMA_API_BASE = 'https://gamma-api.polymarket.com';

// Evolution thresholds (price ranges)
export const EVOLUTION_THRESHOLDS = {
  level1: { min: 0, max: 0.33 },    // 0-33¢
  level2: { min: 0.33, max: 0.66 }, // 33-66¢
  level3: { min: 0.66, max: 1.0 },  // 66-100¢
} as const;

import type { IconName } from '@/components/PixelIcon';

// Category to creature mapping
export const CATEGORY_CREATURES: Record<string, {
  evolutions: readonly string[];
  baseSprite: string;
  icon: IconName;
}> = {
  politics: {
    evolutions: ['Pollster', 'Caucus', 'Senator'],
    baseSprite: 'eagle',
    icon: 'vote',
  },
  crypto: {
    evolutions: ['Hashling', 'Blockbit', 'Chainlord'],
    baseSprite: 'crystal',
    icon: 'diamond',
  },
  sports: {
    evolutions: ['Rookie', 'Varsity', 'MVP'],
    baseSprite: 'fox',
    icon: 'target',
  },
  macro: {
    evolutions: ['Yield', 'Dividend', 'Reserve'],
    baseSprite: 'turtle',
    icon: 'bank',
  },
  tech: {
    evolutions: ['Byte', 'Megabyte', 'Quantum'],
    baseSprite: 'robot',
    icon: 'chart',
  },
  space: {
    evolutions: ['Orbit', 'Nova', 'Cosmos'],
    baseSprite: 'moth',
    icon: 'rocket',
  },
  geo: {
    evolutions: ['Scout', 'Atlas', 'Sovereign'],
    baseSprite: 'owl',
    icon: 'target',
  },
} as const;

// Category detection keywords
export const CATEGORY_KEYWORDS = {
  politics: ['election', 'president', 'congress', 'vote', 'trump', 'biden', 'senate', 'house', 'governor', 'mayor', 'democrat', 'republican'],
  crypto: ['bitcoin', 'btc', 'ethereum', 'eth', 'crypto', 'blockchain', 'defi', 'nft', 'token', 'solana', 'dogecoin'],
  sports: ['nfl', 'nba', 'mlb', 'nhl', 'super bowl', 'championship', 'world series', 'playoffs', 'mvp', 'olympics', 'soccer', 'football'],
  macro: ['fed', 'interest rate', 'inflation', 'gdp', 'recession', 'unemployment', 'treasury', 'rate cut', 'rate hike'],
  tech: ['apple', 'google', 'microsoft', 'ai', 'artificial intelligence', 'iphone', 'software', 'openai', 'meta'],
  space: ['spacex', 'nasa', 'rocket', 'mars', 'moon', 'satellite', 'starship', 'astronaut', 'ipo'],
  geo: ['china', 'russia', 'ukraine', 'war', 'nato', 'taiwan', 'israel', 'conflict', 'iran'],
} as const;

// Default color palette (used as fallback)
export const DEFAULT_COLORS = {
  primary: '#6898F8',
  secondary: '#88B8F8',
  accent: '#A8D8F8',
  shadow: '#4878D8',
} as const;

// Points configuration (for future use)
export const POINTS_CONFIG = {
  evolution: {
    toLevel2: 100,
    toLevel3: 250,
  },
  trade: {
    buy: 10,
    sell: 10,
  },
  win: {
    resolved: 500,
  },
  streak: {
    daily: 25,
    weekly: 100,
  },
} as const;
