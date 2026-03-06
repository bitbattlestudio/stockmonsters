import { NextRequest, NextResponse } from 'next/server';
import { fetchPositions } from '@/lib/polymarket/data-api';
import { fetchMarketByConditionId } from '@/lib/polymarket/gamma-api';
import { detectCategory } from '@/lib/sprites/categories';
import { getEvolutionLevel, getCategoryIcon } from '@/lib/sprites/evolution';
import { DEFAULT_COLORS } from '@/lib/utils/constants';
import type { Sigil, ColorPalette } from '@/types';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const address = searchParams.get('address');

  if (!address) {
    return NextResponse.json(
      { error: 'Address parameter is required' },
      { status: 400 }
    );
  }

  // Validate address format
  if (!/^0x[a-fA-F0-9]{40}$/.test(address)) {
    return NextResponse.json(
      { error: 'Invalid Ethereum address format' },
      { status: 400 }
    );
  }

  try {
    // Fetch positions from Polymarket
    const positions = await fetchPositions(address);

    if (positions.length === 0) {
      return NextResponse.json({ sigils: [], totalValue: 0, totalPnl: 0 });
    }

    // Transform positions to Sigils with market data
    const sigils: Sigil[] = await Promise.all(
      positions.map(async (position, index) => {
        // Try to fetch market data for additional info
        let market = null;
        let colors: ColorPalette = DEFAULT_COLORS;

        try {
          market = await fetchMarketByConditionId(position.conditionId);
        } catch {
          // Market fetch failed, continue with defaults
        }

        // Detect category from title and tags
        const category = detectCategory({
          title: position.title,
          tags: market?.tags,
        });

        // Generate colors based on category (in a real app, extract from market icon)
        colors = getCategoryColors(category);

        const evolutionLevel = getEvolutionLevel(position.currPrice);
        const icon = getCategoryIcon(category);

        return {
          id: `sigil-${position.conditionId}-${position.outcomeIndex}`,
          position,
          market: market || undefined,
          category,
          evolutionLevel,
          colors,
          icon,
        };
      })
    );

    // Calculate totals
    const totalValue = positions.reduce((sum, p) => sum + p.currentValue, 0);
    const totalInvested = positions.reduce((sum, p) => sum + p.totalBought, 0);
    const totalPnl = totalInvested > 0 ? ((totalValue - totalInvested) / totalInvested) * 100 : 0;

    return NextResponse.json({
      sigils,
      totalValue,
      totalPnl,
      count: sigils.length,
    });
  } catch (error) {
    console.error('Error fetching positions:', error);
    return NextResponse.json(
      { error: 'Failed to fetch positions' },
      { status: 500 }
    );
  }
}

/**
 * Get predefined colors for each category
 * In production, these would be extracted from market thumbnails
 */
function getCategoryColors(category: string): ColorPalette {
  const categoryColors: Record<string, ColorPalette> = {
    politics: {
      primary: '#9B2C2C',
      secondary: '#FC8181',
      accent: '#FEB2B2',
      shadow: '#63171B',
    },
    crypto: {
      primary: '#C05621',
      secondary: '#ED8936',
      accent: '#FBD38D',
      shadow: '#7B341E',
    },
    sports: {
      primary: '#C53030',
      secondary: '#F6E05E',
      accent: '#FEFCBF',
      shadow: '#822727',
    },
    macro: {
      primary: '#276749',
      secondary: '#48BB78',
      accent: '#9AE6B4',
      shadow: '#1A4731',
    },
    tech: {
      primary: '#4A5568',
      secondary: '#A0AEC0',
      accent: '#E2E8F0',
      shadow: '#1A202C',
    },
    space: {
      primary: '#1A365D',
      secondary: '#4299E1',
      accent: '#90CDF4',
      shadow: '#0D1B2A',
    },
    geo: {
      primary: '#744210',
      secondary: '#D69E2E',
      accent: '#FAF089',
      shadow: '#5C3D0E',
    },
  };

  return categoryColors[category] || DEFAULT_COLORS;
}
