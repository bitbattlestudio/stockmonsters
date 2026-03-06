'use client';

import { useParams, useRouter } from 'next/navigation';
import { useState, useRef, useCallback } from 'react';
import { motion } from 'framer-motion';
import { getStockData, getStockBrand, getSpriteForStock, hasMonsterSprite } from '@/lib/stocks';
import { useStockData, formatMarketCap, type ChartPoint } from '@/hooks/useStockData';
import { PixelIcon } from '@/components/PixelIcon';

// Robinhood-style interactive stock chart
function StockChart({
  data,
  isPositive,
  isLoading,
  period,
  onHoverPrice,
  textColor = 'white',
}: {
  data: Array<{ price: number; time?: number }>;
  isPositive: boolean;
  isLoading?: boolean;
  period: '1D' | '1W' | '1M';
  onHoverPrice?: (price: number | null, time: string | null) => void;
  textColor?: 'white' | 'black';
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [hoverIndex, setHoverIndex] = useState<number | null>(null);

  const handleInteraction = useCallback(
    (clientX: number) => {
      if (!containerRef.current || !data.length) return;

      const rect = containerRef.current.getBoundingClientRect();
      const x = clientX - rect.left;
      const percentage = Math.max(0, Math.min(1, x / rect.width));
      const index = Math.round(percentage * (data.length - 1));

      setHoverIndex(index);

      if (onHoverPrice && data[index]) {
        const point = data[index];
        let timeStr = '';

        if (point.time) {
          const date = new Date(point.time * 1000);
          if (period === '1D') {
            timeStr = date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
          } else if (period === '1W') {
            timeStr = date.toLocaleDateString('en-US', { weekday: 'short', hour: 'numeric' });
          } else {
            timeStr = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
          }
        }

        onHoverPrice(point.price, timeStr);
      }
    },
    [data, onHoverPrice, period]
  );

  const handleMouseMove = (e: React.MouseEvent) => handleInteraction(e.clientX);
  const handleTouchMove = (e: React.TouchEvent) => handleInteraction(e.touches[0].clientX);

  const handleLeave = () => {
    setHoverIndex(null);
    onHoverPrice?.(null, null);
  };

  if (isLoading) {
    return (
      <div className="h-48 flex items-center justify-center">
        <div className="animate-pulse" style={{ color: textColor, opacity: 0.5 }}>
          Loading chart...
        </div>
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <div className="h-48 flex items-center justify-center">
        <div style={{ color: textColor, opacity: 0.5 }}>No chart data available</div>
      </div>
    );
  }

  const prices = data.map((d) => d.price);
  const min = Math.min(...prices);
  const max = Math.max(...prices);
  const padding = (max - min) * 0.1 || 1;
  const chartMin = min - padding;
  const chartMax = max + padding;
  const range = chartMax - chartMin;

  const width = 320;
  const height = 180;
  const chartHeight = 150;
  const chartTop = 10;

  // Create smooth path
  const getY = (price: number) => chartTop + chartHeight - ((price - chartMin) / range) * chartHeight;

  let pathD = '';
  data.forEach((point, i) => {
    const x = (i / (data.length - 1)) * width;
    const y = getY(point.price);
    if (i === 0) {
      pathD += `M ${x} ${y}`;
    } else {
      pathD += ` L ${x} ${y}`;
    }
  });

  const lineColor = isPositive ? '#00C805' : '#FF5000';
  const hoverX = hoverIndex !== null ? (hoverIndex / (data.length - 1)) * width : null;
  const hoverY = hoverIndex !== null ? getY(data[hoverIndex].price) : null;

  // Time labels
  const timeLabels: { x: number; label: string }[] = [];
  const labelCount = 4;
  for (let i = 0; i <= labelCount; i++) {
    const idx = Math.floor((i / labelCount) * (data.length - 1));
    const point = data[idx];
    let label = '';
    if (point?.time) {
      const date = new Date(point.time * 1000);
      if (period === '1D') {
        label = date.toLocaleTimeString('en-US', { hour: 'numeric' });
      } else if (period === '1W') {
        label = date.toLocaleDateString('en-US', { weekday: 'short' });
      } else {
        label = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      }
    } else {
      // Mock time labels
      if (period === '1D') {
        const hours = ['9AM', '11AM', '1PM', '3PM', '4PM'];
        label = hours[i] || '';
      } else if (period === '1W') {
        const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'];
        label = days[i] || '';
      } else {
        const dates = ['1', '8', '15', '22', '30'];
        label = dates[i] || '';
      }
    }
    timeLabels.push({ x: (i / labelCount) * width, label });
  }

  return (
    <div
      ref={containerRef}
      className="relative cursor-crosshair select-none w-full"
      style={{ aspectRatio: '16/9' }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleLeave}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleLeave}
    >
      <svg width="100%" height="100%" viewBox={`0 0 ${width} ${height}`} preserveAspectRatio="xMidYMid meet">
        {/* Horizontal grid lines */}
        {[0.25, 0.5, 0.75].map((pct) => (
          <line
            key={pct}
            x1={0}
            y1={chartTop + chartHeight * pct}
            x2={width}
            y2={chartTop + chartHeight * pct}
            stroke={textColor}
            strokeOpacity={0.1}
            strokeWidth={1}
          />
        ))}

        {/* Main price line */}
        <path
          d={pathD}
          fill="none"
          stroke={lineColor}
          strokeWidth={2}
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Hover elements */}
        {hoverIndex !== null && hoverX !== null && hoverY !== null && (
          <>
            {/* Vertical line */}
            <line
              x1={hoverX}
              y1={chartTop}
              x2={hoverX}
              y2={chartTop + chartHeight}
              stroke={textColor}
              strokeOpacity={0.3}
              strokeWidth={1}
              strokeDasharray="4,4"
            />
            {/* Horizontal line */}
            <line
              x1={0}
              y1={hoverY}
              x2={width}
              y2={hoverY}
              stroke={textColor}
              strokeOpacity={0.2}
              strokeWidth={1}
            />
            {/* Dot */}
            <circle cx={hoverX} cy={hoverY} r={4} fill={lineColor} />
          </>
        )}

        {/* Current price dot (when not hovering) */}
        {hoverIndex === null && (
          <circle
            cx={width}
            cy={getY(prices[prices.length - 1])}
            r={4}
            fill={lineColor}
          />
        )}

        {/* Time labels */}
        {timeLabels.map((tl, i) => (
          <text
            key={i}
            x={tl.x}
            y={height - 2}
            textAnchor={i === 0 ? 'start' : i === timeLabels.length - 1 ? 'end' : 'middle'}
            fill={textColor}
            fillOpacity={0.5}
            fontSize={10}
            fontFamily="system-ui"
          >
            {tl.label}
          </text>
        ))}
      </svg>
    </div>
  );
}

// Period toggle buttons
function PeriodToggle({
  period,
  onChange,
  color,
}: {
  period: '1D' | '1W' | '1M';
  onChange: (p: '1D' | '1W' | '1M') => void;
  color: string;
}) {
  const periods: Array<'1D' | '1W' | '1M'> = ['1D', '1W', '1M'];

  return (
    <div className="flex gap-2">
      {periods.map((p) => (
        <button
          key={p}
          onClick={() => onChange(p)}
          className="px-4 py-2 rounded-full text-sm font-semibold transition-all"
          style={{
            backgroundColor: period === p ? color : 'rgba(255,255,255,0.15)',
            color: 'white',
          }}
        >
          {p}
        </button>
      ))}
    </div>
  );
}

// Position card component
function PositionCard({
  shares,
  avgCost,
  currentValue,
  profitLoss,
  profitLossPercent,
  textColor,
}: {
  shares: number;
  avgCost: number;
  currentValue: number;
  profitLoss: number;
  profitLossPercent: number;
  textColor: 'white' | 'black';
}) {
  const isProfit = profitLoss >= 0;

  return (
    <div
      className="rounded-2xl p-4"
      style={{
        backgroundColor: textColor === 'white' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.08)',
      }}
    >
      <p className="text-sm font-medium mb-3 opacity-70" style={{ color: textColor }}>
        Your Position
      </p>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <p className="text-2xl font-bold" style={{ color: textColor }}>
            {shares} shares
          </p>
          <p className="text-sm opacity-70" style={{ color: textColor }}>
            Avg cost ${avgCost.toFixed(2)}
          </p>
        </div>
        <div className="text-right">
          <p className="text-2xl font-bold" style={{ color: textColor }}>
            ${currentValue.toFixed(2)}
          </p>
          <p className="text-sm font-semibold" style={{ color: isProfit ? '#00C805' : '#FF5000' }}>
            {isProfit ? '+' : ''}${profitLoss.toFixed(2)} ({isProfit ? '+' : ''}
            {profitLossPercent.toFixed(2)}%)
          </p>
        </div>
      </div>
    </div>
  );
}

// Market stats grid
function MarketStats({
  open,
  high,
  low,
  volume,
  marketCap,
  textColor,
}: {
  open: number;
  high: number;
  low: number;
  volume: string;
  marketCap: string;
  textColor: 'white' | 'black';
}) {
  const stats = [
    { label: 'Open', value: `$${open.toFixed(2)}` },
    { label: 'High', value: `$${high.toFixed(2)}` },
    { label: 'Low', value: `$${low.toFixed(2)}` },
    { label: 'Volume', value: volume },
    { label: 'Market Cap', value: marketCap },
  ];

  return (
    <div
      className="rounded-2xl p-4"
      style={{
        backgroundColor: textColor === 'white' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.08)',
      }}
    >
      <p className="text-sm font-medium mb-3 opacity-70" style={{ color: textColor }}>
        Market Stats
      </p>
      <div className="grid grid-cols-2 gap-3">
        {stats.map((stat) => (
          <div key={stat.label} className="flex justify-between">
            <span className="text-sm opacity-70" style={{ color: textColor }}>
              {stat.label}
            </span>
            <span className="text-sm font-semibold" style={{ color: textColor }}>
              {stat.value}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function StockDetailPage() {
  const params = useParams();
  const router = useRouter();
  const ticker = (params.id as string).toUpperCase();

  const [period, setPeriod] = useState<'1D' | '1W' | '1M'>('1D');
  const [hoverPrice, setHoverPrice] = useState<number | null>(null);
  const [hoverTime, setHoverTime] = useState<string | null>(null);

  // Get static brand/mock data
  const mockStockData = getStockData(ticker);
  const brand = getStockBrand(ticker);

  // Fetch real data from Finnhub
  const { data: realData, isLoading: isLoadingRealData } = useStockData(ticker, period);

  // If no brand found, show error
  if (!brand) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6 bg-gray-900">
        <div className="text-center">
          <p className="text-xl font-bold text-white mb-2">Stock Not Found</p>
          <p className="text-gray-400 mb-4">We don&apos;t have data for {ticker}</p>
          <button
            onClick={() => router.back()}
            className="px-6 py-2 bg-white text-black rounded-full font-semibold"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  const { primaryColor, secondaryColor, textColor, whimsicalDescription } = brand;

  // Use real data if available, fall back to mock
  const hasRealData = realData && !realData.usingMockData && realData.quote;

  const price = hasRealData ? realData.quote!.c : (mockStockData?.price || 0);
  const change = hasRealData ? realData.quote!.dp : (mockStockData?.change || 0);
  const changeAmount = hasRealData ? realData.quote!.d : (mockStockData?.changeAmount || 0);
  const open = hasRealData ? realData.quote!.o : (mockStockData?.open || 0);
  const high = hasRealData ? realData.quote!.h : (mockStockData?.high || 0);
  const low = hasRealData ? realData.quote!.l : (mockStockData?.low || 0);

  const marketCap = hasRealData && realData.profile?.marketCapitalization
    ? formatMarketCap(realData.profile.marketCapitalization * 1e6)
    : (mockStockData?.marketCap || 'N/A');

  const volume = mockStockData?.volume || 'N/A';
  const position = mockStockData?.position;

  // Chart data - use real if available, else mock
  const chartData = hasRealData && realData.chartData
    ? realData.chartData.map(c => ({ price: c.price, time: c.time }))
    : mockStockData?.priceHistory[period]?.map((p, i) => ({
        price: p.price,
        time: Math.floor(Date.now() / 1000) - (mockStockData.priceHistory[period].length - i) * (period === '1D' ? 300 : period === '1W' ? 3600 : 86400)
      })) || [];

  // Display price - show hover price if hovering, else current
  const displayPrice = hoverPrice !== null ? hoverPrice : price;

  const isPositive = change >= 0;
  const sprite = getSpriteForStock(ticker, change);
  const isMonster = hasMonsterSprite(ticker);

  return (
    <div
      className="min-h-screen pb-8"
      style={{
        background: `linear-gradient(135deg, ${primaryColor} 0%, ${secondaryColor} 100%)`,
      }}
    >
      {/* Dotted grid overlay */}
      <div
        className="fixed inset-0 pointer-events-none"
        style={{
          backgroundImage: `radial-gradient(circle, ${textColor === 'white' ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)'} 1px, transparent 1px)`,
          backgroundSize: '20px 20px',
        }}
      />

      {/* Content */}
      <div className="relative z-10">
        {/* Header */}
        <header className="px-5 pt-6 pb-4">
          <div className="flex items-center justify-between mb-6">
            <button
              onClick={() => router.back()}
              className="flex items-center gap-2 font-semibold transition-opacity hover:opacity-70"
              style={{ color: textColor }}
            >
              <span className="text-2xl">←</span>
              <span>Back</span>
            </button>
            <div className="flex items-center gap-2">
              {hasRealData && (
                <span className="text-xs px-2 py-1 rounded-full bg-green-500/20 text-green-400">
                  LIVE
                </span>
              )}
              <span className="text-sm font-medium opacity-70" style={{ color: textColor }}>
                {brand.sector}
              </span>
            </div>
          </div>

          {/* Creature and title */}
          <div className="flex items-start gap-4 mb-6">
            <motion.div
              className={`relative flex-shrink-0 ${isMonster ? 'w-32 h-32' : 'w-24 h-24'}`}
              animate={{ y: [0, -6, 0] }}
              transition={{
                duration: 2.5,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={sprite}
                alt={ticker}
                className="w-full h-full object-contain"
                style={isMonster ? undefined : { imageRendering: 'pixelated' }}
              />
            </motion.div>
            <div className="flex-1 min-w-0">
              <h1 className="text-3xl font-bold mb-1" style={{ color: textColor }}>
                {ticker}
              </h1>
              <p className="text-sm opacity-70 mb-2" style={{ color: textColor }}>
                {brand.name}
              </p>
              <p className="text-xs leading-relaxed opacity-80" style={{ color: textColor }}>
                {whimsicalDescription}
              </p>
            </div>
          </div>

          {/* Price display */}
          <div className="mb-2">
            <p className="text-5xl font-bold tracking-tight" style={{ color: textColor }}>
              ${displayPrice.toFixed(2)}
            </p>
            {hoverTime ? (
              <p className="text-lg mt-1" style={{ color: textColor, opacity: 0.7 }}>
                {hoverTime}
              </p>
            ) : (
              <p className="text-xl font-semibold mt-1" style={{ color: isPositive ? '#00C805' : '#FF5000' }}>
                {isPositive ? '+' : ''}${changeAmount.toFixed(2)} ({isPositive ? '+' : ''}
                {change.toFixed(2)}%) today
              </p>
            )}
          </div>
        </header>

        {/* Chart section */}
        <div className="px-5 mb-6">
          <div className="mb-4">
            <StockChart
              data={chartData}
              isPositive={isPositive}
              isLoading={isLoadingRealData}
              period={period}
              textColor={textColor}
              onHoverPrice={(p, t) => {
                setHoverPrice(p);
                setHoverTime(t);
              }}
            />
          </div>
          <PeriodToggle
            period={period}
            onChange={setPeriod}
            color={textColor === 'white' ? 'rgba(255,255,255,0.25)' : 'rgba(0,0,0,0.2)'}
          />
        </div>

        {/* Position card */}
        {position && (
          <div className="px-5 mb-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <PositionCard
                shares={position.shares}
                avgCost={position.avgCost}
                currentValue={position.currentValue}
                profitLoss={position.profitLoss}
                profitLossPercent={position.profitLossPercent}
                textColor={textColor}
              />
            </motion.div>
          </div>
        )}

        {/* Market stats */}
        <div className="px-5 mb-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <MarketStats
              open={open}
              high={high}
              low={low}
              volume={volume}
              marketCap={marketCap}
              textColor={textColor}
            />
          </motion.div>
        </div>

        {/* Action buttons */}
        <div className="px-5">
          <motion.div
            className="grid grid-cols-2 gap-3"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <button
              className="py-4 rounded-2xl font-bold text-lg transition-transform active:scale-95"
              style={{ backgroundColor: '#10B981', color: 'white' }}
            >
              Buy
            </button>
            <button
              className="py-4 rounded-2xl font-bold text-lg transition-transform active:scale-95"
              style={{
                backgroundColor: textColor === 'white' ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.15)',
                color: textColor,
              }}
            >
              Sell
            </button>
          </motion.div>
        </div>

        {/* About section */}
        <div className="px-5 mt-6">
          <motion.div
            className="rounded-2xl p-4"
            style={{
              backgroundColor: textColor === 'white' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.08)',
            }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <p className="text-sm font-medium mb-2 opacity-70" style={{ color: textColor }}>
              About {brand.name}
            </p>
            <p className="text-sm leading-relaxed" style={{ color: textColor }}>
              {brand.description}
            </p>
          </motion.div>
        </div>

        {/* On-Chain Data section */}
        {brand.tokenAddress && (
          <div className="px-5 mt-4 mb-8">
            <motion.div
              className="rounded-2xl p-4"
              style={{
                backgroundColor: textColor === 'white' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.08)',
              }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
            >
              <p className="text-sm font-medium mb-3 opacity-70 flex items-center gap-1" style={{ color: textColor }}>
                <PixelIcon name="link" size="sm" /> On-Chain Data
              </p>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm opacity-70" style={{ color: textColor }}>Network</span>
                  <span className="text-sm font-semibold" style={{ color: textColor }}>
                    {brand.chainName}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm opacity-70" style={{ color: textColor }}>Chain ID</span>
                  <span className="text-sm font-semibold" style={{ color: textColor }}>
                    {brand.chainId}
                  </span>
                </div>
                <div className="flex justify-between items-start">
                  <span className="text-sm opacity-70" style={{ color: textColor }}>Token Contract</span>
                  <a
                    href={`${brand.explorerUrl}/address/${brand.tokenAddress}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm font-mono text-right max-w-[180px] truncate underline"
                    style={{ color: textColor }}
                  >
                    {brand.tokenAddress.slice(0, 6)}...{brand.tokenAddress.slice(-4)}
                  </a>
                </div>
                <div
                  className="pt-2 border-t"
                  style={{ borderColor: textColor === 'white' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)' }}
                >
                  <a
                    href={`${brand.explorerUrl}/address/${brand.tokenAddress}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 text-sm font-semibold py-2"
                    style={{ color: textColor }}
                  >
                    View on Explorer →
                  </a>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </div>
    </div>
  );
}
