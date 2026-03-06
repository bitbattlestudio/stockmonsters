'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Panel, Button, LoadingSpinner } from '@/components/ui';
import { SigilSprite } from '@/components/sigil';
import { PixelIcon } from '@/components/PixelIcon';
import { formatPrice, formatUSD } from '@/lib/utils/format';
import { getEvolutionLevel, getCreatureName } from '@/lib/sprites/evolution';
import { useTrading } from '@/hooks';
import { useWalletStore } from '@/stores';
import { useXP } from '@/hooks/useXP';
import { XPToast } from '@/components/xp';
import type { Sigil } from '@/types';
import type { XPTransaction } from '@/lib/xp/types';

interface FeedModalProps {
  sigil: Sigil;
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (amount: number) => Promise<void>;
}

const QUICK_AMOUNTS = [10, 25, 50, 100];

type Step = 'input' | 'approve' | 'sign' | 'submit' | 'success' | 'error';

export function FeedModal({ sigil, isOpen, onClose, onConfirm }: FeedModalProps) {
  const [amount, setAmount] = useState<string>('');
  const [step, setStep] = useState<Step>('input');
  const [txHash, setTxHash] = useState<string | null>(null);
  const [estimate, setEstimate] = useState<{
    shares: number;
    avgPrice: number;
    priceImpact: number;
  } | null>(null);
  const [xpToast, setXpToast] = useState<XPTransaction | null>(null);

  const { position, category, colors } = sigil;
  const evolutionLevel = getEvolutionLevel(position.currPrice);
  const name = getCreatureName(category, evolutionLevel);

  const {
    isLoading,
    error,
    needsApproval,
    canTrade,
    approveUsdc,
    getBuyEstimate,
    buyShares,
    checkUsdcApproval,
    clearError,
  } = useTrading();

  const { isConnected, proxyAddress } = useWalletStore();
  const { awardFeedXP } = useXP();

  const numAmount = parseFloat(amount) || 0;

  // Reset state when modal opens/closes
  useEffect(() => {
    if (isOpen) {
      setStep('input');
      setTxHash(null);
      clearError();
    }
  }, [isOpen, clearError]);

  // Fetch estimate when amount changes
  useEffect(() => {
    if (numAmount > 0 && isOpen) {
      getBuyEstimate(sigil, numAmount).then((est) => {
        if (est) {
          setEstimate({
            shares: est.shares,
            avgPrice: est.avgPrice,
            priceImpact: est.priceImpact,
          });
        }
      });
    } else {
      setEstimate(null);
    }
  }, [numAmount, sigil, getBuyEstimate, isOpen]);

  const handleConfirm = async () => {
    if (numAmount <= 0) return;

    clearError();

    // Check approval first
    setStep('approve');
    const needsApprovalCheck = await checkUsdcApproval();

    if (needsApprovalCheck) {
      // Need to approve USDC
      const approvalResult = await approveUsdc();
      if (!approvalResult.success) {
        setStep('error');
        return;
      }
    }

    // Sign and submit order
    setStep('sign');

    const result = await buyShares(sigil, numAmount);

    if (result.success) {
      setTxHash(result.txHash || result.orderId || null);
      setStep('success');

      // Award XP for feeding (buying)
      // Calculate percent change: positive if stock is up, negative if down
      const percentChange = ((position.currPrice - position.avgPrice) / position.avgPrice) * 100;
      const xpTransaction = awardFeedXP(numAmount, position.ticker || position.slug, percentChange);
      if (xpTransaction) {
        setXpToast(xpTransaction);
      }

      // Call the original onConfirm for UI updates
      await onConfirm(numAmount);
    } else {
      setStep('error');
    }
  };

  const handleClose = () => {
    setAmount('');
    setStep('input');
    setTxHash(null);
    clearError();
    onClose();
  };

  // Render different content based on step
  const renderContent = () => {
    switch (step) {
      case 'approve':
        return (
          <div className="text-center py-8">
            <LoadingSpinner size="lg" color={colors.primary} />
            <p className="text-lg font-bold text-text-dark mt-4">Approving USDC...</p>
            <p className="text-sm text-text-mid mt-2">
              Please confirm the transaction in your wallet
            </p>
          </div>
        );

      case 'sign':
        return (
          <div className="text-center py-8">
            <LoadingSpinner size="lg" color={colors.primary} />
            <p className="text-lg font-bold text-text-dark mt-4">Sign Order</p>
            <p className="text-sm text-text-mid mt-2">
              Please sign the order in your wallet
            </p>
          </div>
        );

      case 'submit':
        return (
          <div className="text-center py-8">
            <LoadingSpinner size="lg" color={colors.primary} />
            <p className="text-lg font-bold text-text-dark mt-4">Submitting Order...</p>
            <p className="text-sm text-text-mid mt-2">
              Your order is being placed on Polymarket
            </p>
          </div>
        );

      case 'success':
        return (
          <div className="text-center py-6">
            <motion.div
              className="mb-4 flex justify-center"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 200 }}
            >
              <PixelIcon name="checkmark" size="xl" />
            </motion.div>
            <p className="text-xl font-bold text-hp-green mb-2">Order Submitted!</p>
            <p className="text-sm text-text-mid mb-4">
              Your buy order for ~{estimate?.shares.toFixed(2) || (numAmount / position.currPrice).toFixed(2)} shares has been placed.
            </p>
            {txHash && (
              <a
                href={`https://polygonscan.com/tx/${txHash}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-accent-blue hover:underline"
              >
                View on Polygonscan →
              </a>
            )}
            <Button
              variant="success"
              size="lg"
              className="w-full mt-6"
              onClick={handleClose}
            >
              Done
            </Button>
          </div>
        );

      case 'error':
        return (
          <div className="text-center py-6">
            <div className="mb-4 flex justify-center"><PixelIcon name="x-mark" size="xl" /></div>
            <p className="text-xl font-bold text-hp-red mb-2">Order Failed</p>
            <p className="text-sm text-text-mid mb-4">
              {error || 'Something went wrong. Please try again.'}
            </p>
            <div className="flex gap-3">
              <Button
                variant="primary"
                size="lg"
                className="flex-1"
                onClick={handleClose}
              >
                Cancel
              </Button>
              <Button
                variant="success"
                size="lg"
                className="flex-1"
                onClick={() => {
                  clearError();
                  setStep('input');
                }}
              >
                Try Again
              </Button>
            </div>
          </div>
        );

      default:
        return (
          <>
            {/* Creature preview */}
            <motion.div
              className="p-4 rounded-xl mb-4 flex items-center gap-4"
              style={{ background: `${colors.primary}15` }}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
            >
              <SigilSprite
                category={category}
                evolution={evolutionLevel}
                colors={colors}
                size={60}
              />
              <div className="flex-1">
                <p className="font-bold text-text-dark line-clamp-2">{position.title}</p>
                <p className="text-sm text-text-mid">
                  Current: {formatPrice(position.currPrice)}
                </p>
              </div>
            </motion.div>

            {/* Trading status banner */}
            {!canTrade && (
              <div className="p-3 bg-hp-yellow/10 border-2 border-hp-yellow rounded-xl mb-4">
                <p className="text-sm text-text-dark flex items-center gap-1">
                  <PixelIcon name="warning" size="sm" />
                  {!isConnected
                    ? 'Connect your wallet to trade'
                    : !proxyAddress
                      ? 'Enter your Polymarket address to trade'
                      : 'Setup required to trade'}
                </p>
              </div>
            )}

            {/* Amount input */}
            <div className="mb-4">
              <label className="block text-sm font-bold text-text-dark mb-2">
                Amount (USD)
              </label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-text-mid font-bold">
                  $
                </span>
                <input
                  type="number"
                  value={amount}
                  onChange={(e) => {
                    setAmount(e.target.value);
                    clearError();
                  }}
                  placeholder="0.00"
                  className="w-full pl-8 pr-4 py-3 rounded-xl border-3 border-panel-border bg-white text-text-dark text-lg font-bold focus:outline-none focus:ring-2 focus:ring-hp-green"
                />
              </div>

              {/* Quick amounts */}
              <div className="flex gap-2 mt-3">
                {QUICK_AMOUNTS.map((quickAmount, index) => (
                  <motion.button
                    key={quickAmount}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.15 + index * 0.05 }}
                    onClick={() => setAmount(quickAmount.toString())}
                    className="flex-1 py-2 text-sm font-bold rounded-lg border-2 border-panel-border transition-colors"
                    style={{
                      background: amount === quickAmount.toString() ? colors.primary : 'white',
                      color: amount === quickAmount.toString() ? 'white' : 'var(--text-dark)',
                    }}
                    whileTap={{ scale: 0.95 }}
                  >
                    ${quickAmount}
                  </motion.button>
                ))}
              </div>
            </div>

            {/* Estimate */}
            <AnimatePresence>
              {numAmount > 0 && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="p-3 bg-white rounded-xl border-2 border-panel-border mb-4"
                >
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-text-mid">You pay</span>
                    <span className="font-bold text-text-dark">{formatUSD(numAmount)}</span>
                  </div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-text-mid">Est. price</span>
                    <span className="font-bold text-text-dark">
                      {estimate ? formatPrice(estimate.avgPrice) : formatPrice(position.currPrice)}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm pt-2 border-t border-panel-border/30">
                    <span className="text-text-mid">Est. shares</span>
                    <span className="font-bold text-hp-green">
                      ~{estimate ? estimate.shares.toFixed(2) : (numAmount / position.currPrice).toFixed(2)}
                    </span>
                  </div>
                  {estimate && estimate.priceImpact > 1 && (
                    <div className="flex justify-between text-sm mt-1">
                      <span className="text-text-mid">Price impact</span>
                      <span className="font-bold text-hp-yellow">
                        {estimate.priceImpact.toFixed(2)}%
                      </span>
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>

            {/* Error */}
            <AnimatePresence>
              {error && (
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="text-sm text-hp-red mb-4 text-center"
                >
                  {error}
                </motion.p>
              )}
            </AnimatePresence>

            {/* Actions */}
            <div className="flex gap-3">
              <Button
                variant="primary"
                size="lg"
                className="flex-1"
                onClick={handleClose}
                disabled={isLoading}
              >
                Cancel
              </Button>
              <Button
                variant="success"
                size="lg"
                className="flex-1 flex items-center justify-center gap-2"
                onClick={handleConfirm}
                disabled={!canTrade || numAmount <= 0 || isLoading}
              >
                {isLoading && <LoadingSpinner size="sm" color="#FFF" />}
                {!canTrade ? 'Connect Wallet' : 'Buy Shares'}
              </Button>
            </div>

            <p className="text-xs text-text-mid text-center mt-4">
              Orders are signed with EIP-712 and placed on Polymarket
            </p>
          </>
        );
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={step === 'input' || step === 'error' || step === 'success' ? handleClose : undefined}
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
          >
            <Panel className="relative z-10 w-full max-w-sm p-6">
              {/* Header */}
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-text-dark flex items-center gap-2">
                  🍖 Feed {name}
                </h2>
                {(step === 'input' || step === 'error' || step === 'success') && (
                  <button
                    onClick={handleClose}
                    className="p-2 hover:bg-panel-border/10 rounded-lg transition-colors"
                  >
                    <svg className="w-5 h-5 text-text-mid" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                )}
              </div>

              {renderContent()}
            </Panel>
          </motion.div>
        </div>
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

export default FeedModal;
