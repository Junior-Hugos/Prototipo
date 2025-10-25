"use client";
import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function CadastroPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

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

      if (!res.ok) {
        throw new Error((await res.json()).error || "Falha no cadastro");
      }

      alert("Usuário cadastrado com sucesso! Faça o login.");
      router.push("/login");
    } catch (error: any) {
      alert("Erro: " + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-6 py-12">
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
<<<<<<< HEAD
<<<<<<< HEAD
            <label className="block text-sm font-medium mb-1">Nome Completo</label>
            <input id="nome" type="text" required value={formData.nome} onChange={handleChange} />
=======
=======
>>>>>>> upstream/Dev
            <label htmlFor="nome" className="block text-sm font-medium mb-1">
              Nome Completo
            </label>
            <input
              id="nome"
              type="text"
              required
              value={formData.nome}
              onChange={handleChange}
            />
<<<<<<< HEAD
>>>>>>> 1558edc (Correção do BUg na tela de cadastro)
=======
>>>>>>> upstream/Dev
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
            />
          </div>
<<<<<<< HEAD
<<<<<<< HEAD
           <div>
            <label className="block text-sm font-medium mb-1">Endereço Principal</label>
            <input id="endereco" type="text" required value={formData.endereco} onChange={handleChange} />
=======
=======
>>>>>>> upstream/Dev
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
            />
<<<<<<< HEAD
>>>>>>> 1558edc (Correção do BUg na tela de cadastro)
=======
>>>>>>> upstream/Dev
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
<<<<<<< HEAD
<<<<<<< HEAD
            <label className="block text-sm font-medium mb-1">Telefone</label>
            <input id="telefone" type="tel" placeholder="(99) 99999-9999" required value={formData.telefone} onChange={handleChange} />
=======
=======
>>>>>>> upstream/Dev
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
            />
<<<<<<< HEAD
>>>>>>> 1558edc (Correção do BUg na tela de cadastro)
=======
>>>>>>> upstream/Dev
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
              placeholder="Ex: Finais de semana, Manhãs de Seg/Qua"
              value={formData.disponibilidade}
              onChange={handleChange}
            />
          </div>
        )}

        {formData.tipo === "EMPRESA" && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label htmlFor="cnpj" className="block text-sm font-medium mb-1">
                CNPJ (Obrigatório)
              </label>
              {/* --- CORREÇÃO DO BUG DO CSS (type="text") --- */}
              <input
                id="cnpj"
                type="text"
                required
                value={formData.cnpj}
                onChange={handleChange}
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
                placeholder="Ex: Papelão, Vidro"
                value={formData.tipoMaterialAceito}
                onChange={handleChange}
              />
            </div>
          </div>
        )}

        {/* Submit */}
        <div className="flex flex-col gap-3 pt-4">
          <button
            type="submit"
            disabled={isLoading}
            className="btn-primary w-full"
          >
            {isLoading ? "Cadastrando..." : "Criar minha conta"}
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
    </div>
  );
}
