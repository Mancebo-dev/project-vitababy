import { MessageSquare } from "lucide-react";
import type { Metadata } from "next";
import { prisma } from "@/infrastructure/db/prisma";
import { CopyLinkButton } from "./components/CopyLinkButton";
import { DepoimentoItem } from "./components/DepoimentoItem";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Depoimentos | Vita Baby Dashboard",
};

export default async function DepoimentosPage() {
  const reviews = await prisma.review.findMany({
    include: { client: true },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">
            Depoimentos
          </h1>
          <p className="text-slate-500 mt-2">
            Gerencie os depoimentos deixados pelas clientes.
          </p>
        </div>

        <div className="flex gap-2">
          <CopyLinkButton />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="md:col-span-1">
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <h3 className="font-semibold text-slate-900 mb-4">Resumo</h3>
            <div className="space-y-4">
              <div>
                <p className="text-slate-500 text-sm">Total de Avaliações</p>
                <p className="text-2xl font-bold text-slate-900">
                  {reviews.length}
                </p>
              </div>
              <div className="pt-4 border-t border-slate-100">
                <p className="text-slate-500 text-sm">Em Destaque (Site)</p>
                <p className="text-2xl font-bold text-primary">
                  {reviews.filter((r) => r.isHighlighted).length}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="md:col-span-3">
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
            {reviews.length === 0 ? (
              <div className="p-12 text-center text-slate-500">
                <MessageSquare className="w-12 h-12 mx-auto text-slate-300 mb-4" />
                <p className="text-lg font-medium">
                  Nenhum depoimento recebido.
                </p>
                <p className="text-sm mt-1">
                  Envie o link de avaliação para suas clientes.
                </p>
              </div>
            ) : (
              <div className="divide-y divide-slate-100">
                {reviews.map((review) => (
                  <DepoimentoItem key={review.id} review={review} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
