'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import type { SigilSpriteProps, Category } from '@/types';

/**
 * Animated creature sprite component
 * Uses SVG placeholders until real sprites are generated
 */
export function SigilSprite({
  category,
  evolution,
  colors,
  size = 64,
  animated = true,
}: SigilSpriteProps) {
  const [frame, setFrame] = useState(0);

  useEffect(() => {
    if (!animated) return;

    const interval = setInterval(() => {
      setFrame((f) => (f + 1) % 8);
    }, 150);

    return () => clearInterval(interval);
  }, [animated]);

  // Bounce animation offset
  const yOffset = [0, -1, -2, -2, -1, 0, 1, 1][frame];

  return (
    <motion.div
      style={{ width: size, height: size }}
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
    >
      <svg
        viewBox="0 0 64 64"
        className="w-full h-full"
        style={{ imageRendering: 'pixelated' }}
      >
        <g transform={`translate(0, ${yOffset})`}>
          <CreatureSVG category={category} evolution={evolution} colors={colors} frame={frame} />
        </g>
      </svg>
    </motion.div>
  );
}

interface CreatureSVGProps {
  category: Category;
  evolution: number;
  colors: { primary: string; secondary: string; accent: string; shadow: string };
  frame: number;
}

function CreatureSVG({ category, evolution, colors, frame }: CreatureSVGProps) {
  const c = colors;

  switch (category) {
    case 'space':
      return (
        <g>
          {/* Wings */}
          <ellipse cx="14" cy="36" rx="12" ry="16" fill={c.secondary} />
          <ellipse cx="50" cy="36" rx="12" ry="16" fill={c.secondary} />
          <ellipse cx="14" cy="34" rx="8" ry="10" fill={c.accent} opacity="0.4" />
          <ellipse cx="50" cy="34" rx="8" ry="10" fill={c.accent} opacity="0.4" />
          <circle cx="14" cy="32" r="4" fill={c.primary} />
          <circle cx="50" cy="32" r="4" fill={c.primary} />
          {evolution >= 1 && <ellipse cx="6" cy="36" rx="4" ry="10" fill={c.accent} opacity="0.5" />}
          {evolution >= 1 && <ellipse cx="58" cy="36" rx="4" ry="10" fill={c.accent} opacity="0.5" />}
          {evolution >= 2 && <ellipse cx="2" cy="36" rx="2" ry="6" fill={c.accent} opacity="0.3" />}
          {evolution >= 2 && <ellipse cx="62" cy="36" rx="2" ry="6" fill={c.accent} opacity="0.3" />}
          {/* Body */}
          <ellipse cx="32" cy="40" rx="8" ry="14" fill={c.primary} />
          {/* Head */}
          <circle cx="32" cy="20" r="8" fill={c.primary} />
          {/* Antennae */}
          <rect x="24" y="6" width="2" height="10" fill={c.secondary} />
          <rect x="38" y="6" width="2" height="10" fill={c.secondary} />
          <circle cx="25" cy="4" r="3" fill={c.accent} />
          <circle cx="39" cy="4" r="3" fill={c.accent} />
          {/* Eyes */}
          <circle cx="28" cy="18" r="3" fill={c.accent} />
          <circle cx="36" cy="18" r="3" fill={c.accent} />
        </g>
      );

    case 'crypto':
      return (
        <g>
          {/* Base blob */}
          <ellipse cx="32" cy="46" rx="18" ry="12" fill={c.primary} />
          {/* Main crystal */}
          <polygon points="32,8 40,28 32,24 24,28" fill={c.accent} />
          <polygon points="32,8 40,28 32,20" fill="#FFF" opacity="0.5" />
          {evolution >= 1 && <polygon points="18,18 24,34 18,30 12,34" fill={c.secondary} />}
          {evolution >= 1 && <polygon points="46,18 52,34 46,30 40,34" fill={c.secondary} />}
          {evolution >= 2 && <polygon points="8,26 12,38 8,36 4,38" fill={c.accent} opacity="0.7" />}
          {evolution >= 2 && <polygon points="56,26 60,38 56,36 52,38" fill={c.accent} opacity="0.7" />}
          {/* Eyes */}
          <rect x="22" y="36" width="8" height="8" fill="#FFF" />
          <rect x="34" y="36" width="8" height="8" fill="#FFF" />
          <rect x="24" y="38" width="4" height="4" fill={c.shadow} />
          <rect x="36" y="38" width="4" height="4" fill={c.shadow} />
          {/* Mouth */}
          <rect x="28" y="48" width="8" height="2" fill={c.shadow} opacity="0.5" />
        </g>
      );

    case 'politics':
      return (
        <g>
          {/* Shadow */}
          <ellipse cx="32" cy="58" rx="12" ry="3" fill={c.shadow} opacity="0.3" />
          {/* Body */}
          <rect x="26" y="48" width="12" height="8" fill={c.primary} />
          <rect x="20" y="32" width="24" height="20" fill={c.primary} />
          {/* Wings */}
          <rect x="8" y="34" width="12" height="16" fill={c.primary} />
          <rect x="44" y="34" width="12" height="16" fill={c.primary} />
          {evolution >= 1 && <rect x="4" y="36" width="6" height="12" fill={c.secondary} />}
          {evolution >= 1 && <rect x="54" y="36" width="6" height="12" fill={c.secondary} />}
          {evolution >= 2 && <rect x="0" y="38" width="4" height="8" fill={c.accent} opacity="0.7" />}
          {evolution >= 2 && <rect x="60" y="38" width="4" height="8" fill={c.accent} opacity="0.7" />}
          {/* Head */}
          <rect x="22" y="16" width="20" height="18" fill={c.primary} />
          {/* Crown (Lv3 only) */}
          {evolution >= 2 && <rect x="26" y="8" width="12" height="8" fill={c.accent} />}
          {/* Eyes */}
          <rect x="24" y="20" width="6" height="6" fill="#FFF" />
          <rect x="34" y="20" width="6" height="6" fill="#FFF" />
          <rect x="26" y="22" width="3" height="3" fill={c.shadow} />
          <rect x="36" y="22" width="3" height="3" fill={c.shadow} />
          {/* Beak */}
          <rect x="28" y="28" width="8" height="6" fill="#F8C838" />
          {/* Feet */}
          <rect x="22" y="52" width="6" height="6" fill="#F8C838" />
          <rect x="36" y="52" width="6" height="6" fill="#F8C838" />
        </g>
      );

    case 'macro':
      return (
        <g>
          {/* Shadow */}
          <ellipse cx="32" cy="58" rx="18" ry="4" fill={c.shadow} opacity="0.4" />
          {/* Shell */}
          <ellipse cx="32" cy="40" rx="20" ry="16" fill={c.primary} />
          <ellipse cx="32" cy="36" rx="16" ry="12" fill={c.secondary} />
          {/* Coin on shell */}
          <circle cx="32" cy="36" r="6" fill="#F8D838" />
          <circle cx="32" cy="36" r="4" fill="#E8C828" />
          {/* Head */}
          <ellipse cx="12" cy="40" rx="8" ry="6" fill={c.secondary} />
          <rect x="6" y="38" width="4" height="3" fill={c.shadow} />
          {/* Feet */}
          <ellipse cx="18" cy="54" rx="5" ry="4" fill={c.secondary} />
          <ellipse cx="46" cy="54" rx="5" ry="4" fill={c.secondary} />
          {/* Extra coins for evolution */}
          {evolution >= 1 && <circle cx="32" cy="20" r="4" fill="#F8D838" />}
          {evolution >= 2 && <circle cx="32" cy="12" r="4" fill="#F8D838" />}
          {evolution >= 2 && <circle cx="24" cy="16" r="3" fill="#F8D838" opacity="0.7" />}
          {evolution >= 2 && <circle cx="40" cy="16" r="3" fill="#F8D838" opacity="0.7" />}
        </g>
      );

    case 'sports':
      return (
        <g>
          {/* Shadow */}
          <ellipse cx="32" cy="60" rx="12" ry="3" fill={c.shadow} opacity="0.4" />
          {/* Ears */}
          <polygon points="14,8 22,24 10,24" fill={c.primary} />
          <polygon points="50,8 42,24 54,24" fill={c.primary} />
          <polygon points="16,12 20,22 12,22" fill={c.secondary} />
          <polygon points="48,12 44,22 52,22" fill={c.secondary} />
          {/* Head */}
          <ellipse cx="32" cy="28" rx="16" ry="14" fill={c.primary} />
          {/* Eyes */}
          <ellipse cx="24" cy="26" rx="5" ry="6" fill="#FFF" />
          <ellipse cx="40" cy="26" rx="5" ry="6" fill="#FFF" />
          <ellipse cx="25" cy="27" rx="3" ry="4" fill={c.shadow} />
          <ellipse cx="41" cy="27" rx="3" ry="4" fill={c.shadow} />
          {/* Nose */}
          <rect x="29" y="34" width="6" height="4" fill={c.shadow} />
          {/* Body */}
          <ellipse cx="32" cy="48" rx="12" ry="10" fill={c.primary} />
          {/* Speed lines (evolved) */}
          {evolution >= 1 && <rect x="50" y="44" width="8" height="2" fill={c.accent} />}
          {evolution >= 1 && <rect x="52" y="48" width="8" height="2" fill={c.accent} />}
          {/* Star badge (max evolution) */}
          {evolution >= 2 && (
            <polygon
              points="32,42 34,46 38,46 35,49 36,53 32,50 28,53 29,49 26,46 30,46"
              fill={c.accent}
            />
          )}
          {/* Legs */}
          <rect x="20" y="52" width="6" height="8" fill={c.primary} />
          <rect x="38" y="52" width="6" height="8" fill={c.primary} />
        </g>
      );

    case 'tech':
      return (
        <g>
          {/* Shadow */}
          <ellipse cx="32" cy="60" rx="14" ry="3" fill={c.shadow} opacity="0.4" />
          {/* Body */}
          <rect x="14" y="20" width="36" height="32" fill={c.primary} rx="4" />
          {/* Screen */}
          <rect x="20" y="26" width="24" height="18" fill={c.shadow} rx="2" />
          {/* Eyes on screen */}
          <rect x="24" y="30" width="6" height="8" fill="#FFF" />
          <rect x="34" y="30" width="6" height="8" fill="#FFF" />
          <rect x="26" y="32" width="3" height="4" fill={c.primary} />
          <rect x="36" y="32" width="3" height="4" fill={c.primary} />
          {/* Mouth */}
          <rect x="26" y="40" width="12" height="2" fill={c.accent} />
          {/* Antenna */}
          <rect x="30" y="10" width="4" height="10" fill={c.primary} />
          <circle cx="32" cy="8" r="4" fill={c.secondary} />
          <circle cx="32" cy="8" r="2" fill={c.accent} opacity={frame % 2 === 0 ? 1 : 0.5} />
          {/* Arms */}
          <rect x="6" y="28" width="8" height="6" fill={c.primary} />
          <rect x="50" y="28" width="8" height="6" fill={c.primary} />
          {evolution >= 1 && <rect x="2" y="30" width="6" height="4" fill={c.secondary} />}
          {evolution >= 1 && <rect x="56" y="30" width="6" height="4" fill={c.secondary} />}
          {/* Legs */}
          <rect x="20" y="52" width="8" height="8" fill={c.primary} />
          <rect x="36" y="52" width="8" height="8" fill={c.primary} />
          {evolution >= 2 && (
            <rect x="22" y="58" width="4" height="4" fill={c.accent} opacity={0.5 + frame * 0.05} />
          )}
          {evolution >= 2 && (
            <rect x="38" y="58" width="4" height="4" fill={c.accent} opacity={0.5 + frame * 0.05} />
          )}
        </g>
      );

    case 'geo':
      return (
        <g>
          {/* Shadow */}
          <ellipse cx="32" cy="60" rx="14" ry="3" fill={c.shadow} opacity="0.4" />
          {/* Body */}
          <ellipse cx="32" cy="44" rx="14" ry="12" fill={c.primary} />
          {/* Wings */}
          <ellipse cx="12" cy="40" rx="10" ry="14" fill={c.primary} />
          <ellipse cx="52" cy="40" rx="10" ry="14" fill={c.primary} />
          {evolution >= 1 && <ellipse cx="6" cy="40" rx="5" ry="10" fill={c.secondary} />}
          {evolution >= 1 && <ellipse cx="58" cy="40" rx="5" ry="10" fill={c.secondary} />}
          {/* Head */}
          <circle cx="32" cy="22" r="12" fill={c.primary} />
          {/* Ear tufts */}
          <polygon points="20,10 24,20 16,18" fill={c.primary} />
          <polygon points="44,10 40,20 48,18" fill={c.primary} />
          {/* Eyes */}
          <circle cx="26" cy="20" r="6" fill="#FFF" />
          <circle cx="38" cy="20" r="6" fill="#FFF" />
          <circle cx="27" cy="21" r="4" fill={c.shadow} />
          <circle cx="39" cy="21" r="4" fill={c.shadow} />
          <circle cx="28" cy="20" r="1.5" fill="#FFF" />
          <circle cx="40" cy="20" r="1.5" fill="#FFF" />
          {/* Beak */}
          <polygon points="32,26 28,32 36,32" fill={c.accent} />
          {/* Crown (max evolution) */}
          {evolution >= 2 && (
            <g>
              <rect x="26" y="6" width="12" height="6" fill="#F8D838" />
              <circle cx="32" cy="6" r="3" fill="#E85048" />
            </g>
          )}
          {/* Feet */}
          <rect x="24" y="54" width="4" height="6" fill={c.accent} />
          <rect x="36" y="54" width="4" height="6" fill={c.accent} />
        </g>
      );

    default:
      // Default fallback creature
      return (
        <g>
          <circle cx="32" cy="32" r="20" fill={c.primary} />
          <circle cx="26" cy="28" r="4" fill="#FFF" />
          <circle cx="38" cy="28" r="4" fill="#FFF" />
          <circle cx="27" cy="29" r="2" fill={c.shadow} />
          <circle cx="39" cy="29" r="2" fill={c.shadow} />
          <ellipse cx="32" cy="40" rx="6" ry="3" fill={c.shadow} />
        </g>
      );
  }
}

export default SigilSprite;
