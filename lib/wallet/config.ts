import { http, createConfig, createStorage } from 'wagmi';
import { walletConnect, injected, coinbaseWallet } from 'wagmi/connectors';
import { robinhoodTestnet } from '../chains/robinhood';

// WalletConnect Project ID - get from https://cloud.walletconnect.com
const projectId = process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID || 'demo-project-id';

// Wagmi configuration for Robinhood Chain Testnet
export const wagmiConfig = createConfig({
  chains: [robinhoodTestnet],
  connectors: [
    walletConnect({
      projectId,
      metadata: {
        name: 'Stocklings',
        description: 'Your stocks, alive',
        url: typeof window !== 'undefined' ? window.location.origin : 'https://stocklings.app',
        icons: ['https://stocklings.app/icon.png'],
      },
      showQrModal: true,
    }),
    injected({
      shimDisconnect: true,
    }),
    coinbaseWallet({
      appName: 'Stocklings',
    }),
  ],
  transports: {
    [robinhoodTestnet.id]: http('https://rpc.testnet.chain.robinhood.com'),
  },
  storage: createStorage({
    storage: typeof window !== 'undefined' ? window.localStorage : undefined,
    key: 'stocklings-wallet',
  }),
  ssr: true,
});

// Export chain for use elsewhere
export { robinhoodTestnet };
