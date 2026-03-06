'use client';

import { useState } from 'react';
import { useWallet } from '@/lib/wallet';
import { truncateAddress, formatBalance } from '@/lib/wallet';
import { Panel, Button } from '@/components/ui';

export function WalletStatus() {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const { address, isConnected, balance, balanceSymbol, disconnect } = useWallet();

  if (!isConnected || !address) {
    return null;
  }

  return (
    <div className="relative">
      <button
        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
        className="flex items-center gap-2 px-3 py-2 bg-panel-bg border-2 border-panel-border rounded-xl hover:bg-panel-border/10 transition-colors"
      >
        {/* Network indicator */}
        <div className="w-2 h-2 rounded-full bg-hp-green" />

        {/* Address */}
        <span className="font-bold text-text-dark text-sm">
          {truncateAddress(address)}
        </span>

        {/* Dropdown arrow */}
        <svg
          className={`w-4 h-4 text-text-mid transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {/* Dropdown */}
      {isDropdownOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsDropdownOpen(false)}
          />

          {/* Dropdown content */}
          <Panel className="absolute right-0 top-full mt-2 w-64 p-4 z-50">
            <div className="space-y-3">
              {/* Balance */}
              <div className="p-3 bg-white rounded-xl border-2 border-panel-border">
                <p className="text-xs text-text-mid mb-1">Balance</p>
                <p className="text-lg font-bold text-text-dark">
                  {formatBalance(balance)} {balanceSymbol || 'MATIC'}
                </p>
              </div>

              {/* Address */}
              <div className="p-3 bg-white rounded-xl border-2 border-panel-border">
                <p className="text-xs text-text-mid mb-1">Address</p>
                <p className="text-sm font-mono text-text-dark break-all">
                  {address}
                </p>
              </div>

              {/* Network */}
              <div className="flex items-center gap-2 p-3 bg-white rounded-xl border-2 border-panel-border">
                <div className="w-3 h-3 rounded-full bg-[#8247E5]" />
                <span className="text-sm font-bold text-text-dark">Polygon</span>
              </div>

              {/* Disconnect */}
              <Button
                variant="danger"
                size="md"
                className="w-full"
                onClick={() => {
                  disconnect();
                  setIsDropdownOpen(false);
                }}
              >
                Disconnect
              </Button>
            </div>
          </Panel>
        </>
      )}
    </div>
  );
}

export default WalletStatus;
