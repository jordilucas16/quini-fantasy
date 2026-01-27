/**
 * Utility functions for formatting data
 */

/**
 * Format a date as relative time (e.g., "2 days left")
 */
export function formatTimeRemaining(date: Date): string {
  const now = new Date();
  const diff = date.getTime() - now.getTime();

  if (diff <= 0) {
    return 'Cerrado';
  }

  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

  if (days > 0) {
    return `${days}d ${hours}h`;
  }
  if (hours > 0) {
    return `${hours}h ${minutes}m`;
  }
  return `${minutes}m`;
}

/**
 * Format a date for display
 */
export function formatDate(date: Date): string {
  return new Intl.DateTimeFormat('es-ES', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date);
}

/**
 * Format points with appropriate styling
 */
export function formatPoints(points: number): string {
  if (points >= 0) {
    return `+${points.toFixed(1)}`;
  }
  return points.toFixed(1);
}

/**
 * Format player value in millions
 */
export function formatValue(value: number): string {
  if (value >= 100) {
    return `${value}M`;
  }
  return `${value}M`;
}

/**
 * Get position display name in Spanish
 */
export function getPositionName(position: string): string {
  const positions: Record<string, string> = {
    GK: 'Portero',
    DF: 'Defensa',
    MF: 'Mediocampista',
    FW: 'Delantero',
  };
  return positions[position] || position;
}

/**
 * Get position abbreviation color class
 */
export function getPositionColorClass(position: string): string {
  const colors: Record<string, string> = {
    GK: 'bg-amber-500/20 text-amber-400',
    DF: 'bg-blue-500/20 text-blue-400',
    MF: 'bg-green-500/20 text-green-400',
    FW: 'bg-red-500/20 text-red-400',
  };
  return colors[position] || 'bg-gray-500/20 text-gray-400';
}

/**
 * Clamp a number between min and max
 */
export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

/**
 * Generate a deterministic color from a string (for avatars)
 */
export function stringToColor(str: string): string {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }

  const hue = hash % 360;
  return `hsl(${hue}, 70%, 50%)`;
}
