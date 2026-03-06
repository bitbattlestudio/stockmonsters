'use client';

import { useRouter } from 'next/navigation';
import { Suspense, useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAccount, useConnect, useDisconnect } from 'wagmi';
import { formatUSD } from '@/lib/utils/format';
import { DEMO_STOCKS, type DemoStock } from '@/lib/demo';
import { useRobinhoodPositions, type StockPosition } from '@/hooks/useRobinhoodPositions';
import { useTradeOffers } from '@/hooks/useTradeOffers';
import { TradeOfferBell, TradeOfferList, TradeOfferModal, TradeOfferCard } from '@/components/trade-offers';
import { TradeOffer } from '@/lib/trade-offers/types';
import { PortfolioHealth } from '@/components/PortfolioHealth';
import { type PositionHealth } from '@/lib/portfolioHealth';
import { StockIcon } from '@/components/StockIcon';
import { getSpriteForStock, hasMonsterSprite, type SpriteStyle } from '@/lib/stocks';
import { XPBadge, HarvestModal } from '@/components/xp';

function HabitatCard({
  symbol,
  price,
  change,
  shares,
  sprite,
  isMonster,
  onClick,
}: {
  symbol: string;
  price: number;
  change: number;
  shares?: number;
  sprite: string;
  isMonster?: boolean;
  onClick: () => void;
}) {
  const isUp = change > 0;
  const isDown = change < 0;

  return (
    <motion.div
      className="habitat-card p-3 cursor-pointer"
      onClick={onClick}
      whileTap={{ scale: 0.98 }}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      {/* Sprite Container - the "habitat" */}
      <div className="relative w-full py-4 mb-2 flex items-center justify-center">
        <motion.div
          className={`relative ${isMonster ? 'w-[120px] h-[120px]' : 'w-[104px] h-[104px]'}`}
          animate={{ y: [0, -4, 0] }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={sprite}
            alt={symbol}
            className="absolute inset-0 w-full h-full object-contain"
            style={isMonster ? undefined : { imageRendering: 'pixelated' }}
          />
        </motion.div>
      </div>

      {/* Stock Info */}
      <div className="text-center space-y-0.5">
        {/* Ticker */}
        <p className="font-heading font-semibold text-text-primary text-base tracking-tight">
          {symbol}
        </p>

        {/* Shares (if connected) */}
        {shares !== undefined && (
          <p className="text-xs text-text-secondary">
            {shares.toFixed(2)} shares
          </p>
        )}

        {/* Price */}
        <p className="font-heading text-xl font-bold text-text-primary">
          ${price.toFixed(2)}
        </p>

        {/* Change */}
        <p
          className={`font-pixel text-[10px] ${
            isUp ? 'price-up' : isDown ? 'price-down' : 'price-neutral'
          }`}
        >
          {isUp ? '+' : ''}{change.toFixed(2)}%
        </p>
      </div>
    </motion.div>
  );
}

function ConnectWalletCard() {
  const { connectors, connect, isPending } = useConnect();
  const [mounted, setMounted] = useState(false);

  // Only render connectors after mount to avoid hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <motion.div
      className="habitat-card p-6 col-span-2 text-center"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <div className="mb-4">
        <div className="w-16 h-16 mx-auto mb-3 rounded-full bg-gradient-to-br from-violet-100 to-purple-100 flex items-center justify-center">
          <StockIcon name="link" size="xl" />
        </div>
        <h3 className="text-lg font-semibold text-text-primary mb-1">
          Connect Wallet
        </h3>
        <p className="text-sm text-text-secondary">
          Connect to Robinhood Chain Testnet to see your real positions
        </p>
      </div>

      <div className="space-y-2">
        {mounted && connectors.map((connector) => (
          <button
            key={connector.uid}
            onClick={() => connect({ connector })}
            disabled={isPending}
            className="w-full py-3 px-4 bg-text-primary text-white font-medium rounded-xl hover:opacity-90 transition-opacity disabled:opacity-50"
          >
            {isPending ? 'Connecting...' : `Connect ${connector.name}`}
          </button>
        ))}
        {!mounted && (
          <div className="w-full py-3 px-4 bg-gray-200 rounded-xl animate-pulse">
            Loading wallets...
          </div>
        )}
      </div>

      <p className="text-xs text-text-muted mt-4">
        Get testnet tokens at{' '}
        <a
          href="https://faucet.testnet.chain.robinhood.com"
          target="_blank"
          rel="noopener noreferrer"
          className="underline"
        >
          faucet.testnet.chain.robinhood.com
        </a>
      </p>
    </motion.div>
  );
}

function CollectionContent() {
  const router = useRouter();
  const { isConnected, address } = useAccount();
  const { disconnect } = useDisconnect();
  const {
    positions,
    totalValue,
    totalChange,
    isLoading,
  } = useRobinhoodPositions();

  // Trade offers
  const {
    offers,
    hasOffers,
    executeTrade,
    dismissOffer,
    isExecuting,
  } = useTradeOffers();

  const [isOfferListOpen, setIsOfferListOpen] = useState(false);
  const [selectedOffer, setSelectedOffer] = useState<TradeOffer | null>(null);
  const [isOfferModalOpen, setIsOfferModalOpen] = useState(false);
  const [isHarvestModalOpen, setIsHarvestModalOpen] = useState(false);
  const spriteStyle = 'auto' as SpriteStyle; // Fixed to auto
  const [isDarkMode, setIsDarkMode] = useState(false);

  // Initialize dark mode from localStorage
  useEffect(() => {
    const stored = localStorage.getItem('darkMode');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const shouldBeDark = stored ? stored === 'true' : prefersDark;
    setIsDarkMode(shouldBeDark);
    document.documentElement.classList.toggle('dark', shouldBeDark);
  }, []);

  // Update dark mode
  const toggleDarkMode = () => {
    const newValue = !isDarkMode;
    setIsDarkMode(newValue);
    localStorage.setItem('darkMode', String(newValue));
    document.documentElement.classList.toggle('dark', newValue);
  };

  // Use real positions if connected and has positions, otherwise demo
  const hasRealPositions = isConnected && positions.length > 0;
  const displayStocks = hasRealPositions ? positions : DEMO_STOCKS;

  // Calculate totals
  const displayTotalValue = hasRealPositions
    ? totalValue
    : DEMO_STOCKS.reduce((sum, s) => sum + s.price * 100, 0);
  const displayTotalChange = hasRealPositions
    ? totalChange
    : DEMO_STOCKS.reduce((sum, s) => sum + s.change, 0) / DEMO_STOCKS.length;

  const isUp = displayTotalChange > 0;
  const isDown = displayTotalChange < 0;

  const handleStockClick = (symbol: string) => {
    router.push(`/sigil/${symbol}`);
  };

  const handleOpenOffers = () => {
    setIsOfferListOpen(true);
  };

  const handleCloseOffers = () => {
    setIsOfferListOpen(false);
  };

  const handleSelectOffer = (offer: TradeOffer) => {
    setSelectedOffer(offer);
    setIsOfferListOpen(false);
    setIsOfferModalOpen(true);
  };

  const handleCloseOfferModal = () => {
    setIsOfferModalOpen(false);
    setSelectedOffer(null);
  };

  const handleExecuteTrade = async (offerId: string) => {
    try {
      await executeTrade(offerId);
      setIsOfferModalOpen(false);
      setSelectedOffer(null);
    } catch (error) {
      console.error('Failed to execute trade:', error);
    }
  };

  const handleDismissOffer = async (offerId: string) => {
    try {
      await dismissOffer(offerId);
      setIsOfferModalOpen(false);
      setSelectedOffer(null);
    } catch (error) {
      console.error('Failed to dismiss offer:', error);
    }
  };

  return (
    <div className="min-h-screen pb-8">
      {/* Header */}
      <header className="px-5 pt-6 pb-4">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/logo-3.png"
              width={320}
              height={320}
              alt="Logo"
              className="rounded-xl"
              style={{ imageRendering: 'pixelated' }}
            />
          </div>
          <div className="flex items-start gap-3">
            <XPBadge
              size="sm"
              showHarvestButton
              onClick={() => setIsHarvestModalOpen(true)}
            />
            <div className="flex flex-col items-end gap-1">
              <p className="text-sm text-text-secondary">
                {isConnected ? (
                  <span className="flex items-center gap-1">
                    <span className="w-2 h-2 bg-green-500 rounded-full" />
                    {address?.slice(0, 6)}...{address?.slice(-4)}
                  </span>
                ) : (
                  'Your portfolio, alive'
                )}
              </p>
              {isConnected && (
                <button
                  onClick={() => disconnect()}
                  className="text-xs text-text-secondary hover:text-text-primary"
                >
                  Disconnect
                </button>
              )}
            </div>
            <TradeOfferBell offers={offers} onOpen={handleOpenOffers} />
          </div>
        </div>

        {/* Portfolio Summary */}
        <div className="mb-2">
          <p className="text-sm text-text-secondary mb-1">
            {hasRealPositions ? 'Portfolio Value' : 'Demo Portfolio'}
          </p>
          <p className="font-heading text-4xl font-bold text-text-primary tracking-tight">
            {formatUSD(displayTotalValue)}
          </p>
          <p
            className={`font-pixel text-[11px] mt-2 ${
              isUp ? 'price-up' : isDown ? 'price-down' : 'price-neutral'
            }`}
          >
            {isUp ? '+' : ''}{displayTotalChange.toFixed(2)}% today
          </p>
        </div>

        {/* Settings Row */}
        <div className="flex items-center justify-end mt-4">
          {/* Dark Mode Toggle */}
          <button
            onClick={toggleDarkMode}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-black/5 dark:bg-white/10 border border-black/10 dark:border-white/20 text-text-secondary hover:bg-black/10 dark:hover:bg-white/15 transition-colors"
          >
            <span className="text-sm">{isDarkMode ? '🌙' : '☀️'}</span>
            <span className="text-xs font-semibold">{isDarkMode ? 'Dark' : 'Light'}</span>
          </button>
        </div>
      </header>

      {/* Portfolio Health Section */}
      {displayStocks.length > 0 && (
        <div className="px-4 mb-4">
          <PortfolioHealth
            totalValue={displayTotalValue}
            totalGain={displayTotalValue * (displayTotalChange / 100)}
            totalGainPercent={displayTotalChange}
            positions={displayStocks.map((stock, index) => {
              const symbol = 'ticker' in stock ? stock.ticker : stock.symbol;
              // Deterministic mock days based on index (avoids hydration mismatch)
              const mockDays = [15, 28, 45, 8, 32, 12, 55, 20];
              return {
                symbol,
                percentGain: stock.change,
                daysSinceFed: mockDays[index % mockDays.length],
              };
            })}
          />
        </div>
      )}

      {/* Loading State */}
      {isConnected && isLoading && (
        <div className="px-4 py-8 text-center">
          <div className="animate-spin w-8 h-8 border-2 border-violet-500 border-t-transparent rounded-full mx-auto mb-2" />
          <p className="text-sm text-text-secondary">Loading positions...</p>
        </div>
      )}

      {/* 2-Column Habitat Grid */}
      <div className="px-4">
        <div className="grid grid-cols-2 gap-3">
          {/* Connect Wallet Card (if not connected) */}
          {!isConnected && <ConnectWalletCard />}

          {/* Stock Cards with Trade Offer inserted after position 1 */}
          {displayStocks.map((stock, index) => {
            // Handle both DemoStock and StockPosition types
            const symbol = 'ticker' in stock ? stock.ticker : stock.symbol;
            const price = stock.price;
            const change = stock.change;
            const shares = 'shares' in stock ? stock.shares : undefined;
            const sprite = getSpriteForStock(symbol, change, spriteStyle);
            // Only show as monster if style allows and sprite exists
            const isMonster = spriteStyle !== 'pixel' && hasMonsterSprite(symbol);

            return (
              <motion.div
                key={`${symbol}-${spriteStyle}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.3 }}
              >
                <HabitatCard
                  symbol={symbol}
                  price={price}
                  change={change}
                  shares={shares}
                  sprite={sprite}
                  isMonster={isMonster}
                  onClick={() => handleStockClick(symbol)}
                />
              </motion.div>
            );
          })}

          {/* Trade Offer Card - Featured offer as a tile */}
          {offers[0] && (
            <motion.div
              key={`trade-offer-${offers[0].id}`}
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ delay: 0.35, duration: 0.4 }}
            >
              <TradeOfferCard
                offer={offers[0]}
                onClick={() => handleSelectOffer(offers[0])}
              />
            </motion.div>
          )}
        </div>
      </div>

      {/* Info Banner */}
      {!isConnected && (
        <motion.div
          className="mx-4 mt-6 p-4 rounded-xl bg-violet-50 text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <p className="text-sm text-violet-700">
            Showing demo data. Connect your wallet to see real positions from
            Robinhood Chain Testnet.
          </p>
        </motion.div>
      )}

      {/* Bottom spacing */}
      <div className="h-20" />

      {/* Trade Offer List Dropdown */}
      <TradeOfferList
        offers={offers}
        isOpen={isOfferListOpen}
        onClose={handleCloseOffers}
        onSelectOffer={handleSelectOffer}
      />

      {/* Trade Offer Modal */}
      <TradeOfferModal
        offer={selectedOffer}
        isOpen={isOfferModalOpen}
        onClose={handleCloseOfferModal}
        onExecute={handleExecuteTrade}
        onDismiss={handleDismissOffer}
        isExecuting={isExecuting}
      />

      {/* Harvest XP Modal */}
      <HarvestModal
        isOpen={isHarvestModalOpen}
        onClose={() => setIsHarvestModalOpen(false)}
        availableStocks={displayStocks.map((stock) => ({
          ticker: 'ticker' in stock ? stock.ticker : stock.symbol,
          price: stock.price,
          name: 'ticker' in stock ? stock.ticker : stock.symbol
        }))}
      />
    </div>
  );
}

function CollectionSkeleton() {
  return (
    <div className="min-h-screen pb-8 animate-pulse">
      <header className="px-5 pt-6 pb-4">
        <div className="h-8 bg-gray-200 rounded w-24 mb-2" />
        <div className="h-4 bg-gray-200 rounded w-32 mb-6" />
        <div className="h-12 bg-gray-200 rounded w-40 mb-2" />
        <div className="h-6 bg-gray-200 rounded w-24" />
      </header>
      <div className="px-4 grid grid-cols-2 gap-3">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="habitat-card p-3">
            <div className="py-4 mb-2"><div className="w-[104px] h-[104px] bg-gray-100 rounded-lg mx-auto" /></div>
            <div className="h-4 bg-gray-200 rounded w-14 mx-auto mb-1" />
            <div className="h-6 bg-gray-200 rounded w-18 mx-auto mb-1" />
            <div className="h-4 bg-gray-200 rounded w-16 mx-auto" />
          </div>
        ))}
      </div>
    </div>
  );
}

export default function CollectionPage() {
  return (
    <Suspense fallback={<CollectionSkeleton />}>
      <CollectionContent />
    </Suspense>
  );
}
