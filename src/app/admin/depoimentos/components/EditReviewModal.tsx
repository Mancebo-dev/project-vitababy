"use client";

import type { Review } from "@prisma/client";
import { Edit3, Loader2, Star } from "lucide-react";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { updateReview } from "../actions";

export function EditReviewModal({
  review,
}: {
  review: Review & { client?: { name: string; childName?: string | null } };
}) {
  const [open, setOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [clientName, setClientName] = useState(review.client?.name || "");
  const [childName, setChildName] = useState(review.client?.childName || "");
  const [rating, setRating] = useState(review.rating || 5);
  const [comment, setComment] = useState(review.comment || "");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!comment.trim()) {
      alert("O comentário não pode ficar vazio.");
      return;
    }
    setIsSubmitting(true);
    try {
      await updateReview(review.id, {
        comment,
        rating,
        clientName,
        childName,
      });
      setOpen(false);
    } catch (error) {
      console.error(error);
      alert(
        error instanceof Error
          ? error.message
          : "Erro ao atualizar depoimento.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger>
        <div
          className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-full transition-colors cursor-pointer"
          title="Editar depoimento"
        >
          <Edit3 className="w-4 h-4" />
        </div>
      </DialogTrigger>
      <DialogContent className="w-full max-w-[calc(100%-1.5rem)] sm:max-w-lg max-h-[90vh] overflow-y-auto p-4 sm:p-6">
        <DialogHeader>
          <DialogTitle>Editar Depoimento</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 pt-2">
          {/* Nome da Cliente e Nome do Bebê */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label
                htmlFor={`edit-review-client-${review.id}`}
                className="block text-xs font-semibold text-slate-700 mb-1"
              >
                Nome da Mãe / Pai
              </label>
              <input
                id={`edit-review-client-${review.id}`}
                type="text"
                value={clientName}
                onChange={(e) => setClientName(e.target.value)}
                placeholder="Ex: Mariana Silva"
                className="w-full px-3 py-2 text-sm border rounded-lg bg-white"
              />
            </div>

            <div>
              <label
                htmlFor={`edit-review-child-${review.id}`}
                className="block text-xs font-semibold text-slate-700 mb-1"
              >
                Nome do Bebê (opcional)
              </label>
              <input
                id={`edit-review-child-${review.id}`}
                type="text"
                value={childName}
                onChange={(e) => setChildName(e.target.value)}
                placeholder="Ex: Theo"
                className="w-full px-3 py-2 text-sm border rounded-lg bg-white"
              />
            </div>
          </div>

          {/* Avaliação em Estrelas */}
          <div>
            <span className="block text-xs font-semibold text-slate-700 mb-1.5">
              Avaliação (Estrelas)
            </span>
            <div className="flex items-center gap-1.5">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  type="button"
                  key={`edit-star-${star}`}
                  onClick={() => setRating(star)}
                  className="p-1 hover:scale-110 transition-transform cursor-pointer"
                >
                  <Star
                    className={`w-6 h-6 ${
                      star <= rating
                        ? "text-amber-400 fill-amber-400"
                        : "text-slate-200"
                    }`}
                  />
                </button>
              ))}
              <span className="text-xs text-slate-500 ml-2 font-medium">
                {rating} de 5 estrelas
              </span>
            </div>
          </div>

          {/* Comentário */}
          <div>
            <label
              htmlFor={`edit-review-comment-${review.id}`}
              className="block text-xs font-semibold text-slate-700 mb-1"
            >
              Comentário / Relato
            </label>
            <textarea
              id={`edit-review-comment-${review.id}`}
              rows={4}
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Digite o depoimento da cliente..."
              className="w-full px-3 py-2 text-sm border rounded-lg bg-white resize-y"
              required
            />
          </div>

          {/* Ações */}
          <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-2 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="w-full sm:w-auto px-4 py-2 text-sm text-slate-600 bg-white border rounded-lg hover:bg-slate-50 cursor-pointer"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2 text-sm font-semibold text-white bg-primary rounded-lg hover:bg-primary/90 disabled:opacity-50 cursor-pointer"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" /> Salvando...
                </>
              ) : (
                "Salvar Alterações"
              )}
            </button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
