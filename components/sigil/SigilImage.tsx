'use client';

import Image from 'next/image';
import { getMonsterSprite, hasMonsterSprite } from '@/lib/sprites/monsterSprites';

interface SigilImageProps {
  ticker: string;
  state: 1 | 2 | 3 | 4 | 5;
  size?: number;
  className?: string;
  forcePixel?: boolean;
}

/**
 * Renders a sigil sprite - monster sprite if available, otherwise pixel sprite.
 *
 * Monster sprites: /sprites/monsters/[TICKER].png (high-res, single image)
 * Pixel sprites: /sprites/generated/stock_[TICKER]_[STATE].png (state-based)
 *
 * States (for pixel sprites):
 * 1 = crashing (-10% or worse)
 * 2 = down (-2% to -10%)
 * 3 = neutral (-2% to +2%)
 * 4 = up (+2% to +10%)
 * 5 = mooning (+10% or better)
 */
export function SigilImage({ ticker, state, size = 64, className = '', forcePixel = false }: SigilImageProps) {
  const isMonster = !forcePixel && hasMonsterSprite(ticker);
  const src = isMonster
    ? getMonsterSprite(ticker)!
    : `/sprites/generated/stock_${ticker.toUpperCase()}_${state}.png`;

  // Monster sprites are larger, so scale up the display size
  const displaySize = isMonster ? Math.max(size, 96) : size;

  return (
    <Image
      src={src}
      alt={`${ticker} sigil`}
      width={displaySize}
      height={displaySize}
      className={className}
      style={isMonster ? undefined : { imageRendering: 'pixelated' }}
      onError={(e) => {
        // Fallback if sprite doesn't exist yet
        (e.target as HTMLImageElement).src = '/sprites/placeholder.png';
      }}
    />
  );
}

/**
 * Get the performance state (1-5) from percent change
 */
export function getStateFromChange(change: number): 1 | 2 | 3 | 4 | 5 {
  if (change <= -10) return 1; // crashing
  if (change <= -2) return 2;  // down
  if (change >= 10) return 5;  // mooning
  if (change >= 2) return 4;   // up
  return 3;                     // neutral
}

export default SigilImage;
