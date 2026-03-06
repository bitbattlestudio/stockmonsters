'use client';

import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { StockIcon } from '@/components/StockIcon';
import { getSpriteForStock, hasMonsterSprite } from '@/lib/stocks';

// Demo stocks to show on landing page
const DEMO_STOCKS = [
  { ticker: 'NVDA', change: 12.5 },
  { ticker: 'PLTR', change: 5.2 },
  { ticker: 'AMZN', change: 0.8 },
];

export default function Home() {
  const router = useRouter();

  const handleViewPortfolio = () => {
    router.push('/collection');
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6">
      {/* Animated stock sprites */}
      <div className="flex justify-center gap-8 mb-10">
        {DEMO_STOCKS.map((stock, i) => {
          const sprite = getSpriteForStock(stock.ticker, stock.change);
          const isMonster = hasMonsterSprite(stock.ticker);
          return (
            <motion.div
              key={stock.ticker}
              className="flex flex-col items-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.15, duration: 0.4 }}
            >
              <motion.div
                className={`relative mb-2 ${isMonster ? 'w-24 h-24' : 'w-16 h-16'}`}
                animate={{ y: [0, -6, 0] }}
                transition={{
                  duration: 2.5,
                  repeat: Infinity,
                  delay: i * 0.3,
                  ease: 'easeInOut',
                }}
              >
                <Image
                  src={sprite}
                  alt={stock.ticker}
                  fill
                  className="object-contain"
                  style={isMonster ? undefined : { imageRendering: 'pixelated' }}
                />
              </motion.div>
              <span className="text-xs font-semibold text-text-secondary">{stock.ticker}</span>
              <span
                className={`text-xs font-semibold ${
                  stock.change > 0 ? 'price-up' : stock.change < 0 ? 'price-down' : 'price-neutral'
                }`}
              >
                {stock.change > 0 ? '+' : ''}{stock.change}%
              </span>
            </motion.div>
          );
        })}
      </div>

      {/* Logo and Title */}
      <motion.div
        className="text-center mb-10"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.4 }}
      >
        <Image
          src="/logo.png"
          width={96}
          height={96}
          alt="AssetMonsters logo"
          className="mx-auto mb-4 rounded-2xl shadow-lg"
          style={{ imageRendering: 'pixelated' }}
        />
        <h1 className="text-4xl font-bold mb-2" style={{ color: '#6858A8' }}>
          AssetMonsters
        </h1>
        <p className="text-lg text-text-secondary">
          Your assets, alive
        </p>
      </motion.div>

      {/* CTA Button */}
      <motion.button
        className="w-full max-w-xs py-4 px-6 bg-text-primary text-white font-semibold text-lg rounded-full shadow-lg hover:shadow-xl transition-shadow"
        onClick={handleViewPortfolio}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.4 }}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        View Portfolio
      </motion.button>

      {/* Features */}
      <motion.div
        className="mt-12 grid grid-cols-3 gap-6 max-w-sm w-full"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.7, duration: 0.4 }}
      >
        {[
          { icon: 'trending-up' as const, label: 'Up = Happy' },
          { icon: 'trending-down' as const, label: 'Down = Sad' },
          { icon: 'rocket' as const, label: 'Moon = Party' },
        ].map((feature, i) => (
          <div key={i} className="text-center">
            <div className="mb-1 flex justify-center">
              <StockIcon name={feature.icon} size="lg" />
            </div>
            <p className="text-xs text-text-secondary font-medium">{feature.label}</p>
          </div>
        ))}
      </motion.div>

      {/* Footer */}
      <motion.p
        className="text-xs text-text-muted mt-12"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.9 }}
      >
        Demo Mode
      </motion.p>
    </div>
  );
}
