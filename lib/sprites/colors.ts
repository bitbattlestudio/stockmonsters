import type { ColorPalette } from '@/types';
import { DEFAULT_COLORS } from '@/lib/utils/constants';

/**
 * Convert RGB array to hex color
 */
function rgbToHex([r, g, b]: number[]): string {
  return '#' + [r, g, b].map(x => x.toString(16).padStart(2, '0')).join('');
}

/**
 * Darken a hex color by a percentage
 */
function darkenColor(hex: string, percent: number): string {
  const num = parseInt(hex.replace('#', ''), 16);
  const amt = Math.round(2.55 * percent);
  const R = Math.max((num >> 16) - amt, 0);
  const G = Math.max((num >> 8 & 0x00FF) - amt, 0);
  const B = Math.max((num & 0x0000FF) - amt, 0);
  return '#' + (1 << 24 | R << 16 | G << 8 | B).toString(16).slice(1);
}

/**
 * Lighten a hex color by a percentage
 */
function lightenColor(hex: string, percent: number): string {
  const num = parseInt(hex.replace('#', ''), 16);
  const amt = Math.round(2.55 * percent);
  const R = Math.min((num >> 16) + amt, 255);
  const G = Math.min((num >> 8 & 0x00FF) + amt, 255);
  const B = Math.min((num & 0x0000FF) + amt, 255);
  return '#' + (1 << 24 | R << 16 | G << 8 | B).toString(16).slice(1);
}

/**
 * Extract colors from an image URL using ColorThief
 * This should be called on the client side only
 */
export async function extractColorsFromImage(imageUrl: string): Promise<ColorPalette> {
  // Dynamic import since color-thief-browser is client-only
  try {
    const ColorThief = (await import('color-thief-browser')).default;

    return new Promise((resolve, reject) => {
      const img = new Image();
      img.crossOrigin = 'Anonymous';

      img.onload = () => {
        try {
          const colorThief = new ColorThief();
          const palette = colorThief.getPalette(img, 4);

          if (!palette || palette.length < 3) {
            resolve(DEFAULT_COLORS);
            return;
          }

          resolve({
            primary: rgbToHex(palette[0]),
            secondary: rgbToHex(palette[1]),
            accent: rgbToHex(palette[2]),
            shadow: darkenColor(rgbToHex(palette[0]), 30),
          });
        } catch {
          resolve(DEFAULT_COLORS);
        }
      };

      img.onerror = () => {
        resolve(DEFAULT_COLORS);
      };

      // Proxy through our API to avoid CORS issues
      img.src = imageUrl;
    });
  } catch {
    return DEFAULT_COLORS;
  }
}

/**
 * Generate a color palette from a single base color
 */
export function generatePaletteFromColor(baseColor: string): ColorPalette {
  return {
    primary: baseColor,
    secondary: lightenColor(baseColor, 15),
    accent: lightenColor(baseColor, 30),
    shadow: darkenColor(baseColor, 30),
  };
}

/**
 * Get default colors (used as fallback)
 */
export function getDefaultColors(): ColorPalette {
  return { ...DEFAULT_COLORS };
}

export { darkenColor, lightenColor, rgbToHex };
