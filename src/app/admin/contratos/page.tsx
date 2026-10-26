import {
  CheckCircle2,
  FileText,
  MessageCircle,
  ShieldCheck,
} from "lucide-react";
import type { Metadata } from "next";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { prisma } from "@/infrastructure/db/prisma";
import { buildWhatsAppLink } from "@/utils/whatsapp";
import {
  getContracts,
  getContractTemplates,
  getPendingBookings,
} from "./actions";
import { CopyLinkButton } from "./components/CopyLinkButton";
import { CreateContractModal } from "./components/CreateContractModal";
import { DeleteContractButton } from "./components/DeleteContractButton";
import { EditContractModal } from "./components/EditContractModal";
import { ExportContractsModal } from "./components/ExportContractsModal";
import { PDFPreviewModal } from "./components/PDFPreviewModal";
import {
  CreateTemplateModal,
  EditTemplateModal,
} from "./components/TemplateModals";

export const metadata: Metadata = {
  title: "Contratos | Vita Baby Dashboard",
};

export const dynamic = "force-dynamic";

export default async function ContratosPage() {
  let templates: Awaited<ReturnType<typeof getContractTemplates>> = [];
  let contracts: Awaited<ReturnType<typeof getContracts>> = [];
  let pendingBookings: Awaited<ReturnType<typeof getPendingBookings>> = [];
  let clients: Awaited<
    ReturnType<typeof prisma.client.findMany<{ orderBy: { name: "asc" } }>>
  > = [];
  let clientSchedules: Awaited<
    ReturnType<
      typeof prisma.clientSchedule.findMany<{
        include: { client: true };
        orderBy: { createdAt: "desc" };
      }>
    >
  > = [];

  try {
    [templates, contracts, pendingBookings, clients, clientSchedules] =
      await Promise.all([
        getContractTemplates(),
        getContracts(),
        getPendingBookings(),
        prisma.client.findMany({
          orderBy: { name: "asc" },
        }),
        prisma.clientSchedule.findMany({
          include: { client: true },
          orderBy: { createdAt: "desc" },
        }),
      ]);
  } catch (error) {
    console.error("Erro ao carregar dados de contratos:", error);
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">
            Contratos
          </h1>
          <p className="text-slate-500 mt-2">
            Gerencie os modelos base, emita novos contratos e envie diretamente
            via WhatsApp.
          </p>
        </div>
      </div>

      <Tabs defaultValue="emitidos" className="w-full">
        <TabsList className="mb-6">
          <TabsTrigger value="emitidos">Contratos Emitidos</TabsTrigger>
          <TabsTrigger value="modelos">Modelos Base (Templates)</TabsTrigger>
        </TabsList>

        <TabsContent value="emitidos" className="space-y-4">
          <div className="flex flex-wrap items-center justify-end gap-2.5 mb-4">
            <ExportContractsModal contracts={contracts} />
            <CreateContractModal
              pendingBookings={pendingBookings}
              templates={templates}
              clients={clients}
              clientSchedules={clientSchedules}
            />
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
            {contracts.length === 0 ? (
              <div className="p-12 text-center text-slate-500">
                <FileText className="w-12 h-12 mx-auto text-slate-300 mb-4" />
                <p className="text-lg font-medium text-slate-900">
                  Nenhum contrato emitido.
                </p>
                <p className="text-sm mt-1">
                  Aprove agendamentos e gere os contratos dos clientes.
                </p>
              </div>
            ) : (
              <div className="divide-y divide-slate-100">
                {contracts.map((contract) => {
                  const client =
                    contract.client ||
                    contract.booking?.client ||
                    contract.schedule?.client;
                  const appUrl =
                    process.env.NEXT_PUBLIC_APP_URL ||
                    process.env.BETTER_AUTH_URL ||
                    "https://vitababy.com.br";
                  const contractUrl = `${appUrl}/contrato/${contract.id}`;
                  const whatsappMessage = `Olá, ${client?.name || "Cliente"}! Segue o link para visualização do seu contrato Vita Baby assinado: ${contractUrl}`;
                  const whatsappUrl = buildWhatsAppLink(
                    client?.phone,
                    whatsappMessage,
                  );

                  return (
                    <div
                      key={contract.id}
                      className="p-4 sm:p-6 flex flex-col lg:flex-row lg:items-center justify-between hover:bg-slate-50/50 transition-colors gap-4"
                    >
                      <div className="flex items-start gap-4">
                        <div
                          className={`w-10 h-10 flex items-center justify-center rounded-lg shrink-0 mt-1 ${
                            contract.signedByClient && contract.signedByProf
                              ? "bg-emerald-100 text-emerald-600"
                              : contract.signedByProf
                                ? "bg-blue-100 text-blue-600"
                                : contract.signedByClient
                                  ? "bg-amber-100 text-amber-600"
                                  : "bg-slate-100 text-slate-600"
                          }`}
                        >
                          {contract.signedByClient && contract.signedByProf ? (
                            <CheckCircle2 className="w-5 h-5" />
                          ) : contract.signedByProf ? (
                            <ShieldCheck className="w-5 h-5" />
                          ) : (
                            <FileText className="w-5 h-5" />
                          )}
                        </div>
                        <div>
                          <div className="flex flex-wrap items-center gap-2">
                            <h3 className="font-semibold text-slate-900">
                              {contract.booking?.packages
                                ?.map((p) => p.name)
                                .join(" + ") ||
                                contract.schedule?.title ||
                                `Contrato Nº ${contract.id.slice(-6).toUpperCase()}`}
                            </h3>

                            {contract.signedByClient &&
                            contract.signedByProf ? (
                              <span className="text-[10px] bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full font-bold uppercase tracking-wider">
                                100% Assinado
                              </span>
                            ) : contract.signedByProf ? (
                              <span className="text-[10px] bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full font-bold uppercase tracking-wider">
                                Assinado p/ Contratada
                              </span>
                            ) : contract.signedByClient ? (
                              <span className="text-[10px] bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full font-bold uppercase tracking-wider">
                                Assinado p/ Cliente
                              </span>
                            ) : (
                              <span className="text-[10px] bg-slate-100 text-slate-700 px-2 py-0.5 rounded-full font-bold uppercase tracking-wider">
                                Aguardando Assinatura
                              </span>
                            )}
                          </div>

                          <p className="text-xs text-slate-600 mt-1 font-medium">
                            Cliente: {client?.name || "Cliente não informado"}
                            {client?.phone && ` (${client.phone})`}
                          </p>

                          <div className="flex flex-wrap gap-x-4 text-xs text-slate-500 mt-1">
                            {contract.totalValue && (
                              <span className="font-semibold text-[#ae4d30]">
                                Total:{" "}
                                {new Intl.NumberFormat("pt-BR", {
                                  style: "currency",
                                  currency: "BRL",
                                }).format(contract.totalValue)}
                              </span>
                            )}
                            {contract.monthlyValue && (
                              <span>
                                Mensal:{" "}
                                {new Intl.NumberFormat("pt-BR", {
                                  style: "currency",
                                  currency: "BRL",
                                }).format(contract.monthlyValue)}
                              </span>
                            )}
                            {contract.dailyValue && (
                              <span>
                                Diária:{" "}
                                {new Intl.NumberFormat("pt-BR", {
                                  style: "currency",
                                  currency: "BRL",
                                }).format(contract.dailyValue)}
                              </span>
                            )}
                            <span>
                              Criado em:{" "}
                              {new Date(
                                contract.createdAt,
                              ).toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 sm:flex sm:flex-wrap sm:items-center gap-2 pt-3 lg:pt-0 border-t lg:border-t-0 border-slate-100 w-full lg:w-auto">
                        {contract.signedByClient && whatsappUrl && (
                          <a
                            href={whatsappUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg transition-colors shadow-xs min-h-[38px] w-full sm:w-auto"
                          >
                            <MessageCircle className="w-3.5 h-3.5" />
                            WhatsApp
                          </a>
                        )}

                        {!contract.signedByClient && (
                          <EditContractModal contract={contract} />
                        )}

                        <CopyLinkButton
                          contractId={contract.id}
                          isSigned={contract.signedByClient}
                          clientPhone={client?.phone}
                          clientName={client?.name}
                        />

                        <PDFPreviewModal
                          contractId={contract.id}
                          title={`Contrato Cliente`}
                        />

                        <DeleteContractButton contractId={contract.id} />
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </TabsContent>

        <TabsContent value="modelos">
          <div className="flex justify-end mb-4">
            <CreateTemplateModal />
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
            {templates.length === 0 ? (
              <div className="p-12 text-center text-slate-500">
                <FileText className="w-12 h-12 mx-auto text-slate-300 mb-4" />
                <p className="text-lg font-medium text-slate-900">
                  Nenhum modelo de contrato.
                </p>
                <p className="text-sm mt-1">
                  Crie o seu primeiro texto base para os clientes assinarem.
                </p>
              </div>
            ) : (
              <div className="divide-y divide-slate-100">
                {templates.map((template) => (
                  <div
                    key={template.id}
                    className="p-4 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between hover:bg-slate-50/50 transition-colors gap-3"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-primary/10 text-primary flex items-center justify-center rounded-lg shrink-0">
                        <FileText className="w-5 h-5" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-slate-900">
                          {template.title}
                        </h3>
                        <p className="text-xs text-slate-500 mt-1">
                          Usado como base para novos agendamentos
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100 w-full sm:w-auto justify-end">
                      <PDFPreviewModal
                        contractId={template.id}
                        title={template.title}
                      />
                      <EditTemplateModal template={template} />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
