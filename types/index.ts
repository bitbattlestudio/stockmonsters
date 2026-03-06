import type { IconName } from '@/components/PixelIcon';

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

export interface Sigil {
  id: string;
  position: Position;
  market?: Market;
  category: Category;
  evolutionLevel: number;
  colors: ColorPalette;
  icon: IconName;
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
  details: Record<string, unknown>;
}

// === Component Props Types ===

export interface PanelProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
  variant?: 'default' | 'header' | 'card';
}

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'success' | 'danger';
  size?: 'sm' | 'md' | 'lg';
}

export interface SigilSpriteProps {
  category: Category;
  evolution: number;
  colors: ColorPalette;
  size?: number;
  animated?: boolean;
}

export interface SigilHabitatProps {
  colors: ColorPalette;
  size?: number;
}

export interface EvolutionBarProps {
  price: number;
  colors: ColorPalette;
  showLabels?: boolean;
  className?: string;
}

export interface SigilCardProps {
  sigil: Sigil;
  onClick?: () => void;
  isSelected?: boolean;
}
