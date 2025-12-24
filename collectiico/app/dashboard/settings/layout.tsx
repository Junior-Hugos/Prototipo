"use client"; 

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function SettingsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  
  const getSubLinkClassName = (path: string) => {
    // Base: 
    // - flex-shrink-0: Garante que o botão não encolha no mobile
    // - whitespace-nowrap: Garante que o texto não quebre
    const baseClasses = "flex-shrink-0 flex items-center px-5 py-2.5 md:px-3 md:py-2 text-sm font-medium rounded-full md:rounded-md transition-colors duration-150 whitespace-nowrap border md:border-0";
    
    // Active: Verde (Mobile e Desktop)
    const activeClasses = "bg-green-100 text-green-700 border-green-200 md:bg-primary-light md:text-primary"; 
    
    // Inactive: Cinza claro (Mobile) / Texto cinza (Desktop)
    const inactiveClasses = "bg-white text-gray-600 border-gray-200 hover:bg-gray-50 hover:text-gray-900"; 

    if (pathname === path) {
      return `${baseClasses} ${activeClasses}`;
    }
    return `${baseClasses} ${inactiveClasses}`;
  };

  return (
    <div className="flex flex-col md:flex-row gap-6 md:gap-8 animate-in fade-in duration-300">
      
      {/* SIDEBAR / TOPBAR DE NAVEGAÇÃO */}
      <aside className="w-full md:w-48 flex-shrink-0">
         <h2 className="text-lg font-bold text-gray-800 mb-3 md:mb-4 px-1">Configurações</h2>
         
         {/* NAV: 
             - Mobile: Scroll Horizontal (overflow-x-auto) + Botões visíveis
             - Desktop: Lista Vertical
         */}
         <nav className="flex flex-row md:flex-col gap-3 md:gap-1 overflow-x-auto md:overflow-visible pb-4 md:pb-0 md:pr-4 scrollbar-hide -mx-4 px-4 md:mx-0 md:px-0">
           
           <Link href="/dashboard/settings" className={getSubLinkClassName('/dashboard/settings')}>
             Geral
           </Link>
           
           <Link href="/dashboard/settings/profile" className={getSubLinkClassName('/dashboard/settings/profile')}>
             Perfil
           </Link>
           
           <Link href="/dashboard/settings/security" className={getSubLinkClassName('/dashboard/settings/security')}>
             Segurança
           </Link>
         
         </nav>
      </aside>

      {/* ÁREA DE CONTEÚDO */}
      <div className="flex-1 min-w-0">        
        {children}
      </div>
    </div>
  );
}