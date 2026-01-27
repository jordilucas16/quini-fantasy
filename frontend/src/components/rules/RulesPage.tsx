/**
 * Rules/FAQ page with expandable cards
 */

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  HelpCircle,
  ChevronDown,
  Gamepad2,
  UserPlus,
  PencilOff,
  ArrowLeft,
  Trophy,
  Target,
  CheckCircle2,
} from 'lucide-react';
import { clsx } from 'clsx';
import { Header, Footer, AnimatedBackground } from '../layout';
import { AuthModal } from '../auth';

interface RulesPageProps {
  onBack: () => void;
  onNavigateToRules?: () => void;
  onNavigateToScoring?: () => void;
  currentPage?: 'play' | 'history' | 'rules' | 'scoring';
}

export function RulesPage({ onBack, onNavigateToRules, onNavigateToScoring, currentPage = 'rules' }: RulesPageProps) {
  const [authModalOpen, setAuthModalOpen] = useState(false);

  const openSignup = () => {
    setAuthModalOpen(true);
  };
  return (
    <div className="min-h-screen flex flex-col">
      <AnimatedBackground />
      <Header currentPage={currentPage} onNavigateToRules={onNavigateToRules} onNavigateToScoring={onNavigateToScoring} />

      <main className="flex-1 py-8">
        <div className="max-w-3xl mx-auto px-4 sm:px-6">
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
              <HelpCircle className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold text-white mb-3">
              Reglas del <span className="gradient-text">Juego</span>
            </h1>
            <p className="text-white/50 max-w-md mx-auto">
              Todo lo que necesitas saber para jugar a Quini Fantasy
            </p>
          </div>

          {/* FAQ Cards */}
          <div className="space-y-4">
            <FAQCard
              icon={<Gamepad2 className="w-6 h-6" />}
              question="Como se juega?"
              defaultOpen
            >
              <div className="space-y-4">
                <p>
                  Jugar a Quini Fantasy es muy facil. Solo tienes que seguir estos pasos:
                </p>

                <div className="space-y-3">
                  <Step number={1}>
                    <strong>Mira los enfrentamientos:</strong> Cada jornada veras 11 duelos entre dos jugadores de futbol.
                  </Step>

                  <Step number={2}>
                    <strong>Elige tu favorito:</strong> En cada duelo, pulsa sobre el jugador que crees que conseguira mas puntos en la proxima jornada.
                  </Step>

                  <Step number={3}>
                    <strong>Completa los 11:</strong> Tienes que elegir un ganador en cada uno de los 11 enfrentamientos.
                  </Step>

                  <Step number={4}>
                    <strong>Envia tu quiniela:</strong> Cuando hayas elegido todos, pulsa el boton de enviar.
                  </Step>

                  <Step number={5}>
                    <strong>Espera los resultados:</strong> Despues de que se jueguen los partidos, veras cuantos has acertado.
                  </Step>
                </div>

                <div className="flex items-start gap-3 p-4 rounded-xl bg-primary-500/10 border border-primary-500/20">
                  <Trophy className="w-5 h-5 text-primary-400 flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-white/70">
                    <strong className="text-white">Consejo:</strong> Fijate en las estadisticas de cada jugador (media de puntos, forma reciente) para tomar mejores decisiones.
                  </p>
                </div>
              </div>
            </FAQCard>

            <FAQCard
              icon={<UserPlus className="w-6 h-6" />}
              question="Es necesario registrarse para jugar?"
            >
              <div className="space-y-4">
                <p>
                  <strong className="text-white">No es obligatorio</strong>, pero te lo recomendamos mucho.
                </p>

                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
                    <h4 className="font-bold text-emerald-400 mb-2 flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4" />
                      Con cuenta
                    </h4>
                    <ul className="space-y-1.5 text-sm text-white/70">
                      <li>• Apareces en el ranking</li>
                      <li>• Guardamos tu historial</li>
                      <li>• Compites con tus amigos</li>
                      <li>• Ves tus estadisticas</li>
                    </ul>
                  </div>

                  <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                    <h4 className="font-bold text-white/60 mb-2">Sin cuenta</h4>
                    <ul className="space-y-1.5 text-sm text-white/50">
                      <li>• Puedes ver los enfrentamientos</li>
                      <li>• No puedes enviar predicciones</li>
                      <li>• No apareces en el ranking</li>
                      <li>• No guardamos nada</li>
                    </ul>
                  </div>
                </div>

                <p className="text-sm text-white/50">
                  Registrarse es gratis y solo tarda 30 segundos. Usa el boton de{' '}
                  <button
                    onClick={openSignup}
                    className="font-bold text-primary-400 hover:text-primary-300 transition-colors underline decoration-primary-400/30 hover:decoration-primary-300"
                  >
                    Registrarse
                  </button>
                  {' '}en la parte superior.
                </p>
              </div>
            </FAQCard>

            <FAQCard
              icon={<PencilOff className="w-6 h-6" />}
              question="Puedo modificar mis predicciones una vez enviadas?"
            >
              <div className="space-y-4">
                <div className="flex items-center gap-3 p-4 rounded-xl bg-red-500/10 border border-red-500/20">
                  <PencilOff className="w-6 h-6 text-red-400 flex-shrink-0" />
                  <p className="text-white">
                    <strong>No</strong>, una vez enviadas las predicciones no se pueden cambiar.
                  </p>
                </div>

                <p className="text-white/70">
                  Esto es asi para que todos juguemos con las mismas reglas. Por eso te recomendamos:
                </p>

                <ul className="space-y-2 text-white/70">
                  <li className="flex items-start gap-2">
                    <Target className="w-4 h-4 text-accent-400 flex-shrink-0 mt-1" />
                    <span>Piensa bien cada eleccion antes de enviar</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Target className="w-4 h-4 text-accent-400 flex-shrink-0 mt-1" />
                    <span>Revisa tu quiniela en la pantalla de confirmacion</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Target className="w-4 h-4 text-accent-400 flex-shrink-0 mt-1" />
                    <span>Envia antes de que cierre el plazo (se muestra en pantalla)</span>
                  </li>
                </ul>
              </div>
            </FAQCard>
          </div>

          {/* CTA */}
          <div className="mt-10 text-center">
            <button
              onClick={onBack}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-primary-600 to-accent-600 text-white font-semibold hover:from-primary-500 hover:to-accent-500 transition-colors shadow-lg shadow-primary-500/25"
            >
              <Gamepad2 className="w-5 h-5" />
              Empezar a jugar
            </button>
          </div>
        </div>
      </main>

      <Footer />

      {/* Auth Modal */}
      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        initialMode="signup"
      />
    </div>
  );
}

interface FAQCardProps {
  icon: React.ReactNode;
  question: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}

function FAQCard({ icon, question, children, defaultOpen = false }: FAQCardProps) {
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
        <span className="flex-1 text-lg font-semibold text-white">{question}</span>
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
            <div className="px-5 pb-5 text-white/70 leading-relaxed">
              {children}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

interface StepProps {
  number: number;
  children: React.ReactNode;
}

function Step({ number, children }: StepProps) {
  return (
    <div className="flex items-start gap-3">
      <div className="w-7 h-7 rounded-full bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center flex-shrink-0 text-sm font-bold text-white">
        {number}
      </div>
      <p className="text-white/70 pt-0.5">{children}</p>
    </div>
  );
}
