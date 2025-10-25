// app/dashboard/settings/layout.tsx
"use client"; // Necessário para usar usePathname

import Link from 'next/link';
import { usePathname } from 'next/navigation';
// Importe ícones se desejar (ex: User, Shield, Cog)
// import { User, Shield, Cog } from 'lucide-react';

export default function SettingsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  // Função auxiliar para aplicar estilos ao link ativo do SUBMENU
  const getSubLinkClassName = (path: string) => {
    const baseClasses = "flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors duration-150";
    const activeClasses = "bg-primary-light text-primary font-semibold"; // Estilo ativo
    const inactiveClasses = "text-text-secondary hover:bg-gray-100 hover:text-text-primary"; // Estilo inativo

    // Verifica se o pathname atual corresponde EXATAMENTE ao path do link
    if (pathname === path) {
      return `${baseClasses} ${activeClasses}`;
    }
    return `${baseClasses} ${inactiveClasses}`;
  };

  return (
    // Este layout será renderizado DENTRO do <main> do DashboardLayout principal
    <div className="flex flex-col md:flex-row gap-6 md:gap-8">
      {/* Submenu Lateral (ou superior) Específico para Configurações */}
      <aside className="w-full md:w-48 flex-shrink-0">
         <h2 className="text-lg font-semibold text-text-primary mb-4 px-1 hidden md:block">Configurações</h2>
         <nav className="flex flex-row md:flex-col space-x-2 md:space-x-0 md:space-y-1 border-b md:border-b-0 md:border-r md:border-border-light pb-3 md:pb-0 md:pr-4">
           <Link href="/dashboard/settings" className={getSubLinkClassName('/dashboard/settings')}>
            {/* <Cog className="mr-2 h-4 w-4" /> */}
            <span>Geral</span>
           </Link>
           <Link href="/dashboard/settings/profile" className={getSubLinkClassName('/dashboard/settings/profile')}>
            {/* <User className="mr-2 h-4 w-4" /> */}
            <span>Perfil</span>
           </Link>
           <Link href="/dashboard/settings/security" className={getSubLinkClassName('/dashboard/settings/security')}>
            {/* <Shield className="mr-2 h-4 w-4" /> */}
            <span>Segurança</span>
           </Link>
           {/* Adicione mais links de configurações se necessário */}
        </nav>
      </aside>

      {/* Conteúdo da Página Específica de Configurações */}
      <div className="flex-1 min-w-0">
        {/* Renderiza page.tsx, profile/page.tsx, etc. */}
        {children}
      </div>
    </div>
  );
}
