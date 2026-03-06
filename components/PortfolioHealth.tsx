'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  calculatePortfolioHealth,
  type PositionHealth,
  type HealthLevel,
} from '@/lib/portfolioHealth';
import { StockIcon, type IconName } from '@/components/StockIcon';

interface PortfolioHealthProps {
  totalValue: number;
  totalGain: number;
  totalGainPercent: number;
  positions: PositionHealth[];
}

const COLOR_MAP: Record<HealthLevel['color'], string> = {
  red: 'bg-red-500',
  orange: 'bg-orange-500',
  yellow: 'bg-yellow-500',
  green: 'bg-green-500',
  gold: 'bg-amber-400',
};

const COLOR_TEXT_MAP: Record<HealthLevel['color'], string> = {
  red: 'text-red-600 dark:text-red-400',
  orange: 'text-orange-600 dark:text-orange-400',
  yellow: 'text-yellow-600 dark:text-yellow-400',
  green: 'text-green-600 dark:text-green-400',
  gold: 'text-amber-600 dark:text-amber-400',
};

interface HealthBarProps {
  icon: IconName;
  label: string;
  fill: number;
  color: HealthLevel['color'];
  value: string;
  status: string;
  delay: number;
}

function HealthBar({ icon, label, fill, color, value, status, delay }: HealthBarProps) {
  return (
    <div className="flex items-center gap-3">
      {/* Label */}
      <div className="flex items-center gap-1.5 w-24 flex-shrink-0">
        <StockIcon name={icon} size="md" />
        <span className="text-xs font-semibold text-text-secondary uppercase tracking-wide">
          {label}
        </span>
      </div>

      {/* Bar */}
      <div className="flex-1 h-3 bg-black/5 dark:bg-white/10 rounded-full overflow-hidden">
        <motion.div
          className={`h-full rounded-full ${COLOR_MAP[color]}`}
          initial={{ width: 0 }}
          animate={{ width: `${fill}%` }}
          transition={{ duration: 0.8, delay, ease: 'easeOut' }}
        />
      </div>

      {/* Value & Status */}
      <div className="flex items-center gap-2 w-32 flex-shrink-0 justify-end">
        <span className="font-pixel text-[9px] text-text-primary">{value}</span>
        <span className={`font-pixel text-[9px] ${COLOR_TEXT_MAP[color]}`}>{status}</span>
      </div>
    </div>
  );
}

function InfoPopover({ onClose }: { onClose: () => void }) {
  return (
    <motion.div
      className="absolute top-full left-0 right-0 mt-2 habitat-card p-4 z-[999]"
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.2 }}
    >
      {/* Close button */}
      <button
        onClick={onClose}
        className="absolute top-2 right-2 p-1 text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
        </svg>
      </button>

      <h4 className="font-heading font-semibold text-sm text-text-primary mb-3">
        Understanding Your Portfolio Health
      </h4>

      <div className="space-y-3">
        {/* Health explanation */}
        <div className="flex gap-2">
          <StockIcon name="health-heart" size="md" />
          <div>
            <p className="font-semibold text-xs text-text-primary">Health</p>
            <p className="text-xs text-text-secondary">
              Your overall portfolio performance. Based on total gain/loss percentage.
              Green = profitable, Red = losing money.
            </p>
          </div>
        </div>

        {/* Hunger explanation */}
        <div className="flex gap-2">
          <StockIcon name="hunger-apple" size="md" />
          <div>
            <p className="font-semibold text-xs text-text-primary">Hunger</p>
            <p className="text-xs text-text-secondary">
              How long since you&apos;ve &quot;fed&quot; your StockMonsters (made purchases).
              Regular investing keeps them happy! Green = recently fed, Red = neglected.
            </p>
          </div>
        </div>

        {/* Happiness explanation */}
        <div className="flex gap-2">
          <StockIcon name="happiness" size="md" />
          <div>
            <p className="font-semibold text-xs text-text-primary">Happiness</p>
            <p className="text-xs text-text-secondary">
              How many of your StockMonsters are profitable (in the green).
              More winners = happier portfolio!
            </p>
          </div>
        </div>
      </div>

      <div className="mt-3 pt-3 border-t border-black/5 dark:border-white/10">
        <p className="text-[10px] text-text-muted text-center">
          Keep all bars green for a thriving portfolio!
        </p>
      </div>
    </motion.div>
  );
}

export function PortfolioHealth({
  totalValue,
  totalGain,
  totalGainPercent,
  positions,
}: PortfolioHealthProps) {
  const [showInfo, setShowInfo] = useState(false);
  const healthData = calculatePortfolioHealth(positions, totalGainPercent);

  const { summary } = healthData;

  return (
    <motion.div
      className="relative habitat-card p-4"
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <StockIcon name="health-check" size="md" />
          <h3 className="font-heading text-sm font-bold text-text-primary uppercase tracking-wide">
            Portfolio Health
          </h3>
        </div>

        {/* Info button */}
        <button
          onClick={() => setShowInfo(!showInfo)}
          className="p-1 rounded-full hover:bg-black/5 dark:hover:bg-white/10 transition-colors"
          aria-label="Learn about portfolio health"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-4 h-4 text-text-muted"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
              clipRule="evenodd"
            />
          </svg>
        </button>
      </div>

      {/* Info Popover */}
      <AnimatePresence>
        {showInfo && <InfoPopover onClose={() => setShowInfo(false)} />}
      </AnimatePresence>

      {/* Health Bars */}
      <div className="space-y-2.5">
        <HealthBar
          icon="health-heart"
          label="Health"
          fill={healthData.health.fill}
          color={healthData.health.color}
          value={healthData.health.value}
          status={healthData.health.label}
          delay={0.1}
        />
        <HealthBar
          icon="hunger-apple"
          label="Hunger"
          fill={healthData.hunger.fill}
          color={healthData.hunger.color}
          value={healthData.hunger.value}
          status={healthData.hunger.label}
          delay={0.2}
        />
        <HealthBar
          icon="happiness"
          label="Happiness"
          fill={healthData.happiness.fill}
          color={healthData.happiness.color}
          value={healthData.happiness.value}
          status={healthData.happiness.label}
          delay={0.3}
        />
      </div>

      {/* Summary Line */}
      <div className="mt-3 pt-3 border-t border-black/5 dark:border-white/10">
        <p className="text-xs text-text-secondary text-center flex items-center justify-center gap-1">
          <StockIcon name="backpack" size="sm" />
          <span>{summary.total} StockMonsters</span>
          {summary.greenCount > 0 && (
            <>
              <span className="mx-1">·</span>
              <StockIcon name="trending-up" size="sm" />
              <span>{summary.greenCount} thriving</span>
            </>
          )}
          {summary.redCount > 0 ? (
            <>
              <span className="mx-1">·</span>
              <StockIcon name="sad" size="sm" />
              <span>{summary.redCount} {summary.redCount === 1 ? 'needs' : 'need'} love</span>
            </>
          ) : summary.total > 0 ? (
            <>
              <span className="mx-1">·</span>
              <StockIcon name="celebration" size="sm" />
              <span>All happy!</span>
            </>
          ) : null}
        </p>
      </div>
    </motion.div>
  );
}
