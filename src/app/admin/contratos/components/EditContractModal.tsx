"use client";

import type { Contract } from "@prisma/client";
import { Edit3, Loader2 } from "lucide-react";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { RichEditor } from "@/components/ui/rich-editor";
import { updateContract } from "../actions";

export function EditContractModal({ contract }: { contract: Contract }) {
  const [open, setOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [content, setContent] = useState(contract.content);
  const [totalValue, setTotalValue] = useState<string>(
    contract.totalValue ? String(contract.totalValue) : "",
  );
  const [monthlyValue, setMonthlyValue] = useState<string>(
    contract.monthlyValue ? String(contract.monthlyValue) : "",
  );
  const [dailyValue, setDailyValue] = useState<string>(
    contract.dailyValue ? String(contract.dailyValue) : "",
  );
  const [validityDescription, setValidityDescription] = useState<string>(
    contract.validityDescription || "",
  );
  const [workRegime, setWorkRegime] = useState<string>(
    contract.workRegime || "",
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await updateContract(contract.id, {
        content,
        totalValue: totalValue ? Number.parseFloat(totalValue) : undefined,
        monthlyValue: monthlyValue
          ? Number.parseFloat(monthlyValue)
          : undefined,
        dailyValue: dailyValue ? Number.parseFloat(dailyValue) : undefined,
        validityDescription,
        workRegime,
      });
      setOpen(false);
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
      <DialogTrigger>
        <div className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors shadow-xs cursor-pointer">
          <Edit3 className="w-3.5 h-3.5 text-slate-500" />
          Editar
        </div>
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            Editar Contrato (Nº {contract.id.slice(-6).toUpperCase()})
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 pt-2">
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
                type="number"
                step="0.01"
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
                type="number"
                step="0.01"
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
                type="number"
                step="0.01"
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

          <div className="flex justify-end gap-3 pt-3 border-t">
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="px-4 py-2 text-sm text-slate-600 bg-white border rounded-lg hover:bg-slate-50"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex items-center gap-2 px-5 py-2 text-sm font-semibold text-white bg-primary rounded-lg hover:bg-primary/90 disabled:opacity-50"
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
