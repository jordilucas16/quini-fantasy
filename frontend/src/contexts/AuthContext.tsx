/**
 * Authentication context for managing user state
 */

import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import type { ReactNode } from 'react';
import { api } from '../services/api';
import type { User } from '../services/api';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, username: string, password: string) => Promise<void>;
  logout: () => void;
  error: string | null;
  clearError: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Check auth status on mount
  useEffect(() => {
    let isMounted = true;

    const checkAuth = async () => {
      const token = api.getToken();
      if (!token) {
        if (isMounted) setIsLoading(false);
        return;
      }

      try {
        const status = await api.getAuthStatus();
        if (isMounted) {
          if (status.authenticated && status.user) {
            setUser(status.user);
          } else {
            api.logout();
          }
        }
      } catch {
        if (isMounted) api.logout();
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };

    checkAuth();

    return () => {
      isMounted = false;
    };
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    setError(null);
    try {
      const data = await api.login(email, password);
      setUser(data.user);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Error al iniciar sesion';
      setError(message);
      throw err;
    }
  }, []);

  const signup = useCallback(async (email: string, username: string, password: string) => {
    setError(null);
    try {
      const data = await api.signup(email, username, password);
      setUser(data.user);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Error al crear cuenta';
      setError(message);
      throw err;
    }
  }, []);

  const logout = useCallback(() => {
    api.logout();
    setUser(null);
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated: !!user,
        login,
        signup,
        logout,
        error,
        clearError,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
