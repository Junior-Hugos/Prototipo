"use client";

import React, {
  createContext,
  useContext,
  ReactNode,
  useState,
  useEffect,
  useRef,
} from "react";
import { Usuario, Doador, Voluntario, Empresa } from "@prisma/client";
import { useRouter } from "next/navigation";

type UserSession = Omit<Usuario, "senha"> & {
  doador?: Doador | null;
  voluntario?: Voluntario | null;
  empresa?: Empresa | null;
};

interface AuthContextType {
  session: UserSession | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<UserSession | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  
  // Referência para o cronômetro de inatividade
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  
  // Tempo de inatividade: 15 minutos 
  const INACTIVITY_TIME = 15 * 60 * 1000;

  // Função para limpar e reiniciar o cronômetro
  const resetTimer = () => {
    if (timerRef.current) clearTimeout(timerRef.current);
    
    if (session) {
      timerRef.current = setTimeout(() => {       
        logout(); 
      }, INACTIVITY_TIME);
    }
  };

  // Monitoramento de eventos de atividade
  useEffect(() => {
    const events = ["mousedown", "keydown", "scroll", "touchstart"];

    if (session) {
      events.forEach((event) => window.addEventListener(event, resetTimer));
      resetTimer(); 
    }

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
      events.forEach((event) => window.removeEventListener(event, resetTimer));
    };
  }, [session]);

  useEffect(() => {
    const checkSession = async () => {
      try {
        const res = await fetch("/api/auth/me");
        if (res.ok) {
          const user = await res.json();
          setSession(user);
        }
      } catch (error) {
        console.error("Nenhuma sessão ativa", error);
      } finally {
        setIsLoading(false);
      }
    };
    checkSession();
  }, []);

  const login = async (email: string, password: string) => {
    setIsLoading(true); 
    try {
      const emailLower = email.toLowerCase();
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: emailLower, password: password }), 
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Email ou senha incorretos");

      setSession(data);
    } catch (error) {
      throw error; 
    } finally {
      setIsLoading(false); 
    }
  };

  const logout = async () => {
    try {
        await fetch("/api/auth/logout", { method: "POST" });
    } catch (error) {
        console.error("Erro ao sair", error);
    }
    setSession(null);
    router.push("/"); 
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
    throw new Error("useAuth deve ser usado dentro de um AuthProvider");
  }
  return context;
}