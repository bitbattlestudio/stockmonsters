'use client';

import { useState } from 'react';
import { useXP } from '@/hooks/useXP';
import { StockIcon } from '@/components/StockIcon';

interface HarvestModalProps {
  isOpen: boolean;
  onClose: () => void;
  availableStocks: Array<{ ticker: string; price: number; name: string }>;
}

export function HarvestModal({ isOpen, onClose, availableStocks }: HarvestModalProps) {
  const { currentXP, harvestStock, setHarvestStock, harvest, getHarvestPreview, constants } = useXP();

  const [selectedStock, setSelectedStock] = useState(harvestStock || availableStocks[0]?.ticker);
  const [xpToHarvest, setXpToHarvest] = useState(Math.floor(currentXP / 1000) * 1000);

  if (!isOpen) return null;

  const stock = availableStocks.find(s => s.ticker === selectedStock);
  const preview = stock ? getHarvestPreview(xpToHarvest, stock.price) : null;

  const canHarvest = xpToHarvest >= 1000 && xpToHarvest <= currentXP;

  const handleHarvest = () => {
    if (!canHarvest || !stock) return;

    setHarvestStock(selectedStock);
    const result = harvest(xpToHarvest, stock.price);

    if (result) {
      // TODO: Trigger actual stock purchase via Robinhood Chain
      alert(`Harvested ${result.shares.toFixed(6)} shares of ${selectedStock}! (Demo mode)`);
      onClose();
    }
  };

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-50 bg-black/30 dark:bg-black/60"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none">
        <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl p-6 w-full max-w-md mx-4 pointer-events-auto shadow-2xl">
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-heading text-xl font-bold text-gray-900 dark:text-gray-100 flex items-center gap-2">
              <span>🌾</span> Harvest XP
            </h2>
            <button
              onClick={onClose}
              className="text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 transition-colors text-xl"
            >
              ✕
            </button>
          </div>

          {/* How to Earn XP Guide */}
          <div className="bg-blue-500/10 dark:bg-blue-500/20 border border-blue-500/30 dark:border-blue-500/40 rounded-lg p-4 mb-4">
            <div className="text-sm font-semibold text-blue-700 dark:text-blue-300 mb-2">
              ⭐ How to Earn XP
            </div>
            <div className="space-y-1.5 text-xs text-blue-800 dark:text-blue-200">
              <div className="flex items-start gap-2">
                <span className="text-green-600 dark:text-green-400">🍎</span>
                <div>
                  <span className="font-semibold">Buy stocks:</span> 1 XP per $10 spent
                  <span className="text-green-600 dark:text-green-400 font-semibold"> (2x when stock is down!)</span>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-blue-600 dark:text-blue-400">📉</span>
                <div>
                  <span className="font-semibold">Sell stocks:</span> 0.5 XP per $10 sold
                  <span className="text-blue-600 dark:text-blue-400 font-semibold"> (2x on profit!)</span>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-cyan-600 dark:text-cyan-400">🔄</span>
                <div>
                  <span className="font-semibold">Accept trades:</span> 50-100 XP per swap
                </div>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-purple-600 dark:text-purple-400">🏃</span>
                <div>
                  <span className="font-semibold">Hold daily:</span> 1 XP per stock + milestone bonuses
                </div>
              </div>
            </div>
          </div>

          {/* Current XP */}
          <div className="bg-amber-500/10 dark:bg-amber-500/20 border border-amber-500/30 dark:border-amber-500/40 rounded-lg p-4 mb-4">
            <div className="text-sm text-amber-700 dark:text-amber-300 mb-1">Your XP</div>
            <div className="font-pixel text-2xl text-amber-600 dark:text-amber-400">
              {currentXP.toLocaleString()} XP
            </div>
            <div className="text-xs text-amber-700 dark:text-amber-300 mt-1">
              Lifetime: {constants.XP_TO_DOLLAR_RATIO.toLocaleString()} XP = $1.00
            </div>
          </div>

          {/* Stock Selection */}
          <div className="mb-4">
            <label className="text-sm text-gray-700 dark:text-gray-300 mb-2 block">Harvest Stock</label>
            <select
              value={selectedStock}
              onChange={(e) => setSelectedStock(e.target.value)}
              className="w-full bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg p-3 text-gray-900 dark:text-gray-100"
            >
              {availableStocks.map(s => (
                <option key={s.ticker} value={s.ticker} className="bg-white dark:bg-gray-800">
                  {s.ticker} - {s.name} (${s.price.toFixed(2)})
                </option>
              ))}
            </select>
          </div>

          {/* XP Amount */}
          <div className="mb-4">
            <label className="text-sm text-gray-700 dark:text-gray-300 mb-2 block">XP to Harvest</label>
            <input
              type="number"
              min={1000}
              max={currentXP}
              step={1000}
              value={xpToHarvest}
              onChange={(e) => setXpToHarvest(Number(e.target.value))}
              className="w-full bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg p-3 text-gray-900 dark:text-gray-100 font-mono"
            />
            <div className="text-xs text-gray-600 dark:text-gray-400 mt-1">
              {constants.XP_TO_DOLLAR_RATIO.toLocaleString()} XP = $1.00
            </div>
          </div>

          {/* Preview */}
          {preview && stock && (
            <div className="bg-green-500/10 dark:bg-green-500/20 border border-green-500/30 dark:border-green-500/40 rounded-lg p-4 mb-6">
              <div className="text-sm text-green-700 dark:text-green-300 mb-2">You'll receive:</div>
              <div className="font-heading text-xl text-gray-900 dark:text-gray-100">
                {preview.shares.toFixed(6)} {selectedStock}
              </div>
              <div className="text-sm text-gray-700 dark:text-gray-300">
                (${preview.dollarValue.toFixed(2)} value)
              </div>
            </div>
          )}

          {/* Harvest Button */}
          <button
            onClick={handleHarvest}
            disabled={!canHarvest}
            className={`
              w-full py-3 rounded-lg font-semibold transition-colors
              ${canHarvest
                ? 'bg-green-600 hover:bg-green-500 text-white'
                : 'bg-gray-300 dark:bg-white/10 text-gray-500 dark:text-white/40 cursor-not-allowed'}
            `}
          >
            {canHarvest ? `Harvest ${xpToHarvest.toLocaleString()} XP` : 'Need at least 1,000 XP'}
          </button>
        </div>
      </div>
    </>
  );
}
