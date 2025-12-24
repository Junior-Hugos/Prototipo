"use client";
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';

export default function Header() {
  const { session, logout, isLoading } = useAuth();

  // Define se o link do logo/início vai para o dashboard ou para a home
  const homeLink = session ? "/dashboard" : "/";

  return (
    <header className="bg-white text-text-primary shadow-sm">
      <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
        
        {/* Logo com link dinâmico */}
        <Link href={homeLink} className="text-xl font-bold text-primary">
          Collectiico
        </Link>

        <nav className="flex gap-4 items-center">
          {/* Botão Início com link dinâmico */}
          <Link href={homeLink} className="hover:text-primary transition-colors">
            Início
          </Link>

          {isLoading ? (
            <div className="text-sm">Carregando...</div>
          ) : session ? (
            <>
              {/* O nome do usuário */}
              <span className="text-sm hidden md:block">
                Olá, {session.nome?.split(' ')[0] || 'Usuário'}
              </span>
              
            
              <button 
                onClick={logout} 
                className="bg-primary text-white px-4 py-2 rounded-xl text-sm font-medium hover:bg-primary-dark transition-colors"
              >
                Sair
              </button>
            </>
          ) : (
            <>
              <Link href="/cadastro" className="hover:text-primary transition-colors">Cadastro</Link>
              {/* Botão Entrar original para comparação */}
              <Link href="/login" className="bg-primary text-white px-4 py-2 rounded-xl text-sm font-medium hover:bg-primary-dark transition-colors">Entrar</Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}