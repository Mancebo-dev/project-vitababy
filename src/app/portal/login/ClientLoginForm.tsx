"use client";

import { AlertCircle, Eye, EyeOff, Loader2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { signIn, signOut, useSession } from "@/infrastructure/auth/client";

export function ClientLoginForm() {
  const _router = useRouter();
  const { data: sessionData } = useSession();

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
      const cleanEmail = email.trim().toLowerCase();
      const rawPassword = password.trim();

      // Primeiro tenta com a senha digitada exatamente como fornecida
      let result = await signIn.email({
        email: cleanEmail,
        password: rawPassword,
      });

      // Se falhar e a senha tiver caracteres não numéricos (ex: CPF com pontuação 123.456.789-00), tenta apenas os números
      if (result.error && /\D/.test(rawPassword)) {
        const digitsOnly = rawPassword.replace(/\D/g, "");
        if (digitsOnly.length >= 8) {
          result = await signIn.email({
            email: cleanEmail,
            password: digitsOnly,
          });
        }
      }

      if (result.error) {
        setError(
          result.error.message ||
            "E-mail ou senha incorretos. Verifique suas credenciais.",
        );
        setLoading(false);
        return;
      }

      window.location.href = "/portal";
    } catch (_err: unknown) {
      setError("Ocorreu um erro ao tentar fazer login. Tente novamente.");
      setLoading(false);
    }
  };

  const currentUser = sessionData?.user as
    | { email?: string; role?: string; name?: string }
    | undefined;

  return (
    <div className="w-full max-w-[420px] bg-white border border-[#e4e2de] rounded-2xl p-[2rem] shadow-sm">
      <div className="mb-[2rem] text-center">
        <h1 className="font-heading font-bold text-[1.75rem] text-[#411f03] mb-[0.25rem]">
          Área do Cliente
        </h1>
        <p className="text-[#444840] text-[0.9375rem]">
          Acesse seus agendamentos, contratos e histórico
        </p>
      </div>

      {currentUser && (
        <div className="mb-[1.5rem] p-[1rem] bg-amber-50 border border-amber-200 rounded-xl text-amber-900 text-[0.875rem] space-y-2">
          {currentUser.role === "admin" ? (
            <>
              <p>
                Você está conectado como <strong>Administrador</strong> (
                {currentUser.email}).
              </p>
              <div className="flex items-center gap-3 pt-1">
                <Link
                  href="/admin"
                  className="font-semibold text-[#af4d30] underline hover:opacity-80"
                >
                  Ir para Painel Admin
                </Link>
                <button
                  type="button"
                  onClick={async () => {
                    await signOut();
                    window.location.reload();
                  }}
                  className="text-xs text-stone-600 hover:text-stone-900 underline"
                >
                  Sair da conta
                </button>
              </div>
            </>
          ) : (
            <>
              <p>
                Você já está conectado como{" "}
                <strong>{currentUser.name || currentUser.email}</strong>.
              </p>
              <div className="flex items-center gap-3 pt-1">
                <Link
                  href="/portal"
                  className="font-semibold text-[#af4d30] underline hover:opacity-80"
                >
                  Acessar Minha Área
                </Link>
                <button
                  type="button"
                  onClick={async () => {
                    await signOut();
                    window.location.reload();
                  }}
                  className="text-xs text-stone-600 hover:text-stone-900 underline"
                >
                  Sair da conta
                </button>
              </div>
            </>
          )}
        </div>
      )}

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
              Senha de Acesso
            </label>
          </div>
          <div className="relative">
            <input
              id="password"
              type={showPassword ? "text" : "password"}
              required
              placeholder="Sua senha ou CPF"
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
          <p className="text-[12px] text-[#7d7a75] mt-1.5 leading-snug">
            Primeiro acesso? Sua senha inicial é o seu CPF (somente números) ou{" "}
            <span className="font-semibold text-[#411f03]">
              clientevitababy
            </span>
            .
          </p>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="mt-[0.5rem] w-full rounded-xl h-[3.25rem] bg-[#af4d30] hover:bg-[#af4d30]/90 text-white font-semibold flex items-center justify-center transition-all disabled:opacity-70 disabled:cursor-not-allowed"
        >
          {loading ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : (
            "Entrar na Área do Cliente"
          )}
        </button>
      </form>
    </div>
  );
}
