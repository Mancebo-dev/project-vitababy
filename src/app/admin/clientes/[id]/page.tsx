import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import {
  ArrowLeft,
  Calendar,
  ExternalLink,
  FileText,
  Mail,
  MapPin,
  Phone,
} from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { prisma } from "@/infrastructure/db/prisma";
import { ClientFilesTab } from "../components/ClientFilesTab";
import { ClientModal } from "../components/ClientModal";
import { ClientNotesTab } from "../components/ClientNotesTab";

export const metadata: Metadata = {
  title: "Perfil do Cliente | Vita Baby Dashboard",
};

export default async function ClientProfilePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const client = await prisma.client.findUnique({
    where: { id },
    include: {
      notes: {
        include: { professional: true },
        orderBy: { date: "desc" },
      },
      bookings: {
        include: {
          packages: { include: { service: true } },
          scheduleSlot: true,
          contract: true,
          payments: true,
        },
        orderBy: { createdAt: "desc" },
      },
      files: {
        orderBy: { createdAt: "desc" },
      },
    },
  });

  const professionals = await prisma.professional.findMany({
    where: { active: true },
  });

  if (!client) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link
          href="/admin/clientes"
          className="p-2 bg-white rounded-full border shadow-sm hover:bg-slate-50 transition-colors"
        >
          <ArrowLeft className="w-5 h-5 text-slate-600" />
        </Link>
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">
            {client.name}
          </h1>
          <p className="text-slate-500 mt-1">Perfil e Histórico do Cliente</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Client Info Card */}
        <div className="md:col-span-1 space-y-6">
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 relative">
            <div className="absolute top-4 right-4">
              <ClientModal
                client={client}
                trigger={
                  <button
                    type="button"
                    className="text-sm font-medium text-primary hover:underline"
                  >
                    Editar
                  </button>
                }
              />
            </div>
            <div className="w-20 h-20 rounded-full bg-primary/10 text-primary flex items-center justify-center text-3xl font-bold uppercase mb-4">
              {client.name.charAt(0)}
            </div>
            <h2 className="text-xl font-bold text-slate-900 mb-6">
              {client.name}
            </h2>

            <div className="space-y-4">
              <div className="flex items-start gap-3 text-sm">
                <Phone className="w-4 h-4 text-slate-400 mt-0.5" />
                <div>
                  <p className="font-medium text-slate-900">
                    Telefone / WhatsApp
                  </p>
                  <p className="text-slate-600">{client.phone}</p>
                </div>
              </div>

              {client.email && (
                <div className="flex items-start gap-3 text-sm">
                  <Mail className="w-4 h-4 text-slate-400 mt-0.5" />
                  <div>
                    <p className="font-medium text-slate-900">Email</p>
                    <p className="text-slate-600">{client.email}</p>
                  </div>
                </div>
              )}

              {client.cpf && (
                <div className="flex items-start gap-3 text-sm">
                  <FileText className="w-4 h-4 text-slate-400 mt-0.5" />
                  <div>
                    <p className="font-medium text-slate-900">CPF</p>
                    <p className="text-slate-600">{client.cpf}</p>
                  </div>
                </div>
              )}

              {client.address && (
                <div className="flex items-start gap-3 text-sm">
                  <MapPin className="w-4 h-4 text-slate-400 mt-0.5" />
                  <div>
                    <p className="font-medium text-slate-900">Endereço</p>
                    <p className="text-slate-600">{client.address}</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* History & Notes Area */}
        <div className="md:col-span-2 space-y-6">
          <Tabs defaultValue="historico" className="w-full">
            <TabsList className="mb-6">
              <TabsTrigger value="historico">Histórico de Serviços</TabsTrigger>
              <TabsTrigger value="prontuario">
                Prontuário / Evolução
              </TabsTrigger>
              <TabsTrigger value="arquivos">Exames e Arquivos</TabsTrigger>
            </TabsList>

            <TabsContent value="historico">
              <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                <div className="p-6 border-b border-slate-100 flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-slate-400" />
                  <h3 className="text-lg font-bold text-slate-900">
                    Histórico de Serviços
                  </h3>
                </div>

                <div className="p-0">
                  {client.bookings.length === 0 ? (
                    <div className="p-8 text-center text-slate-500">
                      <p>Este cliente ainda não possui agendamentos.</p>
                    </div>
                  ) : (
                    <div className="divide-y divide-slate-100">
                      {client.bookings.map((booking) => (
                        <div
                          key={booking.id}
                          className="p-6 hover:bg-slate-50/50 transition-colors"
                        >
                          <div className="flex justify-between items-start mb-4">
                            <div>
                              <h4 className="font-bold text-slate-900 text-lg">
                                {booking.packages
                                  ?.map((p) => p.name)
                                  .join(" + ")}
                              </h4>
                              <p className="text-slate-500 text-sm">
                                {booking.packages
                                  ?.map((p) => p.service?.name)
                                  .filter(Boolean)
                                  .join(" + ")}
                              </p>
                            </div>
                            <span
                              className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                booking.status === "CONFIRMED"
                                  ? "bg-emerald-100 text-emerald-800"
                                  : booking.status === "CANCELLED"
                                    ? "bg-rose-100 text-rose-800"
                                    : booking.status === "COMPLETED"
                                      ? "bg-blue-100 text-blue-800"
                                      : "bg-amber-100 text-amber-800"
                              }`}
                            >
                              {booking.status === "CONFIRMED"
                                ? "Confirmado"
                                : booking.status === "CANCELLED"
                                  ? "Cancelado"
                                  : booking.status === "COMPLETED"
                                    ? "Concluído"
                                    : "Pendente"}
                            </span>
                          </div>

                          <div className="grid grid-cols-2 gap-4 text-sm">
                            <div className="bg-slate-50 p-3 rounded-lg">
                              <p className="text-slate-500 mb-1">Horário</p>
                              {booking.scheduleSlot ? (
                                <p className="font-medium text-slate-900">
                                  {format(
                                    new Date(booking.scheduleSlot.date),
                                    "dd/MM/yyyy",
                                    { locale: ptBR },
                                  )}{" "}
                                  às {booking.scheduleSlot.startTime}
                                </p>
                              ) : (
                                <p className="text-slate-400 italic">
                                  Não agendado
                                </p>
                              )}
                            </div>

                            <div className="bg-slate-50 p-3 rounded-lg">
                              <p className="text-slate-500 mb-1">Contrato</p>
                              {booking.contract ? (
                                <Link
                                  href={`/contrato/${booking.contract.id}`}
                                  target="_blank"
                                  className="font-medium text-primary hover:underline inline-flex items-center gap-1"
                                >
                                  Ver Contrato{" "}
                                  <ExternalLink className="w-3 h-3" />
                                </Link>
                              ) : (
                                <p className="text-slate-400 italic">
                                  Sem contrato
                                </p>
                              )}
                            </div>
                          </div>

                          {booking.payments && booking.payments.length > 0 && (
                            <div className="mt-4 pt-4 border-t border-slate-100">
                              <p className="text-sm font-medium text-slate-900 mb-2">
                                Pagamentos Vinculados
                              </p>
                              <div className="space-y-2">
                                {booking.payments.map((payment) => (
                                  <div
                                    key={payment.id}
                                    className="flex justify-between items-center text-sm bg-slate-50 p-2 rounded"
                                  >
                                    <span className="text-slate-600">
                                      {payment.description ||
                                        "Pagamento de Serviço"}
                                    </span>
                                    <div className="flex gap-4">
                                      <span className="font-medium text-emerald-600">
                                        {new Intl.NumberFormat("pt-BR", {
                                          style: "currency",
                                          currency: "BRL",
                                        }).format(payment.amount)}
                                      </span>
                                      <span className="text-slate-400">
                                        {payment.method}
                                      </span>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </TabsContent>

            <TabsContent value="prontuario">
              <ClientNotesTab
                clientId={client.id}
                notes={client.notes}
                professionals={professionals}
              />
            </TabsContent>

            <TabsContent value="arquivos">
              <ClientFilesTab clientId={client.id} files={client.files} />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
