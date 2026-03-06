import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface WalletStore {
  // State
  eoaAddress: string | null;      // Connected wallet (for signing)
  proxyAddress: string | null;    // Polymarket proxy wallet (for positions)
  isConnected: boolean;           // EOA wallet connected
  isReadOnly: boolean;            // Can only view, not trade
  canTrade: boolean;              // Both addresses linked and ready to trade

  // Legacy alias for compatibility
  address: string | null;

  // Actions
  setEoaAddress: (address: string) => void;
  setProxyAddress: (address: string) => void;
  setConnected: (connected: boolean) => void;
  linkAddresses: (eoa: string, proxy: string) => void;
  disconnect: () => void;

  // Legacy actions for compatibility
  setAddress: (address: string, isReadOnly?: boolean) => void;
  setProxyWallet: (proxyWallet: string) => void;
}

export const useWalletStore = create<WalletStore>()(
  persist(
    (set, get) => ({
      eoaAddress: null,
      proxyAddress: null,
      isConnected: false,
      isReadOnly: true,
      canTrade: false,
      address: null,

      setEoaAddress: (address) =>
        set((state) => ({
          eoaAddress: address,
          address: state.proxyAddress || address,
          canTrade: !!(address && state.proxyAddress),
          isReadOnly: !state.proxyAddress,
        })),

      setProxyAddress: (address) =>
        set((state) => ({
          proxyAddress: address,
          address: address,
          canTrade: !!(state.eoaAddress && address && state.isConnected),
          isReadOnly: !(state.eoaAddress && state.isConnected),
        })),

      setConnected: (isConnected) =>
        set((state) => ({
          isConnected,
          canTrade: !!(isConnected && state.eoaAddress && state.proxyAddress),
          isReadOnly: !(isConnected && state.proxyAddress),
        })),

      linkAddresses: (eoa, proxy) =>
        set({
          eoaAddress: eoa,
          proxyAddress: proxy,
          address: proxy,
          isConnected: true,
          canTrade: true,
          isReadOnly: false,
        }),

      disconnect: () =>
        set({
          eoaAddress: null,
          proxyAddress: null,
          address: null,
          isConnected: false,
          isReadOnly: true,
          canTrade: false,
        }),

      // Legacy compatibility
      setAddress: (address, isReadOnly = true) =>
        set((state) => ({
          address,
          proxyAddress: address,
          isReadOnly,
          canTrade: !!(state.eoaAddress && state.isConnected && !isReadOnly),
        })),

      setProxyWallet: (proxyWallet) =>
        set((state) => ({
          proxyAddress: proxyWallet,
          address: proxyWallet,
          canTrade: !!(state.eoaAddress && state.isConnected && proxyWallet),
        })),
    }),
    {
      name: 'sigils-wallet',
    }
  )
);
