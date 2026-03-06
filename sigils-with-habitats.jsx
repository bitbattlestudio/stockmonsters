import React, { useState, useEffect, useRef } from 'react';

const COLORS = {
  bgGradientTop: '#68C0F0',
  bgGradientBottom: '#98E0F8',
  panelBg: '#F8F8F0',
  panelBorder: '#484868',
  panelShadow: '#A8A8B8',
  textDark: '#383850',
  textMid: '#606078',
  profit: '#48B848',
  loss: '#E85858',
};

const positions = [
  { 
    id: 1, 
    title: "SpaceX IPO 2027", 
    category: "space", 
    pnl: 45.2, 
    price: 0.68,
    avgPrice: 0.47, // Bought at 47¢, now 68¢ = +45%
    marketColors: { primary: '#1A365D', secondary: '#4299E1', accent: '#90CDF4', shadow: '#0D1B2A' }
  },
  { 
    id: 2, 
    title: "Fed Rate Cut March", 
    category: "macro", 
    pnl: 18.5, 
    price: 0.72,
    avgPrice: 0.61, // Bought at 61¢, now 72¢ = +18%
    marketColors: { primary: '#276749', secondary: '#48BB78', accent: '#9AE6B4', shadow: '#1A4731' }
  },
  { 
    id: 3, 
    title: "BTC $150k 2025", 
    category: "crypto", 
    pnl: -8.2, 
    price: 0.34,
    avgPrice: 0.37, // Bought at 37¢, now 34¢ = -8%
    marketColors: { primary: '#C05621', secondary: '#ED8936', accent: '#FBD38D', shadow: '#7B341E' }
  },
  { 
    id: 4, 
    title: "Trump Wins 2028", 
    category: "politics", 
    pnl: 52.1, 
    price: 0.38,
    avgPrice: 0.25, // Bought at 25¢, now 38¢ = +52%
    marketColors: { primary: '#9B2C2C', secondary: '#FC8181', accent: '#FEB2B2', shadow: '#63171B' }
  },
  { 
    id: 5, 
    title: "Chiefs Super Bowl", 
    category: "sports", 
    pnl: -22.4, 
    price: 0.22,
    avgPrice: 0.28, // Bought at 28¢, now 22¢ = -22%
    marketColors: { primary: '#C53030', secondary: '#F6E05E', accent: '#FEFCBF', shadow: '#822727' }
  },
  { 
    id: 6, 
    title: "Apple AR Glasses", 
    category: "tech", 
    pnl: 12.3, 
    price: 0.55,
    avgPrice: 0.49, // Bought at 49¢, now 55¢ = +12%
    marketColors: { primary: '#4A5568', secondary: '#A0AEC0', accent: '#E2E8F0', shadow: '#1A202C' }
  },
];

const spriteData = {
  politics: { evolutions: ['Pollster', 'Caucus', 'Senator'] },
  crypto: { evolutions: ['Hashling', 'Blockbit', 'Chainlord'] },
  sports: { evolutions: ['Rookie', 'Varsity', 'MVP'] },
  macro: { evolutions: ['Yield', 'Dividend', 'Reserve'] },
  tech: { evolutions: ['Byte', 'Megabyte', 'Quantum'] },
  space: { evolutions: ['Orbit', 'Nova', 'Cosmos'] },
};

// Pixelated habitat/pedestal component
// Maximum density (128x128) for near-photo recognizability
const PixelatedHabitat = ({ colors, size = 80 }) => {
  const gridSize = 128; // 128x128 pixels - maximum detail
  const heightRatio = 0.5;
  const gridHeight = Math.floor(gridSize * heightRatio);
  
  const [pixels] = useState(() => {
    const generated = [];
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
          const normalizedX = x / gridSize;
          const normalizedY = y / gridHeight;
          
          // Multi-layer noise for realistic texture
          const noise1 = Math.sin(x * 0.15) * Math.cos(y * 0.15) * 0.5 + 0.5;
          const noise2 = Math.sin(x * 0.3 + 2.1) * Math.cos(y * 0.25 + 1.3) * 0.5 + 0.5;
          const noise3 = Math.sin(x * 0.08) * Math.cos(y * 0.5) * 0.5 + 0.5;
          const noise4 = Math.sin(x * 0.6 + y * 0.4) * 0.5 + 0.5;
          const combinedNoise = (noise1 * 0.4 + noise2 * 0.3 + noise3 * 0.2 + noise4 * 0.1);
          
          const verticalGradient = normalizedY;
          const edgeDist = 1 - dist;
          const radialGradient = 1 - Math.sqrt(dx * dx + dy * dy);
          
          // Horizontal bands for more image-like appearance
          const bandNoise = Math.sin(y * 0.2) * 0.5 + 0.5;
          
          let color;
          let opacity = 0.92;
          
          // Create highly detailed shading
          if (edgeDist < 0.04) {
            // Crisp outer edge
            color = colors.shadow;
            opacity = 1;
          } else if (edgeDist < 0.08) {
            // Edge transition
            color = combinedNoise > 0.4 ? colors.shadow : colors.primary;
            opacity = 0.95;
          } else if (edgeDist < 0.12) {
            // Near edge
            color = combinedNoise > 0.5 ? colors.primary : colors.shadow;
          } else if (verticalGradient > 0.85) {
            // Bottom shadow
            color = colors.shadow;
            opacity = 0.9;
          } else if (verticalGradient > 0.7) {
            // Lower area gradient
            const mix = (verticalGradient - 0.7) / 0.15;
            color = mix > combinedNoise ? colors.shadow : colors.primary;
          } else if (verticalGradient < 0.2) {
            // Top highlight zone
            if (combinedNoise > 0.6) {
              color = colors.accent;
              opacity = 0.95;
            } else if (combinedNoise > 0.4) {
              color = colors.secondary;
            } else {
              color = colors.primary;
            }
          } else if (radialGradient > 0.75 && combinedNoise > 0.45) {
            // Center bright spot
            color = combinedNoise > 0.65 ? colors.accent : colors.secondary;
          } else if (combinedNoise > 0.7) {
            // Bright highlights scattered
            color = colors.accent;
          } else if (combinedNoise > 0.5) {
            // Secondary areas
            color = bandNoise > 0.5 ? colors.secondary : colors.primary;
          } else if (combinedNoise > 0.3) {
            // Primary with variation
            color = colors.primary;
          } else {
            // Darker primary
            color = bandNoise > 0.6 ? colors.primary : colors.secondary;
          }
          
          generated.push({ x, y, color, opacity });
        }
      }
    }
    return generated;
  });
  
  return (
    <div className="relative" style={{ width: size, height: size * heightRatio }}>
      {/* Ultra high-density pixelated background */}
      <svg 
        viewBox={`0 0 ${gridSize} ${gridHeight}`} 
        className="w-full h-full"
        style={{ imageRendering: 'pixelated' }}
        preserveAspectRatio="xMidYMid meet"
      >
        {/* Render each pixel */}
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
        
        {/* Glossy highlight on top */}
        <ellipse 
          cx={gridSize / 2} 
          cy={gridHeight * 0.25} 
          rx={gridSize * 0.3} 
          ry={gridHeight * 0.12} 
          fill={colors.accent}
          opacity={0.2}
        />
        
        {/* Subtle inner glow */}
        <ellipse 
          cx={gridSize / 2} 
          cy={gridHeight / 2} 
          rx={gridSize * 0.35} 
          ry={gridHeight * 0.3} 
          fill={colors.accent}
          opacity={0.08}
        />
        
        {/* Crisp edge definition */}
        <ellipse 
          cx={gridSize / 2} 
          cy={gridHeight / 2} 
          rx={gridSize * 0.475} 
          ry={gridHeight * 0.455} 
          fill="none"
          stroke={colors.shadow}
          strokeWidth={1.5}
          opacity={0.5}
        />
      </svg>
    </div>
  );
};

// High-fidelity creature sprite (same as before, condensed)
const CreatureSprite = ({ category, evolution, colors, size = 64 }) => {
  const [frame, setFrame] = useState(0);
  
  useEffect(() => {
    const interval = setInterval(() => setFrame(f => (f + 1) % 8), 150);
    return () => clearInterval(interval);
  }, []);
  
  const yOff = [0, -1, -2, -2, -1, 0, 1, 1][frame];
  const c = colors;
  
  return (
    <div style={{ width: size, height: size }}>
      <svg viewBox="0 0 64 64" className="w-full h-full" style={{ imageRendering: 'pixelated' }}>
        <g transform={`translate(0, ${yOff})`}>
          {category === 'space' && (
            <g>
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
              <ellipse cx="32" cy="40" rx="8" ry="14" fill={c.primary} />
              <circle cx="32" cy="20" r="8" fill={c.primary} />
              <rect x="24" y="6" width="2" height="10" fill={c.secondary} />
              <rect x="38" y="6" width="2" height="10" fill={c.secondary} />
              <circle cx="25" cy="4" r="3" fill={c.accent} />
              <circle cx="39" cy="4" r="3" fill={c.accent} />
              <circle cx="28" cy="18" r="3" fill={c.accent} />
              <circle cx="36" cy="18" r="3" fill={c.accent} />
            </g>
          )}
          
          {category === 'crypto' && (
            <g>
              <ellipse cx="32" cy="46" rx="18" ry="12" fill={c.primary} />
              <polygon points="32,8 40,28 32,24 24,28" fill={c.accent} />
              <polygon points="32,8 40,28 32,20" fill="#FFF" opacity="0.5" />
              {evolution >= 1 && <polygon points="18,18 24,34 18,30 12,34" fill={c.secondary} />}
              {evolution >= 1 && <polygon points="46,18 52,34 46,30 40,34" fill={c.secondary} />}
              {evolution >= 2 && <polygon points="8,26 12,38 8,36 4,38" fill={c.accent} opacity="0.7" />}
              {evolution >= 2 && <polygon points="56,26 60,38 56,36 52,38" fill={c.accent} opacity="0.7" />}
              <rect x="22" y="36" width="8" height="8" fill="#FFF" />
              <rect x="34" y="36" width="8" height="8" fill="#FFF" />
              <rect x="24" y="38" width="4" height="4" fill={c.shadow} />
              <rect x="36" y="38" width="4" height="4" fill={c.shadow} />
              <rect x="28" y="48" width="8" height="2" fill={c.shadow} opacity="0.5" />
            </g>
          )}
          
          {category === 'politics' && (
            <g>
              <ellipse cx="32" cy="58" rx="12" ry="3" fill={c.shadow} opacity="0.3" />
              <rect x="26" y="48" width="12" height="8" fill={c.primary} />
              <rect x="20" y="32" width="24" height="20" fill={c.primary} />
              <rect x="8" y="34" width="12" height="16" fill={c.primary} />
              <rect x="44" y="34" width="12" height="16" fill={c.primary} />
              {evolution >= 1 && <rect x="4" y="36" width="6" height="12" fill={c.secondary} />}
              {evolution >= 1 && <rect x="54" y="36" width="6" height="12" fill={c.secondary} />}
              {evolution >= 2 && <rect x="0" y="38" width="4" height="8" fill={c.accent} opacity="0.7" />}
              {evolution >= 2 && <rect x="60" y="38" width="4" height="8" fill={c.accent} opacity="0.7" />}
              <rect x="22" y="16" width="20" height="18" fill={c.primary} />
              <rect x="12" y="2" width="8" height="4" fill={c.accent} />
              <rect x="24" y="20" width="6" height="6" fill="#FFF" />
              <rect x="34" y="20" width="6" height="6" fill="#FFF" />
              <rect x="26" y="22" width="3" height="3" fill={c.shadow} />
              <rect x="36" y="22" width="3" height="3" fill={c.shadow} />
              <rect x="28" y="28" width="8" height="6" fill="#F8C838" />
              {evolution >= 2 && <rect x="26" y="8" width="12" height="8" fill={c.accent} />}
              <rect x="22" y="52" width="6" height="6" fill="#F8C838" />
              <rect x="36" y="52" width="6" height="6" fill="#F8C838" />
            </g>
          )}
          
          {category === 'macro' && (
            <g>
              <ellipse cx="32" cy="58" rx="18" ry="4" fill={c.shadow} opacity="0.4" />
              <ellipse cx="32" cy="40" rx="20" ry="16" fill={c.primary} />
              <ellipse cx="32" cy="36" rx="16" ry="12" fill={c.secondary} />
              <circle cx="32" cy="36" r="6" fill="#F8D838" />
              <circle cx="32" cy="36" r="4" fill="#E8C828" />
              <ellipse cx="12" cy="40" rx="8" ry="6" fill={c.secondary} />
              <rect x="6" y="38" width="4" height="3" fill={c.shadow} />
              <ellipse cx="18" cy="54" rx="5" ry="4" fill={c.secondary} />
              <ellipse cx="46" cy="54" rx="5" ry="4" fill={c.secondary} />
              {evolution >= 1 && <circle cx="32" cy="20" r="4" fill="#F8D838" />}
              {evolution >= 2 && <circle cx="32" cy="12" r="4" fill="#F8D838" />}
              {evolution >= 2 && <circle cx="24" cy="16" r="3" fill="#F8D838" opacity="0.7" />}
              {evolution >= 2 && <circle cx="40" cy="16" r="3" fill="#F8D838" opacity="0.7" />}
            </g>
          )}
          
          {category === 'sports' && (
            <g>
              <ellipse cx="32" cy="60" rx="12" ry="3" fill={c.shadow} opacity="0.4" />
              <polygon points="14,8 22,24 10,24" fill={c.primary} />
              <polygon points="50,8 42,24 54,24" fill={c.primary} />
              <polygon points="16,12 20,22 12,22" fill={c.secondary} />
              <polygon points="48,12 44,22 52,22" fill={c.secondary} />
              <ellipse cx="32" cy="28" rx="16" ry="14" fill={c.primary} />
              <ellipse cx="24" cy="26" rx="5" ry="6" fill="#FFF" />
              <ellipse cx="40" cy="26" rx="5" ry="6" fill="#FFF" />
              <ellipse cx="25" cy="27" rx="3" ry="4" fill={c.shadow} />
              <ellipse cx="41" cy="27" rx="3" ry="4" fill={c.shadow} />
              <rect x="29" y="34" width="6" height="4" fill={c.shadow} />
              <ellipse cx="32" cy="48" rx="12" ry="10" fill={c.primary} />
              {evolution >= 1 && <rect x="50" y="44" width="8" height="2" fill={c.accent} />}
              {evolution >= 1 && <rect x="52" y="48" width="8" height="2" fill={c.accent} />}
              {evolution >= 2 && <polygon points="32,42 34,46 38,46 35,49 36,53 32,50 28,53 29,49 26,46 30,46" fill={c.accent} />}
              <rect x="20" y="52" width="6" height="8" fill={c.primary} />
              <rect x="38" y="52" width="6" height="8" fill={c.primary} />
            </g>
          )}
          
          {category === 'tech' && (
            <g>
              <ellipse cx="32" cy="60" rx="14" ry="3" fill={c.shadow} opacity="0.4" />
              <rect x="14" y="20" width="36" height="32" fill={c.primary} rx="4" />
              <rect x="20" y="26" width="24" height="18" fill={c.shadow} rx="2" />
              <rect x="24" y="30" width="6" height="8" fill="#FFF" />
              <rect x="34" y="30" width="6" height="8" fill="#FFF" />
              <rect x="26" y="32" width="3" height="4" fill={c.primary} />
              <rect x="36" y="32" width="3" height="4" fill={c.primary} />
              <rect x="26" y="40" width="12" height="2" fill={c.accent} />
              <rect x="30" y="10" width="4" height="10" fill={c.primary} />
              <circle cx="32" cy="8" r="4" fill={c.secondary} />
              <circle cx="32" cy="8" r="2" fill={c.accent} opacity={frame % 2 === 0 ? 1 : 0.5} />
              <rect x="6" y="28" width="8" height="6" fill={c.primary} />
              <rect x="50" y="28" width="8" height="6" fill={c.primary} />
              {evolution >= 1 && <rect x="2" y="30" width="6" height="4" fill={c.secondary} />}
              {evolution >= 1 && <rect x="56" y="30" width="6" height="4" fill={c.secondary} />}
              <rect x="20" y="52" width="8" height="8" fill={c.primary} />
              <rect x="36" y="52" width="8" height="8" fill={c.primary} />
              {evolution >= 2 && <rect x="22" y="58" width="4" height="4" fill={c.accent} opacity={0.5 + frame * 0.05} />}
              {evolution >= 2 && <rect x="38" y="58" width="4" height="4" fill={c.accent} opacity={0.5 + frame * 0.05} />}
            </g>
          )}
        </g>
      </svg>
    </div>
  );
};

// Combined creature + habitat component
const SigilWithHabitat = ({ position, size = 100 }) => {
  return (
    <div className="relative flex flex-col items-center" style={{ width: size, height: size * 0.95 }}>
      {/* Creature - larger and more prominent */}
      <div className="relative z-10" style={{ marginBottom: -size * 0.12 }}>
        <CreatureSprite 
          category={position.category}
          evolution={position.evolution}
          colors={position.marketColors}
          size={size * 0.75}
        />
      </div>
      
      {/* Pixelated habitat/pedestal - smaller */}
      <div className="relative z-0">
        <PixelatedHabitat 
          colors={position.marketColors}
          size={size * 0.7}
        />
      </div>
    </div>
  );
};

// Evolution level based on price: 0-33¢ = Lv1, 33-66¢ = Lv2, 66-100¢ = Lv3
const getEvolutionFromPrice = (price) => {
  if (price >= 0.66) return 2;
  if (price >= 0.33) return 1;
  return 0;
};

// Market emoji mapping
const marketEmojis = {
  1: '🚀',
  2: '🏦', 
  3: '₿',
  4: '🗳️',
  5: '🏈',
  6: '🥽',
};

// Card component
const CreatureCard = ({ position, onClick, isSelected }) => {
  const sprite = spriteData[position.category];
  const evolutionLevel = getEvolutionFromPrice(position.price);
  const name = sprite.evolutions[evolutionLevel];
  const isProfit = position.pnl >= 0;
  const emoji = marketEmojis[position.id] || '📊';
  
  // Calculate progress within current level
  const pricePercent = position.price * 100;
  const levelThresholds = [0, 33, 66, 100];
  const currentLevelStart = levelThresholds[evolutionLevel];
  const currentLevelEnd = levelThresholds[evolutionLevel + 1];
  const progressInLevel = ((pricePercent - currentLevelStart) / (currentLevelEnd - currentLevelStart)) * 100;
  
  return (
    <div 
      onClick={() => onClick(position)}
      className="cursor-pointer transition-all duration-200 active:scale-98"
      style={{
        background: COLORS.panelBg,
        border: `3px solid ${isSelected ? position.marketColors.primary : COLORS.panelBorder}`,
        borderRadius: 16,
        padding: 12,
        boxShadow: isSelected 
          ? `0 0 0 3px ${position.marketColors.primary}40, 4px 4px 0 ${COLORS.panelShadow}`
          : `4px 4px 0 ${COLORS.panelShadow}`,
        transform: isSelected ? 'scale(1.02)' : 'scale(1)',
      }}
    >
      <div className="flex items-center gap-3">
        {/* Creature with habitat */}
        <div className="flex-shrink-0">
          <SigilWithHabitat position={{...position, evolution: evolutionLevel}} size={100} />
        </div>
        
        {/* Info panel */}
        <div className="flex-1 min-w-0">
          {/* Creature name and level */}
          <div className="flex items-center gap-2 mb-1">
            <span className="text-lg font-bold" style={{ color: COLORS.textDark }}>
              {name}
            </span>
            <span 
              className="text-xs px-2 py-0.5 rounded-full font-bold"
              style={{ background: position.marketColors.primary, color: '#FFF' }}
            >
              Lv.{evolutionLevel + 1}
            </span>
          </div>
          
          {/* Market title with emoji */}
          <div className="flex items-center gap-2 mb-2">
            <span style={{ fontSize: 18 }}>{emoji}</span>
            <p className="text-base font-semibold truncate" style={{ color: COLORS.textDark }}>
              {position.title}
            </p>
          </div>
          
          {/* Evolution scale bar */}
          <div className="mb-2">
            <div className="flex justify-between text-[10px] font-bold mb-1" style={{ color: COLORS.textMid }}>
              <span>Lv.1</span>
              <span>Lv.2</span>
              <span>Lv.3</span>
            </div>
            <div 
              className="h-3 rounded-full overflow-hidden flex"
              style={{ background: '#E8E8E0', border: `1px solid ${COLORS.panelBorder}` }}
            >
              {/* Level 1 segment */}
              <div 
                className="h-full"
                style={{ 
                  width: '33.33%',
                  background: evolutionLevel >= 0 
                    ? (evolutionLevel === 0 
                      ? `linear-gradient(90deg, ${position.marketColors.primary} ${progressInLevel}%, #D0D0C8 ${progressInLevel}%)`
                      : position.marketColors.primary)
                    : '#D0D0C8',
                  borderRight: '1px solid #FFF',
                }}
              />
              {/* Level 2 segment */}
              <div 
                className="h-full"
                style={{ 
                  width: '33.33%',
                  background: evolutionLevel >= 1 
                    ? (evolutionLevel === 1 
                      ? `linear-gradient(90deg, ${position.marketColors.secondary} ${progressInLevel}%, #D0D0C8 ${progressInLevel}%)`
                      : position.marketColors.secondary)
                    : '#D0D0C8',
                  borderRight: '1px solid #FFF',
                }}
              />
              {/* Level 3 segment */}
              <div 
                className="h-full"
                style={{ 
                  width: '33.34%',
                  background: evolutionLevel >= 2 
                    ? `linear-gradient(90deg, ${position.marketColors.accent} ${progressInLevel}%, #D0D0C8 ${progressInLevel}%)`
                    : '#D0D0C8',
                }}
              />
            </div>
            <div className="flex justify-between text-[9px] mt-0.5" style={{ color: COLORS.textMid }}>
              <span>0¢</span>
              <span>33¢</span>
              <span>66¢</span>
              <span>100¢</span>
            </div>
          </div>
          
          {/* Price and P&L */}
          <div className="flex items-center justify-between">
            <span 
              className="text-lg font-bold"
              style={{ color: isProfit ? COLORS.profit : COLORS.loss }}
            >
              {isProfit ? '+' : ''}{position.pnl.toFixed(1)}%
            </span>
            <span className="text-lg font-bold" style={{ color: COLORS.textDark }}>
              {(position.price * 100).toFixed(0)}¢
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

// Sample price history data
const priceHistory = [
  { date: '2/1', price: 0.42 },
  { date: '2/3', price: 0.45 },
  { date: '2/5', price: 0.48 },
  { date: '2/7', price: 0.44 },
  { date: '2/9', price: 0.52 },
  { date: '2/11', price: 0.58 },
  { date: '2/13', price: 0.55 },
  { date: '2/15', price: 0.62 },
  { date: '2/17', price: 0.68 },
];

// Price chart component
const PriceChart = ({ data, color, width = 280, height = 100 }) => {
  const prices = data.map(d => d.price);
  const min = Math.min(...prices) * 0.9;
  const max = Math.max(...prices) * 1.1;
  const range = max - min;
  
  const points = data.map((d, i) => {
    const x = (i / (data.length - 1)) * width;
    const y = height - ((d.price - min) / range) * height;
    return `${x},${y}`;
  }).join(' ');
  
  const areaPoints = `0,${height} ${points} ${width},${height}`;
  
  return (
    <svg width={width} height={height} className="w-full">
      {[0.25, 0.5, 0.75].map((pct, i) => (
        <line 
          key={i}
          x1={0} y1={height * pct} x2={width} y2={height * pct}
          stroke={COLORS.panelBorder}
          strokeWidth={0.5}
          strokeDasharray="4,4"
          opacity={0.3}
        />
      ))}
      <polygon points={areaPoints} fill={color} opacity={0.15} />
      <polyline
        points={points}
        fill="none"
        stroke={color}
        strokeWidth={3}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle 
        cx={width} 
        cy={height - ((prices[prices.length - 1] - min) / range) * height}
        r={5}
        fill={color}
        stroke="#FFF"
        strokeWidth={2}
      />
    </svg>
  );
};

// Detail view component
const DetailView = ({ position, onBack }) => {
  const [activeTab, setActiveTab] = useState('stats');
  const evolutionLevel = getEvolutionFromPrice(position.price);
  const sprite = spriteData[position.category];
  const name = sprite.evolutions[evolutionLevel];
  const isProfit = position.pnl >= 0;
  const emoji = marketEmojis[position.id] || '📊';
  
  const pricePercent = position.price * 100;
  const levelThresholds = [0, 33, 66, 100];
  const currentLevelStart = levelThresholds[evolutionLevel];
  const currentLevelEnd = levelThresholds[evolutionLevel + 1];
  const progressInLevel = ((pricePercent - currentLevelStart) / (currentLevelEnd - currentLevelStart)) * 100;
  
  // Sample trade history
  const tradeHistory = [
    { date: 'Feb 15', action: 'BUY', shares: 50, price: position.avgPrice + 0.05, total: 26 },
    { date: 'Feb 10', action: 'BUY', shares: 100, price: position.avgPrice, total: 47 },
    { date: 'Feb 1', action: 'BUY', shares: 50, price: position.avgPrice - 0.05, total: 21 },
  ];

  return (
    <div 
      className="min-h-screen pb-32"
      style={{ background: `linear-gradient(180deg, ${COLORS.bgGradientTop} 0%, ${COLORS.bgGradientBottom} 100%)` }}
    >
      {/* Header with back button */}
      <header 
        className="mx-3 mt-3 px-4 py-3 flex items-center justify-between"
        style={{ 
          background: COLORS.panelBg,
          border: `3px solid ${COLORS.panelBorder}`,
          borderRadius: 16,
          boxShadow: `4px 4px 0 ${COLORS.panelShadow}`,
        }}
      >
        <button 
          onClick={onBack}
          className="flex items-center gap-2 font-bold transition-all active:scale-95"
          style={{ color: COLORS.textDark }}
        >
          <span style={{ fontSize: 20 }}>←</span>
          <span>My Collection</span>
        </button>
        <span className="text-sm font-bold" style={{ color: COLORS.textMid }}>
          SIGIL DETAILS
        </span>
      </header>
      
      {/* Main creature card */}
      <div 
        className="mx-3 mt-3 p-4"
        style={{ 
          background: COLORS.panelBg,
          border: `3px solid ${COLORS.panelBorder}`,
          borderRadius: 16,
          boxShadow: `4px 4px 0 ${COLORS.panelShadow}`,
        }}
      >
        <div className="flex gap-4">
          {/* Creature display - larger */}
          <div 
            className="p-3 rounded-xl flex-shrink-0"
            style={{ background: `${position.marketColors.primary}15`, border: `3px solid ${position.marketColors.primary}40` }}
          >
            <CreatureSprite 
              category={position.category}
              evolution={evolutionLevel}
              colors={position.marketColors}
              size={100}
            />
          </div>
          
          {/* Info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-2xl font-bold" style={{ color: COLORS.textDark }}>
                {name}
              </span>
              <span 
                className="text-sm px-2 py-1 rounded-full font-bold"
                style={{ background: position.marketColors.primary, color: '#FFF' }}
              >
                Lv.{evolutionLevel + 1}
              </span>
            </div>
            
            {/* Market title with emoji */}
            <div className="flex items-center gap-2 mb-3">
              <span style={{ fontSize: 20 }}>{emoji}</span>
              <p className="text-lg font-semibold" style={{ color: COLORS.textDark }}>
                {position.title}
              </p>
            </div>
            
            {/* Value and P&L */}
            <div className="flex items-baseline gap-3">
              <span className="text-3xl font-bold" style={{ color: COLORS.textDark }}>
                {(position.price * 100).toFixed(0)}¢
              </span>
              <span 
                className="text-xl font-bold"
                style={{ color: isProfit ? COLORS.profit : COLORS.loss }}
              >
                {isProfit ? '+' : ''}{position.pnl.toFixed(1)}%
              </span>
            </div>
          </div>
        </div>
      </div>
      
      {/* Evolution progress */}
      <div 
        className="mx-3 mt-3 p-4"
        style={{ 
          background: COLORS.panelBg,
          border: `3px solid ${COLORS.panelBorder}`,
          borderRadius: 16,
          boxShadow: `4px 4px 0 ${COLORS.panelShadow}`,
        }}
      >
        <p className="text-sm font-bold mb-2" style={{ color: COLORS.textDark }}>EVOLUTION PROGRESS</p>
        <div className="flex justify-between text-xs font-bold mb-1" style={{ color: COLORS.textMid }}>
          <span>Lv.1 {sprite.evolutions[0]}</span>
          <span>Lv.2 {sprite.evolutions[1]}</span>
          <span>Lv.3 {sprite.evolutions[2]}</span>
        </div>
        <div 
          className="h-5 rounded-full overflow-hidden flex"
          style={{ background: '#E8E8E0', border: `2px solid ${COLORS.panelBorder}` }}
        >
          <div style={{ width: '33.33%', background: evolutionLevel >= 0 ? (evolutionLevel === 0 ? `linear-gradient(90deg, ${position.marketColors.primary} ${progressInLevel}%, #D0D0C8 ${progressInLevel}%)` : position.marketColors.primary) : '#D0D0C8', borderRight: '2px solid #FFF' }} />
          <div style={{ width: '33.33%', background: evolutionLevel >= 1 ? (evolutionLevel === 1 ? `linear-gradient(90deg, ${position.marketColors.secondary} ${progressInLevel}%, #D0D0C8 ${progressInLevel}%)` : position.marketColors.secondary) : '#D0D0C8', borderRight: '2px solid #FFF' }} />
          <div style={{ width: '33.34%', background: evolutionLevel >= 2 ? `linear-gradient(90deg, ${position.marketColors.accent} ${progressInLevel}%, #D0D0C8 ${progressInLevel}%)` : '#D0D0C8' }} />
        </div>
        <div className="flex justify-between text-xs mt-1" style={{ color: COLORS.textMid }}>
          <span>0¢</span>
          <span>33¢</span>
          <span>66¢</span>
          <span>100¢</span>
        </div>
      </div>
      
      {/* Price chart */}
      <div 
        className="mx-3 mt-3 p-4"
        style={{ 
          background: COLORS.panelBg,
          border: `3px solid ${COLORS.panelBorder}`,
          borderRadius: 16,
          boxShadow: `4px 4px 0 ${COLORS.panelShadow}`,
        }}
      >
        <div className="flex items-center justify-between mb-3">
          <span className="text-sm font-bold" style={{ color: COLORS.textDark }}>PRICE HISTORY</span>
          <div className="flex gap-1">
            {['1D', '1W', '1M', 'ALL'].map(range => (
              <button
                key={range}
                className="px-2 py-1 text-xs font-bold rounded"
                style={{ background: range === '1W' ? position.marketColors.primary : 'transparent', color: range === '1W' ? '#FFF' : COLORS.textMid }}
              >
                {range}
              </button>
            ))}
          </div>
        </div>
        <PriceChart data={priceHistory} color={position.marketColors.primary} height={120} />
        <div className="flex justify-between mt-2 text-xs" style={{ color: COLORS.textMid }}>
          {priceHistory.filter((_, i) => i % 2 === 0).map((d, i) => (
            <span key={i}>{d.date}</span>
          ))}
        </div>
      </div>
      
      {/* Tabs */}
      <div className="mx-3 mt-3 flex gap-2">
        {['stats', 'trades', 'market'].map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className="flex-1 py-2 text-sm font-bold uppercase rounded-t-xl"
            style={{
              background: activeTab === tab ? COLORS.panelBg : COLORS.panelShadow,
              color: activeTab === tab ? COLORS.textDark : '#FFF',
              border: activeTab === tab ? `3px solid ${COLORS.panelBorder}` : 'none',
              borderBottom: activeTab === tab ? `3px solid ${COLORS.panelBg}` : 'none',
              marginBottom: activeTab === tab ? -3 : 0,
            }}
          >
            {tab}
          </button>
        ))}
      </div>
      
      {/* Tab content */}
      <div 
        className="mx-3 p-4 -mt-px"
        style={{ 
          background: COLORS.panelBg,
          border: `3px solid ${COLORS.panelBorder}`,
          borderRadius: '0 0 16px 16px',
          boxShadow: `4px 4px 0 ${COLORS.panelShadow}`,
        }}
      >
        {activeTab === 'stats' && (
          <div className="grid grid-cols-2 gap-3">
            {[
              { label: 'Current Price', value: `${(position.price * 100).toFixed(0)}¢` },
              { label: 'Avg Buy Price', value: `${(position.avgPrice * 100).toFixed(0)}¢` },
              { label: 'Shares Held', value: '200' },
              { label: 'Total Invested', value: `$${(position.avgPrice * 200).toFixed(0)}` },
              { label: 'Current Value', value: `$${(position.price * 200).toFixed(0)}` },
              { label: 'Unrealized P&L', value: `${isProfit ? '+' : ''}$${((position.price - position.avgPrice) * 200).toFixed(0)}`, color: isProfit ? COLORS.profit : COLORS.loss },
            ].map((stat, i) => (
              <div key={i} className="p-3 rounded-xl" style={{ background: '#F0F0E8', border: `2px solid ${COLORS.panelBorder}` }}>
                <p className="text-xs font-bold mb-1" style={{ color: COLORS.textMid }}>{stat.label}</p>
                <p className="text-lg font-bold" style={{ color: stat.color || COLORS.textDark }}>{stat.value}</p>
              </div>
            ))}
          </div>
        )}
        
        {activeTab === 'trades' && (
          <div className="space-y-2">
            {tradeHistory.map((trade, i) => (
              <div key={i} className="flex items-center justify-between p-3 rounded-xl" style={{ background: '#F0F0E8', border: `2px solid ${COLORS.panelBorder}` }}>
                <div className="flex items-center gap-3">
                  <span className="text-xs font-bold px-2 py-1 rounded" style={{ background: trade.action === 'BUY' ? COLORS.profit : COLORS.loss, color: '#FFF' }}>{trade.action}</span>
                  <div>
                    <p className="text-sm font-bold" style={{ color: COLORS.textDark }}>{trade.shares} shares @ {(trade.price * 100).toFixed(0)}¢</p>
                    <p className="text-xs" style={{ color: COLORS.textMid }}>{trade.date}</p>
                  </div>
                </div>
                <span className="text-sm font-bold" style={{ color: COLORS.textDark }}>${trade.total}</span>
              </div>
            ))}
          </div>
        )}
        
        {activeTab === 'market' && (
          <div className="space-y-3">
            {[
              { label: 'Market Volume', value: '$2.4M' },
              { label: 'Resolution Date', value: 'Dec 31, 2026' },
              { label: 'Category', value: position.category.charAt(0).toUpperCase() + position.category.slice(1) },
            ].map((item, i) => (
              <div key={i} className="flex justify-between p-3 rounded-xl" style={{ background: '#F0F0E8', border: `2px solid ${COLORS.panelBorder}` }}>
                <span className="text-sm" style={{ color: COLORS.textMid }}>{item.label}</span>
                <span className="text-sm font-bold" style={{ color: COLORS.textDark }}>{item.value}</span>
              </div>
            ))}
            <a href="#" className="block text-center py-2 text-sm font-bold underline" style={{ color: position.marketColors.primary }}>
              View on Polymarket →
            </a>
          </div>
        )}
      </div>
      
      {/* Action buttons */}
      <div 
        className="fixed bottom-0 left-0 right-0 p-3"
        style={{ background: `linear-gradient(180deg, transparent 0%, ${COLORS.bgGradientBottom} 30%)` }}
      >
        <div className="grid grid-cols-2 gap-3 max-w-md mx-auto">
          <button 
            className="py-4 rounded-xl text-lg font-bold transition-all active:translate-y-1"
            style={{ background: COLORS.profit, color: '#FFF', border: `3px solid #38A838`, boxShadow: `0 4px 0 #38A838` }}
          >
            🍖 FEED
          </button>
          <button 
            className="py-4 rounded-xl text-lg font-bold transition-all active:translate-y-1"
            style={{ background: '#F85888', color: '#FFF', border: `3px solid #D84878`, boxShadow: `0 4px 0 #D84878` }}
          >
            🏃 RELEASE
          </button>
        </div>
      </div>
    </div>
  );
};

export default function SigilsWithHabitats() {
  const [selected, setSelected] = useState(null);
  const [viewingDetail, setViewingDetail] = useState(null);
  const totalValue = 1847;
  const totalPnL = 16.2;
  
  // Show detail view if a position is being viewed
  if (viewingDetail) {
    return <DetailView position={viewingDetail} onBack={() => setViewingDetail(null)} />;
  }
  
  return (
    <div 
      className="min-h-screen pb-8"
      style={{ background: `linear-gradient(180deg, ${COLORS.bgGradientTop} 0%, ${COLORS.bgGradientBottom} 100%)` }}
    >
      {/* Header */}
      <header 
        className="mx-3 mt-3 px-4 py-3 flex items-center justify-between"
        style={{ 
          background: COLORS.panelBg,
          border: `3px solid ${COLORS.panelBorder}`,
          borderRadius: 16,
          boxShadow: `4px 4px 0 ${COLORS.panelShadow}`,
        }}
      >
        <div className="flex items-center gap-3">
          <div 
            className="w-10 h-10 rounded-xl flex items-center justify-center text-xl"
            style={{ background: '#6858A8', color: '#FFF' }}
          >
            ◈
          </div>
          <div>
            <span className="text-xl font-bold block" style={{ color: COLORS.textDark }}>
              SIGILS
            </span>
            <span className="text-xs" style={{ color: COLORS.textMid }}>
              My Collection
            </span>
          </div>
        </div>
        <div 
          className="px-3 py-1.5 rounded-full text-sm font-bold flex items-center gap-2"
          style={{ background: COLORS.profit, color: '#FFF' }}
        >
          <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
          LIVE
        </div>
      </header>
      
      {/* Stats */}
      <div 
        className="mx-3 mt-3 p-4"
        style={{ 
          background: COLORS.panelBg,
          border: `3px solid ${COLORS.panelBorder}`,
          borderRadius: 16,
          boxShadow: `4px 4px 0 ${COLORS.panelShadow}`,
        }}
      >
        <div className="flex justify-between items-end">
          <div>
            <p className="text-sm font-bold mb-1" style={{ color: COLORS.textMid }}>COLLECTION</p>
            <p className="text-4xl font-bold" style={{ color: COLORS.textDark }}>${totalValue}</p>
          </div>
          <div className="text-right">
            <p className="text-2xl font-bold" style={{ color: COLORS.profit }}>+{totalPnL}%</p>
            <p className="text-sm" style={{ color: COLORS.textMid }}>{positions.length} Sigils</p>
          </div>
        </div>
      </div>
      
      {/* Sigil list */}
      <div className="mx-3 mt-3 space-y-3">
        {positions.map((position, i) => (
          <div 
            key={position.id}
            style={{ animation: `slideIn 0.4s ease-out ${i * 0.08}s both` }}
          >
            <CreatureCard 
              position={position}
              onClick={setViewingDetail}
              isSelected={selected?.id === position.id}
            />
          </div>
        ))}
      </div>
      
      <style>{`
        @keyframes slideIn {
          from { opacity: 0; transform: translateX(-20px); }
          to { opacity: 1; transform: translateX(0); }
        }
      `}</style>
    </div>
  );
}
