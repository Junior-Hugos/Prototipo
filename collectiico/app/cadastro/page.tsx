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

  // Classe padrão para inputs para manter consistência
  const inputClass = "w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all bg-gray-50 focus:bg-white";
  const labelClass = "block text-sm font-bold text-gray-700 mb-1.5";

  return (
    <div className="min-h-screen bg-gray-50 py-8 md:py-12 px-4 sm:px-6 lg:px-8 flex justify-center items-center">
      <div className="max-w-3xl w-full space-y-8">
        
        {/* Cabeçalho */}
        <div className="text-center">
          <h2 className="text-3xl font-extrabold text-gray-900">
            Crie sua conta
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Junte-se ao Collectiico e comece a transformar o mundo hoje.
          </p>
        </div>

        {/* Card do Formulário */}
        <div className="bg-white py-8 px-6 shadow-xl rounded-2xl sm:px-10 border border-gray-100">
          <form onSubmit={handleSubmit} className="space-y-6">
            
            {/* Grid Principal: 1 Coluna no Mobile, 2 no Desktop */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* Nome */}
              <div className="col-span-1">
                <label htmlFor="nome" className={labelClass}>Nome Completo</label>
                <input
                  id="nome"
                  type="text"
                  required
                  value={formData.nome}
                  onChange={handleChange}
                  className={inputClass}
                  placeholder="Seu nome"
                />
              </div>

              {/* Email */}
              <div className="col-span-1">
                <label htmlFor="email" className={labelClass}>Email</label>
                <input
                  id="email"
                  type="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className={inputClass}
                  placeholder="seu@email.com"
                />
              </div>

              {/* Senha */}
              <div className="col-span-1">
                <label htmlFor="password" className={labelClass}>Senha</label>
                <input
                  id="password"
                  type="password"
                  required
                  value={formData.password}
                  onChange={handleChange}
                  className={inputClass}
                  placeholder="******"
                />
              </div>

              {/* Endereço */}
              <div className="col-span-1">
                <label htmlFor="endereco" className={labelClass}>Endereço Principal</label>
                <input
                  id="endereco"
                  type="text"
                  value={formData.endereco}
                  onChange={handleChange}
                  className={inputClass}
                  placeholder="Rua, Número - Bairro"
                />
              </div>
            </div>

            <hr className="border-gray-200 my-6" />

            {/* Tipo de Usuário */}
            <div>
              <label htmlFor="tipo" className={labelClass}>Eu sou...</label>
              <select
                id="tipo"
                required
                value={formData.tipo}
                onChange={handleChange}
                className={`${inputClass} cursor-pointer`}
              >
                <option value="DOADOR">Doador (Quero solicitar coletas)</option>
                <option value="VOLUNTARIO">Voluntário (Quero realizar coletas)</option>
                <option value="EMPRESA">Cooperativa / Empresa (Quero receber materiais)</option>
              </select>
            </div>

            {/* Campos Condicionais (Fundo levemente diferente para destaque) */}
            <div className="bg-gray-50 p-4 rounded-xl border border-gray-100 animate-in fade-in slide-in-from-top-2 duration-300">
                {formData.tipo === "DOADOR" && (
                  <div>
                    <label htmlFor="telefone" className={labelClass}>Telefone (WhatsApp)</label>
                    <input
                      id="telefone"
                      type="tel"
                      placeholder="(99) 99999-9999"
                      value={formData.telefone}
                      onChange={handleChange}
                      className={inputClass}
                    />
                  </div>
                )}

                {formData.tipo === "VOLUNTARIO" && (
                  <div>
                    <label htmlFor="disponibilidade" className={labelClass}>Sua Disponibilidade</label>
                    <input
                      id="disponibilidade"
                      type="text"
                      placeholder="Ex: Finais de semana, Manhãs de Seg/Qua"
                      value={formData.disponibilidade}
                      onChange={handleChange}
                      className={inputClass}
                    />
                  </div>
                )}

                {formData.tipo === "EMPRESA" && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div>
                      <label htmlFor="cnpj" className={labelClass}>CNPJ (Obrigatório)</label>            
                      <input
                        id="cnpj"
                        type="text"
                        required
                        value={formData.cnpj}
                        onChange={handleChange}
                        className={inputClass}
                        placeholder="00.000.000/0001-00"
                      />
                    </div>
                    <div>
                      <label htmlFor="tipoMaterialAceito" className={labelClass}>Material Aceito</label>
                      <input
                        id="tipoMaterialAceito"
                        type="text"
                        placeholder="Ex: Papelão, Vidro, Plástico"
                        value={formData.tipoMaterialAceito}
                        onChange={handleChange}
                        className={inputClass}
                      />
                    </div>
                  </div>
                )}
            </div>

            {/* Botão de Submit */}
            <div className="pt-4">
              <button
                type="submit"
                disabled={isLoading}
                className={`w-full flex justify-center py-3.5 px-4 border border-transparent rounded-lg shadow-md text-sm font-bold text-white transition-all transform hover:-translate-y-0.5 ${
                  isLoading ? "bg-gray-400 cursor-not-allowed" : "bg-green-600 hover:bg-green-700 hover:shadow-lg"
                }`}
              >
                {isLoading ? "Criando conta..." : "Criar minha conta"}
              </button>
            </div>

            {/* Link Login */}
            <div className="text-center mt-4">
              <p className="text-sm text-gray-600">
                Já tem conta?{" "}
                <Link
                  href="/login"
                  className="font-bold text-green-600 hover:text-green-500 hover:underline transition-colors"
                >
                  Faça login aqui
                </Link>
              </p>
            </div>

          </form>
        </div>
      </div>

      {/* --- MODAL DE BLOQUEIO --- */}
      {showBlockedModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-300">
          <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-sm w-full text-center animate-in zoom-in-95 duration-200 border-2 border-amber-100">
            <LockIcon />
            <h3 className="text-xl font-bold text-gray-800 mb-2">Cadastros Limitados</h3>
            <p className="text-gray-600 mb-6 text-sm leading-relaxed">
              O <strong>Collectiico</strong> está em fase de demonstração fechada. O cadastro de novos usuários está temporariamente pausado.
            </p>
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 mb-6 text-xs text-amber-800 font-medium">
               Dica: Utilize as credenciais de teste fornecidas na documentação.
            </div>
            <button 
              onClick={() => setShowBlockedModal(false)}
              className="w-full py-3 bg-gray-900 text-white font-bold rounded-lg hover:bg-gray-800 transition-colors shadow-lg"
            >
              Entendi, obrigado
            </button>
          </div>
        </div>
      )}

    </div>
  );
}