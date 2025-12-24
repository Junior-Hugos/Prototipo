"use client";
import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { toast } from 'react-hot-toast';

// Ícone de Cadeado para o Modal
const LockIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-amber-500 mb-4 mx-auto">
    <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
    <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
  </svg>
);

export default function CadastroPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [showBlockedModal, setShowBlockedModal] = useState(false); // Estado do Modal

  const [formData, setFormData] = useState({
    nome: "",
    email: "",
    password: "",
    endereco: "",
    tipo: "DOADOR",
    telefone: "",
    disponibilidade: "",
    cnpj: "",
    tipoMaterialAceito: "",
  });

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    setFormData((prev) => ({ ...prev, [e.target.id]: e.target.value }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      // --- LÓGICA DO MODAL ---
      // Se receber status 403, o cadastro está travado
      if (res.status === 403) {
         setShowBlockedModal(true);
         setIsLoading(false);
         return;
      }

      if (!res.ok) {
        throw new Error((await res.json()).error || "Falha no cadastro");
      }

      toast.success("Usuário cadastrado com sucesso! Faça o login.");
      router.push("/login");
    } catch (error: any) {
      toast.error("Erro: " + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-6 py-12 relative">
      <h2 className="text-3xl font-bold text-text-primary mb-2 text-center">
        Tela de Cadastro
      </h2>
      <p className="text-text-secondary mb-8 text-center">
        Crie sua conta para começar a reciclar.
      </p>

      <form
        onSubmit={handleSubmit}
        className="space-y-6 bg-white p-8 rounded-2xl shadow-card"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <label htmlFor="nome" className="block text-sm font-medium mb-1">
              Nome Completo
            </label>
            <input
              id="nome"
              type="text"
              required
              value={formData.nome}
              onChange={handleChange}
              className="w-full p-2 border rounded"
            />
          </div>
          <div>
            <label htmlFor="email" className="block text-sm font-medium mb-1">
              Email
            </label>
            <input
              id="email"
              type="email"
              required
              value={formData.email}
              onChange={handleChange}
              className="w-full p-2 border rounded"
            />
          </div>
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium mb-1"
            >
              Senha
            </label>
            <input
              id="password"
              type="password"
              required
              value={formData.password}
              onChange={handleChange}
              className="w-full p-2 border rounded"
            />
          </div>
          <div>
            <label
              htmlFor="endereco"
              className="block text-sm font-medium mb-1"
            >
              Endereço Principal
            </label>
            <input
              id="endereco"
              type="text"
              value={formData.endereco}
              onChange={handleChange}
              className="w-full p-2 border rounded"
            />
          </div>
        </div>

        <hr className="border-border-light" />

        <div>
          <label htmlFor="tipo" className="block text-sm font-medium mb-1">
            Eu sou...
          </label>
          <select
            id="tipo"
            required
            value={formData.tipo}
            onChange={handleChange}
            className="w-full p-2 border rounded bg-white"
          >
            <option value="DOADOR">Doador (Quero solicitar coletas)</option>
            <option value="VOLUNTARIO">
              Voluntário (Quero realizar coletas)
            </option>
            <option value="EMPRESA">
              Cooperativa / Empresa (Quero receber materiais)
            </option>
          </select>
        </div>

        {/* Campos de Perfil Dinâmicos */}
        {formData.tipo === "DOADOR" && (
          <div>
            <label
              htmlFor="telefone"
              className="block text-sm font-medium mb-1"
            >
              Telefone (Opcional)
            </label>
            <input
              id="telefone"
              type="tel"
              placeholder="(99) 99999-9999"
              value={formData.telefone}
              onChange={handleChange}
              className="w-full p-2 border rounded"
            />
          </div>
        )}

        {formData.tipo === "VOLUNTARIO" && (
          <div>
            <label
              htmlFor="disponibilidade"
              className="block text-sm font-medium mb-1"
            >
              Disponibilidade (Opcional)
            </label>
            <input
              id="disponibilidade"
              type="text"
              placeholder="Ex: Finais de semana, Manhãs de Seg/Qua"
              value={formData.disponibilidade}
              onChange={handleChange}
              className="w-full p-2 border rounded"
            />
          </div>
        )}

        {formData.tipo === "EMPRESA" && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label htmlFor="cnpj" className="block text-sm font-medium mb-1">
                CNPJ (Obrigatório)
              </label>             
              <input
                id="cnpj"
                type="text"
                required
                value={formData.cnpj}
                onChange={handleChange}
                className="w-full p-2 border rounded"
              />
            </div>
            <div>
              <label
                htmlFor="tipoMaterialAceito"
                className="block text-sm font-medium mb-1"
              >
                Material que Aceita (Opcional)
              </label>
              <input
                id="tipoMaterialAceito"
                type="text"
                placeholder="Ex: Papelão, Vidro"
                value={formData.tipoMaterialAceito}
                onChange={handleChange}
                className="w-full p-2 border rounded"
              />
            </div>
          </div>
        )}

        {/* Submit */}
        <div className="flex flex-col gap-3 pt-4">
          <button
            type="submit"
            disabled={isLoading}
            className="btn-primary w-full p-3 rounded text-white font-bold"
          >
            {isLoading ? "Processando..." : "Criar minha conta"}
          </button>
          <p className="text-sm text-text-secondary text-center">
            Já tem conta?{" "}
            <Link
              href="/login"
              className="text-primary font-medium hover:underline"
            >
              Faça login
            </Link>
            .
          </p>
        </div>
      </form>

      {/* --- MODAL DE BLOQUEIO (BETA FECHADO) --- */}
      {showBlockedModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-sm w-full text-center animate-in zoom-in duration-200">
            <LockIcon />
            <h3 className="text-xl font-bold text-gray-800 mb-2">Cadastros Suspensos</h3>
            <p className="text-gray-600 mb-6 text-sm leading-relaxed">
              No momento, o <strong>Collectiico</strong> está operando em modo de demonstração fechada para testes de estabilidade.
            </p>
            <div className="bg-amber-50 border border-amber-100 rounded-lg p-3 mb-6 text-xs text-amber-800">
               Usuários convidados podem acessar usando as contas de demonstração fornecidas.
            </div>
            <button 
              onClick={() => setShowBlockedModal(false)}
              className="w-full py-2.5 bg-gray-900 text-white font-semibold rounded-lg hover:bg-gray-800 transition-colors"
            >
              Entendi
            </button>
          </div>
        </div>
      )}

    </div>
  );
}