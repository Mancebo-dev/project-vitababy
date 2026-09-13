"use client";

import { AlertCircle, CheckCircle2, Loader2 } from "lucide-react";
import { useState } from "react";
import { updatePasswordAction } from "../actions";

export function PasswordForm() {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (newPassword.length < 6) {
      setError("A nova senha deve ter no mínimo 6 caracteres.");
      return;
    }

    setLoading(true);

    try {
      const result = await updatePasswordAction(currentPassword, newPassword);

      if (!result.success) {
        setError(result.error || "Erro ao atualizar senha.");
      } else {
        setSuccess("Senha atualizada com sucesso!");
        setCurrentPassword("");
        setNewPassword("");
      }
    } catch (_err) {
      setError("Ocorreu um erro inesperado.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4 w-full">
      {error && (
        <div className="p-3 bg-red-50 text-red-600 rounded-lg flex items-center gap-2 text-sm border border-red-100">
          <AlertCircle className="w-4 h-4 shrink-0" />
          {error}
        </div>
      )}

      {success && (
        <div className="p-3 bg-emerald-50 text-emerald-600 rounded-lg flex items-center gap-2 text-sm border border-emerald-100">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          {success}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label
            htmlFor="current-password"
            className="block text-sm font-semibold text-[#411f03] mb-1"
          >
            Senha Atual
          </label>
          <input
            id="current-password"
            type="password"
            required
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            disabled={loading}
            placeholder="Senha atual (ex: CPF)"
            className="w-full px-4 py-2 border border-[#e4e2de] rounded-xl bg-white focus:border-[#af4d30] outline-none"
          />
        </div>
        <div>
          <label
            htmlFor="new-password"
            className="block text-sm font-semibold text-[#411f03] mb-1"
          >
            Nova Senha
          </label>
          <input
            id="new-password"
            type="password"
            required
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            disabled={loading}
            placeholder="Mínimo 6 caracteres"
            className="w-full px-4 py-2 border border-[#e4e2de] rounded-xl bg-white focus:border-[#af4d30] outline-none"
          />
        </div>
      </div>
      <div className="flex justify-end pt-2">
        <button
          type="submit"
          disabled={loading}
          className="px-6 py-2.5 bg-[#af4d30] text-white rounded-xl font-semibold hover:bg-[#af4d30]/90 transition-colors w-full md:w-auto flex items-center justify-center gap-2 disabled:opacity-70"
        >
          {loading && <Loader2 className="w-4 h-4 animate-spin" />}
          Atualizar Senha
        </button>
      </div>
    </form>
  );
}
