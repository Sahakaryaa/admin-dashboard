// context/AuthContext.tsx — Authentication and Federation context
import React, { createContext, useContext, useState, useEffect } from 'react';
import type { AuthSession, Federation } from '../types';
import { api } from '../api/endpoints';
import { DEMO_FEDERATION } from '../data/mockData';

interface AuthContextType {
  session: AuthSession | null;
  currentFederation: Federation;
  federationsList: Federation[];
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (phone: string, pass: string) => Promise<void>;
  loginDemo: () => Promise<void>;
  logout: () => void;
  setCurrentFederation: (fed: Federation) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [session, setSession] = useState<AuthSession | null>(() => {
    const saved = localStorage.getItem('sahakarya_session');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return null;
      }
    }
    return null;
  });

  const [currentFederation, setCurrentFederation] = useState<Federation>(DEMO_FEDERATION);
  const [federationsList, setFederationsList] = useState<Federation[]>([DEMO_FEDERATION]);
  const [isLoading, setIsLoading] = useState(false);

  // Load available federations
  useEffect(() => {
    api.getFederations().then((feds) => {
      if (feds && feds.length) {
        setFederationsList(feds);
        setCurrentFederation(feds[0]);
      }
    });
  }, []);

  const login = async (phone: string, pass: string) => {
    setIsLoading(true);
    try {
      const data = await api.login(phone, pass);
      localStorage.setItem('sahakarya_token', data.access_token);
      localStorage.setItem('sahakarya_session', JSON.stringify(data));
      setSession(data);
    } finally {
      setIsLoading(false);
    }
  };

  const loginDemo = async () => {
    await login('9999900000', 'admin123');
  };

  const logout = () => {
    localStorage.removeItem('sahakarya_token');
    localStorage.removeItem('sahakarya_session');
    setSession(null);
  };

  return (
    <AuthContext.Provider
      value={{
        session,
        currentFederation,
        federationsList,
        isAuthenticated: !!session,
        isLoading,
        login,
        loginDemo,
        logout,
        setCurrentFederation,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
