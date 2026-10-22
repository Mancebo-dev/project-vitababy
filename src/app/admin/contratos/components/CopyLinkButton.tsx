"use client";

import { Check, Copy, Loader2, MessageCircle } from "lucide-react";
import { useState } from "react";
import { buildWhatsAppLink } from "@/utils/whatsapp";
import { generateSignLink } from "../actions";

export function CopyLinkButton({
  contractId,
  isSigned,
  clientPhone,
  clientName,
}: {
  contractId: string;
  isSigned?: boolean;
  clientPhone?: string | null;
  clientName?: string | null;
}) {
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    if (isSigned) {
      alert("Este contrato já foi assinado digitalmente pelo cliente.");
      return;
    }

    setLoading(true);
    try {
      const res = await generateSignLink(contractId);
      if (res?.token) {
        const url = `${window.location.origin}/assinar/${res.token}`;
        await navigator.clipboard.writeText(url);
        setCopied(true);
        setTimeout(() => setCopied(false), 3500);

        alert(
          "Link temporário de assinatura copiado com sucesso!\n\n" +
            "• Válido por 12 horas;\n" +
            "• Não exige login do cliente;\n" +
            "• Será desativado automaticamente após a assinatura.",
        );
      }
    } catch (err) {
      console.error("Erro ao gerar link de assinatura:", err);
      alert(
        err instanceof Error
          ? err.message
          : "Erro ao gerar link temporário de assinatura.",
      );
    } finally {
      setLoading(false);
    }
  };

  const handleSendWhatsApp = async () => {
    if (isSigned) {
      alert("Este contrato já foi assinado digitalmente pelo cliente.");
      return;
    }

    setLoading(true);
    try {
      const res = await generateSignLink(contractId);
      if (res?.token) {
        const url = `${window.location.origin}/assinar/${res.token}`;
        const message = `Olá, ${clientName || "Cliente"}! Segue o link exclusivo para assinatura digital do seu contrato com a Vita Baby Assessoria:\n\n${url}\n\n*Atenção:* Por segurança, este link é temporário e válido por 12 horas (não exige login).`;
        const waLink = buildWhatsAppLink(clientPhone, message);
        window.open(waLink, "_blank");
      }
    } catch (err) {
      console.error("Erro ao gerar link:", err);
      alert(err instanceof Error ? err.message : "Erro ao gerar link.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="inline-flex flex-wrap items-center gap-1.5">
      {clientPhone && !isSigned && (
        <button
          type="button"
          onClick={handleSendWhatsApp}
          disabled={loading}
          title="Gera o link de 12h e abre diretamente no WhatsApp do cliente"
          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg transition-colors shadow-xs disabled:opacity-50"
        >
          <MessageCircle className="w-3.5 h-3.5" />
          WhatsApp (12h)
        </button>
      )}

      <button
        type="button"
        onClick={handleCopy}
        disabled={loading}
        title="Gera um link temporário (12h) para o cliente assinar sem login"
        className={`inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg border transition-all ${
          copied
            ? "bg-emerald-50 text-emerald-700 border-emerald-300"
            : "bg-white text-slate-700 border-slate-300 hover:bg-slate-50 hover:text-slate-900 shadow-xs"
        } disabled:opacity-50`}
      >
        {loading ? (
          <>
            <Loader2 className="w-3.5 h-3.5 animate-spin text-slate-500" />
            <span>Gerando...</span>
          </>
        ) : copied ? (
          <>
            <Check className="w-3.5 h-3.5 text-emerald-600" />
            <span>Link 12h Copiado!</span>
          </>
        ) : (
          <>
            <Copy className="w-3.5 h-3.5 text-slate-500" />
            <span>Copiar Link (12h)</span>
          </>
        )}
      </button>
    </div>
  );
}
