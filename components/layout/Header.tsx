'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useWalletStore } from '@/stores';
import { truncateAddress } from '@/lib/utils/format';
import { WalletConnect } from '@/components/wallet';

interface HeaderProps {
  showBack?: boolean;
  backHref?: string;
  title?: string;
}

export function Header({ showBack, backHref = '/', title }: HeaderProps) {
  const { address, isConnected } = useWalletStore();
  const [showWalletModal, setShowWalletModal] = useState(false);

  return (
    <header className="mx-3 mt-3 px-4 py-3 bg-panel-bg border-3 border-panel-border rounded-2xl shadow-panel flex items-center justify-between">
      <div className="flex items-center gap-3">
        {showBack ? (
          <Link
            href={backHref}
            className="flex items-center gap-2 font-bold text-text-dark transition-all active:scale-95"
          >
            <span className="text-xl">←</span>
            <span>{title || 'Back'}</span>
          </Link>
        ) : (
          <Link href="/" className="flex items-center gap-3">
            <Image
              src="/logo.png"
              width={48}
              height={48}
              alt="StockMonsters logo"
              className="rounded-xl"
              style={{ imageRendering: 'pixelated' }}
            />
            <div>
              <span className="text-xl font-bold block" style={{ color: '#6858A8' }}>
                StockMonsters
              </span>
              <span className="text-xs text-text-mid">
                {address ? truncateAddress(address) : 'My Collection'}
              </span>
            </div>
          </Link>
        )}
      </div>

      <div className="flex items-center gap-2">
        {/* Wallet button */}
        <button
          onClick={() => setShowWalletModal(true)}
          className="px-3 py-1.5 rounded-full text-sm font-bold bg-purple-600 dark:bg-panel-border text-white hover:bg-purple-700 dark:hover:bg-panel-border/80 transition-colors"
        >
          {isConnected ? truncateAddress(address || '') : 'Connect Wallet'}
        </button>

        <div className="px-3 py-1.5 rounded-full text-sm font-bold flex items-center gap-2 bg-hp-green text-white">
          <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
          LIVE
        </div>
      </div>

      {/* Wallet Modal */}
      {showWalletModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={() => setShowWalletModal(false)}>
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />
          <div onClick={(e) => e.stopPropagation()} className="relative z-10">
            <WalletConnect variant="button" onConnect={() => setShowWalletModal(false)} />
          </div>
        </div>
      )}
    </header>
  );
}

export default Header;
