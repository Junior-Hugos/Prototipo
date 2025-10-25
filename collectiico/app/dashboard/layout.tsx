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
  const auth = useAuth(); // Pega o contexto de autenticação
  const { logout } = auth;
  const user = (auth as any).user; // 'user' pode não estar declarado no tipo do contexto, usar any para compatibilidade
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
    const baseClasses = "flex items-center px-4 py-2.5 text-sm font-medium rounded-lg transition-colors duration-150";
    const activeClasses = "bg-primary-light text-primary"; // Estilo ativo
    const inactiveClasses = "text-text-secondary hover:bg-gray-100 hover:text-text-primary"; // Estilo inativo

    // Verifica se o pathname atual começa com o path do link
    // Ex: Se pathname é /dashboard/campanhas/123, considera /dashboard/campanhas como ativo
    if (path === '/dashboard' && pathname === path) {
         return `${baseClasses} ${activeClasses}`; // Caso especial para a home do dashboard
    }
    if (path !== '/dashboard' && pathname.startsWith(path)) {
      return `${baseClasses} ${activeClasses}`;
    }
    return `${baseClasses} ${inactiveClasses}`;
  };


  return (
    <div className="flex h-screen bg-background"> {/* Usa bg-background */}
      {/* Sidebar (Menu Lateral) - Estilo ajustado */}
      <aside className="w-64 bg-white p-4 pt-6 shadow-md flex flex-col border-r border-border-light"> {/* Adiciona borda */}
        <div className="mb-8 px-2">
          {/* Logo - Clicável para a home do dashboard */}
          <Link href="/dashboard" className="text-2xl font-bold text-primary">
            Collectiico
          </Link>
           {user && (
             <p className="text-xs text-text-secondary mt-1">Olá, {user.nome?.split(' ')[0] || 'Usuário'}</p>
           )}
        </div>

        {/* Navegação Principal */}
        <nav className="flex-1 space-y-1.5">
           {/* Link para Home do Dashboard (Opcional) */}
          {/*
          <Link href="/dashboard" className={getLinkClassName('/dashboard')}>
             <LayoutGrid className="mr-3 h-5 w-5" />
            <span>Visão Geral</span>
          </Link>
          */}
          <Link href="/dashboard/solicitar" className={getLinkClassName('/dashboard/solicitar')}>
            {/* <PlusCircle className="mr-3 h-5 w-5" /> */}
            <span>Solicitar Coleta</span>
          </Link>
          <Link href="/dashboard/coletas" className={getLinkClassName('/dashboard/coletas')}>
            {/* <FileText className="mr-3 h-5 w-5" /> */}
            <span>Ver Coletas</span>
          </Link>
          <Link href="/dashboard/campanhas" className={getLinkClassName('/dashboard/campanhas')}>
            {/* <Megaphone className="mr-3 h-5 w-5" /> */}
            <span>Campanhas</span>
          </Link>
           {/* Link de Configurações MOVIDO para cá */}
           <Link href="/dashboard/settings" className={getLinkClassName('/dashboard/settings')}>
            {/* <Settings className="mr-3 h-5 w-5" /> */}
            <span>Configurações</span>
          </Link>
        </nav>

        {/* Botão Sair */}
        <div className="mt-auto pb-2">
          <button
            onClick={handleLogout}
            className="flex items-center w-full text-left px-4 py-2.5 text-sm font-medium text-red-600 rounded-lg hover:bg-red-50 transition-colors"
          >
             {/* <LogOut className="mr-3 h-5 w-5" /> */}
            <span>Sair</span>
          </button>
        </div>
      </aside>

      {/* Conteúdo Principal */}
      <main className="flex-1 p-6 md:p-8 lg:p-10 overflow-y-auto">
        {children}
      </main>
    </div>
  );
}
