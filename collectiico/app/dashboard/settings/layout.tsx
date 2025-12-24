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
    const baseClasses = "flex items-center px-4 py-2.5 md:px-3 md:py-2 text-sm font-medium rounded-md transition-colors duration-150 whitespace-nowrap";
    const activeClasses = "bg-primary-light text-primary font-semibold"; 
    const inactiveClasses = "text-text-secondary hover:bg-gray-50 hover:text-text-primary"; 

    // Verifica se o pathname atual é EXATAMENTE ao path do link
    if (pathname === path) {
      return `${baseClasses} ${activeClasses}`;
    }
    return `${baseClasses} ${inactiveClasses}`;
  };

  return (
    <div className="flex flex-col md:flex-row gap-6 md:gap-8 animate-in fade-in duration-300">
      
      {/* SIDEBAR DE NAVEGAÇÃO */}
      <aside className="w-full md:w-48 flex-shrink-0">
         <h2 className="text-lg font-semibold text-text-primary mb-3 md:mb-4 px-1">Configurações</h2>         
         <nav className="flex flex-row md:flex-col gap-2 md:gap-1 overflow-x-auto md:overflow-visible border-b md:border-b-0 md:border-r md:border-border-light pb-4 md:pb-0 md:pr-4">
           <Link href="/dashboard/settings" className={getSubLinkClassName('/dashboard/settings')}>
             <span>Geral</span>
           </Link>
           <Link href="/dashboard/settings/profile" className={getSubLinkClassName('/dashboard/settings/profile')}>
             <span>Perfil</span>
           </Link>
           <Link href="/dashboard/settings/security" className={getSubLinkClassName('/dashboard/settings/security')}>
             <span>Segurança</span>
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