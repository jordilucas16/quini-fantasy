import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown, Minus, Zap } from 'lucide-react';
import { clsx } from 'clsx';
import type { Player } from '../../types';
import { Avatar } from '../ui/Avatar';
import { PositionBadge } from '../ui/Badge';
import { getFormTrend } from '../../data/mockData';

interface PlayerCardProps {
  player: Player;
  isSelected: boolean;
  onSelect: () => void;
  side: 'left' | 'right';
  disabled?: boolean;
}

/**
 * Interactive player card for matchup selection
 * Displays player info, stats, and selection state
 */
export function PlayerCard({
  player,
  isSelected,
  onSelect,
  side,
  disabled = false,
}: PlayerCardProps) {
  const recentForm = player.recentForm ?? [];
  const formTrend = getFormTrend(recentForm);
  const recentAvg =
    recentForm.length > 0
      ? (recentForm.reduce((a, b) => a + b, 0) / recentForm.length).toFixed(1)
      : '0.0';

  return (
    <motion.button
      type="button"
      onClick={onSelect}
      disabled={disabled}
      className={clsx(
        'relative w-full p-4 sm:p-5 rounded-2xl transition-all duration-300',
        'border-2 focus-visible:outline-none',
        'text-left',
        isSelected
          ? 'bg-gradient-to-br from-primary-600/30 to-accent-600/20 border-primary-500 shadow-lg shadow-primary-500/20'
          : 'bg-white/5 border-white/10 hover:bg-white/8 hover:border-white/20',
        disabled && 'opacity-50 cursor-not-allowed',
        !disabled && !isSelected && 'hover:scale-[1.02] active:scale-[0.98]'
      )}
      whileTap={!disabled ? { scale: 0.98 } : undefined}
      aria-pressed={isSelected}
      aria-label={`Seleccionar ${player.name}`}
    >
      {/* Selection indicator */}
      {isSelected && (
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center shadow-lg"
        >
          <Zap className="w-4 h-4 text-white fill-white" aria-hidden="true" />
        </motion.div>
      )}

      {/* Player Header */}
      <div className={clsx(
        'flex items-center gap-3 sm:gap-4',
        side === 'right' && 'sm:flex-row-reverse'
      )}>
        <Avatar name={player.name} photo={player.photo} size="lg" />
        <div className={clsx(
          'flex-1 min-w-0',
          side === 'right' && 'sm:text-right'
        )}>
          <h3 className="text-base sm:text-lg font-bold text-white truncate">
            {player.name}
          </h3>
          <div className={clsx(
            'flex items-center gap-2 mt-1',
            side === 'right' && 'sm:flex-row-reverse'
          )}>
            <PositionBadge position={player.position} />
            <span className="text-sm text-white/50 truncate">{player.team}</span>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-3 gap-3 mt-4 pt-4 border-t border-white/10">
        {/* Average Points */}
        <div className="text-center">
          <p className="text-2xl sm:text-3xl font-bold gradient-text">
            {player.avgPoints.toFixed(1)}
          </p>
          <p className="text-xs text-white/40 mt-0.5">Media pts</p>
        </div>

        {/* Recent Form */}
        <div className="text-center">
          <div className="flex items-center justify-center gap-1">
            <span className="text-xl sm:text-2xl font-bold text-white">
              {recentAvg}
            </span>
            <FormTrendIcon trend={formTrend} />
          </div>
          <p className="text-xs text-white/40 mt-0.5">Ultimos 5</p>
        </div>

        {/* Matches Played */}
        <div className="text-center">
          <p className="text-xl sm:text-2xl font-bold text-white">
            {player.matchesPlayed}
          </p>
          <p className="text-xs text-white/40 mt-0.5">Partidos</p>
        </div>
      </div>

      {/* Form Sparkline */}
      <div className="mt-4 pt-3 border-t border-white/5">
        <FormSparkline values={recentForm} />
      </div>
    </motion.button>
  );
}

interface FormTrendIconProps {
  trend: 'up' | 'down' | 'stable';
}

function FormTrendIcon({ trend }: FormTrendIconProps) {
  if (trend === 'up') {
    return <TrendingUp className="w-4 h-4 text-emerald-400" aria-label="Tendencia al alza" />;
  }
  if (trend === 'down') {
    return <TrendingDown className="w-4 h-4 text-red-400" aria-label="Tendencia a la baja" />;
  }
  return <Minus className="w-4 h-4 text-white/40" aria-label="Tendencia estable" />;
}

interface FormSparklineProps {
  values: number[];
}

function FormSparkline({ values }: FormSparklineProps) {
  if (values.length === 0) return null;

  const max = Math.max(...values);
  const min = Math.min(...values);
  const range = max - min || 1;

  return (
    <div className="flex items-end justify-between gap-1 h-8" aria-label="Grafico de forma reciente">
      {values.map((value, index) => {
        const height = ((value - min) / range) * 100;
        const isLast = index === values.length - 1;

        return (
          <div
            key={index}
            className={clsx(
              'flex-1 rounded-t transition-all',
              isLast
                ? 'bg-gradient-to-t from-primary-500 to-accent-500'
                : 'bg-white/20'
            )}
            style={{ height: `${Math.max(20, height)}%` }}
            title={`Jornada ${index + 1}: ${value} pts`}
          />
        );
      })}
    </div>
  );
}
