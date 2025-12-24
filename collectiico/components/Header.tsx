"use client";
import { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';

// Ícones simples (SVG) para o menu mobile
const MenuIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="4" y1="12" x2="20" y2="12"/><line x1="4" y1="6" x2="20" y2="6"/><line x1="4" y1="18" x2="20" y2="18"/></svg>
);
const CloseIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
);

export default function Header() {
  const { session, logout, isLoading } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Define se o link do logo/início vai para o dashboard ou para a home
  const homeLink = session ? "/dashboard" : "/";

  // Função para fechar o menu ao clicar em um link
  const closeMenu = () => setIsMenuOpen(false);

  return (
    <header className="bg-white text-text-primary shadow-sm sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
        
        {/* Logo com link dinâmico */}
        <Link href={homeLink} className="text-xl font-bold text-primary z-50" onClick={closeMenu}>
          Collectiico
        </Link>

        {/* --- MENU DESKTOP (Visível apenas em telas médias 'md' ou maiores) --- */}
        <nav className="hidden md:flex gap-4 items-center">
          <Link href={homeLink} className="hover:text-primary transition-colors">
            Início
          </Link>

          {isLoading ? (
            <div className="text-sm text-gray-400">Carregando...</div>
          ) : session ? (
            <>
              <span className="text-sm font-medium">
                Olá, {session.nome?.split(' ')[0] || 'Usuário'}
              </span>
              
              <button 
                onClick={logout} 
                className="bg-primary text-white px-4 py-2 rounded-xl text-sm font-medium hover:bg-green-700 transition-colors"
              >
                Sair
              </button>
            </>
          ) : (
            <>
              <Link href="/cadastro" className="hover:text-primary transition-colors">Cadastro</Link>
              <Link href="/login" className="bg-primary text-white px-4 py-2 rounded-xl text-sm font-medium hover:bg-green-700 transition-colors">
                Entrar
              </Link>
            </>
          )}
        </nav>

        {/* --- BOTÃO MOBILE (Hambúrguer) --- */}
        <button 
            className="md:hidden text-text-primary p-1 focus:outline-none"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
            {isMenuOpen ? <CloseIcon /> : <MenuIcon />}
        </button>
      </div>

      {/* --- MENU MOBILE --- */}
      {isMenuOpen && (
        <div className="md:hidden absolute top-16 left-0 w-full bg-white border-b border-gray-100 shadow-xl animate-in slide-in-from-top-2 z-40">
            <nav className="flex flex-col p-6 gap-4 text-center">
                <Link 
                    href={homeLink} 
                    onClick={closeMenu}
                    className="text-lg font-medium hover:text-primary py-2 border-b border-gray-50"
                >
                    Início
                </Link>

                {isLoading ? (
                    <div className="text-sm py-2">Carregando...</div>
                ) : session ? (
                    <>
                        <div className="py-2 text-primary font-bold">
                            Olá, {session.nome?.split(' ')[0]}
                        </div>
                        <button 
                            onClick={() => { logout(); closeMenu(); }}
                            className="bg-primary text-white px-4 py-3 rounded-xl text-sm font-bold hover:bg-green-700 w-full"
                        >
                            Sair
                        </button>
                    </>
                ) : (
                    <div className="flex flex-col gap-3 pt-2">
                        <Link 
                            href="/cadastro" 
                            onClick={closeMenu}
                            className="hover:text-primary py-2 font-medium"
                        >
                            Cadastro
                        </Link>
                        <Link 
                            href="/login" 
                            onClick={closeMenu}
                            className="bg-primary text-white px-4 py-3 rounded-xl text-sm font-bold hover:bg-green-700 w-full"
                        >
                            Entrar
                        </Link>
                    </div>
                )}
            </nav>
        </div>
      )}
    </header>
  );
}