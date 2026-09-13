"use client";

export function CopyLinkButton({ contractId }: { contractId: string }) {
  const handleCopy = () => {
    const url = `${window.location.origin}/contrato/${contractId}`;
    navigator.clipboard.writeText(url);
    alert("Link de assinatura copiado! Envie para o WhatsApp da cliente.");
  };

  return (
    <button
      type="button"
      onClick={handleCopy}
      className="text-sm font-medium text-slate-600 bg-white border border-slate-200 px-3 py-1.5 rounded-lg hover:bg-slate-50 transition-colors"
    >
      Copiar Link
    </button>
  );
}
