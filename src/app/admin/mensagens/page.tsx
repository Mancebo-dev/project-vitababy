import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import {
  CheckCircle2,
  Circle,
  Mail,
  MessageSquare,
  Trash2,
} from "lucide-react";
import type { Metadata } from "next";
import { prisma } from "@/infrastructure/db/prisma";
import { deleteMessage, markAsRead, markAsUnread } from "./actions";

export const metadata: Metadata = {
  title: "Mensagens | Vita Baby Dashboard",
};

export default async function MensagensPage() {
  const messages = await prisma.contactMessage.findMany({
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">
          Mensagens
        </h1>
        <p className="text-slate-500 mt-1">
          Gerencie os contatos recebidos pelo formulário do site.
        </p>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        {messages.length === 0 ? (
          <div className="p-12 text-center flex flex-col items-center">
            <Mail className="w-12 h-12 text-slate-300 mb-4" />
            <h3 className="text-lg font-medium text-slate-900">
              Nenhuma mensagem
            </h3>
            <p className="text-slate-500 max-w-sm">
              Você ainda não recebeu nenhuma mensagem pelo formulário de contato
              do site.
            </p>
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`p-6 transition-colors ${
                  msg.status === "UNREAD"
                    ? "bg-amber-50/30"
                    : "hover:bg-slate-50/50"
                }`}
              >
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center gap-3">
                    <div
                      className={`p-2 rounded-lg shrink-0 ${msg.status === "UNREAD" ? "bg-amber-100 text-amber-600" : "bg-slate-100 text-slate-400"}`}
                    >
                      <MessageSquare className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-900 text-lg flex items-center gap-2">
                        {msg.name}
                        {msg.status === "UNREAD" && (
                          <span className="inline-block w-2 h-2 rounded-full bg-amber-500" />
                        )}
                      </h4>
                      <p className="text-slate-500 text-sm">
                        {msg.email} • {msg.phone}
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-col items-end gap-2">
                    <span className="text-xs text-slate-400 font-medium">
                      {format(
                        new Date(msg.createdAt),
                        "dd 'de' MMMM 'às' HH:mm",
                        { locale: ptBR },
                      )}
                    </span>
                    <div className="flex gap-2">
                      {msg.status === "UNREAD" ? (
                        <form action={markAsRead.bind(null, msg.id)}>
                          <button
                            type="submit"
                            className="text-xs flex items-center gap-1 text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50 px-2 py-1 rounded transition-colors"
                            title="Marcar como lida"
                          >
                            <CheckCircle2 className="w-4 h-4" /> Lida
                          </button>
                        </form>
                      ) : (
                        <form action={markAsUnread.bind(null, msg.id)}>
                          <button
                            type="submit"
                            className="text-xs flex items-center gap-1 text-slate-500 hover:text-slate-700 hover:bg-slate-100 px-2 py-1 rounded transition-colors"
                            title="Marcar como não lida"
                          >
                            <Circle className="w-4 h-4" /> Não lida
                          </button>
                        </form>
                      )}

                      <form action={deleteMessage.bind(null, msg.id)}>
                        <button
                          type="submit"
                          className="text-xs flex items-center gap-1 text-rose-500 hover:text-rose-700 hover:bg-rose-50 px-2 py-1 rounded transition-colors"
                          title="Excluir mensagem"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </form>
                    </div>
                  </div>
                </div>

                {msg.service && (
                  <div className="mb-4">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-[#af4d30]/10 text-[#af4d30]">
                      Interesse: {msg.service}
                    </span>
                  </div>
                )}

                <div className="bg-white border border-slate-200 rounded-lg p-4 text-slate-700 text-sm whitespace-pre-wrap">
                  {msg.message}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
