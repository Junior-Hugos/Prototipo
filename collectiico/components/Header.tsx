"use client";
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';

export default function Header() {
  const { session, logout, isLoading } = useAuth();

  return (
    <header className="bg-white text-text-primary shadow-sm">
      <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
        <Link href="/" className="text-xl font-bold text-primary">Collectiico</Link>
        <nav className="flex gap-4 items-center">
          <Link href="/" className="hover:text-primary transition-colors">Início</Link>
          <Link href="/dashboard/solicitar" className="hover:text-primary transition-colors">Solicitar Coleta</Link>
          <Link href="/dashboard/rotas" className="hover:text-primary transition-colors">Ver Coletas</Link>
          <Link href="/dashboard/campanhas" className="bg-primary-light text-primary font-medium px-4 py-2 rounded-xl">Campanhas</Link>

          {isLoading ? (
            <div className="text-sm">Carregando...</div>
          ) : session ? (
            <>
              <span className="text-sm hidden md:block">Olá, {session.nome.split(' ')[0]}</span>
              <button onClick={logout} className="bg-gray-200 text-text-primary px-4 py-2 rounded-xl text-sm font-medium">Sair</button>
            </>
          ) : (
            <>
              <Link href="/cadastro" className="hover:text-primary transition-colors">Cadastro</Link>
              <Link href="/login" className="bg-primary text-white px-4 py-2 rounded-xl text-sm font-medium hover:bg-primary-dark transition-colors">Entrar</Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}