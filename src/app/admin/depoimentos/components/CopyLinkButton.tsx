"use client";

import { CheckCircle2, Link as LinkIcon } from "lucide-react";
import { useState } from "react";

export function CopyLinkButton() {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    const url = `${window.location.origin}/avaliar`;
    navigator.clipboard.writeText(url).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <button
      type="button"
      onClick={handleCopy}
      className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 text-slate-700 rounded-lg hover:bg-slate-50 shadow-sm font-medium transition-colors"
    >
      {copied ? (
        <CheckCircle2 className="w-4 h-4 text-emerald-500" />
      ) : (
        <LinkIcon className="w-4 h-4" />
      )}
      {copied ? "Link Copiado!" : "Link para Avaliar"}
    </button>
  );
}
