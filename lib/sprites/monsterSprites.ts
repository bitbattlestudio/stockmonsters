/**
 * High-quality Pokemon-style monster sprites for stocks
 * These are used as the primary sprites when available
 */

export const MONSTER_SPRITES: Record<string, string> = {
  TSLA: '/sprites/monsters/TSLA.png',
  NVDA: '/sprites/monsters/NVDA.png',
  AMZN: '/sprites/monsters/AMZN.png',
  PLTR: '/sprites/monsters/PLTR.png',
  NFLX: '/sprites/monsters/NFLX.png',
  AMD: '/sprites/monsters/AMD.png',
};

/**
 * Get monster sprite path for a stock symbol
 * @returns sprite path or null if no monster sprite exists
 */
export function getMonsterSprite(symbol: string): string | null {
  return MONSTER_SPRITES[symbol.toUpperCase()] || null;
}

/**
 * Check if a stock has a monster sprite available
 */
export function hasMonsterSprite(symbol: string): boolean {
  return symbol.toUpperCase() in MONSTER_SPRITES;
}

/**
 * Get all available monster sprite symbols
 */
export function getMonsterSpriteSymbols(): string[] {
  return Object.keys(MONSTER_SPRITES);
}
