import { Trophy, Menu, X, LogIn, LogOut, User, History, ChevronDown } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import { clsx } from 'clsx';
import { useAuth } from '../../contexts/AuthContext';
import { AuthModal } from '../auth';

interface HeaderProps {
  onNavigateToHistory?: () => void;
  onNavigateToRules?: () => void;
  onNavigateToScoring?: () => void;
  onNavigateToRanking?: () => void;
  currentPage?: 'play' | 'history' | 'rules' | 'scoring' | 'ranking';
}

/**
 * Application header with logo and navigation
 */
export function Header({ onNavigateToHistory, onNavigateToRules, onNavigateToScoring, onNavigateToRanking, currentPage = 'play' }: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'signup'>('login');
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [mobileUserMenuOpen, setMobileUserMenuOpen] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);

  const { user, isAuthenticated, logout } = useAuth();

  // Close user menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setUserMenuOpen(false);
      }
    };

    if (userMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [userMenuOpen]);

  const openLogin = () => {
    setAuthMode('login');
    setAuthModalOpen(true);
  };

  const openSignup = () => {
    setAuthMode('signup');
    setAuthModalOpen(true);
  };

  return (
    <>
      <header className="sticky top-0 z-50 bg-dark-950/80 backdrop-blur-xl border-b border-white/5">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <a
              href="/"
              className="flex items-center gap-3 group"
              aria-label="Quini Fantasy - Inicio"
            >
              <div className="relative">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-accent-500 to-primary-600 flex items-center justify-center shadow-lg shadow-primary-500/25 group-hover:shadow-primary-500/40 transition-shadow">
                  <Trophy className="w-5 h-5 text-white" aria-hidden="true" />
                </div>
                <div className="absolute -inset-1 bg-gradient-to-br from-accent-500 to-primary-600 rounded-xl opacity-0 group-hover:opacity-20 blur transition-opacity" />
              </div>
              <div className="flex flex-col">
                <span className="text-lg font-bold text-white leading-tight">
                  Quini <span className="gradient-text">Fantasy</span>
                </span>
                <span className="text-[10px] text-white/40 uppercase tracking-wider hidden sm:block">
                  La quiniela del fantasy
                </span>
              </div>
            </a>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-1" aria-label="Navegacion principal">
              <NavLink href="/" active={currentPage === 'play'}>Jugar</NavLink>
              {onNavigateToRanking && (
                <button
                  onClick={onNavigateToRanking}
                  className={clsx(
                    'px-4 py-2 rounded-lg text-sm font-medium transition-all',
                    currentPage === 'ranking'
                      ? 'text-white bg-white/10'
                      : 'text-white/60 hover:text-white hover:bg-white/5'
                  )}
                  aria-current={currentPage === 'ranking' ? 'page' : undefined}
                >
                  Ranking
                </button>
              )}
              {onNavigateToScoring && (
                <button
                  onClick={onNavigateToScoring}
                  className={clsx(
                    'px-4 py-2 rounded-lg text-sm font-medium transition-all',
                    currentPage === 'scoring'
                      ? 'text-white bg-white/10'
                      : 'text-white/60 hover:text-white hover:bg-white/5'
                  )}
                  aria-current={currentPage === 'scoring' ? 'page' : undefined}
                >
                  Puntuacion
                </button>
              )}
              {onNavigateToRules && (
                <button
                  onClick={onNavigateToRules}
                  className={clsx(
                    'px-4 py-2 rounded-lg text-sm font-medium transition-all',
                    currentPage === 'rules'
                      ? 'text-white bg-white/10'
                      : 'text-white/60 hover:text-white hover:bg-white/5'
                  )}
                  aria-current={currentPage === 'rules' ? 'page' : undefined}
                >
                  Reglas
                </button>
              )}
            </nav>

            {/* Auth buttons - Desktop */}
            <div className="hidden md:flex items-center gap-2">
              {isAuthenticated ? (
                <div className="relative" ref={userMenuRef}>
                  <button
                    onClick={() => setUserMenuOpen(!userMenuOpen)}
                    className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors"
                    aria-expanded={userMenuOpen}
                    aria-haspopup="true"
                  >
                    <User className="w-4 h-4 text-primary-400" />
                    <span className="text-sm font-medium text-white">{user?.username}</span>
                    <ChevronDown className={clsx(
                      "w-4 h-4 text-white/40 transition-transform",
                      userMenuOpen && "rotate-180"
                    )} />
                  </button>

                  {/* Dropdown menu */}
                  {userMenuOpen && (
                    <div className="absolute right-0 mt-2 w-56 rounded-xl bg-dark-900/95 backdrop-blur-xl border border-white/10 shadow-xl overflow-hidden">
                      {onNavigateToHistory && (
                        <button
                          onClick={() => {
                            onNavigateToHistory();
                            setUserMenuOpen(false);
                          }}
                          className="w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-white/5 transition-colors border-b border-white/5"
                        >
                          <History className="w-4 h-4 text-blue-400" />
                          <span className="text-sm text-white">Mi historial</span>
                        </button>
                      )}
                      <button
                        onClick={() => {
                          logout();
                          setUserMenuOpen(false);
                        }}
                        className="w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-white/5 transition-colors"
                      >
                        <LogOut className="w-4 h-4 text-red-400" />
                        <span className="text-sm text-white">Cerrar sesion</span>
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <>
                  <button
                    onClick={openLogin}
                    className="flex items-center gap-2 px-4 py-2 rounded-lg text-white/70 hover:text-white hover:bg-white/5 transition-colors"
                  >
                    <LogIn className="w-4 h-4" />
                    <span className="text-sm font-medium">Entrar</span>
                  </button>
                  <button
                    onClick={openSignup}
                    className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-primary-600 to-accent-600 text-white hover:from-primary-500 hover:to-accent-500 transition-colors shadow-lg shadow-primary-500/25"
                  >
                    <span className="text-sm font-medium">Registrarse</span>
                  </button>
                </>
              )}
            </div>

            {/* Mobile menu button */}
            <button
              type="button"
              className="md:hidden p-2 text-white/60 hover:text-white transition-colors"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-expanded={mobileMenuOpen}
              aria-controls="mobile-menu"
              aria-label={mobileMenuOpen ? 'Cerrar menu' : 'Abrir menu'}
            >
              {mobileMenuOpen ? (
                <X className="w-6 h-6" aria-hidden="true" />
              ) : (
                <Menu className="w-6 h-6" aria-hidden="true" />
              )}
            </button>
          </div>

          {/* Mobile Navigation */}
          <nav
            id="mobile-menu"
            className={clsx(
              'md:hidden overflow-hidden transition-all duration-300',
              mobileMenuOpen ? 'max-h-[32rem] pb-4' : 'max-h-0'
            )}
            aria-label="Navegacion movil"
          >
            <div className="flex flex-col gap-1 pt-2">
              <MobileNavLink href="/" active={currentPage === 'play'} onClick={() => setMobileMenuOpen(false)}>
                Jugar
              </MobileNavLink>
              {onNavigateToRanking && (
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    onNavigateToRanking();
                  }}
                  className={clsx(
                    'px-4 py-3 rounded-lg text-base font-medium transition-all text-left',
                    currentPage === 'ranking'
                      ? 'text-white bg-white/10'
                      : 'text-white/60 hover:text-white hover:bg-white/5'
                  )}
                  aria-current={currentPage === 'ranking' ? 'page' : undefined}
                >
                  Ranking
                </button>
              )}
              {onNavigateToScoring && (
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    onNavigateToScoring();
                  }}
                  className={clsx(
                    'px-4 py-3 rounded-lg text-base font-medium transition-all text-left',
                    currentPage === 'scoring'
                      ? 'text-white bg-white/10'
                      : 'text-white/60 hover:text-white hover:bg-white/5'
                  )}
                  aria-current={currentPage === 'scoring' ? 'page' : undefined}
                >
                  Puntuacion
                </button>
              )}
              {onNavigateToRules && (
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    onNavigateToRules();
                  }}
                  className={clsx(
                    'px-4 py-3 rounded-lg text-base font-medium transition-all text-left',
                    currentPage === 'rules'
                      ? 'text-white bg-white/10'
                      : 'text-white/60 hover:text-white hover:bg-white/5'
                  )}
                  aria-current={currentPage === 'rules' ? 'page' : undefined}
                >
                  Reglas
                </button>
              )}

              {/* Auth buttons - Mobile */}
              <div className="border-t border-white/10 mt-2 pt-3">
                {isAuthenticated ? (
                  <>
                    <button
                      onClick={() => setMobileUserMenuOpen(!mobileUserMenuOpen)}
                      className="flex items-center justify-between w-full px-4 py-3 rounded-lg bg-white/5 hover:bg-white/10 transition-colors"
                    >
                      <div className="flex items-center gap-2">
                        <User className="w-4 h-4 text-primary-400" />
                        <span className="text-sm font-medium text-white">{user?.username}</span>
                      </div>
                      <ChevronDown className={clsx(
                        "w-4 h-4 text-white/40 transition-transform",
                        mobileUserMenuOpen && "rotate-180"
                      )} />
                    </button>

                    {/* Mobile user submenu */}
                    {mobileUserMenuOpen && (
                      <div className="mt-1 ml-4 space-y-1">
                        {onNavigateToHistory && (
                          <button
                            onClick={() => {
                              setMobileMenuOpen(false);
                              setMobileUserMenuOpen(false);
                              onNavigateToHistory();
                            }}
                            className="flex items-center gap-3 w-full px-4 py-3 rounded-lg hover:bg-white/5 transition-colors"
                          >
                            <History className="w-4 h-4 text-blue-400" />
                            <span className="text-sm text-white">Mi historial</span>
                          </button>
                        )}
                        <button
                          onClick={() => {
                            logout();
                            setMobileMenuOpen(false);
                            setMobileUserMenuOpen(false);
                          }}
                          className="flex items-center gap-3 w-full px-4 py-3 rounded-lg hover:bg-white/5 transition-colors"
                        >
                          <LogOut className="w-4 h-4 text-red-400" />
                          <span className="text-sm text-white">Cerrar sesion</span>
                        </button>
                      </div>
                    )}
                  </>
                ) : (
                  <>
                    <button
                      onClick={() => {
                        setMobileMenuOpen(false);
                        openLogin();
                      }}
                      className="flex items-center gap-2 w-full px-4 py-3 rounded-lg text-white/60 hover:text-white hover:bg-white/5 transition-colors"
                    >
                      <LogIn className="w-4 h-4" />
                      <span className="text-base font-medium">Iniciar sesion</span>
                    </button>
                    <button
                      onClick={() => {
                        setMobileMenuOpen(false);
                        openSignup();
                      }}
                      className="flex items-center gap-2 w-full px-4 py-3 mt-1 rounded-lg bg-gradient-to-r from-primary-600 to-accent-600 text-white"
                    >
                      <span className="text-base font-medium">Crear cuenta</span>
                    </button>
                  </>
                )}
              </div>
            </div>
          </nav>
        </div>
      </header>

      {/* Auth Modal */}
      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        initialMode={authMode}
      />
    </>
  );
}

interface NavLinkProps {
  href: string;
  active?: boolean;
  children: React.ReactNode;
}

function NavLink({ href, active, children }: NavLinkProps) {
  return (
    <a
      href={href}
      className={clsx(
        'px-4 py-2 rounded-lg text-sm font-medium transition-all',
        active
          ? 'text-white bg-white/10'
          : 'text-white/60 hover:text-white hover:bg-white/5'
      )}
      aria-current={active ? 'page' : undefined}
    >
      {children}
    </a>
  );
}

interface MobileNavLinkProps extends NavLinkProps {
  onClick?: () => void;
}

function MobileNavLink({ href, active, children, onClick }: MobileNavLinkProps) {
  return (
    <a
      href={href}
      onClick={onClick}
      className={clsx(
        'px-4 py-3 rounded-lg text-base font-medium transition-all',
        active
          ? 'text-white bg-white/10'
          : 'text-white/60 hover:text-white hover:bg-white/5'
      )}
      aria-current={active ? 'page' : undefined}
    >
      {children}
    </a>
  );
}
