# CLAUDE.md - Sigils Project Instructions

> **Project**: Sigils - A Pokemon-style Polymarket portfolio wallet
> **Goal**: Build a production-ready web app where users can view and trade Polymarket positions as evolving creatures

---

## Quick Start

```bash
# Create Next.js 14 project
npx create-next-app@latest sigils --typescript --tailwind --app --src-dir=false --import-alias="@/*"
cd sigils

# Install core dependencies
npm install zustand @tanstack/react-query framer-motion recharts color-thief-browser
npm install @wagmi/core @wagmi/connectors viem @walletconnect/modal @reown/appkit @reown/appkit-adapter-wagmi
npm install sharp  # For sprite processing

# Create folder structure
mkdir -p components/{ui,sigil,wallet,trading,layout}
mkdir -p lib/{polymarket,wallet,sprites,utils,points}
mkdir -p stores hooks types
mkdir -p public/sprites/{politics,crypto,sports,macro,tech,space,geo}
mkdir -p app/api/{positions,market,trade}
```

---

## Project Context

**What is Sigils?**
- Users enter a Polymarket wallet address OR connect their wallet
- Their positions appear as Pokemon-like creatures that evolve based on price (0-33¢ = Lv1, 33-66¢ = Lv2, 66-100¢ = Lv3)
- 7 creature categories: Politics (eagle), Crypto (crystal), Sports (fox), Macro (turtle), Tech (robot), Space (moth), Geo (owl)
- Colors extracted from market thumbnails, applied to creatures
- Full trading: "Feed" (buy more), "Release" (sell)

**Design Style**: Pokemon GBA FireRed/LeafGreen - chunky 3D borders, pixel art, bright sky-blue gradient backgrounds

---

## Critical Files Reference

Read these files from the project for detailed specifications:
- `SIGILS_BUILD_SPEC.md` - Complete technical specification
- `SIGILS_SPRITE_GUIDE.md` - Sprite generation instructions
- `sigils-with-habitats.jsx` - Reference React prototype with all styling

---

## Implementation Order

### Phase 1: Foundation
1. Set up Next.js with TypeScript + Tailwind
2. Configure tailwind.config.ts with custom colors (see Design System below)
3. Add CSS variables to globals.css
4. Create types/index.ts with all TypeScript interfaces
5. Create utility functions in lib/utils/

### Phase 2: Core Components
1. Panel.tsx - GBA-style panel with border and shadow
2. Button.tsx - Chunky game button with press animation
3. SigilSprite.tsx - Animated creature (use SVG placeholders initially)
4. SigilHabitat.tsx - Pixelated pedestal under creature
5. EvolutionBar.tsx - 3-segment level progress bar
6. SigilCard.tsx - Card showing creature + info

### Phase 3: API Integration
1. lib/polymarket/data-api.ts - Fetch positions, trades
2. lib/polymarket/clob-api.ts - Price history, orderbook
3. lib/polymarket/gamma-api.ts - Market metadata
4. lib/polymarket/categories.ts - Detect category from market
5. lib/sprites/colors.ts - Extract colors from thumbnails
6. app/api/positions/route.ts - API route for positions

### Phase 4: State & Pages
1. stores/wallet-store.ts (Zustand + persist)
2. stores/positions-store.ts
3. app/page.tsx - Landing with wallet input
4. app/collection/page.tsx - Grid of Sigils
5. app/sigil/[id]/page.tsx - Detail view

### Phase 5: Wallet & Trading
1. lib/wallet/config.ts - Wagmi + WalletConnect setup
2. components/wallet/WalletConnect.tsx
3. components/trading/FeedModal.tsx
4. components/trading/ReleaseModal.tsx
5. app/api/trade/route.ts

### Phase 6: Sprites & Polish
1. Generate sprites using PixelLab (see SIGILS_SPRITE_GUIDE.md)
2. Process and optimize sprites
3. Add Framer Motion animations
4. Add loading states and error handling

---

## Design System

### Colors (CSS Variables)
```css
:root {
  --bg-blue: #58B8E8;
  --bg-light: #88D0F0;
  --panel-bg: #F8F8F0;
  --panel-border: #484868;
  --panel-shadow: #A8A8B8;
  --text-dark: #383850;
  --text-mid: #606078;
  --hp-green: #48D848;
  --hp-yellow: #F8C838;
  --hp-red: #E85048;
  --accent-pink: #F85888;
  --accent-blue: #6898F8;
}
```

### Tailwind Config Additions
```typescript
theme: {
  extend: {
    colors: {
      'panel-bg': 'var(--panel-bg)',
      'panel-border': 'var(--panel-border)',
      // ... all CSS variables
    },
    borderWidth: { '3': '3px' },
    boxShadow: {
      'panel': '4px 4px 0 var(--panel-shadow)',
    },
  },
}
```

### Panel Style Pattern
```tsx
<div className="bg-panel-bg border-3 border-panel-border rounded-2xl shadow-panel p-4">
  {children}
</div>
```

---

## Polymarket API Quick Reference

### Data API (No Auth Required)
```
Base: https://data-api.polymarket.com

GET /positions?user={walletAddress}
GET /trades?user={walletAddress}
GET /closed-positions?user={walletAddress}
```

### CLOB API
```
Base: https://clob.polymarket.com

GET /price?token_id={tokenId}
GET /prices-history?market={tokenId}&interval=1d&fidelity=100
GET /book?token_id={tokenId}
POST /order (requires auth for trading)
```

### Gamma API
```
Base: https://gamma-api.polymarket.com

GET /markets?slug={slug}
GET /markets?tag={category}
```

---

## Key Type Definitions

```typescript
interface Position {
  proxyWallet: string;
  asset: string;
  conditionId: string;
  avgPrice: number;
  size: number;
  currPrice: number;
  currentValue: number;
  totalBought: number;
  totalPnl: number;
  outcome: 'Yes' | 'No';
  title: string;
  slug: string;
  icon: string;
}

interface Sigil {
  id: string;
  position: Position;
  category: Category;
  evolutionLevel: number; // 0, 1, or 2
  colors: ColorPalette;
  emoji: string;
}

type Category = 'politics' | 'crypto' | 'sports' | 'macro' | 'tech' | 'space' | 'geo';

interface ColorPalette {
  primary: string;
  secondary: string;
  accent: string;
  shadow: string;
}
```

---

## Evolution Logic

```typescript
function getEvolutionLevel(price: number): number {
  if (price >= 0.66) return 2; // Lv.3
  if (price >= 0.33) return 1; // Lv.2
  return 0; // Lv.1
}

const CATEGORY_CREATURES = {
  politics: ['Pollster', 'Caucus', 'Senator'],
  crypto: ['Hashling', 'Blockbit', 'Chainlord'],
  sports: ['Rookie', 'Varsity', 'MVP'],
  macro: ['Yield', 'Dividend', 'Reserve'],
  tech: ['Byte', 'Megabyte', 'Quantum'],
  space: ['Orbit', 'Nova', 'Cosmos'],
  geo: ['Scout', 'Atlas', 'Sovereign'],
};
```

---

## Category Detection

```typescript
const CATEGORY_KEYWORDS = {
  politics: ['election', 'president', 'trump', 'biden', 'senate', 'congress'],
  crypto: ['bitcoin', 'btc', 'ethereum', 'crypto', 'blockchain'],
  sports: ['nfl', 'nba', 'super bowl', 'championship', 'playoffs'],
  macro: ['fed', 'interest rate', 'inflation', 'recession', 'gdp'],
  tech: ['apple', 'google', 'ai', 'artificial intelligence'],
  space: ['spacex', 'nasa', 'rocket', 'mars', 'starship'],
  geo: ['china', 'russia', 'ukraine', 'war', 'nato'],
};

function detectCategory(title: string, tags?: string[]): Category {
  const text = title.toLowerCase();
  for (const [category, keywords] of Object.entries(CATEGORY_KEYWORDS)) {
    if (keywords.some(k => text.includes(k))) return category as Category;
  }
  return 'politics'; // default
}
```

---

## Environment Variables

Create `.env.local`:
```
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=your_project_id
NEXT_PUBLIC_POLYGON_RPC_URL=https://polygon-rpc.com
PIXELLAB_API_KEY=your_pixellab_key
```

Get WalletConnect Project ID from: https://cloud.walletconnect.com

---

## WalletConnect Setup

```typescript
// lib/wallet/config.ts
import { createConfig, http } from 'wagmi';
import { polygon } from 'wagmi/chains';
import { walletConnect, injected } from 'wagmi/connectors';

export const wagmiConfig = createConfig({
  chains: [polygon],
  connectors: [
    walletConnect({
      projectId: process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID!,
      metadata: {
        name: 'Sigils',
        description: 'Pokemon-style Polymarket wallet',
        url: 'https://sigils.app',
        icons: ['https://sigils.app/icon.png'],
      },
    }),
    injected(),
  ],
  transports: {
    [polygon.id]: http(),
  },
});
```

---

## Color Extraction

```typescript
// lib/sprites/colors.ts
import ColorThief from 'color-thief-browser';

export async function extractColors(imageUrl: string): Promise<ColorPalette> {
  const img = new Image();
  img.crossOrigin = 'Anonymous';
  img.src = imageUrl;
  await img.decode();
  
  const colorThief = new ColorThief();
  const palette = colorThief.getPalette(img, 4);
  
  return {
    primary: rgbToHex(palette[0]),
    secondary: rgbToHex(palette[1]),
    accent: rgbToHex(palette[2]),
    shadow: darkenColor(rgbToHex(palette[0]), 30),
  };
}
```

---

## Testing Checklist

- [ ] Landing page loads
- [ ] Can enter wallet address
- [ ] Positions fetch successfully
- [ ] Colors extract from thumbnails
- [ ] Cards display correctly
- [ ] Evolution level calculates correctly
- [ ] Detail page shows price chart
- [ ] WalletConnect modal opens
- [ ] Connected wallet shows address
- [ ] Feed/Release modals open
- [ ] Mobile responsive
- [ ] Desktop layout works

---

## Deployment

```bash
# Build
npm run build

# Deploy to Vercel
vercel deploy --prod
```

Set environment variables in Vercel dashboard before deploying.

---

## Common Issues

**CORS errors with Polymarket API**: Use Next.js API routes as proxy

**Color extraction fails**: Images must be served with CORS headers, or proxy through your API

**WalletConnect not connecting**: Ensure project ID is valid and domain is whitelisted

**Sprites not rendering**: Check file paths, ensure imageRendering: 'pixelated' is set

---

## Reference Prototype

The file `sigils-with-habitats.jsx` contains a working React prototype with:
- All styling and colors
- SVG placeholder sprites
- Evolution bar component
- Card layout
- Detail view structure

Use this as reference for exact styling and component structure.

---

*Remember: Build incrementally, test each phase before moving on.*
