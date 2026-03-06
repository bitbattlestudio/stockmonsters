'use client';

import { Panel, Button } from '@/components/ui';
import { PixelIcon, type IconName } from '@/components/PixelIcon';

interface ErrorDisplayProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
  onBack?: () => void;
}

export function ErrorDisplay({
  title = 'Something went wrong',
  message = 'An unexpected error occurred. Please try again.',
  onRetry,
  onBack,
}: ErrorDisplayProps) {
  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Panel className="p-6 text-center max-w-md">
        {/* Error icon */}
        <div className="mb-4 flex justify-center">
          <div className="animate-bounce">
            <PixelIcon name="warning" size="xl" />
          </div>
        </div>

        <h2 className="text-xl font-bold text-text-dark mb-2">{title}</h2>
        <p className="text-sm text-text-mid mb-6">{message}</p>

        <div className="flex gap-3 justify-center">
          {onBack && (
            <Button variant="danger" onClick={onBack}>
              Go Back
            </Button>
          )}
          {onRetry && (
            <Button variant="primary" onClick={onRetry}>
              Try Again
            </Button>
          )}
        </div>
      </Panel>
    </div>
  );
}

// Inline error for smaller areas
export function InlineError({
  message,
  onRetry,
}: {
  message: string;
  onRetry?: () => void;
}) {
  return (
    <div className="text-center py-6">
      <p className="text-hp-red text-sm mb-3">{message}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="text-sm text-accent-blue font-bold hover:underline"
        >
          Tap to retry
        </button>
      )}
    </div>
  );
}

// Empty state display
export function EmptyState({
  icon = 'diamond',
  title,
  message,
  action,
}: {
  icon?: IconName;
  title: string;
  message: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="text-center py-12 px-4">
      <div className="mb-4 flex justify-center">
        <PixelIcon name={icon} size="xl" />
      </div>
      <h3 className="text-lg font-bold text-text-dark mb-2">{title}</h3>
      <p className="text-sm text-text-mid mb-4">{message}</p>
      {action}
    </div>
  );
}

export default ErrorDisplay;
