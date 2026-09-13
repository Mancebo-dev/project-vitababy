"use client";

import type { ConsultationNote, Professional } from "@prisma/client";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Download, FileText, Plus, Stethoscope } from "lucide-react";
import { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { createConsultationNote } from "../actions";

export function ClientNotesTab({
  clientId,
  notes,
  professionals,
}: {
  clientId: string;
  notes: (ConsultationNote & { professional?: Professional | null })[];
  professionals: Professional[];
}) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [sombraNotes, setSombraNotes] = useState("");
  const [professionalId, setProfessionalId] = useState("");
  const [requiresSombra, setRequiresSombra] = useState(false);

  const [isGenerating, setIsGenerating] = useState(false);
  const printRef = useRef<HTMLDivElement>(null);

  const handleDownloadPDF = async () => {
    if (typeof window === "undefined" || !printRef.current) return;
    setIsGenerating(true);
    try {
      const html2pdf = (await import("html2pdf.js")).default;
      const element = printRef.current;
      const opt = {
        margin: [10, 10, 10, 10] as [number, number, number, number],
        filename: `prontuario-${clientId}.pdf`,
        image: { type: "jpeg" as const, quality: 0.98 },
        html2canvas: { scale: 2, useCORS: true },
        jsPDF: { unit: "mm", format: "a4", orientation: "portrait" as const },
      };
      await html2pdf().set(opt).from(element).save();
    } catch (error) {
      console.error("Erro ao gerar PDF:", error);
      alert("Ocorreu um erro ao gerar o PDF.");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !content || !professionalId) {
      alert("Preencha título, conteúdo e selecione a assessora.");
      return;
    }
    if (requiresSombra && !sombraNotes) {
      alert("As observações da sombra são obrigatórias.");
      return;
    }

    setLoading(true);
    try {
      await createConsultationNote({
        clientId,
        title,
        content,
        sombraNotes: requiresSombra ? sombraNotes : undefined,
        professionalId,
      });
      setOpen(false);
      setTitle("");
      setContent("");
      setSombraNotes("");
      setRequiresSombra(false);
    } catch (error) {
      console.error(error);
      alert("Erro ao salvar prontuário.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
          <Stethoscope className="w-5 h-5 text-slate-400" />
          Prontuário Clínico / Evolução
        </h3>

        <Button
          variant="outline"
          onClick={handleDownloadPDF}
          disabled={isGenerating || notes.length === 0}
          className="rounded-full h-9 px-4 shadow-sm"
        >
          <Download className="w-4 h-4 mr-2" />
          {isGenerating ? "Gerando PDF..." : "Exportar PDF"}
        </Button>

        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger
            render={
              <Button className="bg-[#af4d30] hover:bg-[#af4d30]/90 text-white rounded-full h-9 px-4 shadow-sm" />
            }
          >
            <Plus className="w-4 h-4 mr-2" />
            Nova Anotação
          </DialogTrigger>
          <DialogContent className="max-w-xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Adicionar Nota ao Prontuário</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4 pt-4">
              <div className="space-y-2">
                <Label>Título / Motivo *</Label>
                <Input
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Ex: Consulta Inicial de Sono"
                />
              </div>

              <div className="space-y-2">
                <Label>Assessora Responsável *</Label>
                <select
                  required
                  className="flex h-10 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm"
                  value={professionalId}
                  onChange={(e) => setProfessionalId(e.target.value)}
                >
                  <option value="">Selecione...</option>
                  {professionals.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <Label>Evolução / Relato *</Label>
                <Textarea
                  required
                  rows={5}
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Descreva a evolução do cliente, queixas, observações..."
                />
              </div>

              <div className="flex items-center gap-2 py-2">
                <input
                  type="checkbox"
                  id="requiresSombra"
                  checked={requiresSombra}
                  onChange={(e) => setRequiresSombra(e.target.checked)}
                  className="rounded border-slate-300 text-[#ae4d30] focus:ring-[#ae4d30]"
                />
                <Label htmlFor="requiresSombra" className="cursor-pointer">
                  Incluir Observação de Sombra (Baby Movie / Escolar)
                </Label>
              </div>

              {requiresSombra && (
                <div className="space-y-2 bg-orange-50 p-3 rounded-lg border border-orange-100">
                  <Label className="text-orange-900">
                    Comentário da Sombra (Obrigatório) *
                  </Label>
                  <Textarea
                    required={requiresSombra}
                    rows={3}
                    value={sombraNotes}
                    onChange={(e) => setSombraNotes(e.target.value)}
                    placeholder="Descreva o acompanhamento da sombra..."
                    className="border-orange-200"
                  />
                </div>
              )}

              <div className="pt-4 flex justify-end gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setOpen(false)}
                >
                  Cancelar
                </Button>
                <Button
                  type="submit"
                  disabled={loading}
                  className="bg-[#ae4d30] text-white hover:bg-[#ae4d30]/90"
                >
                  {loading ? "Salvando..." : "Salvar Prontuário"}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="space-y-4">
        {notes.length === 0 ? (
          <div className="p-8 text-center text-slate-500 bg-white rounded-xl shadow-sm border border-slate-200">
            <FileText className="w-12 h-12 mx-auto text-slate-300 mb-4" />
            <p className="text-lg font-medium">Nenhum registro encontrado.</p>
            <p className="text-sm mt-1">
              As notas de evolução e consultas aparecerão aqui.
            </p>
          </div>
        ) : (
          notes.map((note) => (
            <div
              key={note.id}
              className="bg-white p-5 rounded-xl shadow-sm border border-slate-200 space-y-3"
            >
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="font-bold text-slate-900">{note.title}</h4>
                  <p className="text-xs text-slate-500 flex items-center gap-2 mt-1">
                    <span>
                      {format(new Date(note.date), "dd/MM/yyyy 'às' HH:mm", {
                        locale: ptBR,
                      })}
                    </span>
                    <span>•</span>
                    <span className="font-medium text-primary">
                      {note.professional?.name}
                    </span>
                  </p>
                </div>
              </div>
              <div className="text-sm text-slate-700 whitespace-pre-wrap bg-slate-50 p-4 rounded-lg">
                {note.content}
              </div>
              {note.sombraNotes && (
                <div className="mt-3 bg-orange-50/50 p-3 rounded-lg border border-orange-100 text-sm">
                  <p className="font-semibold text-orange-900 mb-1">
                    Observações (Sombra)
                  </p>
                  <p className="text-slate-700 whitespace-pre-wrap">
                    {note.sombraNotes}
                  </p>
                </div>
              )}
            </div>
          ))
        )}
      </div>

      {/* Hidden printable area for PDF */}
      <div className="hidden">
        <div
          ref={printRef}
          className="p-8 w-[210mm] bg-white text-black font-sans print:block"
        >
          <div className="mb-8 border-b-2 border-[#af4d30] pb-4">
            <h1 className="text-2xl font-bold text-[#af4d30]">
              Vita Baby Assessoria
            </h1>
            <h2 className="text-xl font-semibold mt-2">
              Prontuário Clínico de Evolução
            </h2>
            <p className="text-sm text-gray-500 mt-1">
              Exportado em:{" "}
              {format(new Date(), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}
            </p>
          </div>

          <div className="space-y-6">
            {notes.map((note) => (
              <div
                key={note.id}
                className="border border-gray-200 rounded-lg p-4 break-inside-avoid"
              >
                <div className="border-b border-gray-100 pb-2 mb-2">
                  <h4 className="font-bold text-lg">{note.title}</h4>
                  <p className="text-sm text-gray-500">
                    Data:{" "}
                    {format(new Date(note.date), "dd/MM/yyyy 'às' HH:mm", {
                      locale: ptBR,
                    })}{" "}
                    <br />
                    Profissional: {note.professional?.name}
                  </p>
                </div>
                <div className="text-sm text-gray-800 whitespace-pre-wrap">
                  {note.content}
                </div>
                {note.sombraNotes && (
                  <div className="mt-4 bg-gray-50 p-3 rounded-lg text-sm border border-gray-200">
                    <p className="font-semibold text-gray-700 mb-1">
                      Observações (Sombra)
                    </p>
                    <p className="text-gray-600 whitespace-pre-wrap">
                      {note.sombraNotes}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
