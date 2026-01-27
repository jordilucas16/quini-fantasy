import { motion } from 'framer-motion';
import { clsx } from 'clsx';
import type { Matchup } from '../../types';
import { PlayerCardCompact } from './PlayerCardCompact';

interface MatchupRowProps {
  matchup: Matchup;
  index: number;
  onSelectPlayer: (matchupId: number, selection: 'A' | 'B') => void;
}

/**
 * A single matchup row in quiniela style
 * Displays two players side by side with a VS divider
 * Designed to be compact and scannable like a traditional football pools form
 */
export function MatchupRow({ matchup, index, onSelectPlayer }: MatchupRowProps) {
  const isComplete = matchup.selection !== null;

  return (
    <motion.div
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.03, duration: 0.2 }}
      className={clsx(
        'relative flex items-stretch',
        'rounded-xl sm:rounded-2xl overflow-hidden',
        'transition-all duration-200',
        isComplete
          ? 'ring-2 ring-primary-500/30 shadow-lg shadow-primary-500/10'
          : 'ring-1 ring-white/5'
      )}
    >
      {/* Row number - quiniela style */}
      <div
        className={clsx(
          'flex items-center justify-center w-12 sm:w-16 flex-shrink-0',
          'font-bold text-base sm:text-lg',
          'border-r-2 border-white/10 mr-2',
          isComplete
            ? 'bg-gradient-to-b from-primary-600 to-primary-700 text-white'
            : 'bg-white/5 text-white/60'
        )}
      >
        {index + 1}
      </div>

      {/* Player A */}
      <PlayerCardCompact
        player={matchup.playerA}
        isSelected={matchup.selection === 'A'}
        onSelect={() => onSelectPlayer(matchup.id, 'A')}
        side="left"
      />

      {/* VS Divider */}
      <div className={clsx(
        'flex items-center justify-center w-10 sm:w-12 flex-shrink-0',
        'bg-dark-900/80 border-x border-white/5'
      )}>
        <span className={clsx(
          'text-xs font-bold tracking-wider',
          isComplete ? 'text-primary-400' : 'text-white/30'
        )}>
          VS
        </span>
      </div>

      {/* Player B */}
      <PlayerCardCompact
        player={matchup.playerB}
        isSelected={matchup.selection === 'B'}
        onSelect={() => onSelectPlayer(matchup.id, 'B')}
        side="right"
      />

      {/* Completion indicator - subtle right edge */}
      {isComplete && (
        <motion.div
          initial={{ scaleY: 0 }}
          animate={{ scaleY: 1 }}
          className="absolute right-0 top-0 bottom-0 w-1 bg-gradient-to-b from-primary-500 to-accent-500"
        />
      )}
    </motion.div>
  );
}
