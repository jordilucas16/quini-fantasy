import { motion } from 'framer-motion';
import { Trophy, Check, ArrowLeft, Send } from 'lucide-react';
import { clsx } from 'clsx';
import type { Matchup, Player } from '../../types';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';

interface SubmitConfirmationProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  matchups: Matchup[];
  roundName: string;
  isSubmitting: boolean;
}

/**
 * Confirmation modal showing both players with the selected one highlighted
 */
export function SubmitConfirmation({
  isOpen,
  onClose,
  onConfirm,
  matchups,
  roundName,
  isSubmitting,
}: SubmitConfirmationProps) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="">
      <div className="px-5 py-6">
        {/* Header */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', delay: 0.1 }}
          className="flex justify-center mb-4"
        >
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center shadow-lg shadow-primary-500/30">
            <Trophy className="w-8 h-8 text-white" />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-center mb-6"
        >
          <h2 className="text-xl font-bold text-white mb-1">
            Confirma tu quiniela
          </h2>
          <p className="text-sm text-white/50">{roundName}</p>
        </motion.div>

        {/* Matchups list */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="bg-white/5 rounded-xl border border-white/10 overflow-hidden mb-6"
        >
          <div className="divide-y divide-white/5">
            {matchups.map((matchup, index) => (
              <MatchupPreviewRow
                key={matchup.id}
                matchup={matchup}
                index={index}
              />
            ))}
          </div>
        </motion.div>

        {/* Actions */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="flex gap-3"
        >
          <Button
            variant="secondary"
            size="md"
            onClick={onClose}
            leftIcon={<ArrowLeft className="w-4 h-4" />}
            className="flex-1"
            disabled={isSubmitting}
          >
            Volver
          </Button>
          <Button
            variant="primary"
            size="md"
            onClick={onConfirm}
            leftIcon={<Send className="w-4 h-4" />}
            className="flex-1"
            isLoading={isSubmitting}
          >
            Confirmar
          </Button>
        </motion.div>
      </div>
    </Modal>
  );
}

interface MatchupPreviewRowProps {
  matchup: Matchup;
  index: number;
}

function MatchupPreviewRow({ matchup, index }: MatchupPreviewRowProps) {
  const isASelected = matchup.selection === 'A';

  return (
    <motion.div
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.3 + index * 0.03 }}
      className="flex items-center gap-2 px-3 py-2.5"
    >
      {/* Row number */}
      <span className="w-6 h-6 rounded-full bg-white/10 text-white/60 text-xs font-bold flex items-center justify-center flex-shrink-0">
        {index + 1}
      </span>

      {/* Player A */}
      <PlayerPreview
        player={matchup.playerA}
        isSelected={isASelected}
        side="left"
      />

      {/* VS */}
      <span className="text-[10px] font-bold text-white/30 flex-shrink-0 px-1">
        vs
      </span>

      {/* Player B */}
      <PlayerPreview
        player={matchup.playerB}
        isSelected={!isASelected}
        side="right"
      />
    </motion.div>
  );
}

interface PlayerPreviewProps {
  player: Player;
  isSelected: boolean;
  side: 'left' | 'right';
}

function PlayerPreview({ player, isSelected, side }: PlayerPreviewProps) {
  return (
    <div
      className={clsx(
        'flex-1 flex items-center gap-2 px-2 py-1.5 rounded-lg transition-all',
        side === 'right' && 'flex-row-reverse',
        isSelected
          ? 'bg-gradient-to-r from-primary-500/30 to-accent-500/30 ring-1 ring-primary-500/50'
          : 'bg-white/5 opacity-50'
      )}
    >
      {/* Avatar with check overlay */}
      <div className="relative flex-shrink-0">
        {player.photo ? (
          <img
            src={player.photo}
            alt=""
            className={clsx(
              'w-7 h-7 rounded-full object-cover',
              isSelected ? 'border-2 border-primary-500' : 'border border-white/20'
            )}
          />
        ) : (
          <div
            className={clsx(
              'w-7 h-7 rounded-full flex items-center justify-center',
              isSelected
                ? 'bg-gradient-to-br from-primary-500 to-accent-500 border-2 border-primary-400'
                : 'bg-white/20 border border-white/20'
            )}
          >
            <span className="text-[10px] font-bold text-white">
              {player.name.charAt(0)}
            </span>
          </div>
        )}

        {/* Check badge */}
        {isSelected && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="absolute -bottom-0.5 -right-0.5 w-4 h-4 rounded-full bg-emerald-500 flex items-center justify-center shadow-sm"
          >
            <Check className="w-2.5 h-2.5 text-white" strokeWidth={3} />
          </motion.div>
        )}
      </div>

      {/* Name */}
      <span
        className={clsx(
          'text-xs font-medium truncate',
          side === 'right' && 'text-right',
          isSelected ? 'text-white' : 'text-white/60'
        )}
      >
        {player.name}
      </span>
    </div>
  );
}
