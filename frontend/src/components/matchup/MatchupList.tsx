import { motion } from 'framer-motion';
import type { Matchup } from '../../types';
import { MatchupRow } from './MatchupRow';

interface MatchupListProps {
  matchups: Matchup[];
  onSelectPlayer: (matchupId: number, selection: 'A' | 'B') => void;
}

/**
 * List of all 11 matchups for the current round
 * Displays in a compact quiniela-style format with clear row separation
 */
export function MatchupList({ matchups, onSelectPlayer }: MatchupListProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="w-full"
      role="list"
      aria-label="Lista de enfrentamientos"
    >
      {/* Header row - like a quiniela form header */}
      <div className="flex items-center mb-3 px-2 sm:px-0">
        <div className="w-10 sm:w-14 flex-shrink-0 text-center">
          <span className="text-xs font-bold text-white/40 uppercase tracking-wider">#</span>
        </div>
        <div className="flex-1 text-center">
          <span className="text-xs font-bold text-white/40 uppercase tracking-wider">Jugador 1</span>
        </div>
        <div className="w-10 sm:w-12 flex-shrink-0" />
        <div className="flex-1 text-center">
          <span className="text-xs font-bold text-white/40 uppercase tracking-wider">Jugador 2</span>
        </div>
      </div>

      {/* Matchup rows - compact spacing */}
      <div className="space-y-2 sm:space-y-3">
        {matchups.map((matchup, index) => (
          <div key={matchup.id} role="listitem">
            <MatchupRow
              matchup={matchup}
              index={index}
              onSelectPlayer={onSelectPlayer}
            />
          </div>
        ))}
      </div>

      {/* Footer hint */}
      <div className="mt-4 text-center">
        <p className="text-xs text-white/30">
          Pulsa sobre un jugador para seleccionarlo
        </p>
      </div>
    </motion.div>
  );
}
