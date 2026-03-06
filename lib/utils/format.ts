/**
 * Format a price as cents (e.g., 0.68 -> "68¢")
 */
export function formatPrice(price: number): string {
  return `${Math.round(price * 100)}¢`;
}

/**
 * Format a percentage with sign (e.g., 45.2 -> "+45.2%", -8.2 -> "-8.2%")
 */
export function formatPercent(percent: number): string {
  const sign = percent >= 0 ? '+' : '';
  return `${sign}${percent.toFixed(1)}%`;
}

/**
 * Format USD currency (e.g., 1847 -> "$1,847")
 */
export function formatUSD(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

/**
 * Format a large number with K/M suffix (e.g., 2400000 -> "$2.4M")
 */
export function formatCompactUSD(amount: number): string {
  if (amount >= 1_000_000) {
    return `$${(amount / 1_000_000).toFixed(1)}M`;
  }
  if (amount >= 1_000) {
    return `$${(amount / 1_000).toFixed(1)}K`;
  }
  return `$${amount}`;
}

/**
 * Truncate Ethereum address (e.g., "0x1234...abcd")
 */
export function truncateAddress(address: string): string {
  if (!address || address.length < 10) return address;
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
}

/**
 * Format a date relative to now (e.g., "2 days ago", "in 3 months")
 */
export function formatRelativeDate(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  const now = new Date();
  const diffMs = d.getTime() - now.getTime();
  const diffDays = Math.round(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return 'Today';
  if (diffDays === 1) return 'Tomorrow';
  if (diffDays === -1) return 'Yesterday';
  if (diffDays > 0 && diffDays < 30) return `in ${diffDays} days`;
  if (diffDays < 0 && diffDays > -30) return `${Math.abs(diffDays)} days ago`;

  const diffMonths = Math.round(diffDays / 30);
  if (diffMonths > 0) return `in ${diffMonths} months`;
  return `${Math.abs(diffMonths)} months ago`;
}
