'use client';

import { motion } from 'framer-motion';
import {
  TradeOffer,
  TRADE_TYPE_NAMES,
  TRADE_TYPE_ICONS,
} from '@/lib/trade-offers/types';
import { StockIcon } from '@/components/StockIcon';
import { getSpriteForStock, hasMonsterSprite } from '@/lib/stocks';

interface TradeOfferCardProps {
  offer: TradeOffer;
  onClick: () => void;
}

export function TradeOfferCard({ offer, onClick }: TradeOfferCardProps) {
  const sellTicker = offer.sell?.ticker;
  const buyTicker = offer.buy.ticker;

  // Show the "buy" sprite (what you're getting)
  const displayTicker = buyTicker;
  const sprite = getSpriteForStock(displayTicker, 5); // Use state 5 (positive) for buy offers
  const isMonster = hasMonsterSprite(displayTicker);

  return (
    <motion.div
      className="habitat-card p-3 cursor-pointer bg-amber-50/85 dark:bg-amber-900/30 border border-amber-200/50 dark:border-amber-700/50"
      onClick={onClick}
      whileTap={{ scale: 0.98 }}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      {/* Sprite Container - matches HabitatCard */}
      <div className="relative w-full py-4 mb-2 flex items-center justify-center">
        {/* Small trade badge */}
        <div className="absolute top-0 left-0 flex items-center gap-1 bg-amber-100 dark:bg-amber-800 text-amber-700 dark:text-amber-200 text-[10px] font-semibold px-2 py-0.5 rounded-full">
          <StockIcon name={TRADE_TYPE_ICONS[offer.type]} size="xs" />
          <span>TRADE</span>
        </div>

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
            alt={displayTicker}
            className="absolute inset-0 w-full h-full object-contain"
            style={isMonster ? undefined : { imageRendering: 'pixelated' }}
          />
        </motion.div>
      </div>

      {/* Trade Info - matches HabitatCard layout */}
      <div className="text-center space-y-0.5">
        {/* Trade Type Name */}
        <p className="font-semibold text-text-primary text-base tracking-tight">
          {TRADE_TYPE_NAMES[offer.type]}
        </p>

        {/* Trade Summary */}
        <p className="text-xs text-text-secondary">
          {sellTicker ? `${sellTicker} → ${buyTicker}` : `Buy ${buyTicker}`}
        </p>

        {/* Primary Stat */}
        {offer.stats && offer.stats[0] && (
          <p className="text-xl font-bold text-amber-600 dark:text-amber-400">
            {offer.stats[0].value}
          </p>
        )}

        {/* Empty space to match HabitatCard height */}
        <p className="text-[10px] text-amber-600 dark:text-amber-400 font-semibold">
          {offer.stats && offer.stats[0] ? offer.stats[0].label : '\u00A0'}
        </p>
      </div>
    </motion.div>
  );
}
