"use client";

import React, {
  createContext,
  useContext,
  ReactNode,
  useState,
  useEffect,
} from "react";
// Importa os tipos do Prisma 
import { Usuario, Doador, Voluntario, Empresa } from "@prisma/client";
import { useRouter } from "next/navigation";

// Definição do tipo da sessão 
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

// --- COMPONENTE PROVIDER ---
export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<UserSession | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  // Verifica sessão ao carregar
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

  // Função de Login
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

      if (!res.ok) {        
        throw new Error(data.message || "Email ou senha incorretos");
      }

      setSession(data);
      console.log("Login efetuado:", data.nome);
      
    } catch (error) {
      throw error; 
    } finally {
      setIsLoading(false); 
    }
  };

  // Função de Logout
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