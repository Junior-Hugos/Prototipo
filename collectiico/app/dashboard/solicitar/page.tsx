"use client";

import { useState, FormEvent, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';

// Ícone para ilustrar a página
const RecyclePlusIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-green-600 mb-4 mx-auto">
    <path d="M7 19a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-6a2 2 0 0 0-2 2v10Z"/>
    <path d="M12 12v6"/>
    <path d="M9 15h6"/>
    <path d="M5 6h14"/>
    <path d="M9 6v-1a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v1"/>
  </svg>
);

// Ícone de Bloqueio
const LockIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-gray-400 mb-4 mx-auto">
    <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
    <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
  </svg>
);

export default function SolicitarPage() {
  const { session, isLoading: isAuthLoading } = useAuth();
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [formData, setFormData] = useState({
    tipoMaterial: '',
    quantidade: '',
    data: new Date().toISOString().split('T')[0], 
  });

  useEffect(() => {
    if (!isAuthLoading && !session) {
      toast.error('Você precisa estar logado para solicitar.');
      router.push('/login');
    }
  }, [session, isAuthLoading, router]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const res = await fetch('/api/coletas', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        throw new Error((await res.json()).message || 'Falha ao solicitar');
      }
      
      toast.success('Solicitação enviada com sucesso!'); 
      router.push('/dashboard/coletas'); 
    } catch (error: any) {
      toast.error(error.message || 'Erro ao enviar solicitação.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isAuthLoading || !session) return <div className="min-h-[50vh] flex items-center justify-center text-green-600 font-bold">Carregando...</div>;

  // Se não for DOADOR, bloqueia com visual amigável
  if (session.tipo !== 'DOADOR') {
      return (
        <div className="max-w-md mx-auto px-6 py-20 text-center flex flex-col items-center justify-center">
           <div className="bg-gray-100 p-6 rounded-full mb-6">
              <LockIcon />
           </div>
           <h2 className="text-2xl font-bold text-gray-800 mb-2">Acesso Restrito</h2>
           <p className="text-gray-500 mb-6 leading-relaxed">
             Apenas usuários cadastrados como <strong>Doador</strong> podem solicitar coletas. Seu perfil atual é de {session.tipo.toLowerCase()}.
           </p>
           <button onClick={() => router.push('/dashboard')} className="text-green-600 font-bold hover:underline">
             Voltar ao Início
           </button>
        </div>
      );
  }

  // Estilos reutilizáveis
  const labelClass = "block text-sm font-bold text-gray-700 mb-2";
  const inputClass = "w-full p-3.5 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all text-base";

  return (
    <div className="max-w-2xl mx-auto p-4 md:p-8">
      
      <div className="text-center mb-8">
        <RecyclePlusIcon />
        <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-2">Solicitar Coleta</h2>
        <p className="text-gray-500 text-sm md:text-base">
          O motorista irá buscar no endereço: <br className="md:hidden"/>
          <span className="font-semibold text-gray-700">{session.endereco || "Endereço não informado"}</span>
        </p>
      </div>

      <form onSubmit={handleSubmit} className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-gray-100 space-y-6">
        
        {/* Material */}
        <div>
          <label htmlFor="tipoMaterial" className={labelClass}>
            O que você vai doar?
          </label>
          <input 
            id="tipoMaterial"
            type="text"
            placeholder="Ex: Papelão, Plástico, Vidro" 
            required 
            className={inputClass}
            value={formData.tipoMaterial}
            onChange={e => setFormData({...formData, tipoMaterial: e.target.value})}
          />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="quantidade" className={labelClass}>
              Quantidade Estimada
            </label>
             <input 
              id="quantidade"
              type="number"
              step="0.1"
              placeholder="Ex: 5.5 (Kg ou Sacos)" 
              required 
              className={inputClass}
              value={formData.quantidade}
              onChange={e => setFormData({...formData, quantidade: e.target.value})}
            />
          </div>
          <div>
            <label htmlFor="data" className={labelClass}>
              Data Preferencial
            </label>
             <input 
              id="data"
              type="date"
              required 
              className={`${inputClass} appearance-none`} // appearance-none ajuda no iOS
              value={formData.data}
              onChange={e => setFormData({...formData, data: e.target.value})}
            />
          </div>
        </div>

        <div className="pt-4">
          <button 
            type="submit" 
            disabled={isSubmitting} 
            className="w-full bg-green-600 text-white font-bold py-4 rounded-xl shadow-lg hover:bg-green-700 transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? 'Enviando Solicitação...' : 'Confirmar Solicitação'}
          </button>
        </div>
      </form>
      
      <p className="text-center text-xs text-gray-400 mt-6">
        Ao confirmar, sua solicitação ficará visível para voluntários e cooperativas da região.
      </p>
    </div>
  );
}