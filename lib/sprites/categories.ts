import { CATEGORY_KEYWORDS } from '@/lib/utils/constants';
import type { Category } from '@/types';

/**
 * Detect category from market title and optional tags
 */
export function detectCategory(market: { title: string; tags?: string[] }): Category {
  const text = market.title.toLowerCase();
  const tags = market.tags?.map(t => t.toLowerCase()) || [];

  // Check tags first (more reliable)
  for (const [category, keywords] of Object.entries(CATEGORY_KEYWORDS)) {
    const keywordArray = keywords as readonly string[];
    if (tags.some(tag => keywordArray.includes(tag))) {
      return category as Category;
    }
  }

  // Check title keywords
  for (const [category, keywords] of Object.entries(CATEGORY_KEYWORDS)) {
    const keywordArray = keywords as readonly string[];
    if (keywordArray.some(keyword => text.includes(keyword))) {
      return category as Category;
    }
  }

  // Default to politics (most common on Polymarket)
  return 'politics';
}

/**
 * Get all categories
 */
export function getAllCategories(): Category[] {
  return ['politics', 'crypto', 'sports', 'macro', 'tech', 'space', 'geo'];
}

/**
 * Get human-readable category name
 */
export function getCategoryDisplayName(category: Category): string {
  const names: Record<Category, string> = {
    politics: 'Politics',
    crypto: 'Crypto',
    sports: 'Sports',
    macro: 'Macro',
    tech: 'Tech',
    space: 'Space',
    geo: 'Geopolitics',
  };
  return names[category] ?? category;
}
