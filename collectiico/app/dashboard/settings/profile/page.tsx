"use client";

import { useState, useEffect, FormEvent } from 'react';
import { useAuth } from '@/context/AuthContext';
import { toast } from 'react-hot-toast';

export default function ProfileSettingsPage() {
  const { session } = useAuth(); 
  
  const [telefone, setTelefone] = useState('');
  const [endereco, setEndereco] = useState('');
  const [cidade, setCidade] = useState(''); 
  const [bio, setBio] = useState('');
  
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  // CARREGAR DADOS DO BANCO (GET)
  useEffect(() => {
    async function fetchProfile() {
      if (session?.email) {
        try {
          const res = await fetch(`/api/user/profile?email=${session.email}`);
          const data = await res.json();
          
          if (res.ok) {
            setEndereco(data.endereco || '');
            setTelefone(data.doador?.telefone || ''); 
            setBio(data.bio || ''); 
            setCidade(data.cidade || ''); 
          }
        } catch (error) {
          console.error("Erro ao carregar perfil", error);
        } finally {
          setIsLoading(false);
        }
      }
    }
    fetchProfile();
  }, [session]);

  // SALVAR DADOS NO BANCO (PUT)
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    
    try {
      const response = await fetch('/api/user/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: session?.email, 
          endereco,
          telefone,
          bio,
          cidade 
        }),
      });

      const data = await response.json();

      if (response.ok) {
        toast.success('Perfil atualizado com sucesso!');
      } else {
        toast.error(data.error || 'Erro ao atualizar.');
      }

    } catch (error) {
      toast.error('Erro de conexão.');
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) return <div className="p-6">Carregando dados...</div>;

  return (
    <div>
      <h1 className="text-2xl font-bold mb-2 text-text-primary">Meu Perfil</h1>
      <p className="text-text-secondary mb-6">Gerencie suas informações públicas e de contato.</p>

      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-xl shadow-card border border-border-light max-w-2xl space-y-5">
        
        {/* Foto de Perfil */}
        <div className="flex items-center gap-4 mb-4">
          <div className="w-16 h-16 bg-primary-light rounded-full flex items-center justify-center text-primary text-xl font-bold">
            {session?.nome?.charAt(0) || 'U'}
          </div>
          <div>
            <p className="font-bold text-text-primary">{session?.nome}</p>
            <p className="text-xs text-text-secondary">Para alterar a foto, integre com storage.</p>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-5">
          <div>
            <label className="block text-sm font-medium mb-1">Telefone / WhatsApp</label>
            <input 
              type="tel" 
              value={telefone}
              onChange={(e) => setTelefone(e.target.value)}
              placeholder="(00) 00000-0000"
              className="w-full border p-2 rounded"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">Cidade / Estado</label>
            <input 
              type="text" 
              placeholder="Ex: São Paulo, SP"
              value={cidade}
              onChange={(e) => setCidade(e.target.value)}
              className="w-full border p-2 rounded" 
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Endereço Completo</label>
          <input 
            type="text" 
            value={endereco}
            onChange={(e) => setEndereco(e.target.value)}
            placeholder="Rua, Número, Bairro"
            className="w-full border p-2 rounded"
          />
          <p className="text-xs text-text-secondary mt-1">Usado para calcular rotas de coleta.</p>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Sobre mim (Bio)</label>
          <textarea 
            rows={3}
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            placeholder="Conte um pouco sobre sua participação na reciclagem..."
            maxLength={255} 
            className="w-full border p-2 rounded resize-none"
          ></textarea>
          
          <p className={`text-xs mt-1 text-right ${bio.length === 255 ? 'text-red-500 font-bold' : 'text-text-secondary'}`}>
            {bio.length}/255 caracteres
          </p>
        </div>

        <div className="pt-2 flex justify-end">
          <button type="submit" disabled={isSaving} className="btn-primary px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700">
            {isSaving ? 'Salvando...' : 'Salvar Alterações'}
          </button>
        </div>
      </form>
    </div>
  );
}