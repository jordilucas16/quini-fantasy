import { clsx } from 'clsx';
import { getPlayerInitials } from '../../data/mockData';
import { stringToColor } from '../../utils/formatters';

type AvatarSize = 'sm' | 'md' | 'lg' | 'xl';

interface AvatarProps {
  name: string;
  photo?: string;
  size?: AvatarSize;
  className?: string;
}

const sizeStyles: Record<AvatarSize, { container: string; text: string }> = {
  sm: { container: 'w-8 h-8', text: 'text-xs' },
  md: { container: 'w-12 h-12', text: 'text-sm' },
  lg: { container: 'w-16 h-16', text: 'text-lg' },
  xl: { container: 'w-20 h-20', text: 'text-xl' },
};

/**
 * Avatar component with fallback to initials
 */
export function Avatar({ name, photo, size = 'md', className }: AvatarProps) {
  const initials = getPlayerInitials(name);
  const bgColor = stringToColor(name);
  const styles = sizeStyles[size];

  if (photo) {
    return (
      <div
        className={clsx(
          'relative rounded-full overflow-hidden flex-shrink-0',
          'ring-2 ring-white/20',
          styles.container,
          className
        )}
      >
        <img
          src={photo}
          alt={name}
          className="w-full h-full object-cover"
          loading="lazy"
        />
      </div>
    );
  }

  return (
    <div
      className={clsx(
        'relative rounded-full flex items-center justify-center flex-shrink-0',
        'font-bold text-white ring-2 ring-white/20',
        styles.container,
        styles.text,
        className
      )}
      style={{ backgroundColor: bgColor }}
      aria-label={name}
    >
      {initials}
    </div>
  );
}

interface TeamLogoProps {
  team: string;
  logo?: string;
  size?: 'sm' | 'md';
  className?: string;
}

const logoSizes = {
  sm: 'w-4 h-4',
  md: 'w-5 h-5',
};

/**
 * Team logo with fallback
 */
export function TeamLogo({ team, logo, size = 'sm', className }: TeamLogoProps) {
  if (logo) {
    return (
      <img
        src={logo}
        alt={team}
        className={clsx(logoSizes[size], 'object-contain', className)}
        loading="lazy"
      />
    );
  }

  // Fallback: first letter of team name
  return (
    <span
      className={clsx(
        'inline-flex items-center justify-center rounded-full',
        'bg-white/10 text-white/60 text-xs font-medium',
        logoSizes[size],
        className
      )}
    >
      {team[0]}
    </span>
  );
}
