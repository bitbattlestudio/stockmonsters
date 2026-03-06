'use client';

import { motion, AnimatePresence } from 'framer-motion';
import {
  TradeOffer,
  TRADE_TYPE_NAMES,
  TRADE_TYPE_ICONS,
  TRADE_TYPE_COLORS,
} from '@/lib/trade-offers/types';
import { StockIcon } from '@/components/StockIcon';

interface TradeOfferListProps {
  offers: TradeOffer[];
  isOpen: boolean;
  onClose: () => void;
  onSelectOffer: (offer: TradeOffer) => void;
}

export function TradeOfferList({
  offers,
  isOpen,
  onClose,
  onSelectOffer,
}: TradeOfferListProps) {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        key="trade-offer-backdrop"
        className="fixed inset-0 bg-black/30 z-40"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      />
      <motion.div
        key="trade-offer-list"
        className="fixed top-16 right-4 w-80 bg-white dark:bg-[#1A1A1A] rounded-xl shadow-xl z-50 overflow-hidden"
        initial={{ opacity: 0, y: -10, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: -10, scale: 0.95 }}
      >
        <div className="p-4 border-b border-black/5 dark:border-white/10">
          <h3 className="font-bold text-text-primary">Trade Offers</h3>
          <p className="text-sm text-text-secondary">
            {offers.length} {offers.length === 1 ? 'opportunity' : 'opportunities'} available
          </p>
        </div>

        <div className="max-h-96 overflow-y-auto">
          {offers.length === 0 ? (
            <div className="p-6 text-center">
              <div className="mb-2 flex justify-center"><StockIcon name="target" size="xl" /></div>
              <p className="text-text-secondary text-sm">
                No trade offers right now. Check back later!
              </p>
            </div>
          ) : (
            <div className="divide-y divide-black/5 dark:divide-white/10">
              {offers.map((offer, index) => (
                <motion.button
                  key={offer.id}
                  className="w-full p-4 text-left hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
                  onClick={() => onSelectOffer(offer)}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <div className="flex items-start gap-3">
                    <div
                      className={`w-10 h-10 rounded-full ${TRADE_TYPE_COLORS[offer.type]} flex items-center justify-center`}
                    >
                      <StockIcon name={TRADE_TYPE_ICONS[offer.type]} size="md" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-semibold text-text-primary text-sm">
                        {TRADE_TYPE_NAMES[offer.type]}
                      </div>
                      <div className="text-xs text-text-secondary truncate">
                        {offer.sell ? (
                          <>
                            {offer.sell.ticker} → {offer.buy.ticker}
                          </>
                        ) : (
                          <>Buy {offer.buy.ticker}</>
                        )}
                      </div>
                      {offer.stats && offer.stats[0] && (
                        <div className="mt-1 text-xs font-medium text-green-600 dark:text-green-400">
                          {offer.stats[0].label}: {offer.stats[0].value}
                        </div>
                      )}
                    </div>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      className="w-5 h-5 text-text-muted"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M8.25 4.5l7.5 7.5-7.5 7.5"
                      />
                    </svg>
                  </div>
                </motion.button>
              ))}
            </div>
          )}
        </div>

        <div className="p-3 border-t border-black/5 dark:border-white/10 bg-black/5 dark:bg-white/5">
          <p className="text-xs text-text-muted text-center">
            Offers refresh daily based on market conditions
          </p>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
