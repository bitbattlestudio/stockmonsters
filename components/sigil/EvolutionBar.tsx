'use client';

import { cn } from '@/lib/utils/cn';
import { getEvolutionLevel, getProgressInLevel } from '@/lib/sprites/evolution';
import type { EvolutionBarProps } from '@/types';

/**
 * 3-segment evolution progress bar
 * Shows Lv.1 (0-33¢), Lv.2 (33-66¢), Lv.3 (66-100¢)
 */
export function EvolutionBar({
  price,
  colors,
  showLabels = true,
  className,
}: EvolutionBarProps) {
  const level = getEvolutionLevel(price);
  const progress = getProgressInLevel(price);

  return (
    <div className={cn(className)}>
      {showLabels && (
        <div className="flex justify-between text-[10px] font-bold text-text-mid mb-1">
          <span>Lv.1</span>
          <span>Lv.2</span>
          <span>Lv.3</span>
        </div>
      )}

      <div
        className="h-3 rounded-full overflow-hidden flex"
        style={{
          background: '#E8E8E0',
          border: '1px solid var(--panel-border)',
        }}
      >
        {/* Level 1 segment (0-33¢) */}
        <div
          className="h-full"
          style={{
            width: '33.33%',
            background:
              level >= 0
                ? level === 0
                  ? `linear-gradient(90deg, ${colors.primary} ${progress}%, #D0D0C8 ${progress}%)`
                  : colors.primary
                : '#D0D0C8',
            borderRight: '1px solid #FFF',
          }}
        />

        {/* Level 2 segment (33-66¢) */}
        <div
          className="h-full"
          style={{
            width: '33.33%',
            background:
              level >= 1
                ? level === 1
                  ? `linear-gradient(90deg, ${colors.secondary} ${progress}%, #D0D0C8 ${progress}%)`
                  : colors.secondary
                : '#D0D0C8',
            borderRight: '1px solid #FFF',
          }}
        />

        {/* Level 3 segment (66-100¢) */}
        <div
          className="h-full"
          style={{
            width: '33.34%',
            background:
              level >= 2
                ? `linear-gradient(90deg, ${colors.accent} ${progress}%, #D0D0C8 ${progress}%)`
                : '#D0D0C8',
          }}
        />
      </div>

      {showLabels && (
        <div className="flex justify-between text-[9px] text-text-mid mt-0.5">
          <span>0¢</span>
          <span>33¢</span>
          <span>66¢</span>
          <span>100¢</span>
        </div>
      )}
    </div>
  );
}

export default EvolutionBar;
