'use client';

import { WagmiProvider } from 'wagmi';
import { wagmiConfig } from '@/lib/wallet/config';
import { type ReactNode } from 'react';

export function WalletProvider({ children }: { children: ReactNode }) {
  return (
    <WagmiProvider config={wagmiConfig}>
      {children}
    </WagmiProvider>
  );
}
