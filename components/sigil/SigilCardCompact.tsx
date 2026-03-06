'use client';

import { useMemo } from 'react';
import { Panel } from '@/components/ui';
import { SigilSprite } from './SigilSprite';
import { SigilHabitat } from './SigilHabitat';
import { getEvolutionLevel, getCreatureName, getCategoryIcon } from '@/lib/sprites/evolution';
import { PixelIcon } from '@/components/PixelIcon';
import { formatPrice, formatPercent } from '@/lib/utils/format';
import { cn } from '@/lib/utils/cn';
import type { SigilCardProps } from '@/types';

/**
 * Compact card component for 2-column grid layout
 */
export function SigilCardCompact({ sigil, onClick, isSelected }: SigilCardProps) {
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
      <div className="flex flex-col items-center text-center">
        {/* Creature with habitat */}
        <div className="relative flex flex-col items-center mb-2">
          <div className="relative z-10" style={{ marginBottom: -8 }}>
            <SigilSprite
              category={category}
              evolution={evolutionLevel}
              colors={colors}
              size={56}
            />
          </div>
          <SigilHabitat colors={colors} size={50} />
        </div>

        {/* Name and level */}
        <div className="flex items-center gap-1 mb-1">
          <span className="text-sm font-bold text-text-dark">{name}</span>
          <span
            className="text-[10px] px-1.5 py-0.5 rounded-full font-bold text-white"
            style={{ background: colors.primary }}
          >
            {evolutionLevel + 1}
          </span>
        </div>

        {/* Market title with icon */}
        <div className="flex items-center gap-1 mb-2 w-full">
          <PixelIcon name={icon} size="sm" />
          <p className="text-xs font-medium text-text-dark truncate flex-1">
            {position.title}
          </p>
        </div>

        {/* Price and P&L */}
        <div className="flex items-center justify-between w-full">
          <span
            className="text-sm font-bold"
            style={{ color: isProfit ? 'var(--hp-green)' : 'var(--hp-red)' }}
          >
            {formatPercent(pnlPercent)}
          </span>
          <span className="text-sm font-bold text-text-dark">
            {formatPrice(position.currPrice)}
          </span>
        </div>

        {/* Mini evolution indicator */}
        <div className="flex gap-1 mt-2">
          {[0, 1, 2].map((level) => (
            <div
              key={level}
              className="w-3 h-1.5 rounded-full"
              style={{
                background: level <= evolutionLevel ? colors.primary : '#D0D0C8',
              }}
            />
          ))}
        </div>
      </div>
    </Panel>
  );
}

export default SigilCardCompact;
