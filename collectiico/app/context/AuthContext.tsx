"use client";

import React, { createContext, useContext, ReactNode, useState, useEffect } from 'react';
// Importa os tipos direto do Prisma
import { Usuario, Doador, Voluntario, Empresa } from '@prisma/client';
import { useRouter } from 'next/navigation';

// O novo tipo de sessão que inclui os perfis
type UserSession = Omit<Usuario, 'senha'> & {
  doador?: Doador | null;
  voluntario?: Voluntario | null;
  empresa?: Empresa | null;
};

interface AuthContextType {
  session: UserSession | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<UserSession | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  // Verifica a sessão no /api/auth/me
  useEffect(() => {
    const checkSession = async () => {
      try {
        const res = await fetch('/api/auth/me');
        if (res.ok) {
          const user = await res.json();
          setSession(user);
        }
      } catch (error) {
        console.error('Nenhuma sessão ativa', error);
      } finally {
        setIsLoading(false);
      }
    };
    checkSession();
  }, []);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      if (!res.ok) {
        alert('Falha no login: ' + (await res.json()).message);
        return false;
      }

      const user = await res.json();
      setSession(user);
      alert('Login efetuado: ' + user.nome);
      return true;

    } catch (error) {
      alert('Erro ao tentar fazer login');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    setSession(null);
    router.push('/');
  };

  return (
    <AuthContext.Provider value={{ session, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }
  return context;
}