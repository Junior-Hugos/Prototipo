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
    // Mudamos o breakpoint: de 'md' para 'lg'
    // Agora o layout em lista lateral só acontece em telas grandes (Desktop)
    const baseClasses = "flex-shrink-0 flex items-center px-5 py-2.5 lg:px-3 lg:py-2 text-sm font-medium rounded-full lg:rounded-md transition-all duration-150 whitespace-nowrap border lg:border-0";
    
    const activeClasses = "bg-green-100 text-green-700 border-green-200 lg:bg-primary-light lg:text-primary font-bold shadow-sm"; 
    const inactiveClasses = "bg-white text-gray-600 border-gray-200 hover:bg-gray-50 hover:text-gray-900"; 

    if (pathname === path) {
      return `${baseClasses} ${activeClasses}`;
    }
    return `${baseClasses} ${inactiveClasses}`;
  };

  return (
    // O gap aumenta apenas em telas grandes (lg)
    <div className="flex flex-col lg:flex-row gap-6 lg:gap-10 animate-in fade-in duration-300 pb-20 lg:pb-0">
      
      {/* NAVEGAÇÃO SUPERIOR (Mobile e Tablet Vertical) / LATERAL (Desktop) */}
      <aside className="w-full lg:w-48 flex-shrink-0">
         <h2 className="text-xl font-bold text-gray-800 mb-4 px-1">Configurações</h2>
         
         
         <nav className="flex flex-row lg:flex-col gap-3 lg:gap-1 overflow-x-auto lg:overflow-visible pb-4 mb-6 border-b lg:border-b-0 lg:border-r border-gray-100 lg:pr-4 scrollbar-hide -mx-4 px-4 lg:mx-0 lg:px-0">
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

     
      <div className="flex-1 min-w-0">        
        {children}
      </div>
    </div>
  );
}