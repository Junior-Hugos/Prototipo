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
    <div className="min-h-screen flex flex-col md:flex-row bg-background">
      
      {/* LADO ESQUERDO (Decorativo) */}
      <div className="hidden md:flex w-1/2 bg-green-600 justify-center items-center p-12">
        <div className="text-white max-w-lg">
          <h1 className="text-4xl font-bold mb-6">Bem-vindo de volta!</h1>
          <p className="text-green-100 text-lg leading-relaxed">
            Acesse sua plataforma de gestão de resíduos e continue contribuindo para um futuro mais sustentável com o Collectiico.
          </p>
        </div>
      </div>

      {/* LADO DIREITO (Formulário) */}
      <div className="flex-1 flex items-center justify-center p-6 md:p-12 bg-white">
        <div className="max-w-md w-full space-y-8">
          
          <div className="text-center md:text-left">
            <h1 className="text-3xl font-bold text-primary mb-2">Login</h1>
            <p className="text-text-secondary">Preencha seus dados para entrar.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Campo Email */}
            <div>
              <label className="text-sm font-medium mb-1 block text-gray-700">Email</label>
              <input 
                type="email" 
                required 
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                placeholder="seu@email.com"
                value={email}
                onChange={e => setEmail(e.target.value)}
              />
            </div>
            
            {/* Campo Senha */}
            <div>
              <label className="text-sm font-medium mb-1 block text-gray-700">Senha</label>
              <input 
                type="password" 
                required 
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                placeholder="******"
                value={senha}
                onChange={e => setSenha(e.target.value)}
              />
            </div>

            <div className="flex items-center justify-end">
              <Link href="/recuperar-senha" className="text-sm text-primary hover:text-green-700 font-medium hover:underline">
                Esqueceu a senha?
              </Link>
            </div>

            {/* Botão de Login */}
            <button 
              type="submit" 
              disabled={loading} 
              className={`w-full p-3.5 rounded-lg font-bold text-white shadow-lg transition-transform transform active:scale-95 ${
                loading ? 'bg-gray-400 cursor-not-allowed' : 'btn-primary bg-green-600 hover:bg-green-700 hover:-translate-y-0.5'
              }`}
            >
              {loading ? 'Validando...' : 'Entrar'}
            </button>
          </form>

          <p className="text-center text-sm text-gray-500 mt-6">
            Não tem uma conta? <Link href="/cadastro" className="text-primary font-bold hover:underline">Cadastre-se</Link>
          </p>
        </div>
      </div>
    </div>
  );
}