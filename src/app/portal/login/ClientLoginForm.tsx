"use client";

import { AlertCircle, Eye, EyeOff, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { signIn } from "@/infrastructure/auth/client";

export function ClientLoginForm() {
  const _router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const result = await signIn.email({
        email,
        password,
      });

      if (result.error) {
        setError(result.error.message || "E-mail ou senha incorretos.");
        setLoading(false);
        return;
      }

      window.location.href = "/portal";
    } catch (_err: unknown) {
      setError("Ocorreu um erro ao tentar fazer login. Tente novamente.");
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-[400px] bg-white border border-[#e4e2de] rounded-2xl p-[2rem] shadow-sm">
      <div className="mb-[2rem] text-center">
        <h1 className="font-heading font-bold text-[1.75rem] text-[#411f03] mb-[0.25rem]">
          Área do Cliente
        </h1>
        <p className="text-[#444840] text-[0.9375rem]">
          Acesse seus agendamentos e contratos
        </p>
      </div>

      {error && (
        <div className="mb-[1.5rem] p-[1rem] bg-[#fdf2f0] border border-[#f5c6cb] rounded-xl flex items-start gap-[0.75rem] text-[#af4d30] text-[0.875rem]">
          <AlertCircle className="w-5 h-5 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleLogin} className="flex flex-col gap-[1.25rem]">
        <div>
          <label
            htmlFor="email"
            className="block text-[0.875rem] font-semibold text-[#411f03] mb-[0.375rem]"
          >
            E-mail
          </label>
          <input
            id="email"
            type="email"
            required
            placeholder="Seu e-mail cadastrado"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-[1rem] py-[0.75rem] border border-[#e4e2de] rounded-xl text-[0.9375rem] focus:border-[#af4d30] focus:ring-1 focus:ring-[#af4d30] outline-none"
            disabled={loading}
          />
        </div>

        <div>
          <div className="flex items-center justify-between mb-[0.375rem]">
            <label
              htmlFor="password"
              className="block text-[0.875rem] font-semibold text-[#411f03]"
            >
              Senha (CPF)
            </label>
          </div>
          <div className="relative">
            <input
              id="password"
              type={showPassword ? "text" : "password"}
              required
              placeholder="Apenas números do CPF"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full pl-[1rem] pr-[2.75rem] py-[0.75rem] border border-[#e4e2de] rounded-xl text-[0.9375rem] focus:border-[#af4d30] focus:ring-1 focus:ring-[#af4d30] outline-none"
              disabled={loading}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-[0.875rem] top-1/2 -translate-y-1/2 text-[#7d7a75] hover:text-[#411f03]"
            >
              {showPassword ? (
                <EyeOff className="w-4 h-4" />
              ) : (
                <Eye className="w-4 h-4" />
              )}
            </button>
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="mt-[0.5rem] w-full rounded-xl h-[3.25rem] bg-[#af4d30] hover:bg-[#af4d30]/90 text-white font-semibold flex items-center justify-center transition-all disabled:opacity-70 disabled:cursor-not-allowed"
        >
          {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Entrar"}
        </button>
      </form>
    </div>
  );
}
