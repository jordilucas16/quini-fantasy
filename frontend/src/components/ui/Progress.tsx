import { clsx } from 'clsx';

interface ProgressProps {
  value: number;
  max: number;
  showLabel?: boolean;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'default' | 'gradient';
  className?: string;
}

const sizeStyles = {
  sm: 'h-1.5',
  md: 'h-2.5',
  lg: 'h-4',
};

/**
 * Progress bar component
 */
export function Progress({
  value,
  max,
  showLabel = false,
  size = 'md',
  variant = 'gradient',
  className,
}: ProgressProps) {
  const percentage = Math.min(100, Math.max(0, (value / max) * 100));

  return (
    <div className={clsx('w-full', className)}>
      {showLabel && (
        <div className="flex justify-between text-sm mb-2">
          <span className="text-white/60">Progreso</span>
          <span className="text-white font-medium">
            {value}/{max}
          </span>
        </div>
      )}
      <div
        className={clsx(
          'w-full bg-white/10 rounded-full overflow-hidden',
          sizeStyles[size]
        )}
        role="progressbar"
        aria-valuenow={value}
        aria-valuemin={0}
        aria-valuemax={max}
        aria-label={`${value} de ${max} completados`}
      >
        <div
          className={clsx(
            'h-full rounded-full transition-all duration-500 ease-out',
            variant === 'gradient'
              ? 'bg-gradient-to-r from-accent-500 to-primary-500'
              : 'bg-primary-500'
          )}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}

interface CircularProgressProps {
  value: number;
  max: number;
  size?: number;
  strokeWidth?: number;
  showValue?: boolean;
  className?: string;
}

/**
 * Circular progress indicator
 */
export function CircularProgress({
  value,
  max,
  size = 80,
  strokeWidth = 8,
  showValue = true,
  className,
}: CircularProgressProps) {
  const percentage = Math.min(100, Math.max(0, (value / max) * 100));
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (percentage / 100) * circumference;

  return (
    <div
      className={clsx('relative inline-flex items-center justify-center', className)}
      style={{ width: size, height: size }}
    >
      <svg
        className="transform -rotate-90"
        width={size}
        height={size}
        aria-hidden="true"
      >
        {/* Background circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="currentColor"
          strokeWidth={strokeWidth}
          className="text-white/10"
        />
        {/* Progress circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="url(#progressGradient)"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          className="transition-all duration-500 ease-out"
        />
        <defs>
          <linearGradient id="progressGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="var(--color-accent-500)" />
            <stop offset="100%" stopColor="var(--color-primary-500)" />
          </linearGradient>
        </defs>
      </svg>
      {showValue && (
        <span className="absolute text-lg font-bold text-white">
          {value}/{max}
        </span>
      )}
    </div>
  );
}
