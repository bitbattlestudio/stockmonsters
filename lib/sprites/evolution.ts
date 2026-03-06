import { EVOLUTION_THRESHOLDS, CATEGORY_CREATURES } from '@/lib/utils/constants';
import type { Category } from '@/types';
import type { IconName } from '@/components/PixelIcon';

/**
 * Get evolution level (0, 1, or 2) based on price
 * - Level 0 (Lv.1): 0-33¢
 * - Level 1 (Lv.2): 33-66¢
 * - Level 2 (Lv.3): 66-100¢
 */
export function getEvolutionLevel(price: number): number {
  if (price >= EVOLUTION_THRESHOLDS.level3.min) return 2;
  if (price >= EVOLUTION_THRESHOLDS.level2.min) return 1;
  return 0;
}

/**
 * Get progress percentage within the current evolution level
 */
export function getProgressInLevel(price: number): number {
  const level = getEvolutionLevel(price);
  const thresholds = [0, 0.33, 0.66, 1.0];
  const start = thresholds[level];
  const end = thresholds[level + 1];
  return Math.min(100, Math.max(0, ((price - start) / (end - start)) * 100));
}

/**
 * Get creature name for a category and evolution level
 */
export function getCreatureName(category: Category, evolutionLevel: number): string {
  const creature = CATEGORY_CREATURES[category];
  return creature?.evolutions[evolutionLevel] ?? 'Unknown';
}

/**
 * Get icon name for a category
 */
export function getCategoryIcon(category: Category): IconName {
  const creature = CATEGORY_CREATURES[category];
  return creature?.icon ?? 'chart';
}

/**
 * Calculate points earned from evolution
 */
export function getEvolutionPoints(previousLevel: number, newLevel: number): number {
  if (newLevel <= previousLevel) return 0;

  let points = 0;
  if (previousLevel < 1 && newLevel >= 1) {
    points += 100; // Level 2 evolution
  }
  if (previousLevel < 2 && newLevel >= 2) {
    points += 250; // Level 3 evolution
  }

  return points;
}

// Re-export for convenience
export { CATEGORY_CREATURES, EVOLUTION_THRESHOLDS };
