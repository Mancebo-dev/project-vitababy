"use client";

import { AlertCircle, RefreshCw } from "lucide-react";
import { useEffect } from "react";

export default function ContratosError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Erro na página de contratos:", error);
  }, [error]);

  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] p-8 text-center bg-white rounded-2xl border border-slate-200 shadow-xs">
      <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center text-red-600 mb-4">
        <AlertCircle className="w-6 h-6" />
      </div>
      <h2 className="text-xl font-bold text-slate-900 mb-2">
        Não foi possível carregar os contratos
      </h2>
      <p className="text-sm text-slate-500 max-w-md mb-6">
        Ocorreu uma instabilidade momentânea ao processar os dados desta página.
        {error.digest && (
          <span className="block text-xs text-slate-400 mt-1 font-mono">
            Código do erro: {error.digest}
          </span>
        )}
      </p>
      <button
        type="button"
        onClick={() => reset()}
        className="inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-primary hover:bg-primary/90 rounded-lg transition-colors shadow-xs cursor-pointer"
      >
        <RefreshCw className="w-4 h-4" />
        Tentar Novamente
      </button>
    </div>
  );
}
