'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  TradeOffer,
  TradeType,
  TRADE_TYPE_NAMES,
  TRADE_TYPE_ICONS,
} from '@/lib/trade-offers/types';
import { StockIcon, type IconName } from '@/components/StockIcon';
import { getSpriteForStock, hasMonsterSprite } from '@/lib/stocks';
import { useXP } from '@/hooks/useXP';
import { XPToast } from '@/components/xp';
import type { XPTransaction } from '@/lib/xp/types';

interface TradeOfferModalProps {
  offer: TradeOffer | null;
  isOpen: boolean;
  onClose: () => void;
  onExecute: (offerId: string) => void;
  onDismiss: (offerId: string) => void;
  isExecuting?: boolean;
}

// Trainer data for the "rival trainer" feel
const TRAINER_DATA: Record<TradeType, { name: string; icon: IconName; message: string }> = {
  tax_loss_harvest: {
    name: 'Tax Sage Terry',
    icon: 'wizard',
    message: 'I can help you evolve your portfolio with this trade...',
  },
  rebalance: {
    name: 'Balance Master Bri',
    icon: 'balance',
    message: 'Your habitat needs some rebalancing. How about this trade?',
  },
  oversold_opportunity: {
    name: 'Scout Sally',
    icon: 'target',
    message: 'I spotted a rare opportunity in the wild!',
  },
  pairs_trade: {
    name: 'Trader Trent',
    icon: 'swap',
    message: 'Hey! I think we can make a deal that benefits us both...',
  },
};

function SigilImage({
  ticker,
  percentChange,
  size = 48,
}: {
  ticker: string;
  percentChange: number;
  size?: number;
}) {
  const src = getSpriteForStock(ticker, percentChange);
  const isMonster = hasMonsterSprite(ticker);
  const displaySize = isMonster ? Math.max(size, 64) : size;

  return (
    <motion.div
      style={{ width: displaySize, height: displaySize }}
      className="relative"
      animate={{ y: [0, -3, 0] }}
      transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={src}
        alt={ticker}
        className="w-full h-full object-contain"
        style={isMonster ? undefined : { imageRendering: 'pixelated' }}
      />
    </motion.div>
  );
}

export function TradeOfferModal({
  offer,
  isOpen,
  onClose,
  onExecute,
  onDismiss,
  isExecuting = false,
}: TradeOfferModalProps) {
  const [xpToast, setXpToast] = useState<XPTransaction | null>(null);
  const { awardSwapXP } = useXP();

  if (!offer) return null;

  const trainer = TRAINER_DATA[offer.type];
  const typeIcon = TRADE_TYPE_ICONS[offer.type];
  const typeName = TRADE_TYPE_NAMES[offer.type];

  // Handler to execute trade and award XP
  const handleExecuteTrade = () => {
    // Determine if this is a "smart" trade (gets bonus XP)
    const smartTradeTypes: TradeType[] = ['tax_loss_harvest', 'rebalance', 'oversold_opportunity', 'pairs_trade'];
    const isSmart = smartTradeTypes.includes(offer.type);

    // Award XP for the swap
    const fromTicker = offer.sell?.ticker || '';
    const toTicker = offer.buy.ticker;
    const xpTransaction = awardSwapXP(fromTicker, toTicker, isSmart);
    if (xpTransaction) {
      setXpToast(xpTransaction);
    }

    // Execute the trade
    onExecute(offer.id);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            className="bg-white dark:bg-[#1A1A1A] rounded-2xl max-w-md w-full overflow-hidden shadow-xl"
            initial={{ scale: 0.95, y: 20, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            exit={{ scale: 0.95, y: 20, opacity: 0 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="px-5 pt-5 pb-4 border-b border-black/5 dark:border-white/10">
              <div className="flex items-center gap-3">
                {/* Trainer avatar */}
                <div className="w-12 h-12 rounded-full bg-amber-50 dark:bg-amber-900/30 flex items-center justify-center">
                  <StockIcon name={trainer.icon} size="lg" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-text-primary">{trainer.name}</span>
                    <span className="text-xs bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-300 px-2 py-0.5 rounded-full font-medium flex items-center gap-1">
                      <StockIcon name={typeIcon} size="xs" /> {typeName}
                    </span>
                  </div>
                  <p className="text-sm text-text-secondary mt-0.5">
                    "{trainer.message}"
                  </p>
                </div>
              </div>
            </div>

            {/* Trade Visualization */}
            <div className="px-5 py-4">
              <div className="flex items-center gap-3">
                {/* Sell Side */}
                {offer.sell && (
                  <>
                    <div className="flex-1 p-3 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-900/30 text-center">
                      <p className="text-[10px] font-semibold text-red-400 dark:text-red-400 uppercase mb-2">You Give</p>
                      <div className="flex justify-center mb-2">
                        <SigilImage ticker={offer.sell.ticker} percentChange={-5} size={56} />
                      </div>
                      <p className="font-bold text-text-primary">{offer.sell.ticker}</p>
                      <p className="text-xs text-text-secondary">
                        {offer.sell.shares.toFixed(2)} shares
                      </p>
                      <p className="text-sm font-semibold text-red-500 mt-1">
                        ${offer.sell.total.toFixed(2)}
                      </p>
                    </div>

                    {/* Arrow */}
                    <div className="flex flex-col items-center text-text-muted">
                      <span className="text-xl">⇄</span>
                    </div>
                  </>
                )}

                {/* Buy Side */}
                <div className="flex-1 p-3 rounded-xl bg-green-50 dark:bg-green-900/20 border border-green-100 dark:border-green-900/30 text-center">
                  <p className="text-[10px] font-semibold text-green-500 dark:text-green-400 uppercase mb-2">
                    {offer.sell ? 'You Get' : 'Buy This'}
                  </p>
                  <div className="flex justify-center mb-2">
                    <SigilImage ticker={offer.buy.ticker} percentChange={5} size={56} />
                  </div>
                  <p className="font-bold text-text-primary">{offer.buy.ticker}</p>
                  <p className="text-xs text-text-secondary">
                    {offer.buy.shares.toFixed(2)} shares
                  </p>
                  <p className="text-sm font-semibold text-green-600 dark:text-green-400 mt-1">
                    ${offer.buy.total.toFixed(2)}
                  </p>
                </div>
              </div>
            </div>

            {/* Explanation */}
            <div className="px-5 pb-4">
              <div className="p-3 rounded-xl bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-900/30">
                <div className="flex items-start gap-2">
                  <span className="text-blue-500 dark:text-blue-400 mt-0.5"><StockIcon name="wizard" size="sm" /></span>
                  <div>
                    <p className="text-xs font-semibold text-blue-700 dark:text-blue-300 uppercase mb-1">Why This Trade?</p>
                    <p className="text-sm text-blue-800 dark:text-blue-200 leading-relaxed">{offer.explanation}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Stats */}
            {offer.stats && offer.stats.length > 0 && (
              <div className="px-5 pb-4">
                <div className="grid grid-cols-2 gap-2">
                  {offer.stats.map((stat, i) => (
                    <div
                      key={i}
                      className="p-3 rounded-xl bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/10 text-center"
                    >
                      <p className="text-lg font-bold text-text-primary">{stat.value}</p>
                      <p className="text-[10px] text-text-secondary uppercase font-medium">
                        {stat.label}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="px-5 pb-4 space-y-2">
              <motion.button
                onClick={handleExecuteTrade}
                disabled={isExecuting}
                className="w-full py-3 bg-green-500 text-white rounded-xl font-semibold
                           hover:bg-green-600 transition-colors disabled:opacity-50"
                whileTap={{ scale: 0.98 }}
              >
                {isExecuting ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Executing...
                  </span>
                ) : (
                  'Accept Trade'
                )}
              </motion.button>

              <div className="flex gap-2">
                <button
                  onClick={onClose}
                  className="flex-1 py-2.5 bg-black/5 dark:bg-white/10 text-text-secondary rounded-xl font-medium hover:bg-black/10 dark:hover:bg-white/15 transition-colors"
                >
                  Learn More
                </button>
                <button
                  onClick={() => onDismiss(offer.id)}
                  className="flex-1 py-2.5 bg-black/5 dark:bg-white/10 text-text-secondary rounded-xl font-medium hover:bg-black/10 dark:hover:bg-white/15 transition-colors"
                >
                  Not Now
                </button>
              </div>
            </div>

            {/* Disclaimer */}
            <div className="px-5 pb-4">
              <p className="text-[10px] text-text-muted text-center leading-tight">
                Not financial advice. Past performance doesn't guarantee future results. All trades involve risk.
              </p>
            </div>
          </motion.div>
        </motion.div>
      )}

      {/* XP Toast Notification */}
      {xpToast && (
        <XPToast
          transaction={xpToast}
          onClose={() => setXpToast(null)}
        />
      )}
    </AnimatePresence>
  );
}
