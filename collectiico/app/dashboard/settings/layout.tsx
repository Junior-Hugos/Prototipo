// app/dashboard/settings/layout.tsx
import Link from 'next/link';

export default function SettingsLayout({ children }: { children: React.ReactNode }) {
  // Este layout será renderizado DENTRO do <main> do DashboardLayout
  return (
    <div className="flex gap-8">
        {/* Submenu Lateral Específico para Configurações */}
        <nav className="w-48 flex flex-col space-y-1">
             <h3 className="text-sm font-semibold text-text-secondary uppercase tracking-wider mb-2">Configurações</h3>
             <Link href="/dashboard/settings" className="px-3 py-2 rounded hover:bg-gray-200">Geral</Link>
             <Link href="/dashboard/settings/profile" className="px-3 py-2 rounded hover:bg-gray-200">Perfil</Link>
             <Link href="/dashboard/settings/security" className="px-3 py-2 rounded hover:bg-gray-200">Segurança</Link>
        </nav>

        {/* Conteúdo da Página Específica de Configurações */}
        <div className="flex-1">
            {children}
        </div>
    </div>
  );
}