import { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { User } from '../types';
import { api, setToken, clearToken, getToken, ApiError } from '../services/api';

interface BackendUser {
  id: number;
  nom: string;
  prenom: string;
  email: string;
  avatar?: string | null;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<{ ok: boolean; error?: string }>;
  register: (nom: string, prenom: string, email: string, password: string) => Promise<{ ok: boolean; error?: string }>;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

function toUser(bu: BackendUser): User {
  return {
    id: String(bu.id),
    name: `${bu.prenom} ${bu.nom}`,
    email: bu.email,
    avatar: bu.avatar || undefined,
    memberSince: new Date().toISOString(),
  };
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = getToken();
    if (!token) {
      setLoading(false);
      return;
    }
    api
      .get<BackendUser>('/users/me')
      .then((bu) => setUser(toUser(bu)))
      .catch(() => clearToken())
      .finally(() => setLoading(false));
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const data = await api.post<{ token: string; user: BackendUser }>(
        '/auth/login',
        { email, password },
        false
      );
      setToken(data.token);
      setUser(toUser(data.user));
      return { ok: true };
    } catch (err) {
      const message = err instanceof ApiError ? err.message : 'Erreur de connexion au serveur.';
      return { ok: false, error: message };
    }
  };

  const register = async (nom: string, prenom: string, email: string, password: string) => {
    try {
      const data = await api.post<{ token: string; user: BackendUser }>(
        '/auth/register',
        { nom, prenom, email, password },
        false
      );
      setToken(data.token);
      setUser(toUser(data.user));
      return { ok: true };
    } catch (err) {
      const message = err instanceof ApiError ? err.message : 'Erreur de connexion au serveur.';
      return { ok: false, error: message };
    }
  };

  const logout = () => {
    clearToken();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
