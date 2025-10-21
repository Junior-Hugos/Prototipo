// app/login/page.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import styles from "./login.module.css";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      // 1. Chamar a API de Login que você criou
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, senha }),
      });

      const data = await res.json();

      if (!res.ok) {
        // 2. Mostrar o erro (ex: "Credenciais inválidas")
        setError(data.error || "Ocorreu um erro.");
        setIsLoading(false);
        return;
      }

      // 3. Sucesso! O cookie foi salvo pelo servidor.
      // Agora, redirecionamos para o painel principal.
      setIsLoading(false);
      router.push("/dashboard"); // Próxima página que iremos criar
    } catch (err) {
      setIsLoading(false);
      setError("Não foi possível conectar ao servidor.");
    }
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Login</h1>
      <p className={styles.subtitle}>Acesse sua conta</p>
      <form onSubmit={handleSubmit} className={styles.form}>
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
          placeholder="Sua senha"
          required
          value={senha}
          onChange={(e) => setSenha(e.target.value)}
          className={styles.input}
        />

        {error && <p className={styles.error}>{error}</p>}

        <button type="submit" disabled={isLoading} className={styles.button}>
          {isLoading ? "Entrando..." : "Entrar"}
        </button>
      </form>
    </div>
  );
}
