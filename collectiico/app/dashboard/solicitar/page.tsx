"use client";

import { useState, FormEvent, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';

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

  if (isAuthLoading || !session) return <div className="text-center p-12">Carregando...</div>;

  // Se não for DOADOR, bloqueia
  if (session.tipo !== 'DOADOR') {
      return (
        <div className="max-w-3xl mx-auto px-6 py-12 text-center">
           <h2 className="text-3xl font-bold text-text-primary mb-2">Página Indisponível</h2>
           <p className="text-text-secondary">Apenas usuários do tipo "Doador" podem solicitar coletas.</p>
        </div>
      );
  }

  return (
    <div className="max-w-3xl mx-auto px-6 py-12">
      <h2 className="text-3xl font-bold text-text-primary mb-2 text-center">Solicitar Coleta</h2>
      <p className="text-text-secondary mb-8 text-center">
        Seu endereço cadastrado será usado: ({session.endereco || "Não informado"})
      </p>

      <form onSubmit={handleSubmit} className="bg-white p-8 rounded-2xl shadow-card space-y-5">
        
        <div>
          <label className="text-sm font-medium mb-1 block text-text-primary">Tipo de Material</label>
          <input 
            id="tipoMaterial"
            type="text"
            placeholder="Ex: Papelão, Plástico, Vidro" 
            required 
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/50 outline-none"
            value={formData.tipoMaterial}
            onChange={e => setFormData({...formData, tipoMaterial: e.target.value})}
          />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <label className="text-sm font-medium mb-1 block text-text-primary">Quantidade (Kg ou Vol)</label>
             <input 
              id="quantidade"
              type="number"
              step="0.1"
              placeholder="Ex: 5.5" 
              required 
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/50 outline-none"
              value={formData.quantidade}
              onChange={e => setFormData({...formData, quantidade: e.target.value})}
            />
          </div>
          <div>
            <label className="text-sm font-medium mb-1 block text-text-primary">Data preferencial</label>
             <input 
              id="data"
              type="date"
              required 
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/50 outline-none"
              value={formData.data}
              onChange={e => setFormData({...formData, data: e.target.value})}
            />
          </div>
        </div>

        <div className="pt-4">
          <button type="submit" disabled={isSubmitting} className="btn-primary w-full">
            {isSubmitting ? 'Enviando...' : 'Confirmar Solicitação'}
          </button>
        </div>
      </form>
    </div>
  );
}