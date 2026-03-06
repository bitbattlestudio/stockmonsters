'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { PixelIcon } from '@/components/PixelIcon';

const LOADING_MESSAGES = [
  'Summoning your monsters...',
  'Checking evolution levels...',
  'Fetching market data...',
  'Calculating P&L...',
  'Almost there...',
];

export function LoadingScreen() {
  const [messageIndex, setMessageIndex] = useState(0);
  const [dots, setDots] = useState('');

  useEffect(() => {
    const messageInterval = setInterval(() => {
      setMessageIndex((i) => (i + 1) % LOADING_MESSAGES.length);
    }, 2000);

    const dotsInterval = setInterval(() => {
      setDots((d) => (d.length >= 3 ? '' : d + '.'));
    }, 400);

    return () => {
      clearInterval(messageInterval);
      clearInterval(dotsInterval);
    };
  }, []);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      {/* Animated logo */}
      <div className="relative mb-8">
        <div className="animate-bounce">
          <Image
            src="/logo.png"
            width={96}
            height={96}
            alt="AssetMonsters logo"
            className="rounded-2xl"
            style={{ imageRendering: 'pixelated', boxShadow: '4px 4px 0 #483878' }}
          />
        </div>
        {/* Sparkles */}
        <div className="absolute -top-2 -right-2 animate-pulse">
          <PixelIcon name="sparkle" size="md" />
        </div>
        <div className="absolute -bottom-1 -left-2 animate-pulse" style={{ animationDelay: '300ms' }}>
          <PixelIcon name="sparkle" size="sm" />
        </div>
      </div>

      {/* Loading text */}
      <div className="text-center">
        <h1 className="text-2xl font-bold text-white drop-shadow-lg mb-2">
          AssetMonsters
        </h1>
        <p className="text-lg text-white/90 drop-shadow min-w-[200px]">
          {LOADING_MESSAGES[messageIndex]}{dots}
        </p>
      </div>

      {/* Loading bar */}
      <div className="mt-8 w-48 h-3 bg-white/30 rounded-full overflow-hidden">
        <div
          className="h-full bg-white rounded-full animate-pulse"
          style={{
            width: '60%',
            animation: 'loadingBar 1.5s ease-in-out infinite',
          }}
        />
      </div>

      <style jsx>{`
        @keyframes loadingBar {
          0%, 100% { width: 20%; margin-left: 0; }
          50% { width: 60%; margin-left: 20%; }
        }
      `}</style>
    </div>
  );
}

export default LoadingScreen;
