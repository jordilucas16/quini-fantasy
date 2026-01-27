import { type HTMLAttributes, type ReactNode } from 'react';
import { clsx } from 'clsx';

type BadgeVariant = 'default' | 'success' | 'warning' | 'danger' | 'info' | 'position';
type BadgeSize = 'sm' | 'md';

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant;
  size?: BadgeSize;
  children: ReactNode;
}

const variantStyles: Record<BadgeVariant, string> = {
  default: 'bg-white/10 text-white/80',
  success: 'bg-emerald-500/20 text-emerald-400',
  warning: 'bg-amber-500/20 text-amber-400',
  danger: 'bg-red-500/20 text-red-400',
  info: 'bg-blue-500/20 text-blue-400',
  position: 'bg-primary-500/20 text-primary-400',
};

const sizeStyles: Record<BadgeSize, string> = {
  sm: 'px-2 py-0.5 text-xs',
  md: 'px-2.5 py-1 text-sm',
};

/**
 * Badge component for labels and status indicators
 */
export function Badge({
  variant = 'default',
  size = 'sm',
  className,
  children,
  ...props
}: BadgeProps) {
  return (
    <span
      className={clsx(
        'inline-flex items-center font-medium rounded-full',
        variantStyles[variant],
        sizeStyles[size],
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
}

interface PositionBadgeProps {
  position: 'GK' | 'DF' | 'MF' | 'FW';
  size?: BadgeSize;
}

const positionColors: Record<string, string> = {
  GK: 'bg-amber-500/20 text-amber-400',
  DF: 'bg-blue-500/20 text-blue-400',
  MF: 'bg-green-500/20 text-green-400',
  FW: 'bg-red-500/20 text-red-400',
};

/**
 * Specialized badge for player positions
 */
export function PositionBadge({ position, size = 'sm' }: PositionBadgeProps) {
  return (
    <span
      className={clsx(
        'inline-flex items-center font-bold rounded-full uppercase tracking-wide',
        positionColors[position],
        sizeStyles[size]
      )}
    >
      {position}
    </span>
  );
}
