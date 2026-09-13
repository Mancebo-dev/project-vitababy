import { CheckCircle2, FileText } from "lucide-react";
import type { Metadata } from "next";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  getContracts,
  getContractTemplates,
  getPendingBookings,
} from "./actions";
import { CopyLinkButton } from "./components/CopyLinkButton";
import { CreateContractModal } from "./components/CreateContractModal";
import { PDFPreviewModal } from "./components/PDFPreviewModal";
import {
  CreateTemplateModal,
  EditTemplateModal,
} from "./components/TemplateModals";

export const metadata: Metadata = {
  title: "Contratos | Vita Baby Dashboard",
};

export default async function ContratosPage() {
  const templates = await getContractTemplates();
  const contracts = await getContracts();
  const pendingBookings = await getPendingBookings();

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">
            Contratos
          </h1>
          <p className="text-slate-500 mt-2">
            Gerencie os modelos base e emita novos contratos para seus clientes.
          </p>
        </div>
      </div>

      <Tabs defaultValue="emitidos" className="w-full">
        <TabsList className="mb-6">
          <TabsTrigger value="emitidos">Contratos Emitidos</TabsTrigger>
          <TabsTrigger value="modelos">Modelos Base (Templates)</TabsTrigger>
        </TabsList>

        <TabsContent value="emitidos" className="space-y-4">
          <div className="flex justify-end mb-4">
            <CreateContractModal
              pendingBookings={pendingBookings}
              templates={templates}
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
                {contracts.map((contract) => (
                  <div
                    key={contract.id}
                    className="p-6 flex flex-col sm:flex-row sm:items-center justify-between hover:bg-slate-50/50 transition-colors gap-4"
                  >
                    <div className="flex items-center gap-4">
                      <div
                        className={`w-10 h-10 flex items-center justify-center rounded-lg ${contract.signedByClient ? "bg-emerald-100 text-emerald-600" : "bg-amber-100 text-amber-600"}`}
                      >
                        <CheckCircle2 className="w-5 h-5" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-slate-900 flex items-center gap-2">
                          {contract.booking?.packages
                            ?.map((p) => p.name)
                            .join(" + ") || "Contrato"}

                          {contract.signedByClient ? (
                            <span className="text-[10px] bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full font-bold uppercase tracking-wider">
                              Assinado
                            </span>
                          ) : (
                            <span className="text-[10px] bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full font-bold uppercase tracking-wider">
                              Aguardando
                            </span>
                          )}
                        </h3>
                        <p className="text-xs text-slate-500 mt-1">
                          Cliente: {contract.booking?.client?.name}
                        </p>
                        <p className="text-xs text-slate-500">
                          Gerado em:{" "}
                          {new Date(contract.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-3">
                      <CopyLinkButton contractId={contract.id} />
                      <PDFPreviewModal
                        contractId={contract.id}
                        title={`Contrato Cliente`}
                      />
                    </div>
                  </div>
                ))}
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
                    className="p-6 flex items-center justify-between hover:bg-slate-50/50 transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-primary/10 text-primary flex items-center justify-center rounded-lg">
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
                    <div className="flex gap-4">
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
