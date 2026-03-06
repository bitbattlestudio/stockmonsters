'use client';

import { useState } from 'react';
import { useWallet, getConnectorInfo } from '@/lib/wallet';
import { Button, Panel } from '@/components/ui';
import { truncateAddress } from '@/lib/utils/format';

interface WalletConnectProps {
  onConnect?: (address: string) => void;
  variant?: 'button' | 'full';
}

export function WalletConnect({ onConnect, variant = 'button' }: WalletConnectProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const {
    address,
    isConnected,
    isConnecting,
    connect,
    disconnect,
    connectors,
    error,
  } = useWallet();

  const handleConnect = async (connector: typeof connectors[number]) => {
    try {
      await connect({ connector });
      setIsModalOpen(false);
      if (onConnect && address) {
        onConnect(address);
      }
    } catch (err) {
      console.error('Failed to connect:', err);
    }
  };

  // Connected state - show address and disconnect button
  if (isConnected && address) {
    return (
      <div className="flex items-center gap-2">
        <div className="px-3 py-2 bg-hp-green/10 text-hp-green rounded-xl text-sm font-bold">
          {truncateAddress(address)}
        </div>
        <Button
          variant="danger"
          size="sm"
          onClick={() => disconnect()}
        >
          Disconnect
        </Button>
      </div>
    );
  }

  // Button variant - just shows connect button
  if (variant === 'button') {
    return (
      <>
        <Button
          variant="success"
          size="lg"
          className="w-full"
          onClick={() => setIsModalOpen(true)}
          disabled={isConnecting}
        >
          {isConnecting ? 'Connecting...' : 'Connect Wallet'}
        </Button>

        {/* Connector Modal */}
        {isModalOpen && (
          <ConnectorModal
            connectors={connectors}
            isConnecting={isConnecting}
            error={error}
            onSelect={handleConnect}
            onClose={() => setIsModalOpen(false)}
          />
        )}
      </>
    );
  }

  // Full variant - shows connectors inline
  return (
    <div className="space-y-3">
      <p className="text-sm font-bold text-text-dark dark:text-white mb-2">Connect your wallet</p>
      {connectors.map((connector) => {
        const info = getConnectorInfo(connector.id);
        return (
          <button
            key={connector.id}
            onClick={() => handleConnect(connector)}
            disabled={isConnecting}
            className="w-full p-4 bg-panel-bg dark:bg-gray-800 border-3 border-panel-border dark:border-gray-600 rounded-xl flex items-center gap-3 hover:bg-panel-border/10 dark:hover:bg-gray-700 transition-colors disabled:opacity-50"
          >
            <span className="text-2xl">{info.icon}</span>
            <span className="font-bold text-text-dark dark:text-white">{info.name}</span>
            {isConnecting && (
              <span className="ml-auto text-sm text-text-mid dark:text-gray-400">Connecting...</span>
            )}
          </button>
        );
      })}
      {error && (
        <p className="text-sm text-hp-red mt-2">{error.message}</p>
      )}
    </div>
  );
}

// Modal component for connector selection
function ConnectorModal({
  connectors,
  isConnecting,
  error,
  onSelect,
  onClose,
}: {
  connectors: ReturnType<typeof useWallet>['connectors'];
  isConnecting: boolean;
  error: Error | null;
  onSelect: (connector: typeof connectors[number]) => void;
  onClose: () => void;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <Panel className="relative z-10 w-full max-w-sm p-6 dark:bg-gray-800 dark:border-gray-600">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-text-dark dark:text-white">Connect Wallet</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-panel-border/10 dark:hover:bg-gray-700 rounded-lg transition-colors"
          >
            <svg className="w-5 h-5 text-text-mid dark:text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="space-y-3">
          {connectors.map((connector) => {
            const info = getConnectorInfo(connector.id);
            return (
              <button
                key={connector.id}
                onClick={() => onSelect(connector)}
                disabled={isConnecting}
                className="w-full p-4 bg-panel-bg dark:bg-gray-800 border-2 border-panel-border dark:border-gray-600 rounded-xl flex items-center gap-3 hover:bg-panel-border/10 dark:hover:bg-gray-700 transition-colors disabled:opacity-50"
              >
                <span className="text-2xl">{info.icon}</span>
                <span className="font-bold text-text-dark dark:text-white">{info.name}</span>
              </button>
            );
          })}
        </div>

        {error && (
          <p className="text-sm text-hp-red mt-4 text-center">{error.message}</p>
        )}

        <p className="text-xs text-text-mid dark:text-gray-400 text-center mt-4">
          By connecting, you agree to the Terms of Service
        </p>
      </Panel>
    </div>
  );
}

export default WalletConnect;
