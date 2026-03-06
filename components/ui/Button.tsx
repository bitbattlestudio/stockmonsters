'use client';

import { forwardRef } from 'react';
import { cn } from '@/lib/utils/cn';
import type { ButtonProps } from '@/types';

/**
 * GBA-style chunky button with press animation
 */
export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ children, variant = 'primary', size = 'md', className, disabled, ...props }, ref) => {
    const variantStyles = {
      primary: 'bg-accent-blue border-accent-blue-dark text-white',
      success: 'bg-hp-green border-[#38A838] text-white',
      danger: 'bg-accent-pink border-[#D84878] text-white',
    };

    const shadowStyles = {
      primary: 'shadow-[0_4px_0_var(--accent-blue-dark)]',
      success: 'shadow-[0_4px_0_#38A838]',
      danger: 'shadow-[0_4px_0_#D84878]',
    };

    const sizeStyles = {
      sm: 'px-3 py-2 text-sm',
      md: 'px-4 py-3 text-base',
      lg: 'px-6 py-4 text-lg',
    };

    return (
      <button
        ref={ref}
        disabled={disabled}
        className={cn(
          'font-bold rounded-xl',
          'border-3',
          'transition-all duration-100',
          'active:translate-y-1 active:shadow-[0_2px_0]',
          'disabled:opacity-50 disabled:cursor-not-allowed disabled:active:translate-y-0',
          variantStyles[variant],
          shadowStyles[variant],
          sizeStyles[size],
          className
        )}
        {...props}
      >
        {children}
      </button>
    );
  }
);

Button.displayName = 'Button';

export default Button;
