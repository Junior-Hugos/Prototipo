"use client"; 

import Link from 'next/link';
import { useAuth } from '@/context/AuthContext'; 
import { usePathname } from 'next/navigation'; 

// --- ÍCONES (SVG) ---
const HomeIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>;
const PlusIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="16"/><line x1="8" y1="12" x2="16" y2="12"/></svg>;
const ListIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/></svg>;
const CampaignIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z"/><path d="m12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z"/></svg>;
const SettingsIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.47a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"/><circle cx="12" cy="12" r="3"/></svg>;

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { session } = useAuth(); 
  const pathname = usePathname(); 

  // Verifica se o link está ativo
  const isActive = (path: string) => {
    if (path === '/dashboard' && pathname === path) return true;
    if (path !== '/dashboard' && pathname.startsWith(path)) return true;
    return false;
  };

  // (Sidebar Lateral)
  const getDesktopClass = (path: string) => {
    const base = "flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors duration-150 group gap-3";
    const active = "bg-primary-light text-primary font-bold shadow-sm";
    const inactive = "text-text-secondary hover:bg-gray-50 hover:text-primary";
    return isActive(path) ? `${base} ${active}` : `${base} ${inactive}`;
  };

  //  (Bottom Bar)
  const getMobileClass = (path: string) => {
    const base = "flex flex-col items-center justify-center w-full py-2 text-[10px] font-medium transition-colors";
    const active = "text-primary font-bold";
    const inactive = "text-gray-400 hover:text-gray-600";
    return isActive(path) ? `${base} ${active}` : `${base} ${inactive}`;
  };

  const menuItems = [
    { name: 'Início', path: '/dashboard', icon: <HomeIcon /> },
    { name: 'Solicitar', path: '/dashboard/solicitar', icon: <PlusIcon /> },
    { name: 'Coletas', path: '/dashboard/coletas', icon: <ListIcon /> },
    { name: 'Campanhas', path: '/dashboard/campanhas', icon: <CampaignIcon /> },
    { name: 'Ajustes', path: '/dashboard/settings', icon: <SettingsIcon /> },
  ];

  return (
    <div className="flex h-screen bg-background">
      
      {/* --- SIDEBAR DESKTOP  --- */}
      <aside className="hidden md:flex w-64 bg-white p-4 pt-6 flex-col border-r border-border-light shadow-sm z-20"> 
        <div className="mb-8 px-2">
          <Link href="/dashboard" className="text-2xl font-bold text-primary hover:opacity-80 transition-opacity flex items-center gap-2">
            Collectiico
          </Link>
           {session && (
             <p className="text-xs text-text-secondary mt-1 font-medium">Olá, {session.nome?.split(' ')[0] || 'Usuário'}</p>
           )}
        </div>

        <nav className="flex-1 space-y-1.5">
          {menuItems.map((item) => (
             <Link key={item.path} href={item.path} className={getDesktopClass(item.path)}>
                {item.icon}
                <span>{item.name === 'Início' ? 'Visão Geral' : item.name === 'Ajustes' ? 'Configurações' : item.name}</span>
             </Link>
          ))}
        </nav>
      </aside>

      {/* --- CONTEÚDO PRINCIPAL --- */}
      <main className="flex-1 overflow-y-auto bg-gray-50/50">
        <div className="p-4 md:p-8 lg:p-10 pb-24 md:pb-8 max-w-7xl mx-auto min-h-full">
           {children} 
        </div>
      </main>

     
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)] z-50 px-2 pb-safe">
        <nav className="flex justify-around items-center h-16">
          {menuItems.map((item) => (
            <Link key={item.path} href={item.path} className={getMobileClass(item.path)}>
               <span className="mb-1 transform scale-110">{item.icon}</span>
               <span>{item.name}</span>
            </Link>
          ))}
        </nav>
      </div>

    </div>
  );
}