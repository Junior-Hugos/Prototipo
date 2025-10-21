// app/cadastro/page.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
// 1. Importar o CSS Module
import styles from "./cadastro.module.css";

export default function CadastroPage() {
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [endereco, setEndereco] = useState("");
  const [tipo, setTipo] = useState("DOADOR");

  // Campos específicos
  const [telefone, setTelefone] = useState("");
  const [disponibilidade, setDisponibilidade] = useState("");
  const [cnpj, setCnpj] = useState("");
  const [tipoMaterialAceito, setTipoMaterialAceito] = useState("");

  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    let profileData: any = {
      nome,
      email,
      senha,
      endereco,
      tipo,
    };

    if (tipo === "DOADOR") {
      profileData.telefone = telefone;
    } else if (tipo === "VOLUNTARIO") {
      profileData.disponibilidade = disponibilidade;
    } else if (tipo === "EMPRESA") {
      profileData.cnpj = cnpj;
      profileData.tipoMaterialAceito = tipoMaterialAceito;
    }

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(profileData),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Ocorreu um erro.");
        setIsLoading(false);
        return;
      }

      setIsLoading(false);
      alert("Cadastro realizado com sucesso! Faça seu login.");
      router.push("/login"); // Vamos criar esta página em breve
    } catch (err) {
      setIsLoading(false);
      setError("Não foi possível conectar ao servidor.");
    }
  };

  const renderProfileFields = () => {
    switch (tipo) {
      case "DOADOR":
        return (
          <>
            <label htmlFor="telefone" className={styles.label}>
              Telefone (Opcional)
            </label>
            <input
              id="telefone"
              type="tel"
              placeholder="(67) 99999-9999"
              value={telefone}
              onChange={(e) => setTelefone(e.target.value)}
              className={styles.input}
            />
          </>
        );
      case "VOLUNTARIO":
        return (
          <>
            <label htmlFor="disponibilidade" className={styles.label}>
              Disponibilidade (Opcional)
            </label>
            <input
              id="disponibilidade"
              type="text"
              placeholder="Ex: Segundas (manhã), Fim de semana"
              value={disponibilidade}
              onChange={(e) => setDisponibilidade(e.target.value)}
              className={styles.input}
            />
          </>
        );
      case "EMPRESA":
        return (
          <>
            <label htmlFor="cnpj" className={styles.label}>
              CNPJ (Obrigatório)
            </label>
            <input
              id="cnpj"
              type="text"
              placeholder="XX.XXX.XXX/0001-XX"
              required
              value={cnpj}
              onChange={(e) => setCnpj(e.target.value)}
              className={styles.input}
            />
            <label htmlFor="materiais" className={styles.label}>
              Materiais que aceita (Opcional)
            </label>
            <input
              id="materiais"
              type="text"
              placeholder="Ex: Papel, Plástico, Vidro"
              value={tipoMaterialAceito}
              onChange={(e) => setTipoMaterialAceito(e.target.value)}
              className={styles.input}
            />
          </>
        );
      default:
        return null;
    }
  };

  return (
    // 2. Usar className em vez de style
    <div className={styles.container}>
      <h1 className={styles.title}>Tela de Cadastro</h1>
      <p className={styles.subtitle}>Crie sua conta para começar a reciclar.</p>
      <form onSubmit={handleSubmit} className={styles.form}>
        {/* 3. Adicionar <label> para acessibilidade */}
        <label htmlFor="tipo" className={styles.label}>
          Eu sou:
        </label>
        <select
          id="tipo"
          value={tipo}
          onChange={(e) => setTipo(e.target.value)}
          className={styles.select} // Usando .select
        >
          <option value="DOADOR">Sou um Doador</option>
          <option value="VOLUNTARIO">Sou um Voluntário</option>
          <option value="EMPRESA">Sou uma Empresa</option>
        </select>

        <label htmlFor="nome" className={styles.label}>
          Nome Completo
        </label>
        <input
          id="nome"
          type="text"
          placeholder="Seu nome"
          required
          value={nome}
          onChange={(e) => setNome(e.target.value)}
          className={styles.input}
        />

        <label htmlFor="email" className={styles.label}>
          Email
        </label>
        <input
          id="email"
          type="email"
          placeholder="seu@email.com"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className={styles.input}
        />

        <label htmlFor="senha" className={styles.label}>
          Senha
        </label>
        <input
          id="senha"
          type="password"
          placeholder="Crie uma senha"
          required
          value={senha}
          onChange={(e) => setSenha(e.target.value)}
          className={styles.input}
        />

        <label htmlFor="endereco" className={styles.label}>
          Endereço (Opcional)
        </label>
        <input
          id="endereco"
          type="text"
          placeholder="Rua, N°, Bairro"
          value={endereco}
          onChange={(e) => setEndereco(e.target.value)}
          className={styles.input}
        />

        {/* Renderiza os campos dinâmicos */}
        {renderProfileFields()}

        {error && <p className={styles.error}>{error}</p>}

        <button type="submit" disabled={isLoading} className={styles.button}>
          {isLoading ? "Cadastrando..." : "Cadastrar"}
        </button>
      </form>
    </div>
  );
}
