/**
 * Authentication modal with login and signup forms
 */

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Mail, Lock, User, Eye, EyeOff, AlertCircle } from 'lucide-react';
import { clsx } from 'clsx';
import { useAuth } from '../../contexts/AuthContext';
import { Button } from '../ui/Button';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialMode?: 'login' | 'signup';
}

export function AuthModal({ isOpen, onClose, initialMode = 'login' }: AuthModalProps) {
  const [mode, setMode] = useState<'login' | 'signup'>(initialMode);
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);
  const isMountedRef = useRef(true);

  const { login, signup, error: authError, clearError } = useAuth();

  // Track mounted state
  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  // Sync mode with initialMode when modal opens
  useEffect(() => {
    if (isOpen) {
      setMode(initialMode);
    }
  }, [isOpen, initialMode]);

  const error = localError || authError;

  const resetForm = () => {
    setEmail('');
    setUsername('');
    setPassword('');
    setLocalError(null);
    clearError();
  };

  const switchMode = () => {
    setMode(mode === 'login' ? 'signup' : 'login');
    resetForm();
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError(null);
    clearError();

    // Validation
    if (!email || !password) {
      setLocalError('Todos los campos son obligatorios');
      return;
    }

    if (mode === 'signup' && !username) {
      setLocalError('El nombre de usuario es obligatorio');
      return;
    }

    if (mode === 'signup' && username.length < 3) {
      setLocalError('El nombre de usuario debe tener al menos 3 caracteres');
      return;
    }

    if (password.length < 6) {
      setLocalError('La contrasena debe tener al menos 6 caracteres');
      return;
    }

    setIsSubmitting(true);

    try {
      if (mode === 'login') {
        await login(email, password);
      } else {
        await signup(email, username, password);
      }
      // Only close if successful and still mounted
      if (isMountedRef.current) {
        handleClose();
      }
    } catch (err) {
      // Show local error if not handled by context
      if (isMountedRef.current && err instanceof Error && !authError) {
        setLocalError(err.message);
      }
    } finally {
      if (isMountedRef.current) {
        setIsSubmitting(false);
      }
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
            className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className={clsx(
              'fixed z-50 left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2',
              'w-[calc(100%-2rem)] max-w-md',
              'bg-dark-900 border border-white/10 rounded-2xl shadow-2xl',
              'overflow-hidden'
            )}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-white/10">
              <h2 className="text-xl font-bold text-white">
                {mode === 'login' ? 'Iniciar Sesion' : 'Crear Cuenta'}
              </h2>
              <button
                onClick={handleClose}
                className="p-1.5 rounded-lg text-white/50 hover:text-white hover:bg-white/10 transition-colors"
                aria-label="Cerrar"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              {/* Error message */}
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-center gap-2 p-3 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400"
                >
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />
                  <span className="text-sm">{error}</span>
                </motion.div>
              )}

              {/* Email */}
              <div className="space-y-1.5">
                <label htmlFor="email" className="block text-sm font-medium text-white/70">
                  Email
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
                  <input
                    type="email"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className={clsx(
                      'w-full pl-10 pr-4 py-2.5 rounded-lg',
                      'bg-white/5 border border-white/10',
                      'text-white placeholder-white/40',
                      'focus:outline-none focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500',
                      'transition-colors'
                    )}
                    placeholder="tu@email.com"
                  />
                </div>
              </div>

              {/* Username (only for signup) */}
              {mode === 'signup' && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="space-y-1.5"
                >
                  <label htmlFor="username" className="block text-sm font-medium text-white/70">
                    Nombre de usuario
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
                    <input
                      type="text"
                      id="username"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      className={clsx(
                        'w-full pl-10 pr-4 py-2.5 rounded-lg',
                        'bg-white/5 border border-white/10',
                        'text-white placeholder-white/40',
                        'focus:outline-none focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500',
                        'transition-colors'
                      )}
                      placeholder="usuario123"
                    />
                  </div>
                </motion.div>
              )}

              {/* Password */}
              <div className="space-y-1.5">
                <label htmlFor="password" className="block text-sm font-medium text-white/70">
                  Contrasena
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    id="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className={clsx(
                      'w-full pl-10 pr-12 py-2.5 rounded-lg',
                      'bg-white/5 border border-white/10',
                      'text-white placeholder-white/40',
                      'focus:outline-none focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500',
                      'transition-colors'
                    )}
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-white/40 hover:text-white/70 transition-colors"
                  >
                    {showPassword ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>

              {/* Submit button */}
              <Button
                type="submit"
                variant="primary"
                size="lg"
                fullWidth
                isLoading={isSubmitting}
              >
                {mode === 'login' ? 'Entrar' : 'Crear Cuenta'}
              </Button>

              {/* Switch mode */}
              <p className="text-center text-sm text-white/50">
                {mode === 'login' ? (
                  <>
                    No tienes cuenta?{' '}
                    <button
                      type="button"
                      onClick={switchMode}
                      className="text-primary-400 hover:text-primary-300 font-medium transition-colors"
                    >
                      Registrate
                    </button>
                  </>
                ) : (
                  <>
                    Ya tienes cuenta?{' '}
                    <button
                      type="button"
                      onClick={switchMode}
                      className="text-primary-400 hover:text-primary-300 font-medium transition-colors"
                    >
                      Inicia sesion
                    </button>
                  </>
                )}
              </p>
            </form>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
