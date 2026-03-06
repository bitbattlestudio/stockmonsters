'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { Panel, Button } from '@/components/ui';
import { PixelIcon } from '@/components/PixelIcon';

interface TradeConfirmationProps {
  isOpen: boolean;
  type: 'success' | 'error';
  title: string;
  message: string;
  txHash?: string;
  onClose: () => void;
}

export function TradeConfirmation({
  isOpen,
  type,
  title,
  message,
  txHash,
  onClose,
}: TradeConfirmationProps) {
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
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
          >
            <Panel className="relative z-10 w-full max-w-sm p-6 text-center">
              {/* Animated Icon */}
              <motion.div
                className="mb-4 flex justify-center"
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ type: 'spring', stiffness: 200, damping: 15, delay: 0.1 }}
              >
                <PixelIcon name={type === 'success' ? 'checkmark' : 'x-mark'} size="xl" />
              </motion.div>

              {/* Title */}
              <motion.h2
                className="text-xl font-bold mb-2"
                style={{ color: type === 'success' ? 'var(--hp-green)' : 'var(--hp-red)' }}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                {title}
              </motion.h2>

              {/* Message */}
              <motion.p
                className="text-text-mid mb-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                {message}
              </motion.p>

              {/* Transaction hash */}
              {txHash && (
                <motion.a
                  href={`https://polygonscan.com/tx/${txHash}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block mb-4 text-sm text-accent-blue hover:underline"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.4 }}
                >
                  View transaction →
                </motion.a>
              )}

              {/* Close button */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                <Button
                  variant={type === 'success' ? 'success' : 'primary'}
                  size="lg"
                  className="w-full"
                  onClick={onClose}
                >
                  {type === 'success' ? 'Awesome!' : 'Close'}
                </Button>
              </motion.div>
            </Panel>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

export default TradeConfirmation;
