import { useState, useCallback, useMemo, useEffect } from 'react';
import type { Matchup } from '../types';
import { api } from '../services/api';
import type { ApiMatchup } from '../services/api';
import { mockMatchups, currentRound } from '../data/mockData';

interface UseMatchupsReturn {
  matchups: Matchup[];
  roundId: number | null;
  selectedCount: number;
  totalCount: number;
  isComplete: boolean;
  isLoading: boolean;
  error: string | null;
  selectPlayer: (matchupId: number, selection: 'A' | 'B') => void;
  clearSelection: (matchupId: number) => void;
  clearAll: () => void;
  openConfirmation: () => void;
  confirmSubmit: () => Promise<void>;
  isSubmitting: boolean;
  isSubmitted: boolean;
  showConfirmation: boolean;
  closeConfirmation: () => void;
  deadline: Date;
  roundName: string;
}

/**
 * Convert API matchup to frontend Matchup type
 */
function apiToMatchup(apiMatchup: ApiMatchup): Matchup {
  return {
    id: apiMatchup.id,
    playerA: {
      id: apiMatchup.player_a.id,
      name: apiMatchup.player_a.name,
      team: apiMatchup.player_a.team,
      position: apiMatchup.player_a.position as 'GK' | 'DF' | 'MF' | 'FW',
      photo: apiMatchup.player_a.photo_url || undefined,
      avgPoints: apiMatchup.player_a.avg_points,
      recentForm: [], // Not provided by API yet
    },
    playerB: {
      id: apiMatchup.player_b.id,
      name: apiMatchup.player_b.name,
      team: apiMatchup.player_b.team,
      position: apiMatchup.player_b.position as 'GK' | 'DF' | 'MF' | 'FW',
      photo: apiMatchup.player_b.photo_url || undefined,
      avgPoints: apiMatchup.player_b.avg_points,
      recentForm: [],
    },
    selection: null,
  };
}

/**
 * Hook for managing matchup selections and predictions
 */
export function useMatchups(): UseMatchupsReturn {
  const [matchups, setMatchups] = useState<Matchup[]>(mockMatchups);
  const [roundId, setRoundId] = useState<number | null>(null);
  const [roundName, setRoundName] = useState(currentRound.displayName);
  const [deadline, setDeadline] = useState(currentRound.deadline);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);

  // Load active round from API
  useEffect(() => {
    const loadRound = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const round = await api.getActiveRound();

        if (round && round.matchups.length > 0) {
          setRoundId(round.id);
          setRoundName(round.name);
          setDeadline(new Date(round.deadline));
          setMatchups(round.matchups.map(apiToMatchup));
        }
        // If no round from API, keep using mock data
      } catch (err) {
        console.warn('Could not load from API, using mock data:', err);
        // Keep mock data on error
      } finally {
        setIsLoading(false);
      }
    };

    loadRound();
  }, []);

  const selectedCount = useMemo(
    () => matchups.filter((m) => m.selection !== null).length,
    [matchups]
  );

  const totalCount = matchups.length;
  const isComplete = selectedCount === totalCount && totalCount > 0;

  const selectPlayer = useCallback((matchupId: number, selection: 'A' | 'B') => {
    setMatchups((prev) =>
      prev.map((m) => (m.id === matchupId ? { ...m, selection } : m))
    );
  }, []);

  const clearSelection = useCallback((matchupId: number) => {
    setMatchups((prev) =>
      prev.map((m) => (m.id === matchupId ? { ...m, selection: null } : m))
    );
  }, []);

  const clearAll = useCallback(() => {
    setMatchups((prev) => prev.map((m) => ({ ...m, selection: null })));
  }, []);

  const openConfirmation = useCallback(() => {
    if (isComplete) {
      setShowConfirmation(true);
    }
  }, [isComplete]);

  const closeConfirmation = useCallback(() => {
    setShowConfirmation(false);
    setError(null); // Clear error when closing modal
  }, []);

  const confirmSubmit = useCallback(async () => {
    if (!isComplete) {
      throw new Error('Debes completar todas las predicciones');
    }

    setIsSubmitting(true);
    setError(null);

    try {
      // Build selections object
      const selections: Record<number, string> = {};
      for (const m of matchups) {
        if (m.selection) {
          selections[m.id] = m.selection;
        }
      }

      if (roundId) {
        // Submit to API
        await api.submitPrediction(roundId, selections);
      } else {
        // Fallback: simulate API call for mock data
        await new Promise((resolve) => setTimeout(resolve, 1000));
      }

      setIsSubmitted(true);
      setShowConfirmation(false);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Error al enviar predicciones';
      setError(message);
      // Don't throw - let the component handle the error state
    } finally {
      setIsSubmitting(false);
    }
  }, [isComplete, matchups, roundId]);

  return {
    matchups,
    roundId,
    selectedCount,
    totalCount,
    isComplete,
    isLoading,
    error,
    selectPlayer,
    clearSelection,
    clearAll,
    openConfirmation,
    confirmSubmit,
    isSubmitting,
    isSubmitted,
    showConfirmation,
    closeConfirmation,
    deadline,
    roundName,
  };
}
