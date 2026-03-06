// lib/sigils/mappings.ts

export type ObjectType =
  | 'apple-fruit'
  | 'battery'
  | 'cardboard-box'
  | 'magnifying-glass'
  | 'green-crystal'
  | 'red-crystal'
  | 'window-screen'
  | 'vr-goggles'
  | 'tv-screen'
  | 'coffee-cup'
  | 'sneaker'
  | 'credit-card'
  | 'bank-building'
  | 'gold-coin'
  | 'blue-coin'
  | 'diamond'
  | 'shopping-bag'
  | 'pill-capsule'
  | 'oil-barrel'
  | 'lightning-bolt'
  | 'castle'
  | 'fries'
  | 'soda-cup'
  | 'rocket'
  | 'globe'
  | 'crystal-ball'
  | 'trophy'
  | 'ballot-box'
  | 'chart-generic'
  | 'cloud'
  | 'paint-palette'
  | 'gear';

export interface ObjectConfig {
  type: ObjectType;
  colors: {
    primary: string;
    secondary: string;
    accent: string;
  };
  props?: string; // Additional items to include
}

// ============================================
// TOP 100 STOCKS - MANUAL CURATION
// ============================================

export const STOCK_MAPPINGS: Record<string, ObjectConfig> = {
  // === TECH ===
  AAPL: {
    type: 'apple-fruit',
    colors: { primary: '#A2AAAD', secondary: '#555555', accent: '#86868B' },
    props: 'tiny iPhone nearby',
  },
  MSFT: {
    type: 'window-screen',
    colors: { primary: '#00A4EF', secondary: '#7FBA00', accent: '#F25022' },
    props: 'tiny keyboard nearby',
  },
  GOOGL: {
    type: 'magnifying-glass',
    colors: { primary: '#4285F4', secondary: '#EA4335', accent: '#FBBC05' },
    props: 'tiny search bar nearby',
  },
  GOOG: {
    type: 'magnifying-glass',
    colors: { primary: '#4285F4', secondary: '#EA4335', accent: '#FBBC05' },
    props: 'tiny search bar nearby',
  },
  AMZN: {
    type: 'cardboard-box',
    colors: { primary: '#FF9900', secondary: '#232F3E', accent: '#FEBD69' },
    props: 'tiny shipping tape nearby',
  },
  NVDA: {
    type: 'green-crystal',
    colors: { primary: '#76B900', secondary: '#1A1A1A', accent: '#BFFF00' },
    props: 'tiny circuit board nearby',
  },
  META: {
    type: 'vr-goggles',
    colors: { primary: '#0082FB', secondary: '#FFFFFF', accent: '#00D4FF' },
    props: 'tiny infinity symbol nearby',
  },
  TSLA: {
    type: 'battery',
    colors: { primary: '#CC0000', secondary: '#FFFFFF', accent: '#10B981' },
    props: 'tiny electric car nearby',
  },
  NFLX: {
    type: 'tv-screen',
    colors: { primary: '#E50914', secondary: '#221F1F', accent: '#FFFFFF' },
    props: 'tiny remote control nearby',
  },
  AMD: {
    type: 'red-crystal',
    colors: { primary: '#ED1C24', secondary: '#1A1A1A', accent: '#FF6B6B' },
    props: 'tiny flame effect nearby',
  },
  PLTR: {
    type: 'blue-coin',
    colors: { primary: '#1D1D1D', secondary: '#FFFFFF', accent: '#3B82F6' },
    props: 'tiny data hexagon nearby',
  },
  INTC: {
    type: 'green-crystal', // Blue variant
    colors: { primary: '#0071C5', secondary: '#1A1A1A', accent: '#00BFFF' },
    props: 'tiny snowflake nearby',
  },
  CRM: {
    type: 'cloud',
    colors: { primary: '#00A1E0', secondary: '#FFFFFF', accent: '#1798C1' },
    props: 'tiny data nodes nearby',
  },
  ORCL: {
    type: 'red-crystal',
    colors: { primary: '#C74634', secondary: '#1A1A1A', accent: '#FF6B4A' },
    props: 'tiny database icon nearby',
  },
  ADBE: {
    type: 'paint-palette',
    colors: { primary: '#FF0000', secondary: '#1A1A1A', accent: '#FF4444' },
    props: 'tiny brush nearby',
  },

  // === FINANCE ===
  JPM: {
    type: 'bank-building',
    colors: { primary: '#117ACA', secondary: '#FFFFFF', accent: '#0A5CA8' },
    props: 'tiny vault door nearby',
  },
  V: {
    type: 'credit-card',
    colors: { primary: '#1A1F71', secondary: '#F7B600', accent: '#FFFFFF' },
    props: 'tiny payment wave nearby',
  },
  MA: {
    type: 'credit-card',
    colors: { primary: '#EB001B', secondary: '#F79E1B', accent: '#FF5F00' },
    props: 'tiny payment wave nearby',
  },
  BAC: {
    type: 'bank-building',
    colors: { primary: '#012169', secondary: '#E31837', accent: '#FFFFFF' },
    props: 'tiny flag nearby',
  },
  WFC: {
    type: 'bank-building',
    colors: { primary: '#D71E28', secondary: '#FFCD11', accent: '#FFFFFF' },
    props: 'tiny stagecoach nearby',
  },
  GS: {
    type: 'bank-building',
    colors: { primary: '#7399C6', secondary: '#1A1A1A', accent: '#FFFFFF' },
    props: 'tiny column nearby',
  },

  // === CRYPTO ===
  BTC: {
    type: 'gold-coin',
    colors: { primary: '#F7931A', secondary: '#FFFFFF', accent: '#FFAD33' },
    props: 'tiny blockchain cube nearby',
  },
  ETH: {
    type: 'diamond',
    colors: { primary: '#627EEA', secondary: '#FFFFFF', accent: '#8C9EFF' },
    props: 'tiny gas flame nearby',
  },
  COIN: {
    type: 'blue-coin',
    colors: { primary: '#0052FF', secondary: '#FFFFFF', accent: '#4D8AFF' },
    props: 'tiny chart nearby',
  },

  // === CONSUMER ===
  KO: {
    type: 'soda-cup',
    colors: { primary: '#F40009', secondary: '#FFFFFF', accent: '#FF4444' },
    props: 'tiny ice cubes nearby',
  },
  PEP: {
    type: 'soda-cup',
    colors: { primary: '#004B93', secondary: '#E32934', accent: '#FFFFFF' },
    props: 'tiny ice cubes nearby',
  },
  MCD: {
    type: 'fries',
    colors: { primary: '#FFC72C', secondary: '#DA291C', accent: '#FFFFFF' },
    props: 'tiny burger nearby',
  },
  SBUX: {
    type: 'coffee-cup',
    colors: { primary: '#00704A', secondary: '#FFFFFF', accent: '#1E3932' },
    props: 'tiny coffee beans nearby',
  },
  NKE: {
    type: 'sneaker',
    colors: { primary: '#111111', secondary: '#FFFFFF', accent: '#F5F5F5' },
    props: 'tiny swoosh trail nearby',
  },
  DIS: {
    type: 'castle',
    colors: { primary: '#113CCF', secondary: '#FFFFFF', accent: '#FFD700' },
    props: 'tiny sparkles nearby',
  },

  // === HEALTHCARE ===
  JNJ: {
    type: 'pill-capsule',
    colors: { primary: '#D51900', secondary: '#FFFFFF', accent: '#FF4444' },
    props: 'tiny heart nearby',
  },
  PFE: {
    type: 'pill-capsule',
    colors: { primary: '#0093D0', secondary: '#FFFFFF', accent: '#00BFFF' },
    props: 'tiny shield nearby',
  },
  UNH: {
    type: 'pill-capsule',
    colors: { primary: '#002677', secondary: '#FFFFFF', accent: '#4D8AFF' },
    props: 'tiny plus sign nearby',
  },
  MRNA: {
    type: 'pill-capsule',
    colors: { primary: '#00857C', secondary: '#FFFFFF', accent: '#00BFAA' },
    props: 'tiny helix nearby',
  },

  // === ENERGY ===
  XOM: {
    type: 'oil-barrel',
    colors: { primary: '#ED1C24', secondary: '#0A3D79', accent: '#FFFFFF' },
    props: 'tiny oil drop nearby',
  },
  CVX: {
    type: 'oil-barrel',
    colors: { primary: '#0051A5', secondary: '#EC1C24', accent: '#FFFFFF' },
    props: 'tiny oil drop nearby',
  },

  // === AEROSPACE ===
  BA: {
    type: 'rocket',
    colors: { primary: '#0033A0', secondary: '#FFFFFF', accent: '#4D8AFF' },
    props: 'tiny clouds nearby',
  },
  LMT: {
    type: 'rocket',
    colors: { primary: '#003366', secondary: '#FFFFFF', accent: '#4D8AFF' },
    props: 'tiny star nearby',
  },

  // === ETFs ===
  SPY: {
    type: 'chart-generic',
    colors: { primary: '#10B981', secondary: '#1F2937', accent: '#34D399' },
    props: 'tiny "500" text nearby',
  },
  QQQ: {
    type: 'chart-generic',
    colors: { primary: '#8B5CF6', secondary: '#1F2937', accent: '#A78BFA' },
    props: 'tiny tech icons nearby',
  },
  VOO: {
    type: 'chart-generic',
    colors: { primary: '#C41230', secondary: '#1F2937', accent: '#FF4444' },
    props: 'tiny ship nearby',
  },
};

// ============================================
// CATEGORY FALLBACKS (for unknown tickers)
// ============================================

export const CATEGORY_FALLBACKS: Record<string, ObjectConfig> = {
  tech: {
    type: 'green-crystal',
    colors: { primary: '#6366F1', secondary: '#1F2937', accent: '#818CF8' },
    props: 'tiny circuit pattern nearby',
  },
  finance: {
    type: 'gold-coin',
    colors: { primary: '#D4AF37', secondary: '#1F2937', accent: '#FFD700' },
    props: 'tiny dollar sign nearby',
  },
  healthcare: {
    type: 'pill-capsule',
    colors: { primary: '#EF4444', secondary: '#FFFFFF', accent: '#FF6B6B' },
    props: 'tiny heart nearby',
  },
  energy: {
    type: 'lightning-bolt',
    colors: { primary: '#F59E0B', secondary: '#1F2937', accent: '#FBBF24' },
    props: 'tiny flame nearby',
  },
  consumer: {
    type: 'shopping-bag',
    colors: { primary: '#8B5CF6', secondary: '#FFFFFF', accent: '#A78BFA' },
    props: 'tiny tag nearby',
  },
  industrial: {
    type: 'gear',
    colors: { primary: '#6B7280', secondary: '#1F2937', accent: '#9CA3AF' },
    props: 'tiny wrench nearby',
  },
  crypto: {
    type: 'gold-coin',
    colors: { primary: '#F7931A', secondary: '#1F2937', accent: '#FFAD33' },
    props: 'tiny chain link nearby',
  },
  default: {
    type: 'chart-generic',
    colors: { primary: '#6B7280', secondary: '#1F2937', accent: '#9CA3AF' },
    props: 'tiny trend line nearby',
  },
};

// ============================================
// PREDICTION MARKET CATEGORIES
// ============================================

export const MARKET_CATEGORY_MAPPINGS: Record<string, ObjectConfig> = {
  politics: {
    type: 'ballot-box',
    colors: { primary: '#DC2626', secondary: '#2563EB', accent: '#FFFFFF' },
    props: 'tiny flag nearby',
  },
  crypto: {
    type: 'gold-coin',
    colors: { primary: '#F7931A', secondary: '#1F2937', accent: '#FFAD33' },
    props: 'tiny blockchain cube nearby',
  },
  sports: {
    type: 'trophy',
    colors: { primary: '#FFD700', secondary: '#1F2937', accent: '#FFC107' },
    props: 'tiny ball nearby',
  },
  space: {
    type: 'rocket',
    colors: { primary: '#1E40AF', secondary: '#FFFFFF', accent: '#60A5FA' },
    props: 'tiny stars nearby',
  },
  macro: {
    type: 'bank-building',
    colors: { primary: '#059669', secondary: '#FFFFFF', accent: '#34D399' },
    props: 'tiny chart nearby',
  },
  tech: {
    type: 'green-crystal',
    colors: { primary: '#6366F1', secondary: '#1F2937', accent: '#818CF8' },
    props: 'tiny chip nearby',
  },
  geo: {
    type: 'globe',
    colors: { primary: '#3B82F6', secondary: '#10B981', accent: '#FFFFFF' },
    props: 'tiny radar ring nearby',
  },
  entertainment: {
    type: 'tv-screen',
    colors: { primary: '#E50914', secondary: '#1F2937', accent: '#FF4444' },
    props: 'tiny popcorn nearby',
  },
  default: {
    type: 'crystal-ball',
    colors: { primary: '#8B5CF6', secondary: '#6366F1', accent: '#C4B5FD' },
    props: 'tiny stars nearby',
  },
};

// ============================================
// KEYWORD → CATEGORY DETECTION
// ============================================

const CATEGORY_KEYWORDS: Record<string, RegExp> = {
  politics:
    /election|president|trump|biden|senate|congress|vote|governor|republican|democrat/i,
  crypto: /bitcoin|btc|ethereum|eth|crypto|blockchain|token|defi|nft/i,
  sports:
    /nfl|nba|mlb|nhl|super bowl|championship|playoffs|world series|ufc|boxing/i,
  space: /spacex|nasa|rocket|mars|moon|starship|satellite|astronaut|launch/i,
  macro:
    /fed|interest rate|inflation|gdp|recession|unemployment|treasury|rate cut|rate hike/i,
  tech: /apple|google|ai|artificial intelligence|openai|chatgpt|microsoft/i,
  geo: /china|russia|ukraine|war|nato|taiwan|israel|iran|conflict|military/i,
  entertainment: /movie|netflix|disney|streaming|oscar|grammy|album/i,
};

export function detectMarketCategory(title: string): string {
  for (const [category, regex] of Object.entries(CATEGORY_KEYWORDS)) {
    if (regex.test(title)) {
      return category;
    }
  }
  return 'default';
}

// ============================================
// GET CONFIG FOR ANY ASSET
// ============================================

export function getObjectConfig(
  identifier: string,
  type: 'stock' | 'market' = 'stock',
  marketTitle?: string
): ObjectConfig {
  if (type === 'stock') {
    // Check explicit mapping first
    if (STOCK_MAPPINGS[identifier.toUpperCase()]) {
      return STOCK_MAPPINGS[identifier.toUpperCase()];
    }
    // Fall back to category (would need external API to detect sector)
    return CATEGORY_FALLBACKS['default'];
  } else {
    // Prediction market - detect category from title
    const category = detectMarketCategory(marketTitle || identifier);
    return (
      MARKET_CATEGORY_MAPPINGS[category] || MARKET_CATEGORY_MAPPINGS['default']
    );
  }
}
