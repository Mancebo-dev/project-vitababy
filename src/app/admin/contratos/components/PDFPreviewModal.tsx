"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export function PDFPreviewModal({
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
        className="text-sm font-medium text-slate-500 hover:text-slate-800"
      >
        Visualizar PDF
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
                src={`/contrato/${contractId}`}
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
