"use client";

import { useState, FormEvent } from 'react';
import { toast } from 'react-hot-toast';

// Ícone de Cadeado/Segurança
const LockIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-400"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>);

export default function SecuritySettingsPage() {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    
    if (newPassword !== confirmPassword) {
      toast.error("As novas senhas não conferem.");
      return;
    }

    setIsSaving(true);
    
    // Simulação de chamada de API
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    toast.success('Senha alterada com sucesso!');
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
    setIsSaving(false);
  };

  return (
    <div className="p-4 md:p-6 max-w-4xl mx-auto">
      
      {/* Cabeçalho */}
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-white rounded-lg border border-gray-100 shadow-sm">
            <LockIcon />
        </div>
        <div>
           <h1 className="text-2xl font-bold text-gray-800">Segurança</h1>
           <p className="text-gray-500 text-sm">Atualize sua senha e proteja sua conta.</p>
        </div>
      </div>

      {/* Formulário de Senha */}
      <form onSubmit={handleSubmit} className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-gray-100 max-w-xl space-y-6">
        
        <div>
          <label className="block text-sm font-bold text-gray-700 mb-2">Senha Atual</label>
          <input 
            type="password" 
            required
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            placeholder="••••••••"
            className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all"
          />
        </div>

        <div className="border-t border-gray-100 my-4"></div>

        <div>
          <label className="block text-sm font-bold text-gray-700 mb-2">Nova Senha</label>
          <input 
            type="password" 
            required
            minLength={6}
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            placeholder="Mínimo de 6 caracteres"
            className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all"
          />
        </div>

        <div>
          <label className="block text-sm font-bold text-gray-700 mb-2">Confirmar Nova Senha</label>
          <input 
            type="password" 
            required
            minLength={6}
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Digite a nova senha novamente"
            className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all"
          />
        </div>

        <div className="pt-2">
          <button 
             type="submit" 
             disabled={isSaving} 
             className="w-full md:w-auto px-8 py-3 bg-green-600 text-white font-bold rounded-xl hover:bg-green-700 transition-all shadow-sm active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSaving ? 'Atualizando...' : 'Atualizar Senha'}
          </button>
        </div>
      </form>

      {/* Zona de Perigo */}
      <div className="mt-8 p-6 bg-red-50 rounded-2xl border border-red-100 max-w-xl">
        <h3 className="text-red-800 font-bold text-lg mb-2 flex items-center gap-2">
           ⚠️ Zona de Perigo
        </h3>
        <p className="text-sm text-red-600/80 mb-6 leading-relaxed">
           Ao deletar sua conta, todos os seus dados de coletas, histórico e informações pessoais serão removidos permanentemente. Esta ação não pode ser desfeita.
        </p>
        <button 
           type="button" 
           className="w-full md:w-auto text-red-700 font-bold text-sm border border-red-200 px-6 py-3 rounded-xl bg-white hover:bg-red-50 hover:border-red-300 transition-colors shadow-sm"
        >
          Quero deletar minha conta
        </button>
      </div>
    </div>
  );
}