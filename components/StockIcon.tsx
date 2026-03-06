'use client';

import { useState } from 'react';

export type IconName =
  | 'health-check'
  | 'health-heart'
  | 'hunger-apple'
  | 'happiness'
  | 'sad'
  | 'trending-up'
  | 'trending-down'
  | 'chart'
  | 'diamond'
  | 'backpack'
  | 'bell'
  | 'swap'
  | 'balance'
  | 'rocket'
  | 'celebration'
  | 'warning'
  | 'checkmark'
  | 'x-mark'
  | 'link'
  | 'logo'
  | 'vote'
  | 'bank'
  | 'target'
  | 'wizard'
  | 'sparkle';

interface StockIconProps {
  name: IconName;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  alt?: string;
}

const SIZES = {
  xs: 16,
  sm: 24,
  md: 32,
  lg: 48,
  xl: 64,
};

/**
 * StockIcon - Pokemon/Sugimori style icons with pixel art fallback
 *
 * Tries to load from /icons/pokemon-style/{name}.png first.
 * Falls back to /icons/{name}.png (pixel art) if Pokemon-style not found.
 *
 * This allows us to gradually replace icons without breaking the app.
 */
export function StockIcon({ name, size = 'sm', className = '', alt }: StockIconProps) {
  const [useFallback, setUseFallback] = useState(false);
  const pixelSize = SIZES[size];

  // Try Pokemon-style first, fall back to pixel art
  const src = useFallback
    ? `/icons/${name}.png`
    : `/icons/pokemon-style/${name}.png`;

  // Use pixelated rendering only for fallback pixel art
  const imageStyle = useFallback
    ? { imageRendering: 'pixelated' as const }
    : undefined;

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      width={pixelSize}
      height={pixelSize}
      alt={alt || name}
      className={`inline-block ${className}`}
      style={imageStyle}
      onError={() => {
        // If Pokemon-style fails to load, fall back to pixel art
        if (!useFallback) {
          setUseFallback(true);
        }
      }}
    />
  );
}

// Convenience exports for common icons
export const HeartIcon = (props: Omit<StockIconProps, 'name'>) => (
  <StockIcon name="health-heart" {...props} />
);
export const AppleIcon = (props: Omit<StockIconProps, 'name'>) => (
  <StockIcon name="hunger-apple" {...props} />
);
export const HappyIcon = (props: Omit<StockIconProps, 'name'>) => (
  <StockIcon name="happiness" {...props} />
);
export const SadIcon = (props: Omit<StockIconProps, 'name'>) => (
  <StockIcon name="sad" {...props} />
);
export const RocketIcon = (props: Omit<StockIconProps, 'name'>) => (
  <StockIcon name="rocket" {...props} />
);
export const ChartIcon = (props: Omit<StockIconProps, 'name'>) => (
  <StockIcon name="chart" {...props} />
);
export const WarningIcon = (props: Omit<StockIconProps, 'name'>) => (
  <StockIcon name="warning" {...props} />
);
export const CheckIcon = (props: Omit<StockIconProps, 'name'>) => (
  <StockIcon name="checkmark" {...props} />
);
export const XIcon = (props: Omit<StockIconProps, 'name'>) => (
  <StockIcon name="x-mark" {...props} />
);
