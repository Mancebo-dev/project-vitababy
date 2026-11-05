"use client";

import type { Client, Contract, Professional } from "@prisma/client";
import { Edit3, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { RichEditor } from "@/components/ui/rich-editor";
import { updateContract } from "../actions";

function parseMoneyInput(val?: string): number | null {
  if (!val || !val.trim()) return null;
  const normalized = val.trim().replace(",", ".");
  const parsed = Number.parseFloat(normalized);
  return Number.isNaN(parsed) ? null : parsed;
}

function toInputDateValue(d?: string | Date | null): string {
  if (!d) return "";
  if (typeof d === "string") {
    const trimmed = d.trim();
    if (/^\d{4}-\d{2}-\d{2}$/.test(trimmed)) return trimmed;
    if (/^\d{2}\/\d{2}\/\d{4}$/.test(trimmed)) {
      const [day, month, year] = trimmed.split("/");
      return `${year}-${month}-${day}`;
    }
    return "";
  }
  const dateObj = new Date(d);
  if (Number.isNaN(dateObj.getTime())) return "";
  return dateObj.toISOString().split("T")[0];
}

export function EditContractModal({
  contract,
  clients = [],
  professionals = [],
  defaultDate,
  defaultTime,
  defaultProfessional,
}: {
  contract: Contract;
  clients?: Client[];
  professionals?: Professional[];
  defaultDate?: string;
  defaultTime?: string;
  defaultProfessional?: string;
}) {
  const [open, setOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [customProfMode, setCustomProfMode] = useState(false);
  const router = useRouter();

  const [clientId, setClientId] = useState<string>(contract.clientId || "");
  const [content, setContent] = useState(contract.content);
  const [serviceName, setServiceName] = useState<string>(
    contract.serviceName || "",
  );
  const [serviceDetails, setServiceDetails] = useState<string>(
    contract.serviceDetails || "",
  );
  const [serviceDate, setServiceDate] = useState<string>(
    toInputDateValue(contract.serviceDate || defaultDate),
  );
  const [serviceTime, setServiceTime] = useState<string>(
    contract.serviceTime || defaultTime || "",
  );
  const [serviceProfessional, setServiceProfessional] = useState<string>(
    contract.serviceProfessional || defaultProfessional || "",
  );
  const [totalValue, setTotalValue] = useState<string>(
    contract.totalValue !== null && contract.totalValue !== undefined
      ? String(contract.totalValue)
      : "",
  );
  const [monthlyValue, setMonthlyValue] = useState<string>(
    contract.monthlyValue !== null && contract.monthlyValue !== undefined
      ? String(contract.monthlyValue)
      : "",
  );
  const [dailyValue, setDailyValue] = useState<string>(
    contract.dailyValue !== null && contract.dailyValue !== undefined
      ? String(contract.dailyValue)
      : "",
  );
  const [validityDescription, setValidityDescription] = useState<string>(
    contract.validityDescription || "",
  );
  const [workRegime, setWorkRegime] = useState<string>(
    contract.workRegime || "",
  );

  // Sync state whenever modal opens or contract prop updates
  useEffect(() => {
    if (open) {
      setClientId(contract.clientId || "");
      setContent(contract.content);
      setServiceName(contract.serviceName || "");
      setServiceDetails(contract.serviceDetails || "");
      setServiceDate(toInputDateValue(contract.serviceDate || defaultDate));
      setServiceTime(contract.serviceTime || defaultTime || "");
      const initialProf =
        contract.serviceProfessional || defaultProfessional || "";
      setServiceProfessional(initialProf);
      if (
        initialProf &&
        professionals.length > 0 &&
        !professionals.some((p) => p.name === initialProf)
      ) {
        setCustomProfMode(true);
      } else {
        setCustomProfMode(false);
      }
      setTotalValue(
        contract.totalValue !== null && contract.totalValue !== undefined
          ? String(contract.totalValue)
          : "",
      );
      setMonthlyValue(
        contract.monthlyValue !== null && contract.monthlyValue !== undefined
          ? String(contract.monthlyValue)
          : "",
      );
      setDailyValue(
        contract.dailyValue !== null && contract.dailyValue !== undefined
          ? String(contract.dailyValue)
          : "",
      );
      setValidityDescription(contract.validityDescription || "");
      setWorkRegime(contract.workRegime || "");
    }
  }, [
    open,
    contract,
    defaultDate,
    defaultTime,
    defaultProfessional,
    professionals,
  ]);

  const isSigned = Boolean(contract.signedByClient);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSigned) {
      alert("Contratos já assinados pelo cliente não podem ser editados.");
      return;
    }
    setIsSubmitting(true);
    try {
      await updateContract(contract.id, {
        clientId: clientId || undefined,
        content,
        serviceName: serviceName.trim() || null,
        serviceDetails: serviceDetails.trim() || null,
        serviceDate: serviceDate.trim() || null,
        serviceTime: serviceTime.trim() || null,
        serviceProfessional: serviceProfessional.trim() || null,
        totalValue: parseMoneyInput(totalValue),
        monthlyValue: parseMoneyInput(monthlyValue),
        dailyValue: parseMoneyInput(dailyValue),
        validityDescription: validityDescription.trim() || null,
        workRegime: workRegime.trim() || null,
      });
      setOpen(false);
      router.refresh();
    } catch (error) {
      console.error(error);
      alert(
        error instanceof Error ? error.message : "Erro ao atualizar contrato.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger className="inline-flex items-center justify-center gap-1.5 px-3 py-2 sm:py-1.5 text-xs font-semibold text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors shadow-xs cursor-pointer min-h-[38px] w-full sm:w-auto">
        <Edit3 className="w-3.5 h-3.5 text-slate-500" />
        <span>Editar</span>
      </DialogTrigger>
      <DialogContent className="w-full max-w-[calc(100%-1.5rem)] sm:max-w-3xl lg:max-w-4xl max-h-[90vh] overflow-y-auto p-4 sm:p-6">
        <DialogHeader>
          <DialogTitle>
            Editar Contrato (Nº {contract.id.slice(-6).toUpperCase()})
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 pt-2">
          {/* Cliente / Paciente */}
          {clients.length > 0 && (
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
              <label
                htmlFor={`edit-client-${contract.id}`}
                className="block text-xs font-semibold text-slate-700 mb-1"
              >
                Cliente / Paciente
              </label>
              <select
                id={`edit-client-${contract.id}`}
                value={clientId}
                onChange={(e) => setClientId(e.target.value)}
                className="w-full px-3 py-2 text-sm border rounded-lg bg-white"
              >
                <option value="">Selecione um cliente...</option>
                {clients.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Objeto Contratado: Serviço, Assessora, Data e Horário */}
          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label
                  htmlFor={`edit-service-name-${contract.id}`}
                  className="block text-xs font-semibold text-slate-700 mb-1"
                >
                  Nome do Serviço / Objeto Contratado
                </label>
                <input
                  id={`edit-service-name-${contract.id}`}
                  type="text"
                  placeholder="Ex: Assistência Especializada - 6h de permanência"
                  value={serviceName}
                  onChange={(e) => setServiceName(e.target.value)}
                  className="w-full px-3 py-2 text-sm border rounded-lg bg-white"
                />
                <p className="text-[11px] text-slate-500 mt-1">
                  Se este campo for deixado em branco, a caixa de &quot;Objeto
                  do Contrato&quot; não será exibida no contrato.
                </p>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label
                    htmlFor={`edit-service-prof-${contract.id}`}
                    className="block text-xs font-semibold text-slate-700"
                  >
                    Assessora / Profissional
                  </label>
                  <button
                    type="button"
                    onClick={() => setCustomProfMode(!customProfMode)}
                    className="text-[11px] text-primary hover:underline font-medium"
                  >
                    {customProfMode
                      ? "Selecionar da lista"
                      : "Digitar manualmente"}
                  </button>
                </div>

                {customProfMode || professionals.length === 0 ? (
                  <input
                    id={`edit-service-prof-${contract.id}`}
                    type="text"
                    placeholder="Digite o nome da profissional..."
                    value={serviceProfessional}
                    onChange={(e) => setServiceProfessional(e.target.value)}
                    className="w-full px-3 py-2 text-sm border rounded-lg bg-white"
                  />
                ) : (
                  <select
                    id={`edit-service-prof-${contract.id}`}
                    value={serviceProfessional}
                    onChange={(e) => {
                      if (e.target.value === "__custom__") {
                        setCustomProfMode(true);
                        setServiceProfessional("");
                      } else {
                        setServiceProfessional(e.target.value);
                      }
                    }}
                    className="w-full px-3 py-2 text-sm border rounded-lg bg-white"
                  >
                    <option value="">
                      Selecione a assessora (ou deixe em branco)...
                    </option>
                    {professionals.map((p) => (
                      <option key={p.id} value={p.name}>
                        {p.name}
                      </option>
                    ))}
                    <option value="__custom__">Outro nome (digitar)...</option>
                  </select>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label
                  htmlFor={`edit-service-date-${contract.id}`}
                  className="block text-xs font-semibold text-slate-700 mb-1"
                >
                  Data do Atendimento
                </label>
                <input
                  id={`edit-service-date-${contract.id}`}
                  type="date"
                  value={serviceDate}
                  onChange={(e) => setServiceDate(e.target.value)}
                  className="w-full px-3 py-2 text-sm border rounded-lg bg-white"
                />
              </div>

              <div>
                <label
                  htmlFor={`edit-service-time-${contract.id}`}
                  className="block text-xs font-semibold text-slate-700 mb-1"
                >
                  Horário do Atendimento (Horas)
                </label>
                <input
                  id={`edit-service-time-${contract.id}`}
                  type="text"
                  placeholder="Ex: 19:00 ou 19:00 às 01:00"
                  value={serviceTime}
                  onChange={(e) => setServiceTime(e.target.value)}
                  className="w-full px-3 py-2 text-sm border rounded-lg bg-white"
                />
              </div>

              <div>
                <label
                  htmlFor={`edit-service-details-${contract.id}`}
                  className="block text-xs font-semibold text-slate-700 mb-1"
                >
                  Detalhes / Especificação (Opcional)
                </label>
                <input
                  id={`edit-service-details-${contract.id}`}
                  type="text"
                  placeholder="Ex: Plantão noturno domiciliar"
                  value={serviceDetails}
                  onChange={(e) => setServiceDetails(e.target.value)}
                  className="w-full px-3 py-2 text-sm border rounded-lg bg-white"
                />
              </div>
            </div>
          </div>

          {/* Grid de Valores e Competência */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-4 bg-slate-50 rounded-xl border border-slate-200">
            <div>
              <label
                htmlFor={`edit-total-${contract.id}`}
                className="block text-xs font-semibold text-slate-700 mb-1"
              >
                Valor Total (R$)
              </label>
              <input
                id={`edit-total-${contract.id}`}
                type="text"
                inputMode="decimal"
                placeholder="Ex: 3500.00"
                value={totalValue}
                onChange={(e) => setTotalValue(e.target.value)}
                className="w-full px-3 py-2 text-sm border rounded-lg bg-white"
              />
            </div>

            <div>
              <label
                htmlFor={`edit-monthly-${contract.id}`}
                className="block text-xs font-semibold text-slate-700 mb-1"
              >
                Valor Mensal (R$)
              </label>
              <input
                id={`edit-monthly-${contract.id}`}
                type="text"
                inputMode="decimal"
                placeholder="Ex: 1200.00"
                value={monthlyValue}
                onChange={(e) => setMonthlyValue(e.target.value)}
                className="w-full px-3 py-2 text-sm border rounded-lg bg-white"
              />
            </div>

            <div>
              <label
                htmlFor={`edit-daily-${contract.id}`}
                className="block text-xs font-semibold text-slate-700 mb-1"
              >
                Valor da Diária (R$)
              </label>
              <input
                id={`edit-daily-${contract.id}`}
                type="text"
                inputMode="decimal"
                placeholder="Ex: 250.00"
                value={dailyValue}
                onChange={(e) => setDailyValue(e.target.value)}
                className="w-full px-3 py-2 text-sm border rounded-lg bg-white"
              />
            </div>

            <div className="sm:col-span-2">
              <label
                htmlFor={`edit-validity-${contract.id}`}
                className="block text-xs font-semibold text-slate-700 mb-1"
              >
                Competência / Validade
              </label>
              <input
                id={`edit-validity-${contract.id}`}
                placeholder="Ex: 3 meses (outubro, novembro e dezembro de 2026)"
                value={validityDescription}
                onChange={(e) => setValidityDescription(e.target.value)}
                className="w-full px-3 py-2 text-sm border rounded-lg bg-white"
              />
            </div>

            <div>
              <label
                htmlFor={`edit-regime-${contract.id}`}
                className="block text-xs font-semibold text-slate-700 mb-1"
              >
                Regime de Atendimento
              </label>
              <input
                id={`edit-regime-${contract.id}`}
                placeholder="Ex: dias úteis (segunda a sexta)"
                value={workRegime}
                onChange={(e) => setWorkRegime(e.target.value)}
                className="w-full px-3 py-2 text-sm border rounded-lg bg-white"
              />
            </div>
          </div>

          <div>
            <span className="block text-xs font-semibold text-slate-700 mb-1">
              Texto e Cláusulas do Contrato
            </span>
            <RichEditor value={content} onChange={setContent} a4Mode={false} />
          </div>

          <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-2 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="w-full sm:w-auto px-4 py-2 text-sm text-slate-600 bg-white border rounded-lg hover:bg-slate-50"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2 text-sm font-semibold text-white bg-primary rounded-lg hover:bg-primary/90 disabled:opacity-50"
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
