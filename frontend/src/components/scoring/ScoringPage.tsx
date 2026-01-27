/**
 * Scoring page explaining the scoring system with expandable cards
 */

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeft,
  Trophy,
  Target,
  ShieldAlert,
  AlertCircle,
  Check,
  X,
  Star,
  TrendingUp,
  ChevronDown,
  Calculator,
} from 'lucide-react';
import { clsx } from 'clsx';
import { Header, Footer, AnimatedBackground } from '../layout';

interface ScoringPageProps {
  onBack: () => void;
  onNavigateToRules?: () => void;
  onNavigateToScoring?: () => void;
  currentPage?: 'play' | 'history' | 'rules' | 'scoring';
}

export function ScoringPage({
  onBack,
  onNavigateToRules,
  onNavigateToScoring,
  currentPage = 'scoring',
}: ScoringPageProps) {
  return (
    <div className="min-h-screen flex flex-col">
      <AnimatedBackground />
      <Header
        currentPage={currentPage}
        onNavigateToRules={onNavigateToRules}
        onNavigateToScoring={onNavigateToScoring}
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
              <Trophy className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold text-white mb-3">
              Sistema de <span className="gradient-text">Puntuacion</span>
            </h1>
            <p className="text-white/50 max-w-2xl mx-auto">
              Descubre como calculamos los puntos de cada jugador por jornada
            </p>
          </div>

          {/* Scoring Cards */}
          <div className="space-y-4">
            {/* General Stats */}
            <ScoringCard
              icon={<Target className="w-6 h-6" />}
              title="Estadisticas Generales (Todos los jugadores)"
              defaultOpen
            >
              <div className="grid sm:grid-cols-2 gap-4">
                <StatItem
                  icon={<Target className="w-5 h-5" />}
                  label="Goles"
                  value="+3 puntos"
                  color="emerald"
                />
                <StatItem
                  icon={<TrendingUp className="w-5 h-5" />}
                  label="Asistencias"
                  value="+1.5 puntos"
                  color="blue"
                />
                <StatItem
                  icon={<AlertCircle className="w-5 h-5" />}
                  label="Tarjeta Amarilla"
                  value="-0.5 puntos"
                  color="yellow"
                />
                <StatItem
                  icon={<X className="w-5 h-5" />}
                  label="Tarjeta Roja"
                  value="-2 puntos"
                  color="red"
                />
                <StatItem
                  icon={<Star className="w-5 h-5" />}
                  label="Partidos Jugados"
                  value="+0.2 por partido"
                  color="purple"
                  className="sm:col-span-2"
                />
              </div>
            </ScoringCard>

            {/* Goalkeeper Stats */}
            <ScoringCard
              icon={<ShieldAlert className="w-6 h-6" />}
              title="Estadisticas de Portero (Solo GK)"
            >
              <div className="grid sm:grid-cols-2 gap-4">
                <StatItem
                  icon={<X className="w-5 h-5" />}
                  label="Gol en Contra"
                  value="-1 punto"
                  color="red"
                />
                <StatItem
                  icon={<Check className="w-5 h-5" />}
                  label="Parada"
                  value="+1 punto"
                  color="blue"
                />
                <StatItem
                  icon={<Trophy className="w-5 h-5" />}
                  label="Porteria a Cero"
                  value="+3 puntos"
                  color="emerald"
                />
                <StatItem
                  icon={<Star className="w-5 h-5" />}
                  label="Penalti Parado"
                  value="+2.5 puntos"
                  color="purple"
                />
              </div>
            </ScoringCard>

            {/* Media Calculation */}
            <ScoringCard
              icon={<Calculator className="w-6 h-6" />}
              title="Como se calcula la Media"
            >
              <div className="space-y-4">
                <p className="text-white/70">
                  El campo <strong className="text-white">Media</strong> que ves en cada
                  jugador representa sus puntos promedio por jornada.
                </p>

                <div className="p-4 rounded-xl bg-primary-500/10 border border-primary-500/20">
                  <p className="text-sm font-mono text-white">
                    Media = Suma Total de Puntos / 21 jornadas
                  </p>
                </div>

                <p className="text-sm text-white/60">
                  Este valor te ayuda a comparar jugadores y tomar mejores decisiones
                  en tus predicciones.
                </p>

                {/* Example */}
                <div className="mt-6 p-6 rounded-xl bg-gradient-to-br from-accent-500/10 to-primary-500/10 border border-accent-500/20">
                  <h4 className="text-lg font-bold text-white mb-4">Ejemplo de Calculo</h4>

                  <div className="space-y-4 text-white/70">
                    <p className="text-sm">
                      Imaginemos un delantero con estas estadisticas:
                    </p>

                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div>
                        <span className="text-white/50">Goles:</span>{' '}
                        <span className="text-white font-semibold">8</span>
                      </div>
                      <div>
                        <span className="text-white/50">Asistencias:</span>{' '}
                        <span className="text-white font-semibold">3</span>
                      </div>
                      <div>
                        <span className="text-white/50">Tarjetas amarillas:</span>{' '}
                        <span className="text-white font-semibold">2</span>
                      </div>
                      <div>
                        <span className="text-white/50">Partidos jugados:</span>{' '}
                        <span className="text-white font-semibold">15</span>
                      </div>
                    </div>

                    <div className="p-4 rounded-xl bg-white/5 space-y-2 font-mono text-sm">
                      <div className="flex justify-between">
                        <span>Goles (8 × 3):</span>
                        <span className="text-emerald-400">+24 pts</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Asistencias (3 × 1.5):</span>
                        <span className="text-blue-400">+4.5 pts</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Amarillas (2 × -0.5):</span>
                        <span className="text-yellow-400">-1 pt</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Partidos (15 × 0.2):</span>
                        <span className="text-purple-400">+3 pts</span>
                      </div>
                      <div className="border-t border-white/10 pt-2 flex justify-between font-bold">
                        <span className="text-white">Total:</span>
                        <span className="text-accent-400">30.5 pts</span>
                      </div>
                      <div className="flex justify-between font-bold">
                        <span className="text-white">Media (30.5 / 21):</span>
                        <span className="gradient-text text-lg">1.45 pts/jornada</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </ScoringCard>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

interface ScoringCardProps {
  icon: React.ReactNode;
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}

function ScoringCard({ icon, title, children, defaultOpen = false }: ScoringCardProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={clsx(
        'rounded-2xl border overflow-hidden transition-colors',
        isOpen
          ? 'bg-white/5 border-primary-500/30'
          : 'bg-white/[0.02] border-white/10 hover:border-white/20'
      )}
    >
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center gap-4 p-5 text-left"
      >
        <div
          className={clsx(
            'w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 transition-colors',
            isOpen
              ? 'bg-gradient-to-br from-primary-500 to-accent-500 text-white'
              : 'bg-white/10 text-white/60'
          )}
        >
          {icon}
        </div>
        <span className="flex-1 text-lg font-semibold text-white">{title}</span>
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.2 }}
          className={clsx(
            'w-8 h-8 rounded-lg flex items-center justify-center transition-colors',
            isOpen ? 'bg-primary-500/20 text-primary-400' : 'bg-white/5 text-white/40'
          )}
        >
          <ChevronDown className="w-5 h-5" />
        </motion.div>
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <div className="px-5 pb-5">
              {children}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

interface StatItemProps {
  icon: React.ReactNode;
  label: string;
  value: string;
  color: 'emerald' | 'blue' | 'yellow' | 'red' | 'purple';
  className?: string;
}

function StatItem({ icon, label, value, color, className }: StatItemProps) {
  const colorClasses = {
    emerald: 'from-emerald-500/20 to-emerald-600/20 border-emerald-500/30 text-emerald-400',
    blue: 'from-blue-500/20 to-blue-600/20 border-blue-500/30 text-blue-400',
    yellow: 'from-yellow-500/20 to-yellow-600/20 border-yellow-500/30 text-yellow-400',
    red: 'from-red-500/20 to-red-600/20 border-red-500/30 text-red-400',
    purple: 'from-purple-500/20 to-purple-600/20 border-purple-500/30 text-purple-400',
  };

  return (
    <div
      className={`p-4 rounded-xl bg-gradient-to-br border ${colorClasses[color]} ${className || ''}`}
    >
      <div className="flex items-center gap-3">
        <div className="flex-shrink-0">{icon}</div>
        <div className="flex-1">
          <div className="text-white/60 text-sm">{label}</div>
          <div className="text-white font-bold text-lg">{value}</div>
        </div>
      </div>
    </div>
  );
}
