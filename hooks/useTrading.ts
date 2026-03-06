'use client';

import { useState, useCallback } from 'react';
import { useWalletClient, usePublicClient, useSwitchChain, useChainId } from 'wagmi';
import { polygon } from 'wagmi/chains';
import { useWalletStore } from '@/stores';
import {
  buildOrder,
  getOrderTypedData,
  POLYGON_CONTRACTS,
  Side,
  type SignedOrder,
  type OrderData,
} from '@/lib/polymarket/order-builder';
import {
  submitOrder,
  getPrice,
  estimateFill,
  getBestPrice,
} from '@/lib/polymarket/order-api';
import {
  createClobCredentials,
  getStoredClobCredentials,
  storeClobCredentials,
  type ClobCredentials,
} from '@/lib/polymarket/clob-auth';
import type { Sigil } from '@/types';

export interface TradeEstimate {
  avgPrice: number;
  totalCost: number;
  shares: number;
  priceImpact: number;
}

export interface TradeResult {
  success: boolean;
  txHash?: string;
  orderId?: string;
  error?: string;
}

export function useTrading() {
  const { data: walletClient } = useWalletClient();
  const publicClient = usePublicClient();
  const chainId = useChainId();
  const { switchChain } = useSwitchChain();
  const { eoaAddress, proxyAddress, isConnected } = useWalletStore();

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [needsApproval, setNeedsApproval] = useState<'usdc' | 'ctf' | null>(null);

  // Check if trading is possible
  const canTrade = !!(isConnected && eoaAddress && proxyAddress);
  const isOnPolygon = chainId === polygon.id;

  // Ensure we're on Polygon network
  const ensurePolygonNetwork = useCallback(async (): Promise<boolean> => {
    if (chainId === polygon.id) return true;

    try {
      console.log('Switching to Polygon network...');
      await switchChain({ chainId: polygon.id });
      return true;
    } catch (err) {
      console.error('Failed to switch to Polygon:', err);
      setError('Please switch to Polygon network in your wallet');
      return false;
    }
  }, [chainId, switchChain]);

  // Ensure we have CLOB credentials
  const ensureClobCredentials = useCallback(async (): Promise<ClobCredentials | null> => {
    // Check for stored credentials
    const stored = getStoredClobCredentials();
    if (stored) {
      console.log('Using stored CLOB credentials');
      return stored;
    }

    // Need to create new credentials
    if (!walletClient || !eoaAddress) {
      setError('Wallet not connected');
      return null;
    }

    console.log('Creating new CLOB credentials...');
    console.log('EOA Address:', eoaAddress);
    console.log('Proxy Address:', proxyAddress);

    // Use EIP-712 typed data signing
    const signTypedData = async (params: {
      domain: { name: string; version: string; chainId: number };
      types: Record<string, Array<{ name: string; type: string }>>;
      primaryType: string;
      message: Record<string, unknown>;
    }): Promise<string> => {
      return walletClient.signTypedData({
        domain: params.domain,
        types: params.types,
        primaryType: params.primaryType,
        message: params.message,
      });
    };

    // Try with EOA first, then proxy if that fails
    let credentials = await createClobCredentials(signTypedData, eoaAddress);

    if (!credentials && proxyAddress) {
      console.log('EOA auth failed, trying with proxy address...');
      credentials = await createClobCredentials(signTypedData, proxyAddress);
    }

    if (credentials) {
      storeClobCredentials(credentials);
      console.log('CLOB credentials created and stored');
    }
    return credentials;
  }, [walletClient, eoaAddress, proxyAddress]);

  /**
   * Check if USDC approval is needed
   */
  const checkUsdcApproval = useCallback(async (): Promise<boolean> => {
    if (!eoaAddress || !publicClient) return true;

    try {
      const allowance = await publicClient.readContract({
        address: POLYGON_CONTRACTS.USDC,
        abi: [
          {
            name: 'allowance',
            type: 'function',
            stateMutability: 'view',
            inputs: [
              { name: 'owner', type: 'address' },
              { name: 'spender', type: 'address' },
            ],
            outputs: [{ name: '', type: 'uint256' }],
          },
        ],
        functionName: 'allowance',
        args: [eoaAddress as `0x${string}`, POLYGON_CONTRACTS.CTF_EXCHANGE],
      });

      // Need approval if allowance is 0
      return (allowance as bigint) === BigInt(0);
    } catch (err) {
      console.error('Error checking USDC approval:', err);
      return true;
    }
  }, [eoaAddress, publicClient]);

  /**
   * Check if CTF (conditional token) approval is needed
   */
  const checkCtfApproval = useCallback(async (): Promise<boolean> => {
    if (!eoaAddress || !publicClient) {
      console.log('checkCtfApproval: Missing eoaAddress or publicClient', { eoaAddress, publicClient: !!publicClient });
      return true;
    }

    try {
      console.log('Checking CTF approval for:', eoaAddress);
      const isApproved = await publicClient.readContract({
        address: POLYGON_CONTRACTS.CONDITIONAL_TOKENS,
        abi: [
          {
            name: 'isApprovedForAll',
            type: 'function',
            stateMutability: 'view',
            inputs: [
              { name: 'owner', type: 'address' },
              { name: 'operator', type: 'address' },
            ],
            outputs: [{ name: '', type: 'bool' }],
          },
        ],
        functionName: 'isApprovedForAll',
        args: [eoaAddress as `0x${string}`, POLYGON_CONTRACTS.CTF_EXCHANGE],
      });

      console.log('CTF approval status:', isApproved);
      return !(isApproved as boolean);
    } catch (err) {
      console.error('Error checking CTF approval:', err);
      // Don't assume needs approval on error - try to proceed
      return false;
    }
  }, [eoaAddress, publicClient]);

  /**
   * Approve USDC spending
   */
  const approveUsdc = useCallback(async (): Promise<TradeResult> => {
    if (!walletClient || !eoaAddress) {
      return { success: false, error: 'Wallet not connected' };
    }

    setIsLoading(true);
    setError(null);

    try {
      const hash = await walletClient.writeContract({
        address: POLYGON_CONTRACTS.USDC,
        abi: [
          {
            name: 'approve',
            type: 'function',
            stateMutability: 'nonpayable',
            inputs: [
              { name: 'spender', type: 'address' },
              { name: 'amount', type: 'uint256' },
            ],
            outputs: [{ name: '', type: 'bool' }],
          },
        ],
        functionName: 'approve',
        args: [
          POLYGON_CONTRACTS.CTF_EXCHANGE,
          BigInt('0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff'),
        ],
      });

      if (publicClient) {
        await publicClient.waitForTransactionReceipt({ hash });
      }

      setNeedsApproval(null);
      return { success: true, txHash: hash };
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Approval failed';
      setError(message);
      return { success: false, error: message };
    } finally {
      setIsLoading(false);
    }
  }, [walletClient, eoaAddress, publicClient]);

  /**
   * Approve CTF (Conditional Tokens) for selling
   */
  const approveCtf = useCallback(async (): Promise<TradeResult> => {
    if (!walletClient || !eoaAddress) {
      return { success: false, error: 'Wallet not connected' };
    }

    setIsLoading(true);
    setError(null);

    try {
      const hash = await walletClient.writeContract({
        address: POLYGON_CONTRACTS.CONDITIONAL_TOKENS,
        abi: [
          {
            name: 'setApprovalForAll',
            type: 'function',
            stateMutability: 'nonpayable',
            inputs: [
              { name: 'operator', type: 'address' },
              { name: 'approved', type: 'bool' },
            ],
            outputs: [],
          },
        ],
        functionName: 'setApprovalForAll',
        args: [POLYGON_CONTRACTS.CTF_EXCHANGE, true],
      });

      if (publicClient) {
        await publicClient.waitForTransactionReceipt({ hash });
      }

      setNeedsApproval(null);
      return { success: true, txHash: hash };
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Approval failed';
      setError(message);
      return { success: false, error: message };
    } finally {
      setIsLoading(false);
    }
  }, [walletClient, eoaAddress, publicClient]);

  /**
   * Sign an order using EIP-712
   */
  const signOrder = useCallback(async (order: OrderData): Promise<SignedOrder | null> => {
    if (!walletClient) {
      setError('Wallet not connected');
      return null;
    }

    try {
      const typedData = getOrderTypedData(order);

      // Sign using EIP-712
      const signature = await walletClient.signTypedData({
        domain: typedData.domain,
        types: typedData.types,
        primaryType: typedData.primaryType,
        message: typedData.message,
      });

      return {
        ...order,
        signature: signature as `0x${string}`,
      };
    } catch (err) {
      console.error('Order signing failed:', err);
      setError(err instanceof Error ? err.message : 'Failed to sign order');
      return null;
    }
  }, [walletClient]);

  /**
   * Get a trade estimate for buying
   */
  const getBuyEstimate = useCallback(
    async (sigil: Sigil, usdAmount: number): Promise<TradeEstimate | null> => {
      const tokenId = sigil.position.asset;
      const price = sigil.position.currPrice || 0.5;

      // Try to get estimate from orderbook if we have a valid token ID
      if (tokenId && tokenId.length > 10) {
        const estimate = await estimateFill(tokenId, Side.BUY, usdAmount);
        if (estimate) return estimate;
      }

      // Fallback to simple calculation using current price
      return {
        avgPrice: price,
        totalCost: usdAmount,
        shares: price > 0 ? usdAmount / price : 0,
        priceImpact: 0,
      };
    },
    []
  );

  /**
   * Get a trade estimate for selling
   */
  const getSellEstimate = useCallback(
    async (sigil: Sigil, shares: number): Promise<TradeEstimate | null> => {
      const tokenId = sigil.position.asset;
      const price = sigil.position.currPrice || 0.5;

      // Try to get estimate from orderbook if we have a valid token ID
      if (tokenId && tokenId.length > 10) {
        const estimate = await estimateFill(tokenId, Side.SELL, shares);
        if (estimate) return estimate;
      }

      // Fallback to simple calculation using current price
      return {
        avgPrice: price,
        totalCost: shares * price,
        shares,
        priceImpact: 0,
      };
    },
    []
  );

  /**
   * Execute a buy order (Feed)
   */
  const buyShares = useCallback(
    async (sigil: Sigil, usdAmount: number): Promise<TradeResult> => {
      if (!canTrade || !walletClient || !eoaAddress || !proxyAddress) {
        return {
          success: false,
          error: 'Please connect your wallet and link your Polymarket address',
        };
      }

      setIsLoading(true);
      setError(null);

      try {
        // Check USDC approval first
        const needsUsdcApprovalCheck = await checkUsdcApproval();
        if (needsUsdcApprovalCheck) {
          setNeedsApproval('usdc');
          setIsLoading(false);
          return {
            success: false,
            error: 'USDC approval required. Please approve first.',
          };
        }

        const tokenId = sigil.position.asset;

        // Get best price from orderbook
        let price = await getBestPrice(tokenId, Side.BUY, true);
        if (!price) {
          // Fallback to current price
          const priceData = await getPrice(tokenId);
          price = priceData ? parseFloat(priceData.ask) : sigil.position.currPrice;
        }

        // Calculate shares from USD amount
        const shares = usdAmount / price;

        // Build the order
        // Note: On Polymarket, maker is the proxy wallet, signer is the EOA
        const order = buildOrder({
          tokenId,
          price,
          size: shares,
          side: Side.BUY,
          maker: proxyAddress as `0x${string}`,
          signer: eoaAddress as `0x${string}`,
        });

        // Sign the order with EIP-712
        const signedOrder = await signOrder(order);
        if (!signedOrder) {
          return { success: false, error: 'Failed to sign order' };
        }

        // Submit to CLOB
        const result = await submitOrder(signedOrder, 'GTC');

        if (result.success) {
          return {
            success: true,
            orderId: result.orderId,
            txHash: result.transactionsHashes?.[0],
          };
        } else {
          setError(result.errorMsg || 'Order submission failed');
          return {
            success: false,
            error: result.errorMsg || 'Order submission failed',
          };
        }
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Trade failed';
        setError(message);
        return { success: false, error: message };
      } finally {
        setIsLoading(false);
      }
    },
    [canTrade, walletClient, eoaAddress, proxyAddress, checkUsdcApproval, signOrder]
  );

  /**
   * Execute a sell order (Release)
   */
  const sellShares = useCallback(
    async (sigil: Sigil, shares: number): Promise<TradeResult> => {
      console.log('sellShares called', { canTrade, walletClient: !!walletClient, eoaAddress, proxyAddress });

      if (!canTrade || !walletClient || !eoaAddress || !proxyAddress) {
        return {
          success: false,
          error: 'Please connect your wallet and link your Polymarket address',
        };
      }

      setIsLoading(true);
      setError(null);

      try {
        // Ensure we're on Polygon
        const onPolygon = await ensurePolygonNetwork();
        if (!onPolygon) {
          setIsLoading(false);
          return { success: false, error: 'Please switch to Polygon network' };
        }

        // Try to get CLOB credentials (optional - order signature might be enough)
        console.log('Attempting to get CLOB credentials...');
        const credentials = await ensureClobCredentials();
        if (!credentials) {
          console.log('No CLOB credentials, will try with just order signature');
        }

        console.log('Proceeding with sell order...');

        const tokenId = sigil.position.asset;
        console.log('Token ID:', tokenId);

        // Get best price from orderbook
        let price = await getBestPrice(tokenId, Side.SELL, true);
        if (!price) {
          // Fallback to current price
          const priceData = await getPrice(tokenId);
          price = priceData ? parseFloat(priceData.bid) : sigil.position.currPrice;
        }
        console.log('Using price:', price);

        // Build the order
        const order = buildOrder({
          tokenId,
          price,
          size: shares,
          side: Side.SELL,
          maker: proxyAddress as `0x${string}`,
          signer: eoaAddress as `0x${string}`,
        });
        console.log('Built order:', order);

        // Sign the order with EIP-712
        const signedOrder = await signOrder(order);
        if (!signedOrder) {
          return { success: false, error: 'Failed to sign order' };
        }
        console.log('Order signed');

        // Submit to CLOB with credentials
        const result = await submitOrder(signedOrder, 'GTC', credentials ?? undefined);
        console.log('Submit result:', result);

        if (result.success) {
          return {
            success: true,
            orderId: result.orderId,
            txHash: result.transactionsHashes?.[0],
          };
        } else {
          setError(result.errorMsg || 'Order submission failed');
          return {
            success: false,
            error: result.errorMsg || 'Order submission failed',
          };
        }
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Trade failed';
        setError(message);
        return { success: false, error: message };
      } finally {
        setIsLoading(false);
      }
    },
    [canTrade, walletClient, eoaAddress, proxyAddress, ensurePolygonNetwork, ensureClobCredentials, signOrder]
  );

  return {
    // State
    isLoading,
    error,
    needsApproval,
    canTrade,
    isConnected,
    isOnPolygon,

    // Actions
    approveUsdc,
    approveCtf,
    getBuyEstimate,
    getSellEstimate,
    buyShares,
    sellShares,
    checkUsdcApproval,
    checkCtfApproval,
    signOrder,
    ensurePolygonNetwork,

    // Clear error
    clearError: () => setError(null),
  };
}

export default useTrading;
