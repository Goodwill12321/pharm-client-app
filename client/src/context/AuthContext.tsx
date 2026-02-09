import React, { createContext, useContext, useState, useEffect } from 'react';

interface AuthContextType {
  token: string | null;
  isAuthenticated: boolean;
  currentUserName: string | null;
  login: (login: string, password: string) => Promise<void>;
  logout: () => void;
  loading: boolean;
  error: string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentUserName, setCurrentUserName] = useState<string | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem('jwt');
    if (stored) setToken(stored);

    // Подписка на глобальное событие logout
    const handler = () => logout();
    window.addEventListener('logout', handler);
    return () => window.removeEventListener('logout', handler);
  }, []);

  useEffect(() => {
    const fetchMe = async () => {
      if (!token) {
        setCurrentUserName(null);
        return;
      }
      try {
        const { apiFetch } = await import('../api');
        const res = await apiFetch('/auth/me');
        if (res.ok) {
          const data = await res.json();
          setCurrentUserName(data.name ?? data.login ?? null);
        } else {
          setCurrentUserName(null);
        }
      } catch {
        setCurrentUserName(null);
      }
    };
    fetchMe();
  }, [token]);

  const login = async (login: string, password: string) => {
    setLoading(true);
    setError(null);
    try {
      const { apiFetch } = await import('../api');
      const res = await apiFetch('/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ login, password })
      });
      if (!res.ok) {
        if (res.status === 401) {
          throw new Error('Неверный логин или пароль');
        } else {
          let errorMsg = `Ошибка авторизации (код ${res.status})`;
          try {
            const errData = await res.json();
            errorMsg += ': ' + (errData.message || errData.error || JSON.stringify(errData));
          } catch (e) {
            try {
              const text = await res.text();
              if (text) errorMsg += ': ' + text;
            } catch {}
          }
          throw new Error(errorMsg);
        }
      }
      const data = await res.json();
      localStorage.setItem('jwt', data.token);
      setToken(data.token);
    } catch (e: any) {
      setError(e.message || 'Ошибка авторизации');
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('jwt');
    setToken(null);
    setCurrentUserName(null);
  };

  return (
    <AuthContext.Provider value={{ token, isAuthenticated: !!token, currentUserName, login, logout, loading, error }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};
