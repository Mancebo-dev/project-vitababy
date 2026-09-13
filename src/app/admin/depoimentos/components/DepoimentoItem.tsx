"use client";

import type { Review } from "@prisma/client";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Star, Trash2 } from "lucide-react";
import { useState } from "react";
import { Switch } from "@/components/ui/switch";
import { deleteReview, toggleHighlight } from "../actions";

export function DepoimentoItem({
  review,
}: {
  review: Review & { client?: { name: string } };
}) {
  const [loading, setLoading] = useState(false);

  const handleToggle = async () => {
    setLoading(true);
    try {
      await toggleHighlight(review.id, review.isHighlighted);
    } catch (_error) {
      alert("Erro ao alterar destaque.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (confirm("Deseja realmente excluir este depoimento?")) {
      setLoading(true);
      try {
        await deleteReview(review.id);
      } catch (_error) {
        alert("Erro ao excluir.");
        setLoading(false);
      }
    }
  };

  return (
    <div
      className={`p-6 transition-colors flex flex-col sm:flex-row gap-6 ${review.isHighlighted ? "bg-amber-50/30" : "bg-white hover:bg-slate-50/50"}`}
    >
      <div className="flex-1 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center font-bold text-slate-600 uppercase">
              {review.client?.name?.charAt(0) || "C"}
            </div>
            <div>
              <p className="font-semibold text-slate-900">
                {review.client?.name || "Desconhecido"}
              </p>
              <p className="text-xs text-slate-500">
                {format(new Date(review.createdAt), "dd 'de' MMMM, yyyy", {
                  locale: ptBR,
                })}
              </p>
            </div>
          </div>
          <div className="flex text-amber-400">
            {[1, 2, 3, 4, 5].map((starIndex) => (
              <Star
                key={`star-${review.id}-${starIndex}`}
                className={`w-4 h-4 ${starIndex <= review.rating ? "fill-current" : "text-slate-200"}`}
              />
            ))}
          </div>
        </div>

        <p className="text-slate-700 leading-relaxed italic">
          "{review.comment}"
        </p>
      </div>

      <div className="flex sm:flex-col items-center justify-between gap-4 sm:border-l border-slate-100 sm:pl-6">
        <div className="flex items-center gap-2">
          <Switch
            checked={review.isHighlighted}
            onCheckedChange={handleToggle}
            disabled={loading}
          />
          <span className="text-sm font-medium text-slate-600">Destaque</span>
        </div>

        <button
          type="button"
          onClick={handleDelete}
          disabled={loading}
          className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-full transition-colors"
          title="Excluir depoimento"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
