// app/dashboard/settings/page.tsx
"use client"; 

import { useState, useEffect, FormEvent } from 'react';
import { useAuth } from '@/context/AuthContext'; 

export default function GeneralSettingsPage() {
  const { session } = useAuth(); 
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Preenche o formulário com os dados do usuário carregados
  useEffect(() => {
    if (session) {
      setNome(session.nome || '');
      setEmail(session.email || '');
    }
  }, [session]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setStatusMessage(null); 
    try {
    
      
      await new Promise(resolve => setTimeout(resolve, 1000));
      setStatusMessage({ type: 'success', text: 'Perfil atualizado com sucesso! (Simulação)' });
      

    } catch (error: any) {
      setStatusMessage({ type: 'error', text: 'Erro: ' + error.message });
    } finally {
      setIsSaving(false);
    }
  };

  if (session === undefined) {
    return <p className="text-text-secondary">Carregando dados...</p>;
  }

  return (
    // Será renderizado DENTRO do <div> do SettingsLayout
    <div>
      <h1 className="text-2xl font-bold mb-6 text-text-primary">Configurações Gerais</h1>

      {/* --- FORMULÁRIO --- */}
      <form onSubmit={handleSubmit} className="space-y-5 max-w-lg bg-white p-6 rounded-xl shadow-card border border-border-light">
        <div>
          <label htmlFor="nome" className="block text-sm font-medium text-text-primary mb-1.5">
            Nome Completo
          </label>
          <input
            type="text"
            id="nome"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            required
            className="w-full" 
            aria-describedby="nome-helper"
          />
           <p id="nome-helper" className="mt-1 text-xs text-text-secondary">Seu nome como será exibido no sistema.</p>
        </div>
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-text-primary mb-1.5">
            Email
          </label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full"
             aria-describedby="email-helper"
          />
           <p id="email-helper" className="mt-1 text-xs text-text-secondary">Seu email de login. Para alterá-lo, entre em contato.</p>
        </div>

        {/* Mensagem de Status */}
        {statusMessage && (
          <div className={`text-sm p-3 rounded-md ${
            statusMessage.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
          }`}>
            {statusMessage.text}
          </div>
        )}

        {/* Botão Salvar */}
        <div className="pt-2">
          <button
            type="submit"
            disabled={isSaving}
            className="btn-primary px-5 py-2.5 text-sm" // Usa o estilo do globals.css, ajusta padding/tamanho
          >
            {isSaving ? 'Salvando...' : 'Salvar Alterações'}
          </button>
        </div>
      </form>
      {/* --- FIM DO FORMULÁRIO --- */}

    </div>
  );
}
