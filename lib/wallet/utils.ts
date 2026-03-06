import { getAddress, keccak256, encodePacked } from 'viem';

/**
 * Validate Ethereum address
 */
export function isValidAddress(address: string): boolean {
  try {
    getAddress(address);
    return true;
  } catch {
    return false;
  }
}

/**
 * Checksum an Ethereum address
 */
export function checksumAddress(address: string): string {
  try {
    return getAddress(address);
  } catch {
    return address;
  }
}

/**
 * Truncate an address for display (e.g., 0x1234...5678)
 */
export function truncateAddress(address: string, startLength: number = 6, endLength: number = 4): string {
  if (!address) return '';
  if (address.length <= startLength + endLength) return address;
  return `${address.slice(0, startLength)}...${address.slice(-endLength)}`;
}

/**
 * Parse wallet input - address, URL, or username
 */
export function parseWalletInput(input: string): {
  type: 'address' | 'username' | 'url' | 'invalid';
  value: string | null;
} {
  const trimmed = input.trim();

  // Check if it's a valid Ethereum address
  if (/^0x[a-fA-F0-9]{40}$/.test(trimmed)) {
    return { type: 'address', value: checksumAddress(trimmed) };
  }

  // Check if it's a Polymarket URL
  const urlMatch = trimmed.match(/polymarket\.com\/@(\w+)/);
  if (urlMatch) {
    return { type: 'username', value: urlMatch[1] };
  }

  // Check if it's just a username
  if (/^@?\w+$/.test(trimmed)) {
    return { type: 'username', value: trimmed.replace('@', '') };
  }

  return { type: 'invalid', value: null };
}

/**
 * Derive Polymarket proxy wallet address from EOA
 * Note: This is a simplified version - actual derivation uses CREATE2
 */
export function deriveProxyAddress(eoaAddress: string): string {
  // Polymarket uses a CREATE2 pattern for proxy wallets
  // This is a placeholder - actual implementation would need the exact
  // factory address and init code hash from Polymarket
  const PROXY_FACTORY = '0x...'; // Polymarket proxy factory
  const PROXY_INIT_CODE_HASH = '0x...'; // Init code hash

  // CREATE2 address derivation: keccak256(0xff ++ factory ++ salt ++ keccak256(initCode))
  // For now, return the EOA address as a placeholder
  return eoaAddress;
}

/**
 * Format balance for display
 */
export function formatBalance(balance: string | undefined, decimals: number = 4): string {
  if (!balance) return '0';
  const num = parseFloat(balance);
  if (num === 0) return '0';
  if (num < 0.0001) return '<0.0001';
  return num.toFixed(decimals);
}
