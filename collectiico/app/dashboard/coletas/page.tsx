"use client";
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
    return `https://www.google.com/maps/dir/?api=1&destination=$?q=${encodeURIComponent(end)}`;
  };

  if (loading) return <div className="p-10 text-center text-gray-500 font-medium">Carregando mural...</div>;

  return (
    <div className="p-6 max-w-7xl mx-auto font-sans relative">
      <div className="flex justify-between items-end mb-8 border-b pb-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Mural de Coletas</h1>
          <p className="text-gray-500 mt-1">Gerencie suas coletas</p>
        </div>
        <button onClick={fetchColetas} className="bg-white border text-gray-600 px-4 py-2 rounded-lg text-sm shadow-sm hover:bg-gray-50">
          ↻ Atualizar
        </button>
      </div>

      {visibleColetas.length === 0 ? (
        <div className="py-24 bg-gray-50 rounded-2xl border-2 border-dashed text-center text-gray-400">
          Nenhuma coleta disponível.
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
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
              <div key={coleta.id} className={`bg-white rounded-xl shadow-sm border p-6 flex flex-col ${isConcluida ? 'opacity-75 bg-gray-50' : ''}`}>
                
                {/* Header */}
                <div className="flex justify-between mb-4">
                  <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase ${
                    statusLabel === 'Em Andamento' ? 'bg-blue-100 text-blue-800' : 
                    statusLabel === 'Solicitada' ? 'bg-yellow-100 text-yellow-800' : 'bg-gray-200'
                  }`}>{statusLabel}</span>
                  <div className="flex items-center text-xs text-gray-400">
                    <CalendarIcon /> {new Date(coleta.data).toLocaleDateString('pt-BR')}
                  </div>
                </div>

                {/* Info */}
                <div className="mb-4">
                  <h3 className="text-xl font-bold capitalize">{coleta.tipoMaterial}</h3>
                  <p className="text-gray-500 text-sm">Qtd: <strong>{coleta.quantidade}</strong></p>
                </div>
                <div className="border-t mb-4"></div>
                <div className="mb-6 flex-1 text-sm">
                  <p className="text-gray-800 font-bold">{coleta.doador?.usuario?.nome || 'Anônimo'}</p>
                  <p className="text-gray-500 text-xs">{coleta.doador?.usuario?.endereco} - {coleta.doador?.usuario?.cidade}</p>
                </div>

                {/* --- BOTÕES --- */}
                <div className="pt-2 mt-auto">
                  {isConcluida ? (
                    <div className="w-full py-2 bg-gray-100 text-gray-500 rounded-lg text-center text-sm font-bold flex justify-center gap-2">
                       <CheckIcon /> Finalizada
                    </div>
                  ) : (
                    <>
                      {/* DOADOR */}
                      {isOwner && (
                        <div className="flex gap-2">
                           {(coleta.status === 'ACEITA' || coleta.status === 'EM_ANDAMENTO') && (
                              <button onClick={() => openConfirmModal(coleta.id)} className="flex-1 bg-blue-600 text-white py-2 rounded-lg text-sm flex justify-center items-center gap-1 hover:bg-blue-700">
                                <CheckIcon /> Confirmar
                              </button>
                           )}
                           <button onClick={() => openDeleteModal(coleta.id, 'delete')} className="flex-1 bg-red-50 text-red-600 py-2 rounded-lg text-sm flex justify-center items-center gap-1 hover:bg-red-100">
                              <TrashIcon /> Excluir
                           </button>
                        </div>
                      )}

                      {/* VOLUNTÁRIO/EMPRESA */}
                      {!isOwner && coleta.status === 'SOLICITADA' && (user.tipo !== 'DOADOR') && (
                          <button onClick={() => handleAccept(coleta.id)} className="w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 text-sm font-semibold">
                            Aceitar Coleta
                          </button>
                      )}

                      {/* VOLUNTÁRIO/EMPRESA */}
                      {isAcceptedByMe && (
                        <div className="flex gap-2">
                          <a href={getGoogleMapsLink(coleta)} target="_blank" className="flex-1 bg-green-600 text-white py-2 rounded-lg flex justify-center items-center gap-1 text-sm hover:bg-green-700">
                            <MapIcon /> Rota
                          </a>
                          <button onClick={() => openConfirmModal(coleta.id)} className="flex-1 bg-blue-600 text-white py-2 rounded-lg flex justify-center items-center gap-1 text-sm hover:bg-blue-700">
                            <CheckIcon /> Confirmar
                          </button>
                          <button onClick={() => openDeleteModal(coleta.id, 'release')} className="w-10 border border-red-200 text-red-500 rounded-lg flex justify-center items-center hover:bg-red-50" title="Cancelar">
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

      {/* --- MODAIS --- */}
      {(deleteModalOpen || confirmModalOpen) && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl shadow-xl p-6 max-w-sm w-full text-center">
            {deleteModalOpen ? <AlertIcon /> : <SuccessIcon />}
            <h3 className="text-lg font-bold mb-2 text-gray-800">
                {deleteModalOpen 
                  ? (actionType === 'delete' ? 'Excluir Solicitação?' : 'Cancelar Coleta?') 
                  : 'Confirmar Coleta?'}
            </h3>
            <p className="text-sm text-gray-500 mb-6">
                {deleteModalOpen 
                  ? (actionType === 'delete' ? 'Apagar permanentemente?' : 'A coleta voltará para o mural.') 
                  : 'Confirma que a coleta foi realizada?'}
            </p>
            <div className="flex gap-3">
              <button onClick={() => { setDeleteModalOpen(false); setConfirmModalOpen(false); }} className="flex-1 py-2 bg-gray-100 rounded-lg text-sm hover:bg-gray-200">Cancelar</button>
              <button 
                onClick={deleteModalOpen ? executeDeleteOrRelease : executeConcluir} 
                className={`flex-1 py-2 text-white rounded-lg text-sm ${deleteModalOpen ? 'bg-red-600 hover:bg-red-700' : 'bg-green-600 hover:bg-green-700'}`}
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