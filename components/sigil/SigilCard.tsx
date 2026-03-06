'use client';

import { useMemo } from 'react';
import { Panel } from '@/components/ui';
import { SigilSprite } from './SigilSprite';
import { SigilHabitat } from './SigilHabitat';
import { EvolutionBar } from './EvolutionBar';
import { getEvolutionLevel, getCreatureName, getCategoryIcon } from '@/lib/sprites/evolution';
import { PixelIcon } from '@/components/PixelIcon';
import { formatPrice, formatPercent } from '@/lib/utils/format';
import { cn } from '@/lib/utils/cn';
import type { SigilCardProps } from '@/types';

/**
 * Card component displaying a Sigil with creature, info, and evolution bar
 */
export function SigilCard({ sigil, onClick, isSelected }: SigilCardProps) {
  const { position, category, colors } = sigil;
  const evolutionLevel = getEvolutionLevel(position.currPrice);
  const name = getCreatureName(category, evolutionLevel);
  const icon = getCategoryIcon(category);
  const isProfit = position.totalPnl >= 0;

  const pnlPercent = useMemo(() => {
    if (position.totalBought === 0) return 0;
    return ((position.currentValue - position.totalBought) / position.totalBought) * 100;
  }, [position.currentValue, position.totalBought]);

  return (
    <Panel
      variant="card"
      className={cn(
        'p-3 cursor-pointer transition-all duration-200',
        'active:scale-[0.98]',
        isSelected && 'ring-2 ring-offset-2',
      )}
      style={{
        borderColor: isSelected ? colors.primary : undefined,
        // @ts-expect-error CSS custom property
        '--tw-ring-color': colors.primary,
      }}
      onClick={onClick}
    >
      <div className="flex items-center gap-3">
        {/* Creature with habitat */}
        <div className="flex-shrink-0 relative flex flex-col items-center">
          <div className="relative z-10" style={{ marginBottom: -12 }}>
            <SigilSprite
              category={category}
              evolution={evolutionLevel}
              colors={colors}
              size={75}
            />
          </div>
          <SigilHabitat colors={colors} size={70} />
        </div>

        {/* Info panel */}
        <div className="flex-1 min-w-0">
          {/* Creature name and level */}
          <div className="flex items-center gap-2 mb-1">
            <span className="text-lg font-bold text-text-dark">{name}</span>
            <span
              className="text-xs px-2 py-0.5 rounded-full font-bold text-white"
              style={{ background: colors.primary }}
            >
              Lv.{evolutionLevel + 1}
            </span>
          </div>

          {/* Market title with icon */}
          <div className="flex items-center gap-2 mb-2">
            <PixelIcon name={icon} size="md" />
            <p className="text-base font-semibold text-text-dark truncate">
              {position.title}
            </p>
          </div>

          {/* Evolution bar */}
          <EvolutionBar
            price={position.currPrice}
            colors={colors}
            className="mb-2"
          />

          {/* Price and P&L */}
          <div className="flex items-center justify-between">
            <span
              className="text-lg font-bold"
              style={{ color: isProfit ? 'var(--hp-green)' : 'var(--hp-red)' }}
            >
              {formatPercent(pnlPercent)}
            </span>
            <span className="text-lg font-bold text-text-dark">
              {formatPrice(position.currPrice)}
            </span>
          </div>
        </div>
      </div>
    </Panel>
  );
}

export default SigilCard;
