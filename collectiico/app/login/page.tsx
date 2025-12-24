"use client";
import { useState, FormEvent } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import toast from 'react-hot-toast'; 

export default function LoginPage() {
  const { login } = useAuth();
  const router = useRouter();
  
  // Estados do formulário
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true); 

    try {
      await login(email, senha); 
      toast.success('Login realizado com sucesso!');      
      router.refresh();
      router.push('/dashboard');
    } catch (error: any) {      
      toast.error('Email ou senha incorretos.');      
      setLoading(false); 
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <div className="max-w-md w-full bg-white p-8 rounded-2xl shadow-card space-y-6">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-primary mb-2">Bem-vindo</h1>
          <p className="text-text-secondary">Faça login para continuar</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Campo Email */}
          <div>
            <label className="text-sm font-medium mb-1 block">Email</label>
            <input 
              type="email" 
              required 
              className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-primary/20 outline-none transition-all"
              placeholder="seu@email.com"
              value={email}
              onChange={e => setEmail(e.target.value)}
            />
          </div>
          
          {/* Campo Senha */}
          <div>
            <label className="text-sm font-medium mb-1 block">Senha</label>
            <input 
              type="password" 
              required 
              className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-primary/20 outline-none transition-all"
              placeholder="******"
              value={senha}
              onChange={e => setSenha(e.target.value)}
            />
          </div>

          <div className="flex items-center justify-between">
            <Link href="/recuperar-senha" className="text-sm text-primary hover:underline">
              Esqueceu a senha?
            </Link>
          </div>

          {/* Botão de Login */}
          <button 
            type="submit" 
            disabled={loading} 
            className={`w-full p-3 rounded-lg font-bold text-white transition-colors ${
              loading ? 'bg-gray-400 cursor-not-allowed' : 'btn-primary hover:bg-green-700'
            }`}
          >
            {loading ? 'Validando...' : 'Entrar'}
          </button>
        </form>

        <p className="text-center text-sm text-text-secondary">
          Não tem uma conta? <Link href="/cadastro" className="text-primary font-bold hover:underline">Cadastre-se</Link>
        </p>
      </div>
    </div>
  );
}