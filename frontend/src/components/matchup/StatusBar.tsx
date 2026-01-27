import { motion } from 'framer-motion';
import { Clock, Send, RotateCcw, CheckCircle2, LogIn } from 'lucide-react';
import { clsx } from 'clsx';
import { Progress, CircularProgress } from '../ui/Progress';
import { Button } from '../ui/Button';
import { formatTimeRemaining } from '../../utils/formatters';

interface StatusBarProps {
  selectedCount: number;
  totalCount: number;
  deadline: Date;
  roundName: string;
  isComplete: boolean;
  isSubmitting: boolean;
  onSubmit: () => void;
  onClearAll: () => void;
  requiresAuth?: boolean;
}

/**
 * Floating status bar showing progress and actions
 * Sticky on mobile, fixed on desktop
 */
export function StatusBar({
  selectedCount,
  totalCount,
  deadline,
  roundName,
  isComplete,
  isSubmitting,
  onSubmit,
  onClearAll,
  requiresAuth = false,
}: StatusBarProps) {
  const timeRemaining = formatTimeRemaining(deadline);
  const hasSelections = selectedCount > 0;

  const getButtonText = () => {
    if (requiresAuth && isComplete) {
      return 'Inicia sesion para enviar';
    }
    if (isComplete) {
      return 'Enviar Predicciones';
    }
    return `Selecciona ${totalCount - selectedCount} mas`;
  };

  const getButtonIcon = () => {
    if (requiresAuth && isComplete) {
      return <LogIn className="w-4 h-4" />;
    }
    return <Send className="w-4 h-4" />;
  };

  return (
    <motion.div
      initial={{ y: 100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 0.3, type: 'spring', stiffness: 100 }}
      className={clsx(
        'fixed bottom-0 left-0 right-0 z-40',
        'bg-dark-900/95 backdrop-blur-xl',
        'border-t border-white/10',
        'safe-area-inset-bottom'
      )}
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4">
        {/* Mobile Layout */}
        <div className="sm:hidden space-y-4">
          {/* Progress Row */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <CircularProgress
                value={selectedCount}
                max={totalCount}
                size={48}
                strokeWidth={4}
              />
              <div>
                <p className="text-sm font-medium text-white">{roundName}</p>
                <p className="text-xs text-white/50 flex items-center gap-1">
                  <Clock className="w-3 h-3" aria-hidden="true" />
                  {timeRemaining}
                </p>
              </div>
            </div>

            {isComplete ? (
              <div className="flex items-center gap-1.5 text-emerald-400">
                <CheckCircle2 className="w-5 h-5" aria-hidden="true" />
                <span className="text-sm font-medium">Completo</span>
              </div>
            ) : (
              <span className="text-sm text-white/50">
                {totalCount - selectedCount} restantes
              </span>
            )}
          </div>

          {/* Progress Bar */}
          <Progress value={selectedCount} max={totalCount} size="sm" />

          {/* Actions */}
          <div className="flex gap-3">
            {hasSelections && (
              <Button
                variant="ghost"
                size="sm"
                onClick={onClearAll}
                leftIcon={<RotateCcw className="w-4 h-4" />}
                className="flex-shrink-0"
              >
                Limpiar
              </Button>
            )}
            <Button
              variant="primary"
              size="md"
              fullWidth
              disabled={!isComplete}
              isLoading={isSubmitting}
              onClick={onSubmit}
              leftIcon={getButtonIcon()}
            >
              {getButtonText()}
            </Button>
          </div>
        </div>

        {/* Desktop Layout */}
        <div className="hidden sm:flex items-center justify-between gap-6">
          {/* Left: Round Info */}
          <div className="flex items-center gap-4">
            <CircularProgress
              value={selectedCount}
              max={totalCount}
              size={56}
              strokeWidth={5}
            />
            <div>
              <h3 className="text-lg font-bold text-white">{roundName}</h3>
              <p className="text-sm text-white/50 flex items-center gap-1.5">
                <Clock className="w-4 h-4" aria-hidden="true" />
                Cierra en {timeRemaining}
              </p>
            </div>
          </div>

          {/* Center: Progress */}
          <div className="flex-1 max-w-md">
            <div className="flex items-center justify-between text-sm mb-2">
              <span className="text-white/60">
                {selectedCount} de {totalCount} seleccionados
              </span>
              {isComplete ? (
                <span className="text-emerald-400 font-medium flex items-center gap-1">
                  <CheckCircle2 className="w-4 h-4" aria-hidden="true" />
                  Completo
                </span>
              ) : (
                <span className="text-white/40">
                  {totalCount - selectedCount} restantes
                </span>
              )}
            </div>
            <Progress value={selectedCount} max={totalCount} />
          </div>

          {/* Right: Actions */}
          <div className="flex items-center gap-3">
            {hasSelections && (
              <Button
                variant="secondary"
                size="md"
                onClick={onClearAll}
                leftIcon={<RotateCcw className="w-4 h-4" />}
              >
                Limpiar
              </Button>
            )}
            <Button
              variant="primary"
              size="md"
              disabled={!isComplete}
              isLoading={isSubmitting}
              onClick={onSubmit}
              leftIcon={getButtonIcon()}
            >
              {getButtonText()}
            </Button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
