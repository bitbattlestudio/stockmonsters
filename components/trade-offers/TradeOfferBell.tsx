'use client';

import { motion } from 'framer-motion';
import { TradeOffer } from '@/lib/trade-offers/types';

interface TradeOfferBellProps {
  offers: TradeOffer[];
  onOpen: () => void;
}

export function TradeOfferBell({ offers, onOpen }: TradeOfferBellProps) {
  const hasOffers = offers.length > 0;

  return (
    <button
      onClick={onOpen}
      className="relative p-2 rounded-full hover:bg-gray-100/50 transition-colors"
      aria-label={`Trade offers: ${offers.length} available`}
    >
      {/* Bell Icon */}
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={1.5}
        stroke="currentColor"
        className="w-6 h-6 text-text-primary"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0"
        />
      </svg>

      {/* Notification Badge */}
      {hasOffers && (
        <>
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
            {offers.length}
          </span>

          {/* Pulse Animation for New Offers */}
          <motion.span
            className="absolute -top-1 -right-1 bg-red-500 rounded-full w-5 h-5"
            animate={{ scale: [1, 1.5, 1], opacity: [0.75, 0, 0.75] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
        </>
      )}
    </button>
  );
}
