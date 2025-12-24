"use client"; 

import { useState, useEffect, FormEvent } from 'react';
import { useAuth } from '@/context/AuthContext'; 

// Ícone de Configuração (Opcional, para dar um charme no header)
const SettingsIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-400"><path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.47a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"/><circle cx="12" cy="12" r="3"/></svg>);

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
    return <div className="p-8 text-center text-gray-500 font-medium">Carregando dados...</div>;
  }

  return (
    // Container com padding responsivo
    <div className="p-4 md:p-6 max-w-4xl mx-auto">
      
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-white rounded-lg border border-gray-100 shadow-sm">
            <SettingsIcon />
        </div>
        <h1 className="text-2xl font-bold text-gray-800">Configurações Gerais</h1>
      </div>

      {/* --- FORMULÁRIO --- */}
      <form onSubmit={handleSubmit} className="space-y-6 max-w-xl bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-gray-100">
        
        {/* Nome */}
        <div>
          <label htmlFor="nome" className="block text-sm font-bold text-gray-700 mb-2">
            Nome Completo
          </label>
          <input
            type="text"
            id="nome"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            required
            className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all" 
            placeholder="Seu nome completo"
          />
          <p className="mt-2 text-xs text-gray-500">Este é o nome que aparecerá no seu perfil público.</p>
        </div>

        {/* Email */}
        <div>
          <label htmlFor="email" className="block text-sm font-bold text-gray-700 mb-2">
            Email
          </label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all"
          />
          <p className="mt-2 text-xs text-gray-500">Seu email de login. Para alterá-lo, entre em contato com o suporte.</p>
        </div>

        {/* Mensagem de Status  */}
        {statusMessage && (
          <div className={`text-sm p-4 rounded-xl font-medium border animate-in fade-in slide-in-from-top-2 ${
            statusMessage.type === 'success' 
                ? 'bg-green-50 text-green-700 border-green-100' 
                : 'bg-red-50 text-red-700 border-red-100'
          }`}>
            {statusMessage.text}
          </div>
        )}

        {/* Botão Salvar */}
        <div className="pt-2">
          <button
            type="submit"
            disabled={isSaving}
            className="w-full md:w-auto px-8 py-3 bg-green-600 text-white font-bold rounded-xl hover:bg-green-700 transition-all shadow-sm active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSaving ? 'Salvando...' : 'Salvar Alterações'}
          </button>
        </div>
      </form>
      {/* --- FIM DO FORMULÁRIO --- */}

    </div>
  );
}