'use client';
import { useEffect, useState } from 'react';
import { toast } from 'react-hot-toast';

// --- ÍCONES ---
const MapIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><map name="map"></map><polygon points="1 6 1 22 8 18 16 22 23 18 23 2 16 6 8 2 1 6"/><line x1="8" y1="2" x2="8" y2="18"/><line x1="16" y1="6" x2="16" y2="22"/></svg>);
const TrashIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>);
const XIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>);
const CheckIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>);
const CalendarIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-1.5"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>);
const AlertIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" width="60" height="60" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-red-500 mb-4"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>);
const SuccessIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" width="60" height="60" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-green-500 mb-4"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>);

export default function ColetasPage() {
  const [coletas, setColetas] = useState<any[]>([]);
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  
  // Estados para Modais
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [confirmModalOpen, setConfirmModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<string | null>(null);
  const [actionType, setActionType] = useState<'delete' | 'release'>('delete');

  const fetchColetas = async () => {
    try {
      const resUser = await fetch('/api/user/profile');
      let userData = null;
      if (resUser.ok) {
          userData = await resUser.json();
          setUser(userData);
      }
      const resColetas = await fetch('/api/coletas');
      const dataColetas = await resColetas.json();
      if (resColetas.ok) setColetas(dataColetas);
    } catch (error) { console.error(error); } 
    finally { setLoading(false); }
  };

  useEffect(() => { fetchColetas(); }, []);

  // --- FILTRO VISUALIZAÇÃO ---
  const visibleColetas = coletas.filter(c => {
      if (!user) return false;
      
      // DOADOR
      if (user.tipo === 'DOADOR') {
          return c.doador?.usuario?.id === user.id;
      }
      
      // VOLUNTÁRIO ou EMPRESA
      if (user.tipo === 'VOLUNTARIO' || user.tipo === 'EMPRESA') {
          // Vê disponíveis
          if (c.status === 'SOLICITADA') return true;
          
          
          const meuVolId = user.voluntario?.id;
          const meuEmpId = user.empresa?.id;
          
          if (c.voluntario?.id && c.voluntario.id === meuVolId) return true;
          if (c.empresa?.id && c.empresa.id === meuEmpId) return true;
      }
      return false;
  });

  const openDeleteModal = (id: string, type: 'delete' | 'release') => {
    setSelectedItem(id);
    setActionType(type);
    setDeleteModalOpen(true);
  };

  const openConfirmModal = (id: string) => {
    setSelectedItem(id);
    setConfirmModalOpen(true);
  };

  const handleAccept = async (id: string) => {
      try {
          const res = await fetch('/api/coletas', {
              method: 'PUT',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ id, status: 'ACEITA' }),
          });
          if (res.ok) {
              toast.success("Coleta aceita!");
              fetchColetas(); 
          } else {
              toast.error("Erro ao aceitar.");
          }
      } catch (e) { toast.error("Erro de conexão"); }
  };

  const executeDeleteOrRelease = async () => {
    if (!selectedItem) return;
    try {
      if (actionType === 'delete') {
          // DELETE REAL (Doador)
          const res = await fetch('/api/coletas', {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id: selectedItem }),
          });
          if (res.ok) {
            toast.success("Solicitação excluída!");
            setColetas(coletas.filter(c => c.id !== selectedItem));
          }
      } else {
          // LIBERAR/CANCELAR 
          const res = await fetch('/api/coletas', {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id: selectedItem, status: 'SOLICITADA', action: 'liberar' }),
          });
          if (res.ok) {
            toast.success("Coleta devolvida ao mural.");
            fetchColetas();
          }
      }
    } catch (error) { toast.error("Erro de conexão."); } 
    finally { setDeleteModalOpen(false); setSelectedItem(null); }
  };

  const executeConcluir = async () => {
    if (!selectedItem) return;
    try {
      const res = await fetch('/api/coletas', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: selectedItem, status: 'CONCLUIDA' }),
      });
      if (res.ok) {
        toast.success("Coleta finalizada!");
        fetchColetas();
      }
    } catch (error) { toast.error("Erro ao concluir."); } 
    finally { setConfirmModalOpen(false); setSelectedItem(null); }
  };

  const getGoogleMapsLink = (coleta: any) => {
    const end = `${coleta.doador?.usuario?.endereco || ''} - ${coleta.doador?.usuario?.cidade || ''}`;
    return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(end)}`;
  };

  if (loading) return <div className="min-h-screen flex justify-center items-center text-green-600 font-bold text-lg">Carregando mural...</div>;

  return (
    <div className="p-4 md:p-6 max-w-7xl mx-auto font-sans relative pb-20">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-6 md:mb-8 border-b pb-4 gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800">Mural de Coletas</h1>
          <p className="text-gray-500 mt-1 text-sm md:text-base">Gerencie suas coletas e ajude o meio ambiente.</p>
        </div>
        <button 
          onClick={fetchColetas} 
          className="w-full md:w-auto bg-white border text-gray-600 px-4 py-2.5 rounded-xl text-sm font-bold shadow-sm hover:bg-gray-50 active:scale-95 transition-all"
        >
          ↻ Atualizar
        </button>
      </div>

      {visibleColetas.length === 0 ? (
        <div className="py-24 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200 text-center flex flex-col items-center justify-center">
          <p className="text-gray-400 font-medium">Nenhuma coleta disponível.</p>
          <p className="text-gray-400 text-sm mt-1">Que tal solicitar uma nova?</p>
        </div>
      ) : (
        <div className="grid gap-4 md:gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {visibleColetas.map((coleta) => {
            const isConcluida = coleta.status === 'CONCLUIDA';
            const isOwner = coleta.doador?.usuario?.id === user?.id;
            
            const meuVolId = user?.voluntario?.id;
            const meuEmpId = user?.empresa?.id;
            const isAcceptedByMe = (coleta.status === 'ACEITA' || coleta.status === 'EM_ANDAMENTO') && 
                                   ((coleta.voluntario?.id && coleta.voluntario.id === meuVolId) || 
                                    (coleta.empresa?.id && coleta.empresa.id === meuEmpId));

            const statusLabel = isConcluida ? 'Concluída' : (coleta.status === 'SOLICITADA' ? 'Solicitada' : 'Em Andamento');

            return (
              <div key={coleta.id} className={`bg-white rounded-xl shadow-sm border border-gray-100 p-5 flex flex-col transition-all hover:shadow-md ${isConcluida ? 'opacity-60 bg-gray-50' : ''}`}>
                
                {/* Header do Card */}
                <div className="flex justify-between items-start mb-4">
                  <span className={`px-3 py-1 rounded-full text-[10px] md:text-xs font-bold uppercase tracking-wide ${
                    statusLabel === 'Em Andamento' ? 'bg-blue-100 text-blue-700' : 
                    statusLabel === 'Solicitada' ? 'bg-yellow-100 text-yellow-700' : 'bg-gray-200 text-gray-600'
                  }`}>{statusLabel}</span>
                  <div className="flex items-center text-xs text-gray-400 font-medium bg-gray-50 px-2 py-1 rounded">
                    <CalendarIcon /> {new Date(coleta.data).toLocaleDateString('pt-BR')}
                  </div>
                </div>

                {/* Info Principal */}
                <div className="mb-4">
                  <h3 className="text-lg md:text-xl font-bold capitalize text-gray-800">{coleta.tipoMaterial}</h3>
                  <p className="text-gray-500 text-sm mt-1">Quantidade: <strong className="text-gray-700">{coleta.quantidade}</strong></p>
                </div>
                
                <div className="border-t border-gray-100 mb-4"></div>
                
                <div className="mb-6 flex-1 text-sm space-y-1">
                  <p className="text-gray-800 font-bold flex items-center gap-2">
                    👤 {coleta.doador?.usuario?.nome || 'Anônimo'}
                  </p>
                  <p className="text-gray-500 text-xs leading-relaxed">
                    📍 {coleta.doador?.usuario?.endereco} - {coleta.doador?.usuario?.cidade}
                  </p>
                </div>

                {/* --- BOTÕES DE AÇÃO (Largura total no mobile) --- */}
                <div className="pt-2 mt-auto">
                  {isConcluida ? (
                    <div className="w-full py-2.5 bg-gray-100 text-gray-500 rounded-xl text-center text-sm font-bold flex justify-center gap-2 cursor-default">
                       <CheckIcon /> Finalizada
                    </div>
                  ) : (
                    <>
                      {/* DOADOR (Dono da coleta) */}
                      {isOwner && (
                        <div className="flex flex-col sm:flex-row gap-2">
                           {(coleta.status === 'ACEITA' || coleta.status === 'EM_ANDAMENTO') && (
                              <button onClick={() => openConfirmModal(coleta.id)} className="flex-1 bg-blue-600 text-white py-2.5 rounded-xl text-sm font-bold flex justify-center items-center gap-1 hover:bg-blue-700 shadow-sm transition-colors">
                                <CheckIcon /> Confirmar
                              </button>
                           )}
                           <button onClick={() => openDeleteModal(coleta.id, 'delete')} className="flex-1 bg-red-50 text-red-600 py-2.5 rounded-xl text-sm font-bold flex justify-center items-center gap-1 hover:bg-red-100 transition-colors">
                              <TrashIcon /> Excluir
                           </button>
                        </div>
                      )}

                      {/* VOLUNTÁRIO/EMPRESA (Aceitar Coleta) */}
                      {!isOwner && coleta.status === 'SOLICITADA' && (user.tipo !== 'DOADOR') && (
                          <button onClick={() => handleAccept(coleta.id)} className="w-full bg-green-600 text-white py-3 rounded-xl hover:bg-green-700 text-sm font-bold shadow-md transition-all active:scale-95">
                            Aceitar Coleta
                          </button>
                      )}

                      {/* VOLUNTÁRIO/EMPRESA (Gerenciar Coleta Aceita) */}
                      {isAcceptedByMe && (
                        <div className="flex flex-col sm:flex-row gap-2">
                          <a href={getGoogleMapsLink(coleta)} target="_blank" className="flex-1 bg-green-600 text-white py-2.5 rounded-xl flex justify-center items-center gap-1 text-sm font-bold hover:bg-green-700 shadow-sm transition-colors">
                            <MapIcon /> Rota
                          </a>
                          <button onClick={() => openConfirmModal(coleta.id)} className="flex-1 bg-blue-600 text-white py-2.5 rounded-xl flex justify-center items-center gap-1 text-sm font-bold hover:bg-blue-700 shadow-sm transition-colors">
                            <CheckIcon /> Confirmar
                          </button>
                          <button onClick={() => openDeleteModal(coleta.id, 'release')} className="w-full sm:w-12 border border-red-200 text-red-500 rounded-xl flex justify-center items-center hover:bg-red-50 transition-colors py-2.5 sm:py-0" title="Cancelar / Liberar">
                            <XIcon />
                          </button>
                        </div>
                      )}
                    </>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* --- MODAIS RESPONSIVOS --- */}
      {(deleteModalOpen || confirmModalOpen) && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl shadow-2xl p-6 max-w-sm w-full text-center animate-in zoom-in-95 duration-200">
            {deleteModalOpen ? <AlertIcon /> : <SuccessIcon />}
            <h3 className="text-xl font-bold mb-2 text-gray-800">
                {deleteModalOpen 
                  ? (actionType === 'delete' ? 'Excluir Solicitação?' : 'Cancelar Coleta?') 
                  : 'Confirmar Coleta?'}
            </h3>
            <p className="text-sm text-gray-600 mb-6 px-2 leading-relaxed">
                {deleteModalOpen 
                  ? (actionType === 'delete' ? 'Esta ação não pode ser desfeita.' : 'A coleta voltará para o mural de disponíveis.') 
                  : 'Confirma que a coleta foi realizada e o material recolhido?'}
            </p>
            <div className="flex gap-3">
              <button onClick={() => { setDeleteModalOpen(false); setConfirmModalOpen(false); }} className="flex-1 py-3 bg-gray-100 rounded-xl text-sm font-bold hover:bg-gray-200 transition-colors">Cancelar</button>
              <button 
                onClick={deleteModalOpen ? executeDeleteOrRelease : executeConcluir} 
                className={`flex-1 py-3 text-white rounded-xl text-sm font-bold shadow-md transition-colors ${deleteModalOpen ? 'bg-red-600 hover:bg-red-700' : 'bg-green-600 hover:bg-green-700'}`}
              >
                Confirmar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}