// app/dashboard/page.tsx
"use client"; // Necessário para usar hooks como useAuth se precisar

import Link from 'next/link';
// import { useAuth } from '@/context/AuthContext'; // Se precisar saudar o usuário
// Importe componentes para mostrar informações úteis (ex: cards, estatísticas)

export default function DashboardHomePage() {
  // const { user } = useAuth(); // Exemplo

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6 text-text-primary">
        Visão Geral {/* Saudação opcional: Bem-vindo(a), {user?.nome?.split(' ')[0]}! */}
      </h1>

      <p className="text-text-secondary mb-8">
        Acompanhe suas atividades recentes e acesse rapidamente as principais seções.
      </p>

      {/* Exemplo de Conteúdo: Cards de Acesso Rápido */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Card Solicitar */}
        <Link href="/dashboard/solicitar" className="block p-6 bg-white rounded-xl shadow-card hover:shadow-lg transition-shadow duration-200">
          <h2 className="text-xl font-semibold text-primary mb-2">Nova Solicitação</h2>
          <p className="text-text-secondary text-sm">Agende a coleta dos seus materiais recicláveis.</p>
        </Link>

        {/* Card Ver Coletas */}
        <Link href="/dashboard/coletas" className="block p-6 bg-white rounded-xl shadow-card hover:shadow-lg transition-shadow duration-200">
          <h2 className="text-xl font-semibold text-primary mb-2">Minhas Coletas</h2>
          <p className="text-text-secondary text-sm">Veja o histórico e o status das suas solicitações.</p>
        </Link>

        {/* Card Campanhas */}
        <Link href="/dashboard/campanhas" className="block p-6 bg-white rounded-xl shadow-card hover:shadow-lg transition-shadow duration-200">
          <h2 className="text-xl font-semibold text-primary mb-2">Campanhas</h2>
          <p className="text-text-secondary text-sm">Participe ou divulgue ações de coleta na sua região.</p>
        </Link>

        {/* Você pode adicionar mais cards ou informações aqui */}
         {/* Exemplo: Última Coleta Solicitada (buscar dados reais da API) */}
         {/*
         <div className="p-6 bg-white rounded-xl shadow-card">
           <h2 className="text-xl font-semibold text-text-primary mb-2">Última Solicitação</h2>
           <p className="text-text-secondary text-sm">Status: <span className="font-medium text-orange-600">AGUARDANDO VOLUNTÁRIO</span></p>
           <p className="text-text-secondary text-sm">Material: Papelão (5 Kg)</p>
           <p className="text-text-secondary text-sm">Data: 24/10/2025</p>
         </div>
         */}

      </div>
    </div>
  );
}
