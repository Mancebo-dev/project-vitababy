"use client";

import { Check, Link2, Loader2, MessageCircle, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { buildWhatsAppLink } from "@/utils/whatsapp";
import { deleteEmployeeContract, generateEmployeeSignLink } from "../actions";

export function EmployeePDFPreviewModal({
  contractId,
  title,
}: {
  contractId: string;
  title: string;
}) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="inline-flex items-center justify-center gap-1.5 px-3 py-2 sm:py-1.5 text-xs font-semibold text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors shadow-xs min-h-[38px] w-full sm:w-auto cursor-pointer"
      >
        <span>Visualizar PDF</span>
      </button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-5xl lg:max-w-6xl w-full h-[95vh] flex flex-col p-0 overflow-hidden bg-slate-100 rounded-2xl shadow-2xl">
          <DialogHeader className="px-6 py-3.5 border-b border-slate-200 bg-white flex flex-row items-center justify-between shrink-0">
            <div className="flex items-center gap-3">
              <DialogTitle className="text-base font-bold text-slate-900">
                Visualização do Contrato — {title}
              </DialogTitle>
              <span className="text-[11px] font-semibold bg-slate-100 text-slate-600 px-2.5 py-0.5 rounded-full border border-slate-200">
                Formato A4
              </span>
            </div>
          </DialogHeader>
          <div className="flex-1 w-full bg-slate-200/70 overflow-hidden">
            {open && (
              <iframe
                src={`/contrato-funcionario/${contractId}?preview=1`}
                className="w-full h-full border-0"
                title={`Contrato ${title}`}
              />
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}

export function EmployeeCopyLinkButton({
  contractId,
  isSigned,
  employeePhone,
  employeeName,
}: {
  contractId: string;
  isSigned: boolean;
  employeePhone?: string | null;
  employeeName?: string | null;
}) {
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleCopyOrSend = async (sendWhatsApp = false) => {
    setLoading(true);
    try {
      let url = `${window.location.origin}/contrato-funcionario/${contractId}`;
      if (!isSigned) {
        const res = await generateEmployeeSignLink(contractId);
        if (res.token) {
          url = `${window.location.origin}/assinar-funcionario/${res.token}`;
        }
      }

      if (sendWhatsApp && employeePhone) {
        const msg = isSigned
          ? `Olá, ${employeeName || ""}! Segue o link do seu contrato assinado com a Vita Baby Assessoria:\n\n${url}`
          : `Olá, ${employeeName || ""}! Segue o link para visualização e assinatura digital do seu contrato com a Vita Baby Assessoria:\n\n${url}`;
        const waUrl = buildWhatsAppLink(employeePhone, msg);
        window.open(waUrl, "_blank", "noopener,noreferrer");
      } else {
        await navigator.clipboard.writeText(url);
        setCopied(true);
        setTimeout(() => setCopied(false), 2500);
      }
    } catch (err) {
      console.error(err);
      alert("Erro ao gerar link do contrato.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="inline-flex items-center gap-1.5 w-full sm:w-auto">
      <button
        type="button"
        disabled={loading}
        onClick={() => handleCopyOrSend(false)}
        className="inline-flex items-center justify-center gap-1.5 px-3 py-2 sm:py-1.5 text-xs font-semibold text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors shadow-xs min-h-[38px] flex-1 sm:flex-initial cursor-pointer"
      >
        {loading ? (
          <Loader2 className="w-3.5 h-3.5 animate-spin" />
        ) : copied ? (
          <Check className="w-3.5 h-3.5 text-emerald-600" />
        ) : (
          <Link2 className="w-3.5 h-3.5 text-slate-500" />
        )}
        <span>{copied ? "Copiado!" : "Link Assinatura"}</span>
      </button>

      {employeePhone && (
        <button
          type="button"
          disabled={loading}
          onClick={() => handleCopyOrSend(true)}
          className="inline-flex items-center justify-center gap-1.5 px-3 py-2 sm:py-1.5 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg transition-colors shadow-xs min-h-[38px] cursor-pointer"
          title="Enviar link no WhatsApp"
        >
          <MessageCircle className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">WhatsApp</span>
        </button>
      )}
    </div>
  );
}

export function DeleteEmployeeContractButton({
  contractId,
}: {
  contractId: string;
}) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleDelete = async () => {
    if (!confirm("Tem certeza que deseja excluir este contrato?")) return;
    setLoading(true);
    try {
      await deleteEmployeeContract(contractId);
      router.refresh();
    } catch (err) {
      console.error(err);
      alert("Erro ao excluir contrato.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      type="button"
      disabled={loading}
      onClick={handleDelete}
      className="inline-flex items-center justify-center gap-1.5 px-3 py-2 sm:py-1.5 text-xs font-semibold text-red-600 bg-white border border-red-200 rounded-lg hover:bg-red-50 transition-colors shadow-xs min-h-[38px] w-full sm:w-auto cursor-pointer"
      title="Excluir Contrato"
    >
      <Trash2 className="w-3.5 h-3.5" />
      <span className="sm:hidden">Excluir</span>
    </button>
  );
}
