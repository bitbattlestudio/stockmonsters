'use client';

import { cn } from '@/lib/utils/cn';

interface SkeletonProps {
  className?: string;
  variant?: 'text' | 'circular' | 'rectangular';
}

export function Skeleton({ className, variant = 'rectangular' }: SkeletonProps) {
  return (
    <div
      className={cn(
        'animate-pulse bg-panel-border/20',
        variant === 'circular' && 'rounded-full',
        variant === 'text' && 'rounded h-4',
        variant === 'rectangular' && 'rounded-xl',
        className
      )}
    />
  );
}

// Skeleton for a Sigil card in the collection grid
export function SigilCardSkeleton() {
  return (
    <div className="bg-panel-bg border-3 border-panel-border rounded-2xl p-3 shadow-panel">
      {/* Creature area */}
      <div className="flex justify-center mb-2">
        <Skeleton className="w-16 h-16 rounded-xl" />
      </div>

      {/* Name */}
      <Skeleton className="h-5 w-20 mx-auto mb-1" />

      {/* Title */}
      <Skeleton className="h-3 w-full mb-2" />
      <Skeleton className="h-3 w-3/4 mx-auto mb-2" />

      {/* Evolution bar */}
      <Skeleton className="h-2 w-full rounded-full mb-2" />

      {/* Price and P&L */}
      <div className="flex justify-between items-center">
        <Skeleton className="h-5 w-12" />
        <Skeleton className="h-4 w-10" />
      </div>
    </div>
  );
}

// Skeleton for the collection page header
export function CollectionHeaderSkeleton() {
  return (
    <div className="bg-panel-bg border-3 border-panel-border rounded-2xl p-4 shadow-panel">
      <div className="flex items-center gap-3">
        <Skeleton variant="circular" className="w-12 h-12" />
        <div className="flex-1">
          <Skeleton className="h-5 w-32 mb-2" />
          <Skeleton className="h-3 w-24" />
        </div>
        <Skeleton className="h-6 w-16" />
      </div>
    </div>
  );
}

// Full collection page skeleton
export function CollectionSkeleton() {
  return (
    <div className="min-h-screen pb-6">
      {/* Header */}
      <div className="mx-3 mt-3">
        <CollectionHeaderSkeleton />
      </div>

      {/* Stats bar */}
      <div className="mx-3 mt-3 flex gap-2">
        {[1, 2, 3].map((i) => (
          <Skeleton key={i} className="flex-1 h-16 rounded-xl" />
        ))}
      </div>

      {/* Grid */}
      <div className="mx-3 mt-3 grid grid-cols-2 gap-3">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <SigilCardSkeleton key={i} />
        ))}
      </div>
    </div>
  );
}

// Skeleton for sigil detail page
export function SigilDetailSkeleton() {
  return (
    <div className="min-h-screen pb-32">
      {/* Header */}
      <div className="mx-3 mt-3">
        <Skeleton className="h-12 rounded-2xl" />
      </div>

      {/* Main card */}
      <div className="mx-3 mt-3 bg-panel-bg border-3 border-panel-border rounded-2xl p-4 shadow-panel">
        <div className="flex gap-4">
          <Skeleton className="w-24 h-24 rounded-xl flex-shrink-0" />
          <div className="flex-1">
            <Skeleton className="h-7 w-32 mb-2" />
            <Skeleton className="h-5 w-full mb-2" />
            <Skeleton className="h-8 w-20" />
          </div>
        </div>
      </div>

      {/* Evolution */}
      <div className="mx-3 mt-3 bg-panel-bg border-3 border-panel-border rounded-2xl p-4 shadow-panel">
        <Skeleton className="h-4 w-32 mb-2" />
        <Skeleton className="h-3 w-full rounded-full" />
      </div>

      {/* Chart */}
      <div className="mx-3 mt-3 bg-panel-bg border-3 border-panel-border rounded-2xl p-4 shadow-panel">
        <Skeleton className="h-4 w-24 mb-3" />
        <Skeleton className="h-24 w-full" />
      </div>

      {/* Tabs */}
      <div className="mx-3 mt-3 flex gap-2">
        {[1, 2, 3].map((i) => (
          <Skeleton key={i} className="flex-1 h-10 rounded-t-xl" />
        ))}
      </div>

      {/* Tab content */}
      <div className="mx-3 bg-panel-bg border-3 border-panel-border rounded-b-2xl p-4 shadow-panel">
        <div className="grid grid-cols-2 gap-3">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <Skeleton key={i} className="h-16 rounded-xl" />
          ))}
        </div>
      </div>
    </div>
  );
}

export default Skeleton;
