// app/dashboard/layout.tsx
"use client"; // Necessário para usar hooks

import Link from 'next/link';
import { useAuth } from '@/context/AuthContext'; // Importe seu hook de autenticação
import { useRouter, usePathname } from 'next/navigation'; // Importe hooks de navegação
// Importe ícones se desejar (ex: lucide-react)
// import { LayoutGrid, FileText, Megaphone, Settings, LogOut, PlusCircle } from 'lucide-react';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, logout } = useAuth(); // Pega o usuário e a função de logout
  const router = useRouter();
  const pathname = usePathname(); // Hook para saber a rota ativa

  const handleLogout = async () => {
    try {
      await logout();
      router.push('/'); // Redireciona para a página inicial APÓS o logout
    } catch (error) {
      console.error("Erro ao fazer logout:", error);
    }
  };

  // Função auxiliar para aplicar estilos ao link ativo
  const getLinkClassName = (path: string) => {
    // Base classes for all links
    const baseClasses = "flex items-center px-4 py-2.5 text-sm font-medium rounded-lg transition-colors duration-150 group";
    // Classes for the active link
    const activeClasses = "bg-primary-light text-primary font-semibold";
    // Classes for inactive links
    const inactiveClasses = "text-text-secondary hover:bg-gray-100 hover:text-text-primary";

    // Check if the current path starts with the link path
    // Special case for exact match on '/dashboard' if you add a link for it
    if (path === '/dashboard' && pathname === path) {
         return `${baseClasses} ${activeClasses}`;
    }
    // For other links, check if the current path starts with the link's path
    if (path !== '/dashboard' && pathname.startsWith(path)) {
      return `${baseClasses} ${activeClasses}`;
    }
    // Otherwise, it's inactive
    return `${baseClasses} ${inactiveClasses}`;
  };


  return (
    // Usa a cor de fundo definida no globals.css/tailwind.config.ts
    <div className="flex h-screen bg-background">
      {/* Sidebar (Menu Lateral) - Estilo ajustado */}
      <aside className="w-64 bg-white p-4 pt-6 flex flex-col border-r border-border-light"> {/* Borda sutil */}
        <div className="mb-8 px-2">
          {/* Logo */}
          <Link href="/dashboard" className="text-2xl font-bold text-primary hover:opacity-80 transition-opacity">
            Collectiico
          </Link>
           {/* Saudação */}
           {user && (
             <p className="text-xs text-text-secondary mt-1">Olá, {user.nome?.split(' ')[0] || 'Usuário'}</p>
           )}
        </div>

        {/* Navegação Principal */}
        <nav className="flex-1 space-y-1.5">
          {/* Se quiser um link para a home do dashboard: */}
          {/*
          <Link href="/dashboard" className={getLinkClassName('/dashboard')}>
             <LayoutGrid className="mr-3 h-5 w-5 text-gray-400 group-hover:text-text-primary transition-colors" />
            <span>Visão Geral</span>
          </Link>
          */}
          <Link href="/dashboard/solicitar" className={getLinkClassName('/dashboard/solicitar')}>
            {/* <PlusCircle className="mr-3 h-5 w-5 text-gray-400 group-hover:text-text-primary transition-colors" /> */}
            <span>Solicitar Coleta</span>
          </Link>
          <Link href="/dashboard/coletas" className={getLinkClassName('/dashboard/coletas')}>
            {/* <FileText className="mr-3 h-5 w-5 text-gray-400 group-hover:text-text-primary transition-colors" /> */}
            <span>Ver Coletas</span>
          </Link>
          <Link href="/dashboard/campanhas" className={getLinkClassName('/dashboard/campanhas')}>
            {/* <Megaphone className="mr-3 h-5 w-5 text-gray-400 group-hover:text-text-primary transition-colors" /> */}
            <span>Campanhas</span>
          </Link>
           {/* Link de Configurações MOVIDO para cá */}
           <Link href="/dashboard/settings" className={getLinkClassName('/dashboard/settings')}>
            {/* <Settings className="mr-3 h-5 w-5 text-gray-400 group-hover:text-text-primary transition-colors" /> */}
            <span>Configurações</span>
          </Link>
        </nav>

        {/* Botão Sair - Estilizado */}
        <div className="mt-auto pb-2">
          <button
            onClick={handleLogout}
            className="bg-primary text-white px-4 py-2 rounded-xl text-sm font-medium hover:bg-primary-dark transition-colors"
          >
             {/* <LogOut className="mr-3 h-5 w-5 text-red-500 group-hover:text-red-600 transition-colors" /> */}
            <span>Sair</span>
          </button>
        </div>
      </aside>

      {/* Conteúdo Principal */}
      <main className="flex-1 p-6 md:p-8 lg:p-10 overflow-y-auto">
        {children} {/* Aqui entram as páginas como CampanhasPage, SettingsPage, etc. */}
      </main>
    </div>
  );
}

