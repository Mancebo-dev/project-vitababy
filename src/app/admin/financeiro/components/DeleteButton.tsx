"use client";

import { Trash2 } from "lucide-react";
import { useState } from "react";
import { deleteTransaction } from "../actions";

export function DeleteButton({ id }: { id: string }) {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    if (!confirm("Tem certeza que deseja excluir esta transação?")) return;
    setIsDeleting(true);
    try {
      await deleteTransaction(id);
    } catch (error) {
      console.error(error);
      alert("Erro ao excluir transação.");
      setIsDeleting(false);
    }
  };

  return (
    <button
      type="button"
      onClick={handleDelete}
      disabled={isDeleting}
      className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors disabled:opacity-50"
      title="Excluir"
    >
      <Trash2 className="w-4 h-4" />
    </button>
  );
}
