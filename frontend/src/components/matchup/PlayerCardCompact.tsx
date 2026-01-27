import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown, Minus, Check } from 'lucide-react';
import { clsx } from 'clsx';
import type { Player } from '../../types';
import { getFormTrend } from '../../data/mockData';

interface PlayerCardCompactProps {
  player: Player;
  isSelected: boolean;
  onSelect: () => void;
  side: 'left' | 'right';
  disabled?: boolean;
}

/**
 * Compact player card for quiniela-style matchup selection
 * Designed to fit two cards side by side in a row
 */
export function PlayerCardCompact({
  player,
  isSelected,
  onSelect,
  side,
  disabled = false,
}: PlayerCardCompactProps) {
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
        'relative flex-1 min-w-0 py-3 px-3 sm:px-4 transition-all duration-200',
        'border-2 focus-visible:outline-none',
        'rounded-lg sm:rounded-xl',
        side === 'left' ? 'rounded-r-none sm:rounded-r-none' : 'rounded-l-none sm:rounded-l-none',
        isSelected
          ? 'bg-gradient-to-br from-primary-600/40 to-accent-600/30 border-primary-500 shadow-lg shadow-primary-500/25'
          : 'bg-white/5 border-white/10 hover:bg-white/10 hover:border-white/20',
        disabled && 'opacity-50 cursor-not-allowed',
        !disabled && !isSelected && 'active:scale-[0.98]'
      )}
      whileTap={!disabled ? { scale: 0.98 } : undefined}
      aria-pressed={isSelected}
      aria-label={`Seleccionar ${player.name}`}
    >
      {/* Selection check indicator */}
      {isSelected && (
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className={clsx(
            'absolute top-1 w-5 h-5 rounded-full bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center shadow-md',
            side === 'left' ? 'left-1' : 'right-1'
          )}
        >
          <Check className="w-3 h-3 text-white" aria-hidden="true" />
        </motion.div>
      )}

      {/* Card content - responsive layout */}
      <div className={clsx(
        'flex items-center gap-2 sm:gap-3',
        side === 'right' && 'flex-row-reverse'
      )}>
        {/* Player photo/avatar */}
        <div className="relative flex-shrink-0">
          {player.photo ? (
            <img
              src={player.photo}
              alt=""
              className="w-10 h-10 sm:w-12 sm:h-12 rounded-full object-cover border-2 border-white/20"
            />
          ) : (
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-gradient-to-br from-primary-500/50 to-accent-500/50 flex items-center justify-center border-2 border-white/20">
              <span className="text-sm sm:text-base font-bold text-white">
                {player.name.charAt(0)}
              </span>
            </div>
          )}
          {/* Position badge overlay */}
          <span className={clsx(
            'absolute -bottom-1 left-1/2 -translate-x-1/2',
            'px-1.5 py-0.5 text-[10px] font-bold rounded uppercase',
            player.position === 'GK' && 'bg-amber-500/80 text-amber-100',
            player.position === 'DF' && 'bg-blue-500/80 text-blue-100',
            player.position === 'MF' && 'bg-green-500/80 text-green-100',
            player.position === 'FW' && 'bg-red-500/80 text-red-100',
          )}>
            {player.position}
          </span>
        </div>

        {/* Player info */}
        <div className={clsx(
          'flex-1 min-w-0',
          side === 'left' ? 'text-left' : 'text-right'
        )}>
          <h4 className="text-sm sm:text-base font-bold text-white truncate leading-tight">
            {player.name}
          </h4>
          <p className="text-xs text-white/50 truncate">
            {player.team}
          </p>
        </div>

        {/* Stats - compact */}
        <div className={clsx(
          'flex flex-col items-center gap-0.5 flex-shrink-0',
          side === 'right' ? 'border-r border-white/10 pr-2 sm:pr-3' : 'border-l border-white/10 pl-2 sm:pl-3'
        )}>
          <div className="flex items-center gap-1">
            <span className="text-lg sm:text-xl font-bold gradient-text">
              {player.avgPoints.toFixed(1)}
            </span>
          </div>
          <span className="text-[10px] text-white/40">Media</span>
        </div>

        {/* Recent form indicator - hidden on very small screens */}
        <div className={clsx(
          'hidden sm:flex flex-col items-center gap-0.5 flex-shrink-0',
          side === 'right' ? 'border-r border-white/10 pr-3' : 'border-l border-white/10 pl-3'
        )}>
          <div className="flex items-center gap-0.5">
            <span className="text-base font-semibold text-white">
              {recentAvg}
            </span>
            <FormTrendIcon trend={formTrend} />
          </div>
          <span className="text-[10px] text-white/40">Ult.5</span>
        </div>
      </div>
    </motion.button>
  );
}

interface FormTrendIconProps {
  trend: 'up' | 'down' | 'stable';
}

function FormTrendIcon({ trend }: FormTrendIconProps) {
  if (trend === 'up') {
    return <TrendingUp className="w-3 h-3 text-emerald-400" aria-label="Tendencia al alza" />;
  }
  if (trend === 'down') {
    return <TrendingDown className="w-3 h-3 text-red-400" aria-label="Tendencia a la baja" />;
  }
  return <Minus className="w-3 h-3 text-white/40" aria-label="Tendencia estable" />;
}
