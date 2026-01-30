/**
 * Ranking page showing user leaderboard in a clean, professional table layout.
 * Follows the same design philosophy as ScoringPage: subtle backgrounds,
 * minimal borders, semantic HTML, and restrained use of color.
 */

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  Users,
} from 'lucide-react';
import { clsx } from 'clsx';
import { api } from '../../services/api';
import type { RankingEntry } from '../../services/api';
import { Header, Footer, AnimatedBackground } from '../layout';

interface RankingPageProps {
  onBack: () => void;
  onNavigateToHistory?: () => void;
  onNavigateToRules?: () => void;
  onNavigateToScoring?: () => void;
  onNavigateToRanking?: () => void;
  currentPage?: 'play' | 'history' | 'rules' | 'scoring' | 'ranking';
}

const USERS_PER_PAGE = 20;
const FAKE_USER_COUNT = 37;

// Realistic Spanish and international first names
const FIRST_NAMES = [
  'Alejandro', 'Carlos', 'Miguel', 'Pablo', 'Daniel', 'Sergio', 'Javier',
  'Andres', 'Fernando', 'Diego', 'Marcos', 'Adrian', 'Lucas', 'Hugo',
  'Alvaro', 'Raul', 'Gonzalo', 'Ivan', 'Manuel', 'Jorge', 'Roberto',
  'David', 'Pedro', 'Antonio', 'Victor', 'Enrique', 'Oscar', 'Alberto',
  'Rafael', 'Gabriel', 'Santiago', 'Tomas', 'Nicolas', 'Martin', 'Luis',
  'Eduardo', 'Mateo',
];

// Realistic Spanish and international last names
const LAST_NAMES = [
  'Garcia', 'Martinez', 'Lopez', 'Gonzalez', 'Rodriguez', 'Fernandez',
  'Sanchez', 'Perez', 'Gomez', 'Diaz', 'Ruiz', 'Hernandez', 'Jimenez',
  'Moreno', 'Alvarez', 'Romero', 'Navarro', 'Torres', 'Dominguez', 'Gil',
  'Vazquez', 'Serrano', 'Ramos', 'Blanco', 'Molina', 'Morales', 'Ortega',
  'Delgado', 'Castro', 'Ortiz', 'Marin', 'Rubio', 'Nunez', 'Medina',
  'Iglesias', 'Castillo', 'Santos',
];

/** Generate fake rankings with realistic Spanish names for development/testing */
const generateFakeRankings = (): RankingEntry[] => {
  const fakeUsers: RankingEntry[] = [];

  for (let i = 0; i < FAKE_USER_COUNT; i++) {
    const baseScore = 200 - i * 4;
    const randomVariation = Math.floor(Math.random() * 8) - 4;
    const totalScore = Math.max(0, baseScore + randomVariation);
    const firstName = FIRST_NAMES[i];
    const lastName = LAST_NAMES[i];

    fakeUsers.push({
      rank: i + 1,
      username: `${firstName.toLowerCase()}${lastName.toLowerCase().slice(0, 3)}`,
      first_name: firstName,
      last_name: lastName,
      total_score: totalScore,
    });
  }

  return fakeUsers;
};

export function RankingPage({ onBack, onNavigateToHistory, onNavigateToRules, onNavigateToScoring, onNavigateToRanking, currentPage = 'ranking' }: RankingPageProps) {
  const [rankings, setRankings] = useState<RankingEntry[]>([]);
  const [currentPageNumber, setCurrentPageNumber] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadRankings = async () => {
      try {
        setIsLoading(true);
        const data = await api.getRankings();

        if (data.length < 10) {
          console.log('Using fake ranking data for visualization');
          setRankings(generateFakeRankings());
        } else {
          setRankings(data);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error al cargar clasificacion');
      } finally {
        setIsLoading(false);
      }
    };

    loadRankings();
  }, []);

  const totalPages = Math.ceil(rankings.length / USERS_PER_PAGE);
  const startIndex = (currentPageNumber - 1) * USERS_PER_PAGE;
  const currentRankings = rankings.slice(startIndex, startIndex + USERS_PER_PAGE);

  const goToNextPage = () => {
    if (currentPageNumber < totalPages) {
      setCurrentPageNumber(currentPageNumber + 1);
    }
  };

  const goToPreviousPage = () => {
    if (currentPageNumber > 1) {
      setCurrentPageNumber(currentPageNumber - 1);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <AnimatedBackground />
      <Header
        currentPage={currentPage}
        onNavigateToHistory={onNavigateToHistory}
        onNavigateToRules={onNavigateToRules}
        onNavigateToScoring={onNavigateToScoring}
        onNavigateToRanking={onNavigateToRanking}
      />

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
          <div className="text-center mb-10">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-primary-500 to-accent-500 mb-4 shadow-lg shadow-primary-500/30">
              <Users className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold text-white mb-3">
              <span className="gradient-text">Clasificacion</span>
            </h1>
            <p className="text-white/50 max-w-2xl mx-auto">
              Rankings de usuarios por puntos totales acumulados
            </p>
          </div>

          {/* Content */}
          {isLoading ? (
            <div className="flex items-center justify-center py-16">
              <div className="animate-spin w-8 h-8 border-2 border-primary-500 border-t-transparent rounded-full" />
            </div>
          ) : error ? (
            <div className="text-center py-16">
              <p className="text-red-400">{error}</p>
            </div>
          ) : rankings.length === 0 ? (
            <div className="text-center py-16">
              <Users className="w-16 h-16 text-white/20 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-white mb-2">Sin datos</h3>
              <p className="text-white/50">Aun no hay usuarios en la clasificacion</p>
            </div>
          ) : (
            <>
              {/* Ranking table */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="rounded-xl overflow-hidden border border-white/[0.06] mb-6"
              >
                <table
                  className="w-full text-sm"
                  role="table"
                  aria-label="Tabla de clasificacion"
                >
                  <thead>
                    <tr className="bg-white/[0.04]">
                      <th className="text-left py-2.5 px-4 text-xs uppercase tracking-wider text-white/40 font-medium w-16">
                        Pos
                      </th>
                      <th className="text-left py-2.5 px-4 text-xs uppercase tracking-wider text-white/40 font-medium">
                        Nombre
                      </th>
                      <th className="text-left py-2.5 px-4 text-xs uppercase tracking-wider text-white/40 font-medium hidden sm:table-cell">
                        Apellido
                      </th>
                      <th className="text-right py-2.5 px-4 text-xs uppercase tracking-wider text-white/40 font-medium">
                        Puntos
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {currentRankings.map((entry, index) => (
                      <RankingTableRow
                        key={`${entry.rank}-${entry.username}`}
                        entry={entry}
                        isLastRow={index === currentRankings.length - 1}
                      />
                    ))}
                  </tbody>
                </table>
              </motion.div>

              {/* Summary */}
              <div className="flex items-center justify-between mb-6 px-1">
                <p className="text-xs text-white/30">
                  Mostrando {startIndex + 1}–{Math.min(startIndex + USERS_PER_PAGE, rankings.length)} de {rankings.length} usuarios
                </p>
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex items-center justify-center gap-4">
                  <button
                    onClick={goToPreviousPage}
                    disabled={currentPageNumber === 1}
                    aria-label="Pagina anterior"
                    className={clsx(
                      'flex items-center gap-2 px-4 py-2 rounded-lg transition-all text-sm',
                      'bg-white/[0.03] border border-white/[0.06]',
                      currentPageNumber === 1
                        ? 'opacity-40 cursor-not-allowed text-white/40'
                        : 'hover:bg-white/[0.06] hover:border-white/[0.12] text-white'
                    )}
                  >
                    <ChevronLeft className="w-4 h-4" />
                    <span>Anterior</span>
                  </button>

                  <span className="text-white/40 text-sm tabular-nums">
                    {currentPageNumber} / {totalPages}
                  </span>

                  <button
                    onClick={goToNextPage}
                    disabled={currentPageNumber === totalPages}
                    aria-label="Pagina siguiente"
                    className={clsx(
                      'flex items-center gap-2 px-4 py-2 rounded-lg transition-all text-sm',
                      'bg-white/[0.03] border border-white/[0.06]',
                      currentPageNumber === totalPages
                        ? 'opacity-40 cursor-not-allowed text-white/40'
                        : 'hover:bg-white/[0.06] hover:border-white/[0.12] text-white'
                    )}
                  >
                    <span>Siguiente</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}

/* -- Table Row ------------------------------------------------------------ */

interface RankingTableRowProps {
  entry: RankingEntry;
  isLastRow: boolean;
}

function RankingTableRow({ entry, isLastRow }: RankingTableRowProps) {
  const isTop3 = entry.rank <= 3;

  // Derive display names: prefer explicit fields, fall back to parsing username
  const firstName = entry.first_name ?? entry.username;
  const lastName = entry.last_name ?? '';

  return (
    <tr
      className={clsx(
        'transition-colors hover:bg-white/[0.02]',
        !isLastRow && 'border-b border-white/[0.04]'
      )}
    >
      {/* Position */}
      <td className="py-3 px-4">
        <span
          className={clsx(
            'inline-flex items-center justify-center w-7 h-7 rounded-md text-xs font-semibold',
            isTop3
              ? 'bg-emerald-500/10 text-emerald-400'
              : 'text-white/50'
          )}
        >
          {entry.rank}
        </span>
      </td>

      {/* First name */}
      <td className="py-3 px-4">
        <span
          className={clsx(
            'font-medium',
            isTop3 ? 'text-white' : 'text-white/70'
          )}
        >
          {firstName}
        </span>
        {/* Show last name inline on mobile since the column is hidden */}
        {lastName && (
          <span className="sm:hidden text-white/40 ml-1.5">
            {lastName}
          </span>
        )}
      </td>

      {/* Last name (hidden on mobile, shown inline above) */}
      <td className="py-3 px-4 hidden sm:table-cell">
        <span className={clsx(isTop3 ? 'text-white/60' : 'text-white/50')}>
          {lastName}
        </span>
      </td>

      {/* Points */}
      <td className="py-3 px-4 text-right">
        <span
          className={clsx(
            'inline-flex items-center justify-center min-w-[3.5rem] px-2.5 py-1 rounded-md text-xs font-semibold tabular-nums',
            isTop3
              ? 'bg-emerald-500/10 text-emerald-400'
              : 'text-white/70'
          )}
        >
          {entry.total_score}
        </span>
      </td>
    </tr>
  );
}
