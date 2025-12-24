'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

// --- ÍCONES ---
const AlertIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-red-500 mb-4"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>);
const SuccessIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-green-500 mb-4"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>);
const RocketIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-blue-500"><path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z"/><path d="m12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z"/><path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0"/><path d="M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5"/></svg>);
const TrashIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/></svg>);
const CheckIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>);

// --- INTERFACES ---
interface Campanha {
  id: string;
  titulo: string;
  descricao: string;
  dataPublicacao?: string;
  criadorId: string;
  criador?: { nome: string; email: string };
  _count?: { voluntarios: number };
  concluida?: boolean; 
}

interface UserProfile {
  id: string;
  nome: string;
  email: string;
  tipo: string;
  voluntario?: { 
      campanhas: { campanhaId: string; campanha: Campanha }[];
  };
}

interface ModalState {
   show: boolean;
   title: string;
   message: string;
   confirmText: string;
   confirmColor: 'red' | 'green';
   iconType: 'warning' | 'success';
   actionType: 'join' | 'leave' | 'deleteCampaign' | 'finishCampaign' | null;
   targetId: string | null;
}

export default function CampanhasPage() {
  const router = useRouter();

  const [user, setUser] = useState<UserProfile | null>(null);
  const [todasCampanhas, setTodasCampanhas] = useState<Campanha[]>([]);
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState<string | null>(null);

  const [novoTitulo, setNovoTitulo] = useState('');
  const [novaDescricao, setNovaDescricao] = useState('');
  const [creating, setCreating] = useState(false);

  const [modal, setModal] = useState<ModalState>({
      show: false, title: '', message: '', confirmText: '', confirmColor: 'red', iconType: 'warning', actionType: null, targetId: null
  });

  useEffect(() => {
    async function carregarDados() {
      try {
        const [resUser, resCamp] = await Promise.all([
            fetch('/api/user/profile'),
            fetch('/api/campanhas')
        ]);

        if (resUser.status === 401) { router.push('/login'); return; }
        if (resUser.ok) setUser(await resUser.json());
        if (resCamp.ok) {
            const dados = await resCamp.json();
            setTodasCampanhas(dados.map((c: any) => ({...c, concluida: false})));
        }
      } catch (error) {
        console.error("Erro ao carregar dados", error);
      } finally {
        setLoading(false);
      }
    }
    carregarDados();
  }, [router]);

  const handleCreate = async (e: React.FormEvent) => {
      e.preventDefault();
      if(!novoTitulo || !novaDescricao) return;
      setCreating(true);
      try {
          const res = await fetch('/api/campanhas', {
              method: 'POST',
              headers: {'Content-Type': 'application/json'},
              body: JSON.stringify({ titulo: novoTitulo, descricao: novaDescricao })
          });
          if(res.ok) window.location.reload(); 
          else alert("Erro ao criar campanha.");
      } catch (error) { console.error(error); } 
      finally { setCreating(false); }
  };

  const closeModal = () => setModal({ ...modal, show: false });

  // --- LÓGICA DE AÇÃO ---
  const confirmAction = async () => {
      if (!modal.targetId || !modal.actionType) return;
      const { actionType, targetId } = modal;
      
      closeModal();
      setProcessingId(targetId);

      try {
            // PARTICIPAR
          if (actionType === 'join') {
             const res = await fetch(`/api/campanhas/${targetId}/join`, { method: 'POST' });
             
             if (res.ok) {
                 const campAlvo = todasCampanhas.find(c => c.id === targetId);
                 if (user && campAlvo) {
                     const novaInsc = { campanhaId: targetId, campanha: campAlvo };
                     const volAtual = user.voluntario || { campanhas: [] };
                     setUser({ ...user, voluntario: { ...volAtual, campanhas: [...volAtual.campanhas, novaInsc] } });
                 }
                 setTodasCampanhas(prev => prev.map(c => 
                    c.id === targetId ? { ...c, _count: { voluntarios: (c._count?.voluntarios || 0) + 1 } } : c
                 ));
             } else {
                 const erro = await res.json();
                 alert(`Não foi possível participar: ${erro.message || 'Erro desconhecido'}`);
             }
          } 
          // SAIR
          else if (actionType === 'leave') {
             const res = await fetch(`/api/campanhas/${targetId}/join`, { method: 'DELETE' });
             if (res.ok) {
                 if (user && user.voluntario) {
                     const listaAtualizada = user.voluntario.campanhas.filter(c => c.campanhaId !== targetId);
                     setUser({ ...user, voluntario: { ...user.voluntario, campanhas: listaAtualizada } });
                 }
                 setTodasCampanhas(prev => prev.map(c => 
                    c.id === targetId ? { ...c, _count: { voluntarios: Math.max(0, (c._count?.voluntarios || 0) - 1) } } : c
                 ));
             }
          } 
          
          // EXCLUIR
          else if (actionType === 'deleteCampaign') {
             const res = await fetch(`/api/campanhas`, { 
                 method: 'DELETE',
                 headers: {'Content-Type': 'application/json'},
                 body: JSON.stringify({ id: targetId })
             });
             if (res.ok) {
                 setTodasCampanhas(prev => prev.filter(c => c.id !== targetId));
             }
          }

          // FINALIZAR
          else if (actionType === 'finishCampaign') {
              setTodasCampanhas(prev => prev.map(c => 
                  c.id === targetId ? { ...c, concluida: true } : c
              ));
          }

      } catch (error) {
          alert("Erro de conexão.");
      } finally {
          setProcessingId(null);
      }
  };

  const formatDate = (dateStr?: string) => {
    if(!dateStr) return 'Data n/a';
    return new Date(dateStr).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' });
  };

  if (loading) return <div className="min-h-screen flex justify-center items-center text-green-600 font-bold text-lg">Carregando...</div>;
  if (!user) return null;

  const podeCriar = user.tipo === 'VOLUNTARIO' || user.tipo === 'EMPRESA';
 const podeVerBotaoParticipar = user.tipo === 'VOLUNTARIO';

  return (
    <div className="min-h-screen bg-gray-50 pb-10 font-sans relative text-gray-800">

      {/* --- MODAL --- */}
      {modal.show && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl shadow-xl p-6 max-w-md w-full animate-in zoom-in duration-200">
            <div className="flex flex-col items-center text-center">
              {modal.iconType === 'warning' ? <AlertIcon /> : <SuccessIcon />}
              <h3 className="text-xl font-bold text-gray-800 mb-2">{modal.title}</h3>
              <p className="text-base text-gray-600 mb-6 leading-relaxed px-2">{modal.message}</p>
              
              <div className="flex gap-3 w-full">
                <button onClick={closeModal} className="flex-1 px-4 py-3 bg-gray-100 text-gray-700 font-medium rounded-xl hover:bg-gray-200 transition-colors text-base">
                  Cancelar
                </button>
                <button onClick={confirmAction} className={`flex-1 px-4 py-3 text-white font-medium rounded-xl transition-colors text-base ${
                  modal.confirmColor === 'red' ? 'bg-red-600 hover:bg-red-700' : 'bg-green-600 hover:bg-green-700'
                }`}>
                  {modal.confirmText}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <main className="max-w-6xl mx-auto px-6 space-y-8 pt-8">

        {/* --- FORMULÁRIO DE CRIAÇÃO --- */}
        {podeCriar && (
            <section className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                    <RocketIcon /> Criar Nova Campanha
                </h2>
                <form onSubmit={handleCreate} className="space-y-4">
                    <div className="flex flex-col md:flex-row gap-4">
                        <input 
                            type="text" 
                            placeholder="Título da Campanha" 
                            value={novoTitulo}
                            onChange={e => setNovoTitulo(e.target.value)}
                            required
                            className="flex-1 p-3 bg-gray-50 border border-gray-200 rounded-xl text-base focus:outline-none focus:ring-2 focus:ring-green-500 transition-all"
                        />
                        <button 
                            type="submit" 
                            disabled={creating}
                            className="bg-green-600 text-white px-6 py-3 rounded-xl font-bold text-sm hover:bg-green-700 transition-colors disabled:opacity-50 whitespace-nowrap"
                        >
                            {creating ? 'Publicando...' : 'Publicar'}
                        </button>
                    </div>
                    <textarea 
                        placeholder="Descrição detalhada da campanha..." 
                        value={novaDescricao}
                        onChange={e => setNovaDescricao(e.target.value)}
                        required
                        rows={3}
                        className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl text-base focus:outline-none focus:ring-2 focus:ring-green-500 transition-all"
                    />
                </form>
            </section>
        )}

        {/* --- LISTA UNIFICADA --- */}
        <section>
            <div className="flex items-center justify-between mb-4 px-1">
                <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-3">
                    Mural de Campanhas
                </h2>
                <span className="bg-blue-50 text-blue-700 text-sm font-bold px-3 py-1 rounded-full border border-blue-100">
                    {todasCampanhas.length} Ativas
                </span>
            </div>

            <div className="grid grid-cols-1 gap-5">
                {todasCampanhas.length === 0 && (
                    <p className="text-gray-500 italic text-base text-center py-12 bg-white rounded-2xl shadow-sm border border-dashed border-gray-200">
                        Nenhuma campanha encontrada no momento.
                    </p>
                )}

                {todasCampanhas.map((camp) => {
                    const souDono = camp.criadorId === user.id;
                    const participo = user.voluntario?.campanhas.some(c => c.campanhaId === camp.id);

                    const tituloClass = camp.concluida ? "line-through text-gray-400" : "text-gray-800";
                    const descClass = camp.concluida ? "line-through text-gray-300" : "text-gray-600";
                    const cardOpacity = camp.concluida ? "opacity-60 bg-gray-50" : "bg-white";

                    return (
                        <div key={camp.id} className={`${cardOpacity} p-6 rounded-2xl shadow-sm border border-gray-100 transition-all hover:shadow-md`}>
                            <div className="flex flex-col md:flex-row gap-4 justify-between items-start md:items-center">
                                
                                <div className="flex-1 min-w-0 space-y-2">
                                    <div className="flex items-center gap-3 mb-1">
                                        <h3 className={`font-bold text-xl ${tituloClass}`}>{camp.titulo}</h3>
                                        {souDono && <span className="text-[10px] bg-purple-100 text-purple-700 px-2 py-1 rounded-lg border border-purple-200 font-bold uppercase tracking-wide">Sua Campanha</span>}
                                        {participo && !souDono && <span className="text-[10px] bg-green-100 text-green-700 px-2 py-1 rounded-lg border border-green-200 font-bold uppercase tracking-wide">Inscrito</span>}
                                    </div>
                                    <p className={`text-sm leading-relaxed ${descClass}`}>{camp.descricao}</p>
                                    
                                    <div className="flex items-center gap-4 text-xs text-gray-500 font-medium pt-2">
                                        <span className="flex items-center gap-1">📅 {formatDate(camp.dataPublicacao)}</span>
                                        <span className="flex items-center gap-1 text-gray-700 bg-gray-100 px-2 py-1 rounded-md">
                                            👥 {camp._count?.voluntarios || 0} confirmados
                                        </span>
                                        <span className="hidden sm:inline">👤 Criado por: {camp.criador?.nome}</span>
                                    </div>
                                </div>

                                <div className="flex items-center gap-3 w-full md:w-auto mt-2 md:mt-0">
                                    {souDono ? (
                                        <>
                                            <button
                                                onClick={() => setModal({
                                                    show: true, title: "Excluir", message: "Apagar campanha permanentemente?",
                                                    confirmText: "Excluir", confirmColor: "red", iconType: "warning", actionType: "deleteCampaign", targetId: camp.id
                                                })}
                                                disabled={processingId === camp.id}
                                                className="px-4 py-2 bg-red-50 text-red-600 hover:bg-red-100 rounded-xl text-sm font-bold transition-colors flex items-center gap-2"
                                            >
                                                <TrashIcon />
                                            </button>
                                            <button
                                                onClick={() => setModal({
                                                    show: true, title: "Concluir", message: "Marcar campanha como realizada (Riscado)?",
                                                    confirmText: "Concluir", confirmColor: "green", iconType: "success", actionType: "finishCampaign", targetId: camp.id
                                                })}
                                                disabled={processingId === camp.id || camp.concluida}
                                                className={`px-4 py-2 rounded-xl text-sm font-bold transition-colors flex items-center gap-2 ${
                                                    camp.concluida 
                                                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                                                    : 'bg-green-50 text-green-600 hover:bg-green-100'
                                                }`}
                                            >
                                                <CheckIcon /> Finalizar
                                            </button>
                                        </>
                                    ) : (
                                        podeVerBotaoParticipar ? (
                                            participo ? (
                                                <button
                                                    onClick={() => setModal({
                                                        show: true, title: "Cancelar Inscrição", message: `Sair da campanha "${camp.titulo}"?`,
                                                        confirmText: "Sair", confirmColor: "red", iconType: "warning", actionType: "leave", targetId: camp.id
                                                    })}
                                                    disabled={processingId === camp.id}
                                                    className="w-full md:w-auto bg-white border border-red-200 text-red-600 hover:bg-red-50 px-6 py-2.5 rounded-xl text-sm font-bold transition-all shadow-sm"
                                                >
                                                    {processingId === camp.id ? '...' : 'Cancelar Inscrição'}
                                                </button>
                                            ) : (
                                                <button
                                                    onClick={() => setModal({
                                                        show: true, title: "Participar", message: `Confirmar presença em "${camp.titulo}"?`,
                                                        confirmText: "Confirmar", confirmColor: "green", iconType: "success", actionType: "join", targetId: camp.id
                                                    })}
                                                    disabled={processingId === camp.id || camp.concluida}
                                                    className={`w-full md:w-auto px-6 py-2.5 rounded-xl text-sm font-bold shadow-sm transition-all ${
                                                        camp.concluida
                                                        ? 'bg-gray-300 text-white cursor-not-allowed'
                                                        : 'bg-green-600 text-white hover:bg-green-700 active:scale-95'
                                                    }`}
                                                >
                                                    {processingId === camp.id ? '...' : 'Participar'}
                                                </button>
                                            )
                                        ) : null
                                    )}
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </section>

      </main>
    </div>
  );
}