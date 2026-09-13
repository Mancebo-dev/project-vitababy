"use client";

import { Star } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { submitReview } from "./actions";

export default function AvaliarPage() {
  const [name, setName] = useState("");
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !comment) return;
    setIsSubmitting(true);
    try {
      await submitReview({ name, rating, comment });
      setIsSuccess(true);
    } catch (_error) {
      alert("Ocorreu um erro ao enviar seu depoimento. Tente novamente.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="min-h-screen bg-[#fbf9f5] flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-lg p-8 text-center space-y-4">
          <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <Star className="w-8 h-8 fill-current" />
          </div>
          <h1 className="text-2xl font-bold text-slate-900">Muito obrigado!</h1>
          <p className="text-slate-600">
            Seu depoimento foi enviado com sucesso. Agradecemos muito pelo seu
            feedback e confiança em nosso trabalho.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#fbf9f5] flex flex-col items-center justify-center p-4">
      <div className="max-w-xl w-full bg-white rounded-2xl shadow-lg overflow-hidden">
        <div className="bg-[#ae4d30] p-8 text-center text-white space-y-4">
          <div className="flex justify-center mb-4">
            <Image
              src="/assets/logo-vita-baby.png"
              alt="Vita Baby"
              width={140}
              height={45}
              className="brightness-0 invert"
            />
          </div>
          <h1 className="text-2xl font-bold">Como foi sua experiência?</h1>
          <p className="text-white/80">
            Seu depoimento é muito importante para nós e para outras mães.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          <div className="space-y-2">
            <label
              htmlFor="client-name"
              className="text-sm font-medium text-slate-700"
            >
              Seu Nome
            </label>
            <input
              id="client-name"
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full h-12 px-4 rounded-lg border border-slate-200 focus:border-[#ae4d30] focus:ring-1 focus:ring-[#ae4d30] outline-none transition-all"
              placeholder="Ex: Maria Clara"
            />
          </div>

          <div className="space-y-3">
            <span className="text-sm font-medium text-slate-700 block">
              Avaliação
            </span>
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  className="focus:outline-none"
                >
                  <Star
                    className={`w-10 h-10 transition-colors ${
                      rating >= star
                        ? "fill-amber-400 text-amber-400"
                        : "text-slate-200"
                    }`}
                  />
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <label
              htmlFor="client-comment"
              className="text-sm font-medium text-slate-700"
            >
              Seu Depoimento
            </label>
            <textarea
              id="client-comment"
              required
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              className="w-full p-4 rounded-lg border border-slate-200 focus:border-[#ae4d30] focus:ring-1 focus:ring-[#ae4d30] outline-none transition-all resize-none h-32"
              placeholder="Conte-nos como foi sua experiência com a Vita Baby..."
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full h-12 bg-[#ae4d30] hover:bg-[#ae4d30]/90 text-white font-bold rounded-lg transition-colors disabled:opacity-50"
          >
            {isSubmitting ? "Enviando..." : "Enviar Depoimento"}
          </button>
        </form>
      </div>
    </div>
  );
}
