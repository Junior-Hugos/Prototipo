// app/dashboard/layout.tsx
"use client"; 

import Link from 'next/link';
import { useAuth } from '@/context/AuthContext'; 
import { usePathname } from 'next/navigation'; 


export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { session } = useAuth(); 
  const pathname = usePathname(); 

 

  // Função auxiliar para aplicar estilos ao link ativo
  const getLinkClassName = (path: string) => {
    
    const baseClasses = "flex items-center px-4 py-2.5 text-sm font-medium rounded-lg transition-colors duration-150 group";
    
    const activeClasses = "bg-primary-light text-primary font-semibold";
   
    const inactiveClasses = "text-text-secondary hover:bg-gray-100 hover:text-text-primary";

    
    if (path === '/dashboard' && pathname === path) {
         return `${baseClasses} ${activeClasses}`;
    }
      
    if (path !== '/dashboard' && pathname.startsWith(path)) {
      return `${baseClasses} ${activeClasses}`;
    }
    
    return `${baseClasses} ${inactiveClasses}`;
  };


  return (
    
    <div className="flex h-screen bg-background">
      {/* Sidebar (Menu) */}
      <aside className="w-64 bg-white p-4 pt-6 flex flex-col border-r border-border-light"> 
        <div className="mb-8 px-2">
          {/* Logo */}
          <Link href="/dashboard" className="text-2xl font-bold text-primary hover:opacity-80 transition-opacity">
            Collectiico
          </Link>
           {/* Saudação */}
           {session && (
             <p className="text-xs text-text-secondary mt-1">Olá, {session.nome?.split(' ')[0] || 'Usuário'}</p>
           )}
        </div>

        {/* Navegação Principal */}
        <nav className="flex-1 space-y-1.5">
         
          <Link href="/dashboard/solicitar" className={getLinkClassName('/dashboard/solicitar')}>
            <span>Solicitar Coleta</span>
          </Link>
          <Link href="/dashboard/coletas" className={getLinkClassName('/dashboard/coletas')}>
            <span>Ver Coletas</span>
          </Link>
          <Link href="/dashboard/campanhas" className={getLinkClassName('/dashboard/campanhas')}>
            <span>Campanhas</span>
          </Link>
           <Link href="/dashboard/settings" className={getLinkClassName('/dashboard/settings')}>
            <span>Configurações</span>
          </Link>
        </nav>
      </aside>

      
      <main className="flex-1 p-6 md:p-8 lg:p-10 overflow-y-auto">
        {children} 
      </main>
    </div>
  );
}

