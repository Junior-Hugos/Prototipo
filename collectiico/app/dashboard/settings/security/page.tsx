"use client";

import { useState, FormEvent } from 'react';
import { toast } from 'react-hot-toast';

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
    
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    toast.success('Senha alterada com sucesso!');
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
    setIsSaving(false);
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-2 text-text-primary">Segurança</h1>
      <p className="text-text-secondary mb-6">Atualize sua senha e proteja sua conta.</p>

      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-xl shadow-card border border-border-light max-w-xl space-y-5">
        
        <div>
          <label className="block text-sm font-medium mb-1">Senha Atual</label>
          <input 
            type="password" 
            required
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            placeholder="Digite sua senha atual"
          />
        </div>

        <hr className="border-border-light" />

        <div>
          <label className="block text-sm font-medium mb-1">Nova Senha</label>
          <input 
            type="password" 
            required
            minLength={6}
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            placeholder="Mínimo de 6 caracteres"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Confirmar Nova Senha</label>
          <input 
            type="password" 
            required
            minLength={6}
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Digite a nova senha novamente"
          />
        </div>

        <div className="pt-4">
          <button type="submit" disabled={isSaving} className="btn-primary w-full md:w-auto">
            {isSaving ? 'Atualizando...' : 'Atualizar Senha'}
          </button>
        </div>
      </form>

      {/*  Deletar Conta */}
      <div className="mt-8 p-6 bg-red-50 rounded-xl border border-red-100 max-w-xl">
        <h3 className="text-red-800 font-bold mb-2">Zona de Perigo</h3>
        <p className="text-sm text-red-600 mb-4">Ao deletar sua conta, todos os seus dados de coletas e histórico serão removidos permanentemente.</p>
        <button type="button" className="text-red-600 font-medium text-sm hover:underline border border-red-200 px-4 py-2 rounded-lg bg-white hover:bg-red-50 transition">
          Quero deletar minha conta
        </button>
      </div>
    </div>
  );
}