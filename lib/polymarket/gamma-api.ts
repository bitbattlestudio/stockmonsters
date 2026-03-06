import { GAMMA_API_BASE } from '@/lib/utils/constants';
import type { Market } from '@/types';
import type { GammaMarket, GammaEvent } from './types';

/**
 * Fetch market by slug
 */
export async function fetchMarket(slug: string): Promise<Market | null> {
  const response = await fetch(
    `${GAMMA_API_BASE}/markets?slug=${slug}`,
    {
      headers: {
        'Accept': 'application/json',
      },
      next: { revalidate: 300 }, // Cache for 5 minutes
    }
  );

  if (!response.ok) {
    if (response.status === 404) {
      return null;
    }
    throw new Error(`Failed to fetch market: ${response.status}`);
  }

  const data: GammaMarket[] = await response.json();

  if (!data || data.length === 0) {
    return null;
  }

  return transformMarket(data[0]);
}

/**
 * Fetch market by condition ID
 */
export async function fetchMarketByConditionId(conditionId: string): Promise<Market | null> {
  const response = await fetch(
    `${GAMMA_API_BASE}/markets?condition_id=${conditionId}`,
    {
      headers: {
        'Accept': 'application/json',
      },
      next: { revalidate: 300 },
    }
  );

  if (!response.ok) {
    if (response.status === 404) {
      return null;
    }
    throw new Error(`Failed to fetch market: ${response.status}`);
  }

  const data: GammaMarket[] = await response.json();

  if (!data || data.length === 0) {
    return null;
  }

  return transformMarket(data[0]);
}

/**
 * Fetch markets by tag/category
 */
export async function fetchMarketsByTag(tag: string, limit: number = 20): Promise<Market[]> {
  const response = await fetch(
    `${GAMMA_API_BASE}/markets?tag=${tag}&limit=${limit}&active=true`,
    {
      headers: {
        'Accept': 'application/json',
      },
      next: { revalidate: 300 },
    }
  );

  if (!response.ok) {
    throw new Error(`Failed to fetch markets: ${response.status}`);
  }

  const data: GammaMarket[] = await response.json();

  return (data || []).map(transformMarket);
}

/**
 * Fetch event with all its markets
 */
export async function fetchEvent(slug: string): Promise<GammaEvent | null> {
  const response = await fetch(
    `${GAMMA_API_BASE}/events?slug=${slug}`,
    {
      headers: {
        'Accept': 'application/json',
      },
      next: { revalidate: 300 },
    }
  );

  if (!response.ok) {
    if (response.status === 404) {
      return null;
    }
    throw new Error(`Failed to fetch event: ${response.status}`);
  }

  const data: GammaEvent[] = await response.json();

  return data?.[0] || null;
}

/**
 * Search markets by query
 */
export async function searchMarkets(query: string, limit: number = 10): Promise<Market[]> {
  // The Gamma API doesn't have a direct search endpoint,
  // so we fetch active markets and filter client-side
  const response = await fetch(
    `${GAMMA_API_BASE}/markets?active=true&limit=100`,
    {
      headers: {
        'Accept': 'application/json',
      },
      next: { revalidate: 60 },
    }
  );

  if (!response.ok) {
    throw new Error(`Failed to search markets: ${response.status}`);
  }

  const data: GammaMarket[] = await response.json();
  const queryLower = query.toLowerCase();

  const filtered = (data || [])
    .filter((m) =>
      m.question.toLowerCase().includes(queryLower) ||
      m.slug.toLowerCase().includes(queryLower)
    )
    .slice(0, limit);

  return filtered.map(transformMarket);
}

/**
 * Transform API response to internal Market type
 */
function transformMarket(apiMarket: GammaMarket): Market {
  // Parse token IDs from JSON string
  let tokenIds: string[] = [];
  try {
    tokenIds = JSON.parse(apiMarket.clob_token_ids || '[]');
  } catch {
    tokenIds = [];
  }

  // Parse outcome prices
  let outcomePrices: number[] = [];
  try {
    outcomePrices = JSON.parse(apiMarket.outcomePrices || '[]').map(Number);
  } catch {
    outcomePrices = [];
  }

  // Parse outcomes
  let outcomes: string[] = [];
  try {
    outcomes = JSON.parse(apiMarket.outcomes || '["Yes", "No"]');
  } catch {
    outcomes = ['Yes', 'No'];
  }

  return {
    id: apiMarket.id,
    question: apiMarket.question,
    slug: apiMarket.slug,
    conditionId: apiMarket.conditionId,
    tokens: tokenIds.map((id, index) => ({
      token_id: id,
      outcome: outcomes[index] || (index === 0 ? 'Yes' : 'No'),
      price: outcomePrices[index],
    })),
    image: apiMarket.image,
    icon: apiMarket.icon,
    active: apiMarket.active,
    closed: apiMarket.closed,
    volume: apiMarket.volumeNum || parseFloat(apiMarket.volume) || 0,
    liquidity: apiMarket.liquidityNum || parseFloat(apiMarket.liquidity) || 0,
    endDate: apiMarket.endDate,
    tags: apiMarket.tags || [],
  };
}
