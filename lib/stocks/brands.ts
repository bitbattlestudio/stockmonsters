// lib/stocks/brands.ts
// Brand colors and info for supported stocks

export interface StockBrand {
  ticker: string;
  name: string;
  primaryColor: string;
  secondaryColor: string;
  textColor: 'white' | 'black'; // Best text color for this background
  description: string;
  whimsicalDescription: string;
  sector: string;
  // Robinhood Chain data
  tokenAddress?: `0x${string}`;
  chainId: number;
  chainName: string;
  explorerUrl: string;
}

// Robinhood Chain Testnet config
const CHAIN_CONFIG = {
  chainId: 46630,
  chainName: 'Robinhood Chain Testnet',
  explorerUrl: 'https://explorer.testnet.chain.robinhood.com',
};

export const STOCK_BRANDS: Record<string, StockBrand> = {
  TSLA: {
    ticker: 'TSLA',
    name: 'Tesla, Inc.',
    primaryColor: '#E82127', // Tesla red
    secondaryColor: '#1A1A1A',
    textColor: 'white',
    description: 'Tesla designs, manufactures, and sells electric vehicles, energy storage systems, and solar products.',
    whimsicalDescription: 'This electric battery creature ZOOMS with lightning speed! It dreams of a world where all cars go vroom-vroom without the stinky smoke. When happy, sparks fly from its antenna!',
    sector: 'Automotive',
    tokenAddress: '0xC9f9c86933092BbbfFF3CCb4b105A4A94bf3Bd4E',
    ...CHAIN_CONFIG,
  },
  NVDA: {
    ticker: 'NVDA',
    name: 'NVIDIA Corporation',
    primaryColor: '#76B900', // NVIDIA green
    secondaryColor: '#1A1A1A',
    textColor: 'white',
    description: 'NVIDIA designs graphics processing units and system-on-chip units for gaming, professional visualization, and AI.',
    whimsicalDescription: 'The GPU guardian glows with the power of a thousand pixels! This chip creature processes dreams at lightning speed and makes AI magic happen. It loves crunching numbers for breakfast!',
    sector: 'Technology',
    ...CHAIN_CONFIG,
  },
  AAPL: {
    ticker: 'AAPL',
    name: 'Apple Inc.',
    primaryColor: '#555555', // Apple space gray
    secondaryColor: '#A3AAAE',
    textColor: 'white',
    description: 'Apple designs, manufactures, and markets smartphones, personal computers, tablets, wearables, and accessories.',
    whimsicalDescription: 'This sleek fruit creature is always thinking different! With a shiny aluminum shell and a glowing apple heart, it brings joy to millions with its magical touch screens and catchy tunes.',
    sector: 'Technology',
    ...CHAIN_CONFIG,
  },
  AMZN: {
    ticker: 'AMZN',
    name: 'Amazon.com, Inc.',
    primaryColor: '#FF9900', // Amazon orange
    secondaryColor: '#232F3E',
    textColor: 'black',
    description: 'Amazon is a multinational technology company focusing on e-commerce, cloud computing, and artificial intelligence.',
    whimsicalDescription: 'This happy box creature delivers smiles to doorsteps everywhere! Its smile-arrow mouth grins wider with every package shipped. It dreams of drones and same-day delivery magic!',
    sector: 'E-Commerce',
    tokenAddress: '0x5884aD2f920c162CFBbACc88C9C51AA75eC09E02',
    ...CHAIN_CONFIG,
  },
  PLTR: {
    ticker: 'PLTR',
    name: 'Palantir Technologies',
    primaryColor: '#101010', // Palantir black
    secondaryColor: '#1E1E1E',
    textColor: 'white',
    description: 'Palantir builds software platforms for data integration, analysis, and operations used by organizations worldwide.',
    whimsicalDescription: 'The all-seeing eye orb floats mysteriously through data streams! This mystical creature can spot patterns in chaos and whispers secrets to those who seek knowledge. Beware its powerful gaze!',
    sector: 'Technology',
    tokenAddress: '0x1FBE1a0e43594b3455993B5dE5Fd0A7A266298d0',
    ...CHAIN_CONFIG,
  },
  NFLX: {
    ticker: 'NFLX',
    name: 'Netflix, Inc.',
    primaryColor: '#E50914', // Netflix red
    secondaryColor: '#141414',
    textColor: 'white',
    description: 'Netflix is a streaming entertainment service offering TV series, documentaries, feature films, and mobile games.',
    whimsicalDescription: 'This popcorn bucket creature LOVES binge-watching! Kernels pop with excitement during cliffhangers. It asks "Are you still watching?" because it cares about your well-being!',
    sector: 'Entertainment',
    tokenAddress: '0x3b8262A63d25f0477c4DDE23F83cfe22Cb768C93',
    ...CHAIN_CONFIG,
  },
  AMD: {
    ticker: 'AMD',
    name: 'Advanced Micro Devices',
    primaryColor: '#ED1C24', // AMD red
    secondaryColor: '#1A1A1A',
    textColor: 'white',
    description: 'AMD develops computer processors and related technologies for business and consumer markets.',
    whimsicalDescription: 'This fiery crystal creature burns with processing power! Its red facets glow hotter when crunching complex calculations. A worthy rival to any chip beast in the silicon kingdom!',
    sector: 'Technology',
    tokenAddress: '0x71178BAc73cBeb415514eB542a8995b82669778d',
    ...CHAIN_CONFIG,
  },
  META: {
    ticker: 'META',
    name: 'Meta Platforms, Inc.',
    primaryColor: '#0668E1', // Meta blue
    secondaryColor: '#1877F2',
    textColor: 'white',
    description: 'Meta builds technologies that help people connect, find communities, and grow businesses.',
    whimsicalDescription: 'This infinity creature loops through virtual worlds! It connects friends across dimensions and dreams of a metaverse where everyone can be together. Poke it for good luck!',
    sector: 'Technology',
    ...CHAIN_CONFIG,
  },
};

export function getStockBrand(ticker: string): StockBrand | undefined {
  return STOCK_BRANDS[ticker.toUpperCase()];
}

export function getTextColorForBackground(bgColor: string): 'white' | 'black' {
  // Convert hex to RGB and calculate luminance
  const hex = bgColor.replace('#', '');
  const r = parseInt(hex.substr(0, 2), 16);
  const g = parseInt(hex.substr(2, 2), 16);
  const b = parseInt(hex.substr(4, 2), 16);
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  return luminance > 0.5 ? 'black' : 'white';
}
