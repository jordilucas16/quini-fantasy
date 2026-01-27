/**
 * History page showing user's past predictions
 */

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  History,
  ChevronRight,
  Check,
  X,
  Clock,
  Trophy,
  ArrowLeft,
  Calendar
} from 'lucide-react';
import { clsx } from 'clsx';
import { api } from '../../services/api';
import type { PredictionHistory, PredictionDetail, MatchupDetail } from '../../services/api';
import { useAuth } from '../../contexts/AuthContext';
import { Header, Footer, AnimatedBackground } from '../layout';

interface HistoryPageProps {
  onBack: () => void;
  onNavigateToScoring?: () => void;
  currentPage?: 'play' | 'history' | 'rules' | 'scoring';
}

export function HistoryPage({ onBack, onNavigateToScoring, currentPage = 'history' }: HistoryPageProps) {
  const { isAuthenticated } = useAuth();
  const [predictions, setPredictions] = useState<PredictionHistory[]>([]);
  const [selectedPrediction, setSelectedPrediction] = useState<PredictionDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingDetail, setIsLoadingDetail] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isAuthenticated) return;

    const loadHistory = async () => {
      try {
        setIsLoading(true);
        const data = await api.getPredictionHistory();
        setPredictions(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error al cargar historial');
      } finally {
        setIsLoading(false);
      }
    };

    loadHistory();
  }, [isAuthenticated]);

  const loadPredictionDetail = async (predictionId: number) => {
    try {
      setIsLoadingDetail(true);
      const detail = await api.getPredictionDetail(predictionId);
      setSelectedPrediction(detail);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al cargar detalle');
    } finally {
      setIsLoadingDetail(false);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex flex-col">
        <AnimatedBackground />
        <Header currentPage={currentPage} onNavigateToScoring={onNavigateToScoring} />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center p-8">
            <History className="w-16 h-16 text-white/30 mx-auto mb-4" />
            <h2 className="text-xl font-bold text-white mb-2">Inicia sesion</h2>
            <p className="text-white/50">Para ver tu historial de predicciones</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <AnimatedBackground />
      <Header currentPage={currentPage} onNavigateToScoring={onNavigateToScoring} />

      <main className="flex-1 py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          {/* Back button */}
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-white/60 hover:text-white mb-6 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Volver a jugar</span>
          </button>

          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl sm:text-4xl font-bold text-white mb-2">
              Mi <span className="gradient-text">Historial</span>
            </h1>
            <p className="text-white/50">
              Revisa tus predicciones pasadas y tus aciertos
            </p>
          </div>

          <AnimatePresence mode="wait">
            {selectedPrediction ? (
              <PredictionDetailView
                key="detail"
                prediction={selectedPrediction}
                onBack={() => setSelectedPrediction(null)}
              />
            ) : (
              <PredictionListView
                key="list"
                predictions={predictions}
                isLoading={isLoading}
                error={error}
                onSelectPrediction={loadPredictionDetail}
                isLoadingDetail={isLoadingDetail}
              />
            )}
          </AnimatePresence>
        </div>
      </main>

      <Footer />
    </div>
  );
}

interface PredictionListViewProps {
  predictions: PredictionHistory[];
  isLoading: boolean;
  error: string | null;
  onSelectPrediction: (id: number) => void;
  isLoadingDetail: boolean;
}

function PredictionListView({
  predictions,
  isLoading,
  error,
  onSelectPrediction,
  isLoadingDetail,
}: PredictionListViewProps) {
  if (isLoading) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="flex items-center justify-center py-16"
      >
        <div className="animate-spin w-8 h-8 border-2 border-primary-500 border-t-transparent rounded-full" />
      </motion.div>
    );
  }

  if (error) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="text-center py-16"
      >
        <p className="text-red-400">{error}</p>
      </motion.div>
    );
  }

  if (predictions.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="text-center py-16"
      >
        <History className="w-16 h-16 text-white/20 mx-auto mb-4" />
        <h3 className="text-xl font-bold text-white mb-2">Sin predicciones</h3>
        <p className="text-white/50">Aun no has enviado ninguna prediccion</p>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="space-y-3"
    >
      {predictions.map((prediction, index) => (
        <motion.button
          key={prediction.id}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.05 }}
          onClick={() => onSelectPrediction(prediction.id)}
          disabled={isLoadingDetail}
          className={clsx(
            'w-full flex items-center gap-4 p-4 rounded-xl',
            'bg-white/5 border border-white/10',
            'hover:bg-white/10 hover:border-white/20',
            'transition-all text-left',
            isLoadingDetail && 'opacity-50 cursor-wait'
          )}
        >
          {/* Round icon */}
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary-500/20 to-accent-500/20 flex items-center justify-center flex-shrink-0">
            <Trophy className="w-6 h-6 text-primary-400" />
          </div>

          {/* Info */}
          <div className="flex-1 min-w-0">
            <h3 className="font-bold text-white truncate">{prediction.round_name}</h3>
            <p className="text-sm text-white/50 flex items-center gap-1">
              <Calendar className="w-3 h-3" />
              {new Date(prediction.submitted_at).toLocaleDateString('es-ES', {
                day: 'numeric',
                month: 'short',
                year: 'numeric',
              })}
            </p>
          </div>

          {/* Score */}
          <div className="text-right">
            {prediction.score !== null ? (
              <div className="flex items-center gap-2">
                <span className="text-2xl font-bold gradient-text">
                  {prediction.score}
                </span>
                <span className="text-white/40 text-sm">/ {prediction.total_matchups}</span>
              </div>
            ) : (
              <div className="flex items-center gap-1 text-white/40">
                <Clock className="w-4 h-4" />
                <span className="text-sm">Pendiente</span>
              </div>
            )}
          </div>

          <ChevronRight className="w-5 h-5 text-white/30" />
        </motion.button>
      ))}
    </motion.div>
  );
}

interface PredictionDetailViewProps {
  prediction: PredictionDetail;
  onBack: () => void;
}

function PredictionDetailView({ prediction, onBack }: PredictionDetailViewProps) {
  const hasResults = prediction.matchups.some((m) => m.result !== null);

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
    >
      {/* Back button */}
      <button
        onClick={onBack}
        className="flex items-center gap-2 text-white/60 hover:text-white mb-6 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Volver al historial</span>
      </button>

      {/* Header */}
      <div className="bg-white/5 border border-white/10 rounded-2xl p-6 mb-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-2xl font-bold text-white">{prediction.round_name}</h2>
            <p className="text-sm text-white/50">
              Enviado el {new Date(prediction.submitted_at).toLocaleDateString('es-ES', {
                day: 'numeric',
                month: 'long',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
              })}
            </p>
          </div>

          {hasResults && (
            <div className="text-center">
              <div className="text-4xl font-bold gradient-text">
                {prediction.correct_count}/{prediction.total_count}
              </div>
              <p className="text-xs text-white/50">Aciertos</p>
            </div>
          )}
        </div>

        {/* Stats bar */}
        {hasResults && (
          <div className="flex gap-4">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-emerald-500" />
              <span className="text-sm text-white/70">
                {prediction.correct_count} correctos
              </span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-red-500" />
              <span className="text-sm text-white/70">
                {prediction.total_count - prediction.correct_count} fallados
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Matchups */}
      <div className="space-y-2">
        {prediction.matchups.map((matchup, index) => (
          <MatchupDetailRow key={matchup.id} matchup={matchup} index={index} />
        ))}
      </div>
    </motion.div>
  );
}

interface MatchupDetailRowProps {
  matchup: MatchupDetail;
  index: number;
}

function MatchupDetailRow({ matchup, index }: MatchupDetailRowProps) {
  const selectedPlayer = matchup.user_selection === 'A' ? matchup.player_a : matchup.player_b;
  const otherPlayer = matchup.user_selection === 'A' ? matchup.player_b : matchup.player_a;
  const hasResult = matchup.result !== null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.03 }}
      className={clsx(
        'flex items-center gap-3 p-3 rounded-xl',
        'bg-white/5 border',
        hasResult
          ? matchup.is_correct
            ? 'border-emerald-500/30 bg-emerald-500/5'
            : 'border-red-500/30 bg-red-500/5'
          : 'border-white/10'
      )}
    >
      {/* Row number */}
      <span className="w-8 h-8 rounded-lg bg-white/10 text-white/60 text-sm font-bold flex items-center justify-center flex-shrink-0">
        {index + 1}
      </span>

      {/* Selected player (highlighted) */}
      <div className="flex-1 flex items-center gap-2">
        <div className={clsx(
          'w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold',
          'bg-gradient-to-br from-primary-500/50 to-accent-500/50 text-white'
        )}>
          {selectedPlayer.name.charAt(0)}
        </div>
        <div className="min-w-0">
          <p className="text-sm font-medium text-white truncate">{selectedPlayer.name}</p>
          <p className="text-xs text-white/40 truncate">{selectedPlayer.team}</p>
        </div>
      </div>

      {/* VS */}
      <span className="text-xs font-bold text-white/30 px-2">vs</span>

      {/* Other player (dimmed) */}
      <div className="flex-1 flex items-center gap-2 opacity-50">
        <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-xs font-bold text-white/60">
          {otherPlayer.name.charAt(0)}
        </div>
        <div className="min-w-0">
          <p className="text-sm font-medium text-white/60 truncate">{otherPlayer.name}</p>
          <p className="text-xs text-white/30 truncate">{otherPlayer.team}</p>
        </div>
      </div>

      {/* Result indicator */}
      <div className="w-8 h-8 flex items-center justify-center flex-shrink-0">
        {hasResult ? (
          matchup.is_correct ? (
            <div className="w-6 h-6 rounded-full bg-emerald-500 flex items-center justify-center">
              <Check className="w-4 h-4 text-white" />
            </div>
          ) : (
            <div className="w-6 h-6 rounded-full bg-red-500 flex items-center justify-center">
              <X className="w-4 h-4 text-white" />
            </div>
          )
        ) : (
          <Clock className="w-5 h-5 text-white/30" />
        )}
      </div>
    </motion.div>
  );
}
