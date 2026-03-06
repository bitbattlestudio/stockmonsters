'use client';

import { SigilSprite } from './SigilSprite';
import { SigilHabitat } from './SigilHabitat';
import type { Category, ColorPalette } from '@/types';

interface SigilWithHabitatProps {
  category: Category;
  evolution: number;
  colors: ColorPalette;
  size?: number;
}

/**
 * Combined creature sprite with habitat pedestal
 */
export function SigilWithHabitat({
  category,
  evolution,
  colors,
  size = 100,
}: SigilWithHabitatProps) {
  return (
    <div
      className="relative flex flex-col items-center"
      style={{ width: size, height: size * 0.95 }}
    >
      {/* Creature - positioned above habitat */}
      <div className="relative z-10" style={{ marginBottom: -size * 0.12 }}>
        <SigilSprite
          category={category}
          evolution={evolution}
          colors={colors}
          size={size * 0.75}
        />
      </div>

      {/* Pixelated habitat/pedestal */}
      <div className="relative z-0">
        <SigilHabitat colors={colors} size={size * 0.7} />
      </div>
    </div>
  );
}

export default SigilWithHabitat;
