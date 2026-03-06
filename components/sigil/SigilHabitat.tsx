'use client';

import { useMemo } from 'react';
import type { SigilHabitatProps } from '@/types';

/**
 * Pixelated elliptical pedestal/habitat for creatures
 * Uses procedural generation for texture
 */
export function SigilHabitat({ colors, size = 80 }: SigilHabitatProps) {
  const gridSize = 64; // Pixel density
  const heightRatio = 0.5;
  const gridHeight = Math.floor(gridSize * heightRatio);

  // Generate pixels once using useMemo
  const pixels = useMemo(() => {
    const generated: Array<{ x: number; y: number; color: string; opacity: number }> = [];
    const centerX = gridSize / 2;
    const centerY = gridHeight / 2;
    const radiusX = gridSize * 0.48;
    const radiusY = gridHeight * 0.46;

    for (let y = 0; y < gridHeight; y++) {
      for (let x = 0; x < gridSize; x++) {
        // Check if pixel is inside ellipse
        const dx = (x - centerX) / radiusX;
        const dy = (y - centerY) / radiusY;
        const dist = dx * dx + dy * dy;

        if (dist <= 1) {
          const normalizedY = y / gridHeight;

          // Multi-layer noise for texture
          const noise1 = Math.sin(x * 0.15) * Math.cos(y * 0.15) * 0.5 + 0.5;
          const noise2 = Math.sin(x * 0.3 + 2.1) * Math.cos(y * 0.25 + 1.3) * 0.5 + 0.5;
          const noise3 = Math.sin(x * 0.08) * Math.cos(y * 0.5) * 0.5 + 0.5;
          const combinedNoise = noise1 * 0.5 + noise2 * 0.3 + noise3 * 0.2;

          const edgeDist = 1 - dist;
          const radialGradient = 1 - Math.sqrt(dx * dx + dy * dy);

          let color: string;
          let opacity = 0.92;

          // Shading logic
          if (edgeDist < 0.06) {
            // Outer edge
            color = colors.shadow;
            opacity = 1;
          } else if (edgeDist < 0.12) {
            // Edge transition
            color = combinedNoise > 0.45 ? colors.shadow : colors.primary;
            opacity = 0.95;
          } else if (normalizedY > 0.8) {
            // Bottom shadow
            color = colors.shadow;
            opacity = 0.9;
          } else if (normalizedY > 0.65) {
            // Lower gradient
            const mix = (normalizedY - 0.65) / 0.15;
            color = mix > combinedNoise ? colors.shadow : colors.primary;
          } else if (normalizedY < 0.25) {
            // Top highlight
            if (combinedNoise > 0.6) {
              color = colors.accent;
              opacity = 0.95;
            } else if (combinedNoise > 0.4) {
              color = colors.secondary;
            } else {
              color = colors.primary;
            }
          } else if (radialGradient > 0.7 && combinedNoise > 0.5) {
            // Center bright spot
            color = combinedNoise > 0.65 ? colors.accent : colors.secondary;
          } else if (combinedNoise > 0.6) {
            // Scattered highlights
            color = colors.accent;
          } else if (combinedNoise > 0.45) {
            // Secondary areas
            color = colors.secondary;
          } else {
            // Primary fill
            color = colors.primary;
          }

          generated.push({ x, y, color, opacity });
        }
      }
    }
    return generated;
  }, [colors, gridSize, gridHeight]);

  return (
    <div className="relative" style={{ width: size, height: size * heightRatio }}>
      <svg
        viewBox={`0 0 ${gridSize} ${gridHeight}`}
        className="w-full h-full"
        style={{ imageRendering: 'pixelated' }}
        preserveAspectRatio="xMidYMid meet"
      >
        {/* Render pixels */}
        {pixels.map((pixel, i) => (
          <rect
            key={i}
            x={pixel.x}
            y={pixel.y}
            width={1.01}
            height={1.01}
            fill={pixel.color}
            opacity={pixel.opacity}
          />
        ))}

        {/* Glossy highlight overlay */}
        <ellipse
          cx={gridSize / 2}
          cy={gridHeight * 0.25}
          rx={gridSize * 0.3}
          ry={gridHeight * 0.12}
          fill={colors.accent}
          opacity={0.2}
        />

        {/* Edge definition */}
        <ellipse
          cx={gridSize / 2}
          cy={gridHeight / 2}
          rx={gridSize * 0.475}
          ry={gridHeight * 0.455}
          fill="none"
          stroke={colors.shadow}
          strokeWidth={1}
          opacity={0.4}
        />
      </svg>
    </div>
  );
}

export default SigilHabitat;
