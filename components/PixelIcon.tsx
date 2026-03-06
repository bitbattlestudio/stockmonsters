import Image from 'next/image';

export type IconName =
  | 'health-check'
  | 'health-heart'
  | 'hunger-apple'
  | 'happiness'
  | 'sad'
  | 'trending-up'
  | 'trending-down'
  | 'chart'
  | 'diamond'
  | 'backpack'
  | 'bell'
  | 'swap'
  | 'balance'
  | 'rocket'
  | 'celebration'
  | 'warning'
  | 'checkmark'
  | 'x-mark'
  | 'link'
  | 'logo'
  | 'vote'
  | 'bank'
  | 'target'
  | 'wizard'
  | 'sparkle';

interface PixelIconProps {
  name: IconName;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  alt?: string;
}

const SIZES = {
  xs: 12,
  sm: 16,
  md: 20,
  lg: 24,
  xl: 32,
};

export function PixelIcon({ name, size = 'sm', className = '', alt }: PixelIconProps) {
  const pixelSize = SIZES[size];

  return (
    <Image
      src={`/icons/${name}.png`}
      width={pixelSize}
      height={pixelSize}
      alt={alt || name}
      className={`inline-block ${className}`}
      style={{ imageRendering: 'pixelated' }}
    />
  );
}

// Convenience exports for common icons
export const HeartIcon = (props: Omit<PixelIconProps, 'name'>) => (
  <PixelIcon name="health-heart" {...props} />
);
export const AppleIcon = (props: Omit<PixelIconProps, 'name'>) => (
  <PixelIcon name="hunger-apple" {...props} />
);
export const HappyIcon = (props: Omit<PixelIconProps, 'name'>) => (
  <PixelIcon name="happiness" {...props} />
);
export const SadIcon = (props: Omit<PixelIconProps, 'name'>) => (
  <PixelIcon name="sad" {...props} />
);
export const RocketIcon = (props: Omit<PixelIconProps, 'name'>) => (
  <PixelIcon name="rocket" {...props} />
);
export const ChartIcon = (props: Omit<PixelIconProps, 'name'>) => (
  <PixelIcon name="chart" {...props} />
);
export const WarningIcon = (props: Omit<PixelIconProps, 'name'>) => (
  <PixelIcon name="warning" {...props} />
);
export const CheckIcon = (props: Omit<PixelIconProps, 'name'>) => (
  <PixelIcon name="checkmark" {...props} />
);
export const XIcon = (props: Omit<PixelIconProps, 'name'>) => (
  <PixelIcon name="x-mark" {...props} />
);
