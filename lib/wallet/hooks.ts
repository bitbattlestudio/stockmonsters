'use client';

import { useAccount, useConnect, useDisconnect, useBalance } from 'wagmi';
import { useEffect } from 'react';
import { formatUnits } from 'viem';
import { useWalletStore } from '@/stores';
import { robinhoodTestnet } from './config';
import type { IconName } from '@/components/PixelIcon';

/**
 * Custom hook that combines Wagmi hooks with our store
 */
export function useWallet() {
  const { address, isConnected, isConnecting, connector } = useAccount();
  const { connect, connectors, isPending, error } = useConnect();
  const { disconnect } = useDisconnect();
  const { data: balance } = useBalance({
    address,
    chainId: robinhoodTestnet.id,
  });

  // Sync with wallet store
  const { setEoaAddress, setConnected, disconnect: storeDisconnect } = useWalletStore();

  useEffect(() => {
    if (isConnected && address) {
      // Set the EOA address (the signing wallet from MetaMask)
      setEoaAddress(address);
      setConnected(true);
    } else {
      storeDisconnect();
    }
  }, [isConnected, address, setEoaAddress, setConnected, storeDisconnect]);

  // Format balance
  const formattedBalance = balance
    ? formatUnits(balance.value, balance.decimals)
    : undefined;

  // Full disconnect - clears both Wagmi and store
  const fullDisconnect = () => {
    disconnect();
    storeDisconnect();
    // Clear persisted storage
    if (typeof window !== 'undefined') {
      localStorage.removeItem('sigils-wallet');
    }
  };

  return {
    // Connection state
    address,
    isConnected,
    isConnecting: isConnecting || isPending,
    connector,
    error,

    // Balance
    balance: formattedBalance,
    balanceSymbol: balance?.symbol,

    // Actions
    connect,
    disconnect: fullDisconnect,
    connectors,
  };
}

/**
 * Get connector icon/name
 */
export function getConnectorInfo(connectorId: string): { name: string; icon: IconName } {
  const connectorMap: Record<string, { name: string; icon: IconName }> = {
    walletConnect: { name: 'WalletConnect', icon: 'link' },
    injected: { name: 'Browser Wallet', icon: 'link' },
    coinbaseWalletSDK: { name: 'Coinbase Wallet', icon: 'link' },
    metaMask: { name: 'MetaMask', icon: 'link' },
  };

  return connectorMap[connectorId] || { name: connectorId, icon: 'link' };
}
