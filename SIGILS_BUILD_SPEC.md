# SIGILS - Polymarket Pokemon Wallet
## Complete Build Specification for Claude Code

---

## Table of Contents
1. [Project Overview](#1-project-overview)
2. [Technical Stack](#2-technical-stack)
3. [Project Structure](#3-project-structure)
4. [Core Features](#4-core-features)
5. [API Integration](#5-api-integration)
6. [Sprite & Art System](#6-sprite--art-system)
7. [Component Specifications](#7-component-specifications)
8. [Data Models](#8-data-models)
9. [State Management](#9-state-management)
10. [Styling & Design System](#10-styling--design-system)
11. [Build & Deployment](#11-build--deployment)
12. [Step-by-Step Implementation](#12-step-by-step-implementation)

---

## 1. Project Overview

### 1.1 What is Sigils?
Sigils is a gamified Polymarket portfolio viewer and trading app styled like Pokemon. Each prediction market position is visualized as a living creature ("Sigil") that evolves based on the market price. Users can view their positions, see detailed analytics, and execute trades directly from the app.

### 1.2 Core Value Proposition
- **For casual users**: Fun, engaging way to check prediction market positions daily
- **For traders**: Full trading functionality with a unique UX
- **Gamification**: Evolution system, points/credits (future), collection mechanics

### 1.3 Target Platforms
- **Primary**: Mobile web (iOS Safari, Android Chrome)
- **Secondary**: Desktop web (Chrome, Firefox, Safari)
- **Future**: Native mobile apps via React Native or Capacitor

### 1.4 User Flows

```
FLOW 1: Read-Only Viewing (No Auth)
┌─────────────────────────────────────────────────────────────┐
│ Landing Page → Enter Wallet Address → View Collection       │
│                     OR                                      │
│ Landing Page → Paste Polymarket Profile URL → View          │
└─────────────────────────────────────────────────────────────┘

FLOW 2: Connected Wallet (Full Trading)
┌─────────────────────────────────────────────────────────────┐
│ Landing Page → Connect Wallet (WalletConnect) → View        │
│ Collection → Tap Sigil → Detail View → Feed/Release         │
└─────────────────────────────────────────────────────────────┘
```

---

## 2. Technical Stack

### 2.1 Frontend Framework
```
Framework: Next.js 14 (App Router)
Language: TypeScript
Styling: Tailwind CSS + CSS Variables for theming
State: Zustand (lightweight, simple)
```

### 2.2 Key Dependencies
```json
{
  "dependencies": {
    "next": "^14.2.0",
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "typescript": "^5.4.0",
    "tailwindcss": "^3.4.0",
    "zustand": "^4.5.0",
    "@wagmi/core": "^2.6.0",
    "@wagmi/connectors": "^4.1.0",
    "viem": "^2.8.0",
    "@walletconnect/modal": "^2.6.0",
    "@tanstack/react-query": "^5.28.0",
    "color-thief-browser": "^1.0.0",
    "framer-motion": "^11.0.0",
    "recharts": "^2.12.0"
  },
  "devDependencies": {
    "@types/node": "^20.0.0",
    "@types/react": "^18.2.0",
    "eslint": "^8.57.0",
    "eslint-config-next": "^14.2.0"
  }
}
```

### 2.3 External APIs
| API | Purpose | Auth Required |
|-----|---------|---------------|
| Polymarket Data API | Positions, trades, P&L | No (public wallet data) |
| Polymarket CLOB API | Trading, price history, orderbook | Yes (for trading) |
| Polymarket Gamma API | Market metadata, thumbnails | No |
| WalletConnect | Wallet connection & signing | User wallet |
| PixelLab API | Sprite generation | API Key |

### 2.4 Environment Variables
```env
# .env.local
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=your_project_id
NEXT_PUBLIC_POLYGON_RPC_URL=https://polygon-rpc.com
PIXELLAB_API_KEY=your_pixellab_key

# Server-side only (for Builder trading)
POLYMARKET_BUILDER_API_KEY=your_builder_key
POLYMARKET_BUILDER_SECRET=your_builder_secret
POLYMARKET_BUILDER_PASSPHRASE=your_builder_passphrase
```

---

## 3. Project Structure

```
sigils/
├── app/
│   ├── layout.tsx                 # Root layout with providers
│   ├── page.tsx                   # Landing/home page
│   ├── collection/
│   │   └── page.tsx               # Collection view (list of Sigils)
│   ├── sigil/
│   │   └── [id]/
│   │       └── page.tsx           # Individual Sigil detail view
│   ├── api/
│   │   ├── positions/
│   │   │   └── route.ts           # Fetch positions for wallet
│   │   ├── market/
│   │   │   └── [id]/
│   │   │       └── route.ts       # Market metadata & price history
│   │   ├── trade/
│   │   │   └── route.ts           # Execute trades (POST)
│   │   └── sprites/
│   │       └── generate/
│   │           └── route.ts       # Generate sprites via PixelLab
│   └── globals.css                # Global styles + Tailwind
├── components/
│   ├── ui/                        # Reusable UI components
│   │   ├── Panel.tsx              # GBA-style panel
│   │   ├── Button.tsx             # Chunky game buttons
│   │   ├── ProgressBar.tsx        # Evolution progress bar
│   │   ├── PriceChart.tsx         # Sparkline chart
│   │   └── TabGroup.tsx           # Tab navigation
│   ├── sigil/
│   │   ├── SigilCard.tsx          # Card in collection view
│   │   ├── SigilSprite.tsx        # Animated sprite component
│   │   ├── SigilHabitat.tsx       # Pixelated pedestal
│   │   ├── EvolutionBar.tsx       # Level progress visualization
│   │   └── SigilDetail.tsx        # Full detail view
│   ├── wallet/
│   │   ├── WalletInput.tsx        # Manual address input
│   │   ├── WalletConnect.tsx      # WalletConnect button
│   │   └── WalletStatus.tsx       # Connected wallet display
│   ├── trading/
│   │   ├── FeedModal.tsx          # Buy more shares
│   │   ├── ReleaseModal.tsx       # Sell shares
│   │   └── TradeConfirmation.tsx  # Confirmation dialog
│   └── layout/
│       ├── Header.tsx             # App header
│       ├── Navigation.tsx         # Bottom nav (mobile)
│       └── LoadingScreen.tsx      # Pokemon-style loading
├── lib/
│   ├── polymarket/
│   │   ├── data-api.ts            # Data API client
│   │   ├── clob-api.ts            # CLOB API client
│   │   ├── gamma-api.ts           # Gamma API client
│   │   └── types.ts               # API response types
│   ├── wallet/
│   │   ├── config.ts              # Wagmi/WalletConnect config
│   │   ├── hooks.ts               # Custom wallet hooks
│   │   └── utils.ts               # Address parsing, validation
│   ├── sprites/
│   │   ├── categories.ts          # Category → creature mapping
│   │   ├── evolution.ts           # Evolution logic
│   │   ├── colors.ts              # Color extraction utilities
│   │   └── pixellab.ts            # PixelLab API client
│   └── utils/
│       ├── format.ts              # Number/price formatting
│       ├── constants.ts           # App constants
│       └── cn.ts                  # Classname utility
├── stores/
│   ├── wallet-store.ts            # Wallet connection state
│   ├── positions-store.ts         # User positions state
│   └── ui-store.ts                # UI state (modals, etc.)
├── hooks/
│   ├── usePositions.ts            # Fetch & cache positions
│   ├── useMarket.ts               # Fetch market data
│   ├── usePriceHistory.ts         # Fetch price history
│   └── useTrade.ts                # Execute trades
├── types/
│   └── index.ts                   # Global TypeScript types
├── public/
│   ├── sprites/                   # Pre-generated sprite images
│   │   ├── politics/
│   │   ├── crypto/
│   │   ├── sports/
│   │   ├── macro/
│   │   ├── tech/
│   │   ├── space/
│   │   └── geo/
│   └── sounds/                    # UI sounds (optional)
├── tailwind.config.ts
├── next.config.js
├── tsconfig.json
└── package.json
```

---

## 4. Core Features

### 4.1 Feature: Wallet Connection

**Read-Only Mode (No Auth)**
```typescript
// User can enter any wallet address or Polymarket profile URL
// Example inputs:
// - 0x1234...abcd
// - https://polymarket.com/@username
// - @username

// Parse and validate input
function parseWalletInput(input: string): string | null {
  // Check if it's a valid Ethereum address
  if (/^0x[a-fA-F0-9]{40}$/.test(input)) {
    return input;
  }
  
  // Check if it's a Polymarket URL
  const urlMatch = input.match(/polymarket\.com\/@(\w+)/);
  if (urlMatch) {
    // Fetch wallet address from profile API
    return fetchWalletFromUsername(urlMatch[1]);
  }
  
  // Check if it's just a username
  if (/^@?\w+$/.test(input)) {
    return fetchWalletFromUsername(input.replace('@', ''));
  }
  
  return null;
}
```

**Connected Mode (WalletConnect)**
```typescript
// Use WalletConnect for full trading capabilities
// Config in lib/wallet/config.ts

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
    [polygon.id]: http(process.env.NEXT_PUBLIC_POLYGON_RPC_URL),
  },
});
```

### 4.2 Feature: Position Fetching

```typescript
// lib/polymarket/data-api.ts

const DATA_API_BASE = 'https://data-api.polymarket.com';

export interface Position {
  proxyWallet: string;
  asset: string;
  conditionId: string;
  avgPrice: number;
  size: number;
  currPrice: number;
  currentValue: number;
  cashPnl: number;
  totalBought: number;
  realizedPnl: number;
  totalPnl: number;
  outcome: string;
  outcomeIndex: number;
  title: string;
  slug: string;
  icon: string;
  eventSlug: string;
}

export async function fetchPositions(walletAddress: string): Promise<Position[]> {
  const response = await fetch(
    `${DATA_API_BASE}/positions?user=${walletAddress}`
  );
  
  if (!response.ok) {
    throw new Error('Failed to fetch positions');
  }
  
  return response.json();
}

export async function fetchTrades(walletAddress: string): Promise<Trade[]> {
  const response = await fetch(
    `${DATA_API_BASE}/trades?user=${walletAddress}`
  );
  
  if (!response.ok) {
    throw new Error('Failed to fetch trades');
  }
  
  return response.json();
}

export async function fetchClosedPositions(walletAddress: string): Promise<Position[]> {
  const response = await fetch(
    `${DATA_API_BASE}/closed-positions?user=${walletAddress}`
  );
  
  if (!response.ok) {
    throw new Error('Failed to fetch closed positions');
  }
  
  return response.json();
}
```

### 4.3 Feature: Market Data & Price History

```typescript
// lib/polymarket/clob-api.ts

const CLOB_API_BASE = 'https://clob.polymarket.com';

export async function fetchPriceHistory(
  tokenId: string,
  interval: '1m' | '5m' | '1h' | '1d' = '1d',
  fidelity: number = 100
): Promise<PricePoint[]> {
  const response = await fetch(
    `${CLOB_API_BASE}/prices-history?market=${tokenId}&interval=${interval}&fidelity=${fidelity}`
  );
  
  if (!response.ok) {
    throw new Error('Failed to fetch price history');
  }
  
  return response.json();
}

export async function fetchCurrentPrice(tokenId: string): Promise<number> {
  const response = await fetch(
    `${CLOB_API_BASE}/price?token_id=${tokenId}`
  );
  
  if (!response.ok) {
    throw new Error('Failed to fetch current price');
  }
  
  const data = await response.json();
  return parseFloat(data.price);
}
```

### 4.4 Feature: Trading (Feed/Release)

```typescript
// lib/polymarket/trading.ts
// This requires Builder API credentials

import { ClobClient, Side, OrderType } from '@polymarket/clob-client';

export async function createBuyOrder(params: {
  tokenId: string;
  amount: number; // USD amount
  price?: number; // Limit price (optional, market order if not provided)
  privateKey: string;
}) {
  const clobClient = new ClobClient(
    'https://clob.polymarket.com',
    polygon.id,
    params.privateKey
  );
  
  if (params.price) {
    // Limit order
    const order = {
      tokenID: params.tokenId,
      price: params.price,
      size: params.amount / params.price,
      side: Side.BUY,
    };
    
    return clobClient.createAndPostOrder(order);
  } else {
    // Market order (Fill or Kill)
    const marketOrder = {
      tokenID: params.tokenId,
      amount: params.amount,
      side: Side.BUY,
    };
    
    return clobClient.createAndPostMarketOrder(
      marketOrder,
      { negRisk: false },
      OrderType.FOK
    );
  }
}

export async function createSellOrder(params: {
  tokenId: string;
  shares: number;
  price?: number;
  privateKey: string;
}) {
  const clobClient = new ClobClient(
    'https://clob.polymarket.com',
    polygon.id,
    params.privateKey
  );
  
  if (params.price) {
    // Limit order
    const order = {
      tokenID: params.tokenId,
      price: params.price,
      size: params.shares,
      side: Side.SELL,
    };
    
    return clobClient.createAndPostOrder(order);
  } else {
    // Market order
    const marketOrder = {
      tokenID: params.tokenId,
      amount: params.shares,
      side: Side.SELL,
    };
    
    return clobClient.createAndPostMarketOrder(
      marketOrder,
      { negRisk: false },
      OrderType.FOK
    );
  }
}
```

### 4.5 Feature: Evolution System

```typescript
// lib/sprites/evolution.ts

export interface EvolutionLevel {
  level: number;
  name: string;
  minPrice: number;
  maxPrice: number;
}

export const EVOLUTION_THRESHOLDS = {
  level1: { min: 0, max: 0.33 },    // 0-33¢
  level2: { min: 0.33, max: 0.66 }, // 33-66¢
  level3: { min: 0.66, max: 1.0 },  // 66-100¢
};

export function getEvolutionLevel(price: number): number {
  if (price >= 0.66) return 2; // Max evolution
  if (price >= 0.33) return 1; // Evolved
  return 0; // Base form
}

export function getProgressInLevel(price: number): number {
  const level = getEvolutionLevel(price);
  const thresholds = [0, 0.33, 0.66, 1.0];
  const start = thresholds[level];
  const end = thresholds[level + 1];
  return ((price - start) / (end - start)) * 100;
}

// Category to creature type mapping
export const CATEGORY_CREATURES = {
  politics: {
    evolutions: ['Pollster', 'Caucus', 'Senator'],
    baseSprite: 'eagle',
  },
  crypto: {
    evolutions: ['Hashling', 'Blockbit', 'Chainlord'],
    baseSprite: 'crystal',
  },
  sports: {
    evolutions: ['Rookie', 'Varsity', 'MVP'],
    baseSprite: 'fox',
  },
  macro: {
    evolutions: ['Yield', 'Dividend', 'Reserve'],
    baseSprite: 'turtle',
  },
  tech: {
    evolutions: ['Byte', 'Megabyte', 'Quantum'],
    baseSprite: 'robot',
  },
  space: {
    evolutions: ['Orbit', 'Nova', 'Cosmos'],
    baseSprite: 'moth',
  },
  geo: {
    evolutions: ['Scout', 'Atlas', 'Sovereign'],
    baseSprite: 'owl',
  },
};
```

### 4.6 Feature: Points/Credits System (Future)

```typescript
// lib/points/system.ts
// Placeholder for future implementation

export interface PointsEvent {
  type: 'evolution' | 'trade' | 'win' | 'streak';
  points: number;
  timestamp: Date;
  details: Record<string, any>;
}

export const POINTS_CONFIG = {
  evolution: {
    toLevel2: 100,  // Points for evolving to Lv2
    toLevel3: 250,  // Points for evolving to Lv3
  },
  trade: {
    buy: 10,        // Points per trade
    sell: 10,
  },
  win: {
    resolved: 500,  // Points when market resolves in your favor
  },
  streak: {
    daily: 25,      // Points for daily check-in
    weekly: 100,    // Bonus for 7-day streak
  },
};

// This would integrate with a backend/database
// For MVP, store in localStorage
export function trackEvolutionPoints(
  previousLevel: number,
  newLevel: number
): number {
  if (newLevel <= previousLevel) return 0;
  
  let points = 0;
  if (previousLevel < 1 && newLevel >= 1) {
    points += POINTS_CONFIG.evolution.toLevel2;
  }
  if (previousLevel < 2 && newLevel >= 2) {
    points += POINTS_CONFIG.evolution.toLevel3;
  }
  
  return points;
}
```

---

## 5. API Integration

### 5.1 Polymarket Data API

**Base URL**: `https://data-api.polymarket.com`

| Endpoint | Method | Description | Auth |
|----------|--------|-------------|------|
| `/positions?user={address}` | GET | Current positions | No |
| `/trades?user={address}` | GET | Trade history | No |
| `/closed-positions?user={address}` | GET | Resolved positions | No |
| `/activity?user={address}` | GET | On-chain activity | No |

**Example Response - Positions**:
```json
[
  {
    "proxyWallet": "0x1234...",
    "asset": "0xabcd...",
    "conditionId": "0x5678...",
    "avgPrice": 0.47,
    "size": 200,
    "currPrice": 0.68,
    "currentValue": 136,
    "cashPnl": 42,
    "totalBought": 94,
    "realizedPnl": 0,
    "totalPnl": 42,
    "outcome": "Yes",
    "outcomeIndex": 0,
    "title": "SpaceX IPO before 2027?",
    "slug": "spacex-ipo-2027",
    "icon": "https://polymarket-upload.s3.amazonaws.com/spacex.jpg",
    "eventSlug": "spacex-ipo"
  }
]
```

### 5.2 Polymarket CLOB API

**Base URL**: `https://clob.polymarket.com`

| Endpoint | Method | Description | Auth |
|----------|--------|-------------|------|
| `/price?token_id={id}` | GET | Current price | No |
| `/prices-history?market={id}` | GET | Price history | No |
| `/book?token_id={id}` | GET | Order book | No |
| `/order` | POST | Place order | Yes |
| `/order` | DELETE | Cancel order | Yes |

**Price History Parameters**:
- `interval`: `1m`, `5m`, `1h`, `1d`
- `fidelity`: Number of data points (default 100)

### 5.3 Polymarket Gamma API

**Base URL**: `https://gamma-api.polymarket.com`

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/markets` | GET | List all markets |
| `/markets?slug={slug}` | GET | Single market by slug |
| `/events?slug={slug}` | GET | Event with markets |
| `/markets?tag={tag}` | GET | Markets by category |

**Example Response - Market**:
```json
{
  "id": "12345",
  "question": "Will SpaceX IPO before 2027?",
  "slug": "spacex-ipo-2027",
  "conditionId": "0x5678...",
  "tokens": [
    {"token_id": "0xYES...", "outcome": "Yes"},
    {"token_id": "0xNO...", "outcome": "No"}
  ],
  "image": "https://polymarket-upload.s3.amazonaws.com/spacex.jpg",
  "icon": "https://polymarket-upload.s3.amazonaws.com/spacex-icon.jpg",
  "active": true,
  "closed": false,
  "volume": 2400000,
  "liquidity": 150000,
  "endDate": "2026-12-31T23:59:59Z",
  "tags": ["space", "tech", "ipo"]
}
```

### 5.4 Category Detection

```typescript
// lib/polymarket/categories.ts

const CATEGORY_KEYWORDS = {
  politics: ['election', 'president', 'congress', 'vote', 'trump', 'biden', 'senate', 'house', 'governor', 'mayor'],
  crypto: ['bitcoin', 'btc', 'ethereum', 'eth', 'crypto', 'blockchain', 'defi', 'nft', 'token'],
  sports: ['nfl', 'nba', 'mlb', 'nhl', 'super bowl', 'championship', 'world series', 'playoffs', 'mvp'],
  macro: ['fed', 'interest rate', 'inflation', 'gdp', 'recession', 'unemployment', 'treasury'],
  tech: ['apple', 'google', 'microsoft', 'ai', 'artificial intelligence', 'iphone', 'software'],
  space: ['spacex', 'nasa', 'rocket', 'mars', 'moon', 'satellite', 'starship', 'astronaut'],
  geo: ['china', 'russia', 'ukraine', 'war', 'nato', 'taiwan', 'israel', 'conflict'],
};

export function detectCategory(market: { title: string; tags?: string[] }): string {
  const text = market.title.toLowerCase();
  const tags = market.tags?.map(t => t.toLowerCase()) || [];
  
  // Check tags first
  for (const [category, keywords] of Object.entries(CATEGORY_KEYWORDS)) {
    if (tags.some(tag => keywords.includes(tag))) {
      return category;
    }
  }
  
  // Check title keywords
  for (const [category, keywords] of Object.entries(CATEGORY_KEYWORDS)) {
    if (keywords.some(keyword => text.includes(keyword))) {
      return category;
    }
  }
  
  // Default to most common
  return 'politics';
}
```

---

## 6. Sprite & Art System

### 6.1 Sprite Requirements

Each creature type needs:
- **3 evolution stages** (Lv1, Lv2, Lv3)
- **4 animation frames** per stage (idle animation)
- **64x64 pixel resolution**
- **Transparent background**
- **Color-swappable design** (primary, secondary, accent, shadow)

Total sprites needed: 7 categories × 3 evolutions × 4 frames = **84 sprite frames**

### 6.2 PixelLab API Integration

```typescript
// lib/sprites/pixellab.ts

const PIXELLAB_API_BASE = 'https://api.pixellab.ai/v1';

interface GenerateSpriteParams {
  prompt: string;
  style: 'pixel-art';
  size: '64x64';
  frames?: number;
  reference_image?: string;
}

export async function generateSprite(params: GenerateSpriteParams) {
  const response = await fetch(`${PIXELLAB_API_BASE}/generate`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${process.env.PIXELLAB_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      prompt: params.prompt,
      style: 'pixel-art',
      size: '64x64',
      frames: params.frames || 4,
      animation_type: 'idle',
      reference_image: params.reference_image,
    }),
  });
  
  if (!response.ok) {
    throw new Error('Failed to generate sprite');
  }
  
  return response.json();
}

// Batch generate all sprites
export async function generateAllSprites() {
  const prompts = {
    politics: {
      base: 'Pixel art eagle creature, Pokemon GBA style, majestic bird, political theme, 64x64, transparent background',
      evolutions: [
        'small eagle chick, simple feathers, cute',
        'medium eagle, spread wings, more detail',
        'large royal eagle, crown, golden accents, max evolution',
      ],
    },
    crypto: {
      base: 'Pixel art crystal slime creature, Pokemon GBA style, geometric, shiny, 64x64, transparent background',
      evolutions: [
        'small crystal blob, simple shape, glowing core',
        'medium crystal creature, multiple crystals, brighter',
        'large crystal lord, elaborate crystal formations, rainbow shimmer',
      ],
    },
    sports: {
      base: 'Pixel art fox creature, Pokemon GBA style, athletic, swift, 64x64, transparent background',
      evolutions: [
        'small fox pup, playful pose, simple',
        'medium athletic fox, running stance, speed lines',
        'champion fox, trophy, star badge, maximum speed',
      ],
    },
    macro: {
      base: 'Pixel art turtle creature, Pokemon GBA style, vault/bank theme, coin shell, 64x64, transparent background',
      evolutions: [
        'small turtle, simple shell, one coin',
        'medium turtle, decorated shell, stack of coins',
        'large vault turtle, golden shell, treasure pile',
      ],
    },
    tech: {
      base: 'Pixel art robot cube creature, Pokemon GBA style, digital, screen face, 64x64, transparent background',
      evolutions: [
        'small simple robot, basic screen face',
        'medium robot, antenna, arm extensions',
        'advanced robot, holographic display, hover jets',
      ],
    },
    space: {
      base: 'Pixel art cosmic moth creature, Pokemon GBA style, ethereal, starry wings, 64x64, transparent background',
      evolutions: [
        'small moth, simple wings, one star',
        'medium cosmic moth, larger wings, constellation pattern',
        'celestial moth, nebula wings, cosmic crown, galaxy dust',
      ],
    },
    geo: {
      base: 'Pixel art owl creature, Pokemon GBA style, wise, globe chest, 64x64, transparent background',
      evolutions: [
        'small owlet, big eyes, simple feathers',
        'medium owl, spread wings, map markings',
        'sovereign owl, crown, atlas globe, royal cape',
      ],
    },
  };
  
  // Generate each category
  for (const [category, config] of Object.entries(prompts)) {
    for (let evolution = 0; evolution < 3; evolution++) {
      const prompt = `${config.base}. ${config.evolutions[evolution]}. Idle animation, 4 frames.`;
      
      console.log(`Generating ${category} evolution ${evolution + 1}...`);
      
      const result = await generateSprite({
        prompt,
        style: 'pixel-art',
        size: '64x64',
        frames: 4,
      });
      
      // Save to public/sprites/{category}/evolution_{n}.png
      // ... file saving logic
    }
  }
}
```

### 6.3 Color Extraction & Application

```typescript
// lib/sprites/colors.ts

import ColorThief from 'color-thief-browser';

export interface ColorPalette {
  primary: string;
  secondary: string;
  accent: string;
  shadow: string;
}

export async function extractColorsFromImage(imageUrl: string): Promise<ColorPalette> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'Anonymous';
    
    img.onload = () => {
      const colorThief = new ColorThief();
      const palette = colorThief.getPalette(img, 4);
      
      resolve({
        primary: rgbToHex(palette[0]),
        secondary: rgbToHex(palette[1]),
        accent: rgbToHex(palette[2]),
        shadow: darkenColor(rgbToHex(palette[0]), 30),
      });
    };
    
    img.onerror = reject;
    img.src = imageUrl;
  });
}

function rgbToHex([r, g, b]: number[]): string {
  return '#' + [r, g, b].map(x => x.toString(16).padStart(2, '0')).join('');
}

function darkenColor(hex: string, percent: number): string {
  const num = parseInt(hex.replace('#', ''), 16);
  const amt = Math.round(2.55 * percent);
  const R = Math.max((num >> 16) - amt, 0);
  const G = Math.max((num >> 8 & 0x00FF) - amt, 0);
  const B = Math.max((num & 0x0000FF) - amt, 0);
  return '#' + (1 << 24 | R << 16 | G << 8 | B).toString(16).slice(1);
}
```

### 6.4 Sprite Component with Color Application

```typescript
// components/sigil/SigilSprite.tsx

'use client';

import { useState, useEffect } from 'react';
import { ColorPalette } from '@/lib/sprites/colors';

interface SigilSpriteProps {
  category: string;
  evolution: number;
  colors: ColorPalette;
  size?: number;
  animated?: boolean;
}

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
      setFrame(f => (f + 1) % 4);
    }, 150);
    
    return () => clearInterval(interval);
  }, [animated]);
  
  // Animation bounce effect
  const yOffset = [0, -2, -3, -2][frame];
  
  // Sprite path
  const spriteSrc = `/sprites/${category}/evolution_${evolution}_frame_${frame}.png`;
  
  return (
    <div 
      className="relative"
      style={{ 
        width: size, 
        height: size,
        transform: `translateY(${yOffset}px)`,
        transition: 'transform 0.1s ease-out',
      }}
    >
      {/* Color overlay using CSS filters or SVG filters */}
      <img
        src={spriteSrc}
        alt={`${category} evolution ${evolution}`}
        className="w-full h-full"
        style={{
          imageRendering: 'pixelated',
          filter: `
            drop-shadow(0 0 0 ${colors.primary})
          `,
        }}
      />
      
      {/* Alternative: SVG-based sprite with fill colors */}
      {/* This would use the SVG sprites from earlier */}
    </div>
  );
}
```

### 6.5 Alternative: Commission Professional Sprites

If PixelLab results are not satisfactory, commission a pixel artist:

**Recommended Platforms:**
- Fiverr: Search "pixel art sprite sheet Pokemon style"
- ArtStation: Filter by pixel art
- itch.io: Many indie artists do commissions
- r/gamedevclassifieds

**Commission Brief Template:**
```markdown
# Sigils Sprite Commission

## Project Overview
Creating sprites for a Pokemon-inspired Polymarket portfolio app.

## Requirements
- 7 creature types (see descriptions below)
- 3 evolution stages per creature (21 total designs)
- 4 animation frames per design (84 total frames)
- 64x64 pixel resolution
- Transparent background (PNG)
- Layered files for color swapping (PSDs preferred)

## Style Reference
- Pokemon FireRed/LeafGreen GBA sprites
- Bright, cheerful colors
- Clear silhouettes
- Cute but can be serious

## Creature Descriptions
[Include the detailed descriptions from above]

## Deliverables
- PNG sprite sheets (4 frames per row)
- PSD/Aseprite files with layers
- Color palette document

## Budget
$800-1500 depending on experience

## Timeline
2-3 weeks
```

---

## 7. Component Specifications

### 7.1 Panel Component (GBA Style)

```typescript
// components/ui/Panel.tsx

interface PanelProps {
  children: React.ReactNode;
  className?: string;
  variant?: 'default' | 'header' | 'card';
}

export function Panel({ children, className, variant = 'default' }: PanelProps) {
  return (
    <div
      className={cn(
        'relative',
        'bg-panel-bg',
        'border-3 border-panel-border',
        'rounded-2xl',
        variant === 'default' && 'shadow-[4px_4px_0_var(--panel-shadow)]',
        variant === 'card' && 'shadow-[3px_3px_0_var(--panel-shadow)]',
        className
      )}
    >
      {children}
    </div>
  );
}
```

### 7.2 Button Component

```typescript
// components/ui/Button.tsx

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'success' | 'danger';
  size?: 'sm' | 'md' | 'lg';
}

export function Button({
  children,
  variant = 'primary',
  size = 'md',
  className,
  ...props
}: ButtonProps) {
  const variantStyles = {
    primary: 'bg-accent-blue border-accent-blue-dark shadow-accent-blue-dark',
    success: 'bg-hp-green border-[#38A838] shadow-[#38A838]',
    danger: 'bg-accent-pink border-[#D84878] shadow-[#D84878]',
  };
  
  const sizeStyles = {
    sm: 'px-3 py-2 text-sm',
    md: 'px-4 py-3 text-base',
    lg: 'px-6 py-4 text-lg',
  };
  
  return (
    <button
      className={cn(
        'font-bold text-white rounded-xl',
        'border-3',
        'shadow-[0_4px_0]',
        'transition-all',
        'active:translate-y-1 active:shadow-[0_2px_0]',
        variantStyles[variant],
        sizeStyles[size],
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}
```

### 7.3 SigilCard Component

```typescript
// components/sigil/SigilCard.tsx

'use client';

import { useMemo } from 'react';
import { Panel } from '@/components/ui/Panel';
import { SigilSprite } from './SigilSprite';
import { SigilHabitat } from './SigilHabitat';
import { EvolutionBar } from './EvolutionBar';
import { getEvolutionLevel, CATEGORY_CREATURES } from '@/lib/sprites/evolution';
import { formatPrice, formatPercent } from '@/lib/utils/format';
import type { Position } from '@/lib/polymarket/types';

interface SigilCardProps {
  position: Position;
  colors: ColorPalette;
  onClick?: () => void;
}

export function SigilCard({ position, colors, onClick }: SigilCardProps) {
  const evolutionLevel = getEvolutionLevel(position.currPrice);
  const creature = CATEGORY_CREATURES[position.category];
  const name = creature.evolutions[evolutionLevel];
  const isProfit = position.totalPnl >= 0;
  
  const pnlPercent = useMemo(() => {
    if (position.totalBought === 0) return 0;
    return ((position.currentValue - position.totalBought) / position.totalBought) * 100;
  }, [position]);
  
  return (
    <Panel
      variant="card"
      className="p-3 cursor-pointer transition-transform active:scale-98"
      onClick={onClick}
    >
      <div className="flex items-center gap-3">
        {/* Creature with habitat */}
        <div className="flex-shrink-0 relative">
          <div className="relative z-10 -mb-3">
            <SigilSprite
              category={position.category}
              evolution={evolutionLevel}
              colors={colors}
              size={75}
            />
          </div>
          <SigilHabitat colors={colors} size={70} />
        </div>
        
        {/* Info panel */}
        <div className="flex-1 min-w-0">
          {/* Name and level */}
          <div className="flex items-center gap-2 mb-1">
            <span className="text-lg font-bold text-text-dark">
              {name}
            </span>
            <span
              className="text-xs px-2 py-0.5 rounded-full font-bold text-white"
              style={{ background: colors.primary }}
            >
              Lv.{evolutionLevel + 1}
            </span>
          </div>
          
          {/* Market title with emoji */}
          <div className="flex items-center gap-2 mb-2">
            <span className="text-lg">{position.emoji}</span>
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
```

### 7.4 EvolutionBar Component

```typescript
// components/sigil/EvolutionBar.tsx

interface EvolutionBarProps {
  price: number;
  colors: ColorPalette;
  showLabels?: boolean;
  className?: string;
}

export function EvolutionBar({
  price,
  colors,
  showLabels = true,
  className,
}: EvolutionBarProps) {
  const level = getEvolutionLevel(price);
  const progress = getProgressInLevel(price);
  
  return (
    <div className={className}>
      {showLabels && (
        <div className="flex justify-between text-[10px] font-bold text-text-mid mb-1">
          <span>Lv.1</span>
          <span>Lv.2</span>
          <span>Lv.3</span>
        </div>
      )}
      
      <div className="h-3 rounded-full overflow-hidden flex bg-gray-200 border border-panel-border">
        {/* Level 1 segment */}
        <div
          className="h-full"
          style={{
            width: '33.33%',
            background: level >= 0
              ? level === 0
                ? `linear-gradient(90deg, ${colors.primary} ${progress}%, #D0D0C8 ${progress}%)`
                : colors.primary
              : '#D0D0C8',
            borderRight: '1px solid white',
          }}
        />
        
        {/* Level 2 segment */}
        <div
          className="h-full"
          style={{
            width: '33.33%',
            background: level >= 1
              ? level === 1
                ? `linear-gradient(90deg, ${colors.secondary} ${progress}%, #D0D0C8 ${progress}%)`
                : colors.secondary
              : '#D0D0C8',
            borderRight: '1px solid white',
          }}
        />
        
        {/* Level 3 segment */}
        <div
          className="h-full"
          style={{
            width: '33.34%',
            background: level >= 2
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
```

---

## 8. Data Models

### 8.1 TypeScript Types

```typescript
// types/index.ts

// === Polymarket API Types ===

export interface Position {
  proxyWallet: string;
  asset: string;
  conditionId: string;
  avgPrice: number;
  size: number;
  currPrice: number;
  currentValue: number;
  cashPnl: number;
  totalBought: number;
  realizedPnl: number;
  totalPnl: number;
  outcome: 'Yes' | 'No';
  outcomeIndex: number;
  title: string;
  slug: string;
  icon: string;
  eventSlug: string;
}

export interface Trade {
  id: string;
  timestamp: number;
  side: 'BUY' | 'SELL';
  size: number;
  price: number;
  outcome: string;
  marketSlug: string;
}

export interface Market {
  id: string;
  question: string;
  slug: string;
  conditionId: string;
  tokens: Token[];
  image: string;
  icon: string;
  active: boolean;
  closed: boolean;
  volume: number;
  liquidity: number;
  endDate: string;
  tags: string[];
}

export interface Token {
  token_id: string;
  outcome: string;
  price?: number;
}

export interface PricePoint {
  timestamp: number;
  price: number;
}

// === App Types ===

export interface Sigil {
  id: string;
  position: Position;
  market: Market;
  category: Category;
  evolutionLevel: number;
  colors: ColorPalette;
  emoji: string;
}

export type Category = 
  | 'politics'
  | 'crypto'
  | 'sports'
  | 'macro'
  | 'tech'
  | 'space'
  | 'geo';

export interface ColorPalette {
  primary: string;
  secondary: string;
  accent: string;
  shadow: string;
}

export interface WalletState {
  address: string | null;
  isConnected: boolean;
  isReadOnly: boolean;
  proxyWallet: string | null;
}

export interface PointsState {
  total: number;
  history: PointsEvent[];
}

export interface PointsEvent {
  type: 'evolution' | 'trade' | 'win' | 'streak';
  points: number;
  timestamp: Date;
  details: Record<string, any>;
}
```

---

## 9. State Management

### 9.1 Wallet Store

```typescript
// stores/wallet-store.ts

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface WalletStore {
  // State
  address: string | null;
  proxyWallet: string | null;
  isConnected: boolean;
  isReadOnly: boolean;
  
  // Actions
  setAddress: (address: string, isReadOnly?: boolean) => void;
  setProxyWallet: (proxyWallet: string) => void;
  setConnected: (connected: boolean) => void;
  disconnect: () => void;
}

export const useWalletStore = create<WalletStore>()(
  persist(
    (set) => ({
      address: null,
      proxyWallet: null,
      isConnected: false,
      isReadOnly: true,
      
      setAddress: (address, isReadOnly = true) => set({
        address,
        isReadOnly,
      }),
      
      setProxyWallet: (proxyWallet) => set({ proxyWallet }),
      
      setConnected: (isConnected) => set({
        isConnected,
        isReadOnly: !isConnected,
      }),
      
      disconnect: () => set({
        address: null,
        proxyWallet: null,
        isConnected: false,
        isReadOnly: true,
      }),
    }),
    {
      name: 'sigils-wallet',
    }
  )
);
```

### 9.2 Positions Store

```typescript
// stores/positions-store.ts

import { create } from 'zustand';
import type { Sigil, Position } from '@/types';

interface PositionsStore {
  // State
  positions: Position[];
  sigils: Sigil[];
  isLoading: boolean;
  error: string | null;
  lastUpdated: Date | null;
  
  // Actions
  setPositions: (positions: Position[]) => void;
  setSigils: (sigils: Sigil[]) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  refresh: () => void;
}

export const usePositionsStore = create<PositionsStore>((set) => ({
  positions: [],
  sigils: [],
  isLoading: false,
  error: null,
  lastUpdated: null,
  
  setPositions: (positions) => set({
    positions,
    lastUpdated: new Date(),
  }),
  
  setSigils: (sigils) => set({ sigils }),
  
  setLoading: (isLoading) => set({ isLoading }),
  
  setError: (error) => set({ error }),
  
  refresh: () => set({ lastUpdated: null }),
}));
```

### 9.3 UI Store

```typescript
// stores/ui-store.ts

import { create } from 'zustand';

interface UIStore {
  // Modals
  feedModalOpen: boolean;
  releaseModalOpen: boolean;
  selectedSigilId: string | null;
  
  // Actions
  openFeedModal: (sigilId: string) => void;
  openReleaseModal: (sigilId: string) => void;
  closeModals: () => void;
}

export const useUIStore = create<UIStore>((set) => ({
  feedModalOpen: false,
  releaseModalOpen: false,
  selectedSigilId: null,
  
  openFeedModal: (sigilId) => set({
    feedModalOpen: true,
    selectedSigilId: sigilId,
  }),
  
  openReleaseModal: (sigilId) => set({
    releaseModalOpen: true,
    selectedSigilId: sigilId,
  }),
  
  closeModals: () => set({
    feedModalOpen: false,
    releaseModalOpen: false,
    selectedSigilId: null,
  }),
}));
```

---

## 10. Styling & Design System

### 10.1 CSS Variables (globals.css)

```css
/* app/globals.css */

@tailwind base;
@tailwind components;
@tailwind utilities;

:root {
  /* Background */
  --bg-blue: #58B8E8;
  --bg-light: #88D0F0;
  
  /* Panels */
  --panel-bg: #F8F8F0;
  --panel-border: #484868;
  --panel-shadow: #A8A8B8;
  
  /* Text */
  --text-dark: #383850;
  --text-mid: #606078;
  
  /* Status Colors */
  --hp-green: #48D848;
  --hp-yellow: #F8C838;
  --hp-red: #E85048;
  
  /* Accents */
  --accent-pink: #F85888;
  --accent-blue: #6898F8;
  --accent-blue-dark: #4878D8;
}

/* Pokemon-style font (optional) */
@font-face {
  font-family: 'Pokemon';
  src: url('/fonts/pokemon-gb.ttf') format('truetype');
}

/* Global styles */
body {
  font-family: system-ui, -apple-system, sans-serif;
  background: linear-gradient(180deg, var(--bg-blue) 0%, var(--bg-light) 100%);
  min-height: 100vh;
  color: var(--text-dark);
}

/* Pixel art rendering */
.pixelated {
  image-rendering: pixelated;
  image-rendering: crisp-edges;
}

/* Custom scrollbar */
::-webkit-scrollbar {
  width: 8px;
}

::-webkit-scrollbar-track {
  background: var(--panel-shadow);
  border-radius: 4px;
}

::-webkit-scrollbar-thumb {
  background: var(--panel-border);
  border-radius: 4px;
}
```

### 10.2 Tailwind Config

```typescript
// tailwind.config.ts

import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'bg-blue': 'var(--bg-blue)',
        'bg-light': 'var(--bg-light)',
        'panel-bg': 'var(--panel-bg)',
        'panel-border': 'var(--panel-border)',
        'panel-shadow': 'var(--panel-shadow)',
        'text-dark': 'var(--text-dark)',
        'text-mid': 'var(--text-mid)',
        'hp-green': 'var(--hp-green)',
        'hp-yellow': 'var(--hp-yellow)',
        'hp-red': 'var(--hp-red)',
        'accent-pink': 'var(--accent-pink)',
        'accent-blue': 'var(--accent-blue)',
      },
      borderWidth: {
        '3': '3px',
      },
      boxShadow: {
        'panel': '4px 4px 0 var(--panel-shadow)',
        'panel-sm': '3px 3px 0 var(--panel-shadow)',
      },
      animation: {
        'bounce-slow': 'bounce 1.5s ease-in-out infinite',
        'pulse-slow': 'pulse 2s ease-in-out infinite',
      },
    },
  },
  plugins: [],
};

export default config;
```

---

## 11. Build & Deployment

### 11.1 Development Setup

```bash
# Create Next.js project
npx create-next-app@latest sigils --typescript --tailwind --app --src-dir=false

# Navigate to project
cd sigils

# Install dependencies
npm install zustand @tanstack/react-query framer-motion recharts color-thief-browser
npm install @wagmi/core @wagmi/connectors viem @walletconnect/modal
npm install -D @types/color-thief-browser

# Create directory structure
mkdir -p components/{ui,sigil,wallet,trading,layout}
mkdir -p lib/{polymarket,wallet,sprites,utils}
mkdir -p stores hooks types
mkdir -p public/sprites/{politics,crypto,sports,macro,tech,space,geo}

# Start development server
npm run dev
```

### 11.2 Environment Setup

```bash
# Copy example env file
cp .env.example .env.local

# Edit with your values:
# - Get WalletConnect Project ID from https://cloud.walletconnect.com
# - Get PixelLab API key from https://pixellab.ai
# - Builder credentials from Polymarket (if trading)
```

### 11.3 Production Build

```bash
# Build for production
npm run build

# Test production build locally
npm start

# Deploy to Vercel (recommended)
vercel deploy --prod
```

### 11.4 Deployment Checklist

- [ ] All environment variables set in Vercel dashboard
- [ ] WalletConnect Project ID configured
- [ ] Domain configured (sigils.app or similar)
- [ ] SSL certificate active
- [ ] Error tracking set up (Sentry recommended)
- [ ] Analytics configured (Vercel Analytics or Plausible)

---

## 12. Step-by-Step Implementation

### Phase 1: Foundation (Days 1-2)

**Step 1.1: Project Setup**
```
CLAUDE CODE INSTRUCTION:
Create a new Next.js 14 project with TypeScript and Tailwind CSS.
Set up the folder structure as specified in Section 3.
Install all dependencies from Section 2.2.
Configure Tailwind with the custom theme from Section 10.2.
Add the CSS variables and global styles from Section 10.1.
```

**Step 1.2: Design System Components**
```
CLAUDE CODE INSTRUCTION:
Create the following UI components in components/ui/:
- Panel.tsx (GBA-style panel with border and shadow)
- Button.tsx (chunky game button with press animation)
- ProgressBar.tsx (segmented progress bar)

Use the specifications from Section 7.1-7.2.
Each component should accept className prop for customization.
Use CSS variables for theming.
```

**Step 1.3: Type Definitions**
```
CLAUDE CODE INSTRUCTION:
Create types/index.ts with all TypeScript interfaces from Section 8.1.
Ensure all Polymarket API response types are included.
Add the Sigil, Category, ColorPalette, and WalletState types.
```

### Phase 2: Core Display (Days 3-5)

**Step 2.1: Sprite System**
```
CLAUDE CODE INSTRUCTION:
Create lib/sprites/evolution.ts with:
- Evolution threshold constants
- getEvolutionLevel(price) function
- getProgressInLevel(price) function
- CATEGORY_CREATURES mapping

Create lib/sprites/colors.ts with:
- ColorPalette interface
- extractColorsFromImage() using color-thief-browser
- rgbToHex() and darkenColor() utility functions
```

**Step 2.2: Sigil Components**
```
CLAUDE CODE INSTRUCTION:
Create the following components in components/sigil/:

1. SigilSprite.tsx
   - Accepts category, evolution, colors, size, animated props
   - Renders sprite with bounce animation
   - Uses placeholder SVG sprites initially (from existing code)
   - Applies color palette to sprite

2. SigilHabitat.tsx
   - Accepts colors and size props
   - Renders pixelated elliptical pedestal
   - Uses multi-layer noise for texture
   - 64x64 or 128x128 pixel density

3. EvolutionBar.tsx
   - Accepts price and colors props
   - Shows 3-segment progress bar
   - Displays Lv.1, Lv.2, Lv.3 labels
   - Shows price scale (0¢, 33¢, 66¢, 100¢)

4. SigilCard.tsx
   - Combines SigilSprite, SigilHabitat, EvolutionBar
   - Displays creature name, market title with emoji
   - Shows P&L percentage and current price
   - Accepts onClick for navigation

Use the component specifications from Section 7.3-7.4.
```

**Step 2.3: State Management**
```
CLAUDE CODE INSTRUCTION:
Create Zustand stores in stores/:

1. wallet-store.ts (Section 9.1)
   - address, proxyWallet, isConnected, isReadOnly state
   - setAddress, setConnected, disconnect actions
   - Persist to localStorage

2. positions-store.ts (Section 9.2)
   - positions, sigils, isLoading, error, lastUpdated state
   - setPositions, setSigils, setLoading, setError actions

3. ui-store.ts (Section 9.3)
   - Modal state for Feed/Release
   - selectedSigilId tracking
```

### Phase 3: API Integration (Days 6-8)

**Step 3.1: Polymarket API Clients**
```
CLAUDE CODE INSTRUCTION:
Create API clients in lib/polymarket/:

1. data-api.ts
   - fetchPositions(walletAddress) -> Position[]
   - fetchTrades(walletAddress) -> Trade[]
   - fetchClosedPositions(walletAddress) -> Position[]
   - Use base URL: https://data-api.polymarket.com

2. clob-api.ts
   - fetchPriceHistory(tokenId, interval, fidelity) -> PricePoint[]
   - fetchCurrentPrice(tokenId) -> number
   - Use base URL: https://clob.polymarket.com

3. gamma-api.ts
   - fetchMarket(slug) -> Market
   - fetchMarkets(params) -> Market[]
   - Use base URL: https://gamma-api.polymarket.com

4. categories.ts
   - CATEGORY_KEYWORDS constant
   - detectCategory(market) -> Category

Include proper error handling and TypeScript types.
```

**Step 3.2: API Routes**
```
CLAUDE CODE INSTRUCTION:
Create Next.js API routes in app/api/:

1. positions/route.ts
   - GET handler that fetches positions for a wallet
   - Accepts ?address query param
   - Returns enriched positions with market data and colors

2. market/[id]/route.ts
   - GET handler for single market details
   - Includes price history

3. Create a hook hooks/usePositions.ts that:
   - Fetches positions from API
   - Extracts colors from market thumbnails
   - Detects categories
   - Transforms to Sigil objects
   - Uses React Query for caching
```

**Step 3.3: Data Fetching Hooks**
```
CLAUDE CODE INSTRUCTION:
Create custom hooks in hooks/:

1. usePositions.ts
   - Uses React Query to fetch and cache positions
   - Automatically extracts colors from thumbnails
   - Returns { sigils, isLoading, error, refetch }

2. useMarket.ts
   - Fetches single market details
   - Includes price history

3. usePriceHistory.ts
   - Fetches price history for a token
   - Accepts timeRange parameter (1D, 1W, 1M, ALL)
```

### Phase 4: Pages & Navigation (Days 9-11)

**Step 4.1: Landing Page**
```
CLAUDE CODE INSTRUCTION:
Create app/page.tsx as the landing page:

- Hero section with Sigils logo/branding
- "Enter Wallet Address" input field
- "Connect Wallet" button (WalletConnect)
- Parse input: raw address, Polymarket URL, or @username
- On submit, redirect to /collection?address={address}

Style with GBA Pokemon aesthetic:
- Blue gradient background
- Panel-style cards
- Chunky buttons
```

**Step 4.2: Collection Page**
```
CLAUDE CODE INSTRUCTION:
Create app/collection/page.tsx:

- Header with logo, wallet info, LIVE indicator
- Portfolio summary card (total value, total P&L, count)
- List of SigilCard components
- Loading skeleton while fetching
- Error state handling
- Empty state if no positions

Use usePositions hook to fetch data.
Implement pull-to-refresh on mobile.
```

**Step 4.3: Sigil Detail Page**
```
CLAUDE CODE INSTRUCTION:
Create app/sigil/[id]/page.tsx:

- Back button to collection
- Large creature display with habitat
- Evolution progress bar (expanded)
- Price chart component (using Recharts)
- Tab navigation: Stats, Trades, Market
- Stats tab: current price, avg price, shares, invested, value, P&L
- Trades tab: list of user's trades for this market
- Market tab: volume, end date, category, link to Polymarket
- Fixed bottom buttons: Feed (green), Release (pink)

Fetch market details and price history.
```

**Step 4.4: Layout & Navigation**
```
CLAUDE CODE INSTRUCTION:
Create layout components in components/layout/:

1. Header.tsx
   - Logo on left
   - Wallet status or Connect button on right
   - LIVE indicator

2. Navigation.tsx (mobile bottom nav)
   - Collection, Explore (future), Settings icons
   - Fixed to bottom on mobile

3. LoadingScreen.tsx
   - Pokemon-style loading animation
   - "Loading your Sigils..." text

Update app/layout.tsx to include:
- Wallet provider (Wagmi)
- React Query provider
- Header component
- Mobile navigation
```

### Phase 5: Wallet Integration (Days 12-14)

**Step 5.1: WalletConnect Setup**
```
CLAUDE CODE INSTRUCTION:
Create lib/wallet/config.ts:

- Configure Wagmi with Polygon chain
- Set up WalletConnect connector with project ID
- Set up injected connector (MetaMask, etc.)
- Create and export wagmiConfig

Create lib/wallet/hooks.ts:
- useWallet() hook that combines Wagmi hooks
- Returns address, isConnected, connect, disconnect
- Syncs with wallet-store
```

**Step 5.2: Wallet Components**
```
CLAUDE CODE INSTRUCTION:
Create wallet components in components/wallet/:

1. WalletInput.tsx
   - Input field for manual address entry
   - Validates Ethereum addresses
   - Handles Polymarket URLs and usernames
   - Submit button

2. WalletConnect.tsx
   - "Connect Wallet" button
   - Opens WalletConnect modal
   - Shows loading state while connecting

3. WalletStatus.tsx
   - Shows connected address (truncated)
   - Network indicator (Polygon)
   - Disconnect button
   - Dropdown for options
```

**Step 5.3: Proxy Wallet Derivation**
```
CLAUDE CODE INSTRUCTION:
Create lib/wallet/utils.ts:

- deriveProxyAddress(eoaAddress) function
- Uses CREATE2 derivation like Polymarket
- Import constants for PROXY_FACTORY and PROXY_INIT_CODE_HASH

This is needed because Polymarket uses proxy wallets
for actual trading. The proxy is derived from the EOA.
```

### Phase 6: Trading (Days 15-17)

**Step 6.1: Trading Logic**
```
CLAUDE CODE INSTRUCTION:
Create lib/polymarket/trading.ts:

- createBuyOrder(params) function
- createSellOrder(params) function
- Uses @polymarket/clob-client if available
- Falls back to direct API calls

Note: Full trading requires Builder API credentials.
For MVP, we can use WalletConnect to sign transactions.

Create app/api/trade/route.ts:
- POST handler for executing trades
- Validates request body
- Calls trading functions
- Returns transaction result
```

**Step 6.2: Trading Components**
```
CLAUDE CODE INSTRUCTION:
Create trading components in components/trading/:

1. FeedModal.tsx (Buy more shares)
   - Amount input (USD)
   - Shows estimated shares to receive
   - Shows current price and potential P&L
   - Confirm button
   - Loading state while executing

2. ReleaseModal.tsx (Sell shares)
   - Shares input or % selector (25%, 50%, 100%)
   - Shows estimated USD to receive
   - Shows realized P&L
   - Confirm button

3. TradeConfirmation.tsx
   - Success/failure state
   - Transaction hash link
   - Close button

Use Framer Motion for modal animations.
```

**Step 6.3: Trade Hook**
```
CLAUDE CODE INSTRUCTION:
Create hooks/useTrade.ts:

- useTrade() hook
- buy(tokenId, amount) function
- sell(tokenId, shares) function
- Returns { buy, sell, isLoading, error }
- Uses React Query mutations
- Invalidates positions cache after trade
```

### Phase 7: Sprites & Polish (Days 18-20)

**Step 7.1: Sprite Generation**
```
CLAUDE CODE INSTRUCTION:
Create lib/sprites/pixellab.ts:

- generateSprite(params) function
- Uses PixelLab API
- Saves to public/sprites/

Create app/api/sprites/generate/route.ts:
- POST handler to trigger sprite generation
- Admin-only (check for secret key)

OR if using commissioned sprites:
- Create a script to organize sprite files
- Ensure naming convention: {category}/evolution_{n}_frame_{f}.png
```

**Step 7.2: Sprite Loading**
```
CLAUDE CODE INSTRUCTION:
Update SigilSprite.tsx:

- Check if sprite file exists at expected path
- Fall back to SVG placeholder if not
- Preload sprites on app init
- Use Next.js Image component for optimization
```

**Step 7.3: Animations & Sounds**
```
CLAUDE CODE INSTRUCTION:
Add polish:

1. Add Framer Motion animations:
   - Page transitions (slide)
   - Card enter animations (stagger)
   - Modal animations (scale + fade)
   - Button press feedback

2. Optional: Add sounds
   - Evolution level up sound
   - Trade success/failure sounds
   - Button click sounds
   - Use Howler.js or Web Audio API
```

### Phase 8: Points System (Future)

**Step 8.1: Points Tracking**
```
CLAUDE CODE INSTRUCTION:
Create lib/points/system.ts:

- POINTS_CONFIG constants
- trackEvolutionPoints(prev, new) function
- trackTradePoints(type) function

Create stores/points-store.ts:
- total, history state
- addPoints(event) action
- Persist to localStorage

For MVP, track locally. Future: sync to backend.
```

**Step 8.2: Points UI**
```
CLAUDE CODE INSTRUCTION:
Create points display:

- Points badge in header
- Toast notification on points earned
- Points history modal
- Level/rank system (future)
```

---

## Appendix A: API Reference Quick Sheet

```
DATA API (https://data-api.polymarket.com)
├── GET /positions?user={address}
├── GET /trades?user={address}
├── GET /closed-positions?user={address}
└── GET /activity?user={address}

CLOB API (https://clob.polymarket.com)
├── GET /price?token_id={id}
├── GET /prices-history?market={id}&interval={1d}&fidelity={100}
├── GET /book?token_id={id}
├── POST /order (auth required)
└── DELETE /order (auth required)

GAMMA API (https://gamma-api.polymarket.com)
├── GET /markets
├── GET /markets?slug={slug}
├── GET /events?slug={slug}
└── GET /markets?tag={tag}
```

---

## Appendix B: Color Palette Reference

```
Pokemon GBA Palette:
┌─────────────────────────────────────┐
│ Background                          │
│ - Sky Blue: #58B8E8                 │
│ - Light Blue: #88D0F0               │
├─────────────────────────────────────┤
│ Panels                              │
│ - Panel BG: #F8F8F0                 │
│ - Border: #484868                   │
│ - Shadow: #A8A8B8                   │
├─────────────────────────────────────┤
│ Text                                │
│ - Dark: #383850                     │
│ - Mid: #606078                      │
├─────────────────────────────────────┤
│ Status                              │
│ - Green (HP/Profit): #48D848        │
│ - Yellow (Warning): #F8C838         │
│ - Red (HP/Loss): #E85048            │
├─────────────────────────────────────┤
│ Accents                             │
│ - Pink: #F85888                     │
│ - Blue: #6898F8                     │
└─────────────────────────────────────┘
```

---

## Appendix C: Creature Quick Reference

```
Category    │ Lv1       │ Lv2       │ Lv3
────────────┼───────────┼───────────┼───────────
Politics    │ Pollster  │ Caucus    │ Senator
Crypto      │ Hashling  │ Blockbit  │ Chainlord
Sports      │ Rookie    │ Varsity   │ MVP
Macro       │ Yield     │ Dividend  │ Reserve
Tech        │ Byte      │ Megabyte  │ Quantum
Space       │ Orbit     │ Nova      │ Cosmos
Geo         │ Scout     │ Atlas     │ Sovereign
```

---

## Final Notes for Claude Code

1. **Start with Phase 1** and complete each phase before moving to the next.

2. **Test incrementally** - After each step, verify the component/feature works.

3. **Use the existing prototype code** from the conversation as reference for styling and component structure.

4. **Handle errors gracefully** - All API calls should have try/catch with user-friendly error messages.

5. **Mobile-first** - Design for mobile viewport, then scale up to desktop.

6. **Performance** - Use React Query for caching, Next.js Image for optimization.

7. **Accessibility** - Add proper ARIA labels, keyboard navigation where possible.

8. **TypeScript strict** - Enable strict mode, no `any` types.

This specification contains everything needed to build Sigils from scratch. Follow the phases in order, and the app will come together piece by piece.

---

*Document Version: 1.0*
*Last Updated: February 2025*
*Author: Claude (Anthropic)*
