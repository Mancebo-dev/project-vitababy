"use client";

import { Loader2, Trash2 } from "lucide-react";
import { useState } from "react";
import { deleteContract } from "../actions";

export function DeleteContractButton({ contractId }: { contractId: string }) {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    const confirmed = window.confirm(
      "Tem certeza que deseja excluir este contrato permanentemente? Esta ação não pode ser desfeita.",
    );
    if (!confirmed) return;

    setIsDeleting(true);
    try {
      await deleteContract(contractId);
    } catch (error) {
      console.error(error);
      alert(
        error instanceof Error ? error.message : "Erro ao excluir o contrato.",
      );
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <button
      type="button"
      onClick={handleDelete}
      disabled={isDeleting}
      title="Excluir Contrato"
      className="inline-flex items-center justify-center p-1.5 text-xs font-semibold text-rose-600 bg-white border border-rose-200 rounded-lg hover:bg-rose-50 hover:border-rose-300 transition-colors shadow-xs disabled:opacity-50 cursor-pointer"
    >
      {isDeleting ? (
        <Loader2 className="w-3.5 h-3.5 animate-spin" />
      ) : (
        <Trash2 className="w-3.5 h-3.5" />
      )}
    </button>
  );
}
