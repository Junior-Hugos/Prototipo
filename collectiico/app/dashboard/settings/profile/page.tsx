"use client";

import { useState, useEffect, FormEvent } from 'react';
import { useAuth } from '@/context/AuthContext';
import { toast } from 'react-hot-toast';

// Ícone de Perfil
const UserIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-400"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>);

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

  if (isLoading) return <div className="p-8 text-center text-gray-500 font-medium">Carregando perfil...</div>;

  return (
    <div className="p-4 md:p-6 max-w-4xl mx-auto">
      
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-white rounded-lg border border-gray-100 shadow-sm">
            <UserIcon />
        </div>
        <div>
           <h1 className="text-2xl font-bold text-gray-800">Meu Perfil</h1>
           <p className="text-gray-500 text-sm">Gerencie suas informações públicas e de contato.</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-gray-100 max-w-2xl space-y-6">
        
        {/* Foto de Perfil */}
        <div className="flex items-center gap-5 p-4 bg-gray-50 rounded-xl border border-gray-100">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center text-green-700 text-2xl font-bold border-2 border-white shadow-sm">
            {session?.nome?.charAt(0) || 'U'}
          </div>
          <div>
            <p className="font-bold text-gray-800 text-lg">{session?.nome}</p>
            <p className="text-xs text-gray-500 font-medium">Sua foto é gerada automaticamente.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Telefone / WhatsApp</label>
            <input 
              type="tel" 
              value={telefone}
              onChange={(e) => setTelefone(e.target.value)}
              placeholder="(00) 00000-0000"
              className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all"
            />
          </div>
          
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Cidade / Estado</label>
            <input 
              type="text" 
              placeholder="Ex: São Paulo, SP"
              value={cidade}
              onChange={(e) => setCidade(e.target.value)}
              className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all" 
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-bold text-gray-700 mb-2">Endereço Completo</label>
          <input 
            type="text" 
            value={endereco}
            onChange={(e) => setEndereco(e.target.value)}
            placeholder="Rua, Número, Bairro"
            className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all"
          />
          <p className="text-xs text-gray-500 mt-2 flex items-center gap-1">
             📍 Usado para calcular a rota das coletas.
          </p>
        </div>

        <div>
          <label className="block text-sm font-bold text-gray-700 mb-2">Sobre mim (Bio)</label>
          <div className="relative">
             <textarea 
                rows={4}
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                placeholder="Conte um pouco sobre sua participação na reciclagem..."
                maxLength={255} 
                className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all resize-none"
             ></textarea>
             <div className={`absolute bottom-3 right-3 text-xs font-bold px-2 py-1 rounded bg-white/80 backdrop-blur-sm ${bio.length === 255 ? 'text-red-500' : 'text-gray-400'}`}>
                {bio.length}/255
             </div>
          </div>
        </div>

        <div className="pt-2 flex justify-end">
          <button 
             type="submit" 
             disabled={isSaving} 
             className="w-full md:w-auto px-8 py-3 bg-green-600 text-white font-bold rounded-xl hover:bg-green-700 transition-all shadow-sm active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSaving ? 'Salvando...' : 'Salvar Alterações'}
          </button>
        </div>
      </form>
    </div>
  );
}