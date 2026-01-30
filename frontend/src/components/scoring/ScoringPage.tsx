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
  ChevronDown,
  Calculator,
  Info,
} from 'lucide-react';
import { clsx } from 'clsx';
import { Header, Footer, AnimatedBackground } from '../layout';

interface ScoringPageProps {
  onBack: () => void;
  onNavigateToRules?: () => void;
  onNavigateToScoring?: () => void;
  onNavigateToRanking?: () => void;
  currentPage?: 'play' | 'history' | 'rules' | 'scoring' | 'ranking';
}

/** A single row entry for the scoring table */
interface ScoringRow {
  stat: string;
  points: string;
  type: 'positive' | 'negative' | 'neutral';
}

export function ScoringPage({
  onBack,
  onNavigateToRules,
  onNavigateToScoring,
  onNavigateToRanking,
  currentPage = 'scoring',
}: ScoringPageProps) {
  const generalStats: ScoringRow[] = [
    { stat: 'Goles', points: '+3', type: 'positive' },
    { stat: 'Asistencias', points: '+1.5', type: 'positive' },
    { stat: 'Partidos jugados', points: '+0.2', type: 'positive' },
    { stat: 'Tarjeta amarilla', points: '-0.5', type: 'negative' },
    { stat: 'Tarjeta roja', points: '-2', type: 'negative' },
  ];

  const goalkeeperStats: ScoringRow[] = [
    { stat: 'Porteria a cero', points: '+3', type: 'positive' },
    { stat: 'Penalti parado', points: '+2.5', type: 'positive' },
    { stat: 'Parada', points: '+1', type: 'positive' },
    { stat: 'Gol en contra', points: '-1', type: 'negative' },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <AnimatedBackground />
      <Header
        currentPage={currentPage}
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
              title="Estadisticas Generales"
              subtitle="Aplicable a todos los jugadores"
              defaultOpen
            >
              <ScoringTable rows={generalStats} />
              <div className="flex items-start gap-3 mt-4 p-3 rounded-xl bg-white/[0.03] border border-white/[0.06]">
                <Info className="w-4 h-4 text-white/40 flex-shrink-0 mt-0.5" />
                <p className="text-xs text-white/40 leading-relaxed">
                  Los puntos por partidos jugados se acumulan automaticamente por cada jornada en la que el jugador participa.
                </p>
              </div>
            </ScoringCard>

            {/* Goalkeeper Stats */}
            <ScoringCard
              icon={<ShieldAlert className="w-6 h-6" />}
              title="Estadisticas de Portero"
              subtitle="Exclusivo para porteros (GK)"
            >
              <ScoringTable rows={goalkeeperStats} />
              <div className="flex items-start gap-3 mt-4 p-3 rounded-xl bg-white/[0.03] border border-white/[0.06]">
                <Info className="w-4 h-4 text-white/40 flex-shrink-0 mt-0.5" />
                <p className="text-xs text-white/40 leading-relaxed">
                  Estos puntos se suman a las estadisticas generales. Un portero tambien recibe puntos por goles, asistencias y tarjetas.
                </p>
              </div>
            </ScoringCard>

            {/* Media Calculation */}
            <ScoringCard
              icon={<Calculator className="w-6 h-6" />}
              title="Como se calcula la Media"
              subtitle="Formula y ejemplo practico"
            >
              <div className="space-y-5">
                <p className="text-white/70 leading-relaxed">
                  El campo <strong className="text-white">Media</strong> que ves en cada
                  jugador representa sus puntos promedio por jornada. Es el indicador
                  principal para comparar rendimiento entre jugadores.
                </p>

                <div className="p-4 rounded-xl bg-white/[0.03] border border-white/[0.06]">
                  <p className="text-xs uppercase tracking-wider text-white/40 mb-2">Formula</p>
                  <p className="font-mono text-white text-sm">
                    Media = Suma Total de Puntos / 21 jornadas
                  </p>
                </div>

                {/* Example */}
                <div>
                  <p className="text-xs uppercase tracking-wider text-white/40 mb-3">Ejemplo practico</p>
                  <div className="p-5 rounded-xl bg-white/[0.03] border border-white/[0.06]">
                    <p className="text-sm text-white/60 mb-4">
                      Delantero con las siguientes estadisticas acumuladas en la temporada:
                    </p>

                    {/* Stats summary in a compact grid */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-5">
                      <ExampleStat label="Goles" value="8" />
                      <ExampleStat label="Asistencias" value="3" />
                      <ExampleStat label="Amarillas" value="2" />
                      <ExampleStat label="Partidos" value="15" />
                    </div>

                    {/* Calculation breakdown */}
                    <div className="border-t border-white/[0.06] pt-4">
                      <table className="w-full text-sm" role="table" aria-label="Desglose del calculo">
                        <thead className="sr-only">
                          <tr>
                            <th>Concepto</th>
                            <th>Puntos</th>
                          </tr>
                        </thead>
                        <tbody>
                          <CalculationRow label="Goles" formula="8 x 3" value="+24" />
                          <CalculationRow label="Asistencias" formula="3 x 1.5" value="+4.5" />
                          <CalculationRow label="Amarillas" formula="2 x -0.5" value="-1" isNegative />
                          <CalculationRow label="Partidos" formula="15 x 0.2" value="+3" />
                        </tbody>
                        <tfoot>
                          <tr className="border-t border-white/10">
                            <td className="pt-3 text-white font-semibold">Total</td>
                            <td className="pt-3 text-right text-white font-semibold">30.5 pts</td>
                          </tr>
                          <tr>
                            <td className="pt-1 text-white font-semibold">Media (30.5 / 21)</td>
                            <td className="pt-1 text-right font-bold gradient-text">1.45 pts/jornada</td>
                          </tr>
                        </tfoot>
                      </table>
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

/* ─── Expandable Card Shell ───────────────────────────────────────────── */

interface ScoringCardProps {
  icon: React.ReactNode;
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}

function ScoringCard({ icon, title, subtitle, children, defaultOpen = false }: ScoringCardProps) {
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
        aria-expanded={isOpen}
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
        <div className="flex-1 min-w-0">
          <span className="block text-lg font-semibold text-white">{title}</span>
          {subtitle && (
            <span className="block text-sm text-white/40 mt-0.5">{subtitle}</span>
          )}
        </div>
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.2 }}
          className={clsx(
            'w-8 h-8 rounded-lg flex items-center justify-center transition-colors flex-shrink-0',
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

/* ─── Scoring Table ───────────────────────────────────────────────────── */

interface ScoringTableProps {
  rows: ScoringRow[];
}

function ScoringTable({ rows }: ScoringTableProps) {
  return (
    <div className="rounded-xl overflow-hidden border border-white/[0.06]">
      <table className="w-full text-sm" role="table" aria-label="Tabla de puntuacion">
        <thead>
          <tr className="bg-white/[0.04]">
            <th className="text-left py-2.5 px-4 text-xs uppercase tracking-wider text-white/40 font-medium">
              Estadistica
            </th>
            <th className="text-right py-2.5 px-4 text-xs uppercase tracking-wider text-white/40 font-medium">
              Puntos
            </th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row, index) => (
            <tr
              key={row.stat}
              className={clsx(
                'transition-colors hover:bg-white/[0.02]',
                index < rows.length - 1 && 'border-b border-white/[0.04]'
              )}
            >
              <td className="py-3 px-4 text-white/70">{row.stat}</td>
              <td className="py-3 px-4 text-right">
                <span
                  className={clsx(
                    'inline-flex items-center justify-center min-w-[4rem] px-2.5 py-1 rounded-md text-xs font-semibold',
                    row.type === 'positive' && 'bg-emerald-500/10 text-emerald-400',
                    row.type === 'negative' && 'bg-red-500/10 text-red-400',
                    row.type === 'neutral' && 'bg-white/5 text-white/60'
                  )}
                >
                  {row.points}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

/* ─── Example Calculation Helpers ─────────────────────────────────────── */

interface ExampleStatProps {
  label: string;
  value: string;
}

function ExampleStat({ label, value }: ExampleStatProps) {
  return (
    <div className="text-center p-2.5 rounded-lg bg-white/[0.03] border border-white/[0.04]">
      <p className="text-xs text-white/40 mb-1">{label}</p>
      <p className="text-lg font-semibold text-white">{value}</p>
    </div>
  );
}

interface CalculationRowProps {
  label: string;
  formula: string;
  value: string;
  isNegative?: boolean;
}

function CalculationRow({ label, formula, value, isNegative = false }: CalculationRowProps) {
  return (
    <tr>
      <td className="py-1.5 text-white/50">
        {label}{' '}
        <span className="text-white/30">({formula})</span>
      </td>
      <td
        className={clsx(
          'py-1.5 text-right font-mono',
          isNegative ? 'text-red-400/70' : 'text-emerald-400/70'
        )}
      >
        {value}
      </td>
    </tr>
  );
}
