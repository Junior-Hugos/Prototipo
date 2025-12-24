'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

interface Campanha {
  id: string;
  titulo: string;
  descricao: string;
}

// --- ÍCONES ---
const BoxIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-green-600"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/><line x1="3.27 6.96" x2="12 12.01"/><line x1="20.73 6.96" x2="12 12.01"/></svg>);
const RocketIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-blue-500"><path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z"/><path d="m12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z"/><path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0"/><path d="M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5"/></svg>);

export default function DashboardHomePage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [recentColeta, setRecentColeta] = useState<any>(null);
  const [todasCampanhas, setTodasCampanhas] = useState<Campanha[]>([]); // Added state for campaigns

  useEffect(() => {
    async function fetchData() {
        try {
            // Profile
            const resUser = await fetch("/api/user/profile");
            if (!resUser.ok) throw new Error("Falha ao carregar perfil");
            const data = await resUser.json();
            setUser(data);

            console.log("User Data:", data); // DEBUG: Check console to see if 'empresa.coletasRecebidas' exists

            // --- LÓGICA DE ATIVIDADE RECENTE ---
            let recent = null;
            
            // DOADOR
            if (data.tipo === 'DOADOR' && data.doador?.coletas?.length > 0) {
                recent = data.doador.coletas[0]; 
            }
            // VOLUNTÁRIO
            else if (data.tipo === 'VOLUNTARIO' && data.voluntario?.coletasRealizadas?.length > 0) {
                recent = data.voluntario.coletasRealizadas[0];
            }
            // EMPRESA
            else if (data.tipo === 'EMPRESA' && data.empresa?.coletasRecebidas?.length > 0) {
                recent = data.empresa.coletasRecebidas[0];
            }
            
            setRecentColeta(recent);

            // Campanhas
            const resCamp = await fetch('/api/campanhas');
            if (resCamp.ok) setTodasCampanhas(await resCamp.json());

        } catch (err) {
            console.error(err);
            router.push("/login");
        } finally {
            setLoading(false);
        }
    }
    fetchData();
  }, [router]);

  const formatDate = (dateStr?: string) => {
    if(!dateStr) return 'Data n/a';
    return new Date(dateStr).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute:'2-digit' });
  };

  // Filtra campanhas disponíveis
  const campanhasInscritas = user?.voluntario?.campanhas?.map((item: any) => item.campanha) || [];
  const idsInscritos = campanhasInscritas.map((c: any) => c.id);
  const campanhasDisponiveis = todasCampanhas.filter((c) => !idsInscritos.includes(c.id));

  if (loading) return <div className="p-8 text-center text-gray-500">Carregando painel...</div>;

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-8 animate-in fade-in duration-500">
      
      {/* Cabeçalho */}
      <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 flex flex-col md:flex-row justify-between items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-800 mb-1">
            Olá, {user.nome?.split(' ')[0]}! 👋
          </h1>
          <p className="text-gray-500 text-sm">{user.email}</p>
        </div>
        <span className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest border ${
            user.tipo === 'EMPRESA' ? 'bg-blue-100 text-blue-700 border-blue-200' : 
            user.tipo === 'DOADOR' ? 'bg-purple-100 text-purple-700 border-purple-200' :
            'bg-green-100 text-green-700 border-green-200'
        }`}>
          {user.tipo}
        </span>
      </div>

      {/* Atividade Recente */}
      <div>
        <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
          <BoxIcon /> Atividade Recente
        </h2>
        
        {recentColeta ? (
           <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 border-l-4 border-green-500 flex flex-col md:flex-row justify-between items-center gap-6 hover:shadow-md transition-shadow">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                    <span className="text-xs font-bold uppercase text-gray-400 tracking-wider">
                        {formatDate(recentColeta.data)}
                    </span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${
                        recentColeta.status === 'CONCLUIDA' ? 'bg-gray-200 text-gray-600' :
                        recentColeta.status === 'SOLICITADA' ? 'bg-yellow-100 text-yellow-700' :
                        'bg-blue-100 text-blue-700'
                    }`}>
                        {recentColeta.status.replace('_', ' ')}
                    </span>
                </div>
                <h3 className="text-2xl font-bold text-gray-800 capitalize mb-1">
                   {recentColeta.tipoMaterial}
                </h3>
                <p className="text-gray-500">
                   Quantidade: <span className="font-semibold text-gray-700">{recentColeta.quantidade}</span> Kg/Vol
                </p>
              </div>

              {/* Botão de Ação */}
              <button 
                onClick={() => router.push('/dashboard/coletas')}
                className="px-6 py-3 bg-gray-50 text-gray-700 hover:text-green-700 hover:bg-green-50 font-semibold rounded-xl transition-all text-sm border border-gray-200 cursor-pointer"
              >
                Gerenciar / Ver Detalhes
              </button>
           </div>
        ) : (
           <div className="bg-gray-50 p-10 rounded-2xl border-2 border-dashed border-gray-200 text-center">
              <p className="text-gray-400 font-medium mb-4">Nenhuma atividade recente.</p>
              <button 
                 onClick={() => router.push('/dashboard/coletas')}
                 className="text-green-600 font-bold text-sm hover:underline cursor-pointer bg-transparent border-none"
              >
                 Ir para o Mural de Coletas
              </button>
           </div>
        )}
      </div>

      {/* Campanhas / Oportunidades */}
      <div>
         <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
            <RocketIcon /> Oportunidades
         </h2>
         
         {campanhasDisponiveis.length > 0 ? (
             <div className="grid gap-4 md:grid-cols-2">
                 {campanhasDisponiveis.slice(0, 2).map((camp: any) => (
                     <div key={camp.id} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                         <h3 className="font-bold text-lg text-gray-800">{camp.titulo}</h3>
                         <p className="text-gray-500 text-sm line-clamp-2 mt-1">{camp.descricao}</p>
                         <button 
                            onClick={() => router.push('/dashboard/campanhas')}
                            className="mt-3 text-blue-600 font-bold text-xs uppercase hover:underline"
                         >
                            Ver Campanha
                         </button>
                     </div>
                 ))}
             </div>
         ) : (
             <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-center min-h-[150px]">
                <p className="text-gray-400 italic">
                    Acesse a aba <span className="font-bold text-gray-600 cursor-pointer hover:underline" onClick={() => router.push('/dashboard/campanhas')}>Campanhas</span> para ver e participar.
                </p>
             </div>
         )}
      </div>
    </div>
  );
}