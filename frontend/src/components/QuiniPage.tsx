import { useState } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Target, TrendingUp, Users } from 'lucide-react';
import { Header, Footer, AnimatedBackground } from './layout';
import { MatchupList, StatusBar, SubmitConfirmation } from './matchup';
import { Card } from './ui';
import { AuthModal } from './auth';
import { useMatchups } from '../hooks/useMatchups';
import { useAuth } from '../contexts/AuthContext';

interface QuiniPageProps {
  onNavigateToHistory?: () => void;
  onNavigateToRules?: () => void;
  onNavigateToScoring?: () => void;
  currentPage?: 'play' | 'history' | 'rules' | 'scoring';
}

/**
 * Main quiniela page - the core of the application
 * Users select which player they think will score more points in each matchup
 */
export function QuiniPage({ onNavigateToHistory, onNavigateToRules, onNavigateToScoring, currentPage = 'play' }: QuiniPageProps) {
  const {
    matchups,
    selectedCount,
    totalCount,
    isComplete,
    selectPlayer,
    clearAll,
    openConfirmation,
    confirmSubmit,
    isSubmitting,
    showConfirmation,
    closeConfirmation,
    deadline,
    roundName,
  } = useMatchups();

  const { isAuthenticated } = useAuth();
  const [showAuthModal, setShowAuthModal] = useState(false);

  const handleSubmitClick = () => {
    if (!isAuthenticated) {
      setShowAuthModal(true);
      return;
    }
    openConfirmation();
  };

  return (
    <div className="min-h-screen flex flex-col">
      <AnimatedBackground />
      <Header onNavigateToHistory={onNavigateToHistory} onNavigateToRules={onNavigateToRules} onNavigateToScoring={onNavigateToScoring} currentPage={currentPage} />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="pt-8 pb-12 sm:pt-12 sm:pb-16">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-4">
                Quien ganara{' '}
                <span className="gradient-text">mas puntos</span>?
              </h1>
              <p className="text-lg sm:text-xl text-white/60 max-w-2xl mx-auto mb-8">
                Selecciona el jugador que crees que conseguira mas puntos en cada
                enfrentamiento. 11 duelos, una oportunidad de demostrar tu vision.
              </p>
            </motion.div>

            {/* Stats Cards */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 max-w-3xl mx-auto"
            >
              <StatCard
                icon={<Target className="w-5 h-5" />}
                label="Enfrentamientos"
                value="11"
              />
              <StatCard
                icon={<Sparkles className="w-5 h-5" />}
                label="Puntos en juego"
                value="110"
              />
              <StatCard
                icon={<TrendingUp className="w-5 h-5" />}
                label="Tu racha"
                value="3"
                highlight
              />
              <StatCard
                icon={<Users className="w-5 h-5" />}
                label="Participantes"
                value="1.2K"
              />
            </motion.div>
          </div>
        </section>

        {/* Instructions */}
        <section className="pb-8">
          <div className="max-w-6xl mx-auto px-4 sm:px-6">
            <Card padding="md" className="bg-gradient-to-r from-primary-600/10 to-accent-600/10 border-primary-500/20">
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center flex-shrink-0">
                  <Sparkles className="w-6 h-6 text-white" aria-hidden="true" />
                </div>
                <div className="flex-1">
                  <h2 className="text-lg font-bold text-white mb-1">
                    Como jugar
                  </h2>
                  <p className="text-white/60 text-sm sm:text-base">
                    En cada enfrentamiento, pulsa sobre el jugador que crees que
                    conseguira mas puntos en la proxima jornada. Analiza sus
                    estadisticas, forma reciente y posicion antes de decidir.
                  </p>
                </div>
              </div>
            </Card>
          </div>
        </section>

        {/* Matchups Section - Quiniela style */}
        <section className="pb-32">
          <div className="max-w-5xl mx-auto px-2 sm:px-4 lg:px-6">
            <MatchupList matchups={matchups} onSelectPlayer={selectPlayer} />
          </div>
        </section>
      </main>

      <Footer />

      {/* Floating Status Bar */}
      <StatusBar
        selectedCount={selectedCount}
        totalCount={totalCount}
        deadline={deadline}
        roundName={roundName}
        isComplete={isComplete}
        isSubmitting={false}
        onSubmit={handleSubmitClick}
        onClearAll={clearAll}
        requiresAuth={!isAuthenticated}
      />

      {/* Submit Confirmation Modal */}
      <SubmitConfirmation
        isOpen={showConfirmation}
        onClose={closeConfirmation}
        onConfirm={confirmSubmit}
        matchups={matchups}
        roundName={roundName}
        isSubmitting={isSubmitting}
      />

      {/* Auth Modal for unauthenticated users */}
      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        initialMode="login"
      />
    </div>
  );
}

interface StatCardProps {
  icon: React.ReactNode;
  label: string;
  value: string;
  highlight?: boolean;
}

function StatCard({ icon, label, value, highlight }: StatCardProps) {
  return (
    <div className="glass-card rounded-xl p-3 sm:p-4">
      <div className="flex items-center gap-2 mb-2">
        <span className={highlight ? 'text-accent-400' : 'text-white/40'}>
          {icon}
        </span>
        <span className="text-xs sm:text-sm text-white/50">{label}</span>
      </div>
      <p
        className={`text-2xl sm:text-3xl font-bold ${
          highlight ? 'gradient-text' : 'text-white'
        }`}
      >
        {value}
      </p>
    </div>
  );
}
