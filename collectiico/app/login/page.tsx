"use client";
import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext"; // Ajuste o caminho se necessário
import Link from "next/link";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    const success = await login(email, password);
    setIsLoading(false);
    if (success) {
      router.push("/dashboard"); // Apenas uma chamada é necessária
      // router.push("/dashboard"); // Remove esta linha duplicada
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center">
      {/* --- INÍCIO DO BLOCO CORRETO (ÚNICO) --- */}
      <div className="max-w-md w-full p-8 bg-white rounded-2xl shadow-card">
        <h2 className="text-3xl font-bold text-text-primary mb-6 text-center">
          Entrar
        </h2>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium mb-1 text-text-secondary">
              Email
            </label>
            <input
              type="email"
              placeholder="seu@email.com"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1 text-text-secondary">
              Senha
            </label>
            <input
              type="password"
              placeholder="Sua senha"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <button
            type="submit"
            disabled={isLoading}
            className="btn-primary w-full"
          >
            {isLoading ? "Entrando..." : "Entrar"}
          </button>
        </form>

        <p className="text-sm text-text-secondary text-center mt-6">
          Não tem cadastro?{" "}
          <Link
            href="/cadastro"
            className="text-primary font-medium hover:underline"
          >
            Clique aqui
          </Link>
          .
        </p>
      </div>
      {/* --- FIM DO BLOCO CORRETO --- */}
    </div>
  );
}
