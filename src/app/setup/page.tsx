"use client";

import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { signUp } from "@/infrastructure/auth/client";

export default function SetupDevAccount() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const [formData, setFormData] = useState({
    name: "Admin Dev",
    email: "dev@vitababy.com.br",
    password: "vitababy_admin",
  });

  const handleCreateAccount = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await signUp.email({
        email: formData.email,
        password: formData.password,
        name: formData.name,
      });

      if (res.error) {
        setError(res.error.message || "Erro ao criar conta.");
        setLoading(false);
        return;
      }

      // better-auth has a setRole admin plugin API, but for this dev setup
      // we might need to manually set it via DB if the plugin blocks client-side role setting.
      // We will handle role directly in DB if necessary, but for now the user is created.
      setSuccess(true);
      setTimeout(() => {
        router.push("/admin");
      }, 2000);
    } catch (_err) {
      setError("Falha inesperada.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#fbf9f5] p-4">
      <div className="bg-white p-8 rounded-2xl shadow-sm border border-[#e4e2de] w-full max-w-md">
        <h1 className="text-2xl font-bold font-heading text-[#411f03] mb-2">
          Setup Inicial (Dev)
        </h1>
        <p className="text-[#444840] mb-6">
          Crie a primeira conta administrativa para testar o Dashboard.
        </p>

        {success ? (
          <div className="bg-green-50 text-green-700 p-4 rounded-xl border border-green-200">
            Conta dev criada com sucesso! Redirecionando para o painel...
          </div>
        ) : (
          <form onSubmit={handleCreateAccount} className="flex flex-col gap-4">
            {error && (
              <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm border border-red-200">
                {error}
              </div>
            )}

            <div>
              <label
                htmlFor="name"
                className="block text-sm font-semibold text-[#411f03] mb-1"
              >
                Nome
              </label>
              <input
                id="name"
                type="text"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                className="w-full px-4 py-2 border rounded-xl"
                required
              />
            </div>

            <div>
              <label
                htmlFor="email"
                className="block text-sm font-semibold text-[#411f03] mb-1"
              >
                E-mail
              </label>
              <input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                className="w-full px-4 py-2 border rounded-xl"
                required
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-semibold text-[#411f03] mb-1"
              >
                Senha
              </label>
              <input
                id="password"
                type="text"
                value={formData.password}
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                }
                className="w-full px-4 py-2 border rounded-xl"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="mt-2 w-full h-12 bg-[#af4d30] text-white rounded-xl font-semibold flex items-center justify-center disabled:opacity-70"
            >
              {loading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                "Criar Conta Admin"
              )}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
