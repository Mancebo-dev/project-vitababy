"use client";

import type { ClientFile } from "@prisma/client";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import {
  Download,
  File as FileIcon,
  FileText,
  Image as ImageIcon,
  Plus,
  Upload,
} from "lucide-react";
import { useState } from "react";
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
import { uploadClientFileAction } from "../actions";

export function ClientFilesTab({
  clientId,
  files,
}: {
  clientId: string;
  files: ClientFile[];
}) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [file, setFile] = useState<File | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !file) {
      alert("Preencha o título e selecione um arquivo.");
      return;
    }

    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("clientId", clientId);
      formData.append("title", title);
      formData.append("description", description);
      formData.append("uploadedBy", "PROFESSIONAL");

      await uploadClientFileAction(formData);

      setOpen(false);
      setTitle("");
      setDescription("");
      setFile(null);
    } catch (error) {
      console.error(error);
      alert("Erro ao enviar arquivo.");
    } finally {
      setLoading(false);
    }
  };

  const getIcon = (type: string) => {
    if (type.includes("pdf"))
      return <FileText className="w-8 h-8 text-red-500" />;
    if (type.includes("image"))
      return <ImageIcon className="w-8 h-8 text-blue-500" />;
    return <FileIcon className="w-8 h-8 text-slate-500" />;
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
          <Upload className="w-5 h-5 text-slate-400" />
          Exames e Arquivos
        </h3>

        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger
            render={
              <Button className="bg-[#af4d30] hover:bg-[#af4d30]/90 text-white rounded-full h-9 px-4 shadow-sm" />
            }
          >
            <Plus className="w-4 h-4 mr-2" />
            Novo Arquivo
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Enviar Arquivo/Exame</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4 pt-4">
              <div className="space-y-2">
                <Label>Título do Documento *</Label>
                <Input
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Ex: Exame de Sangue - Bebê"
                />
              </div>

              <div className="space-y-2">
                <Label>Descrição (Opcional)</Label>
                <Textarea
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Observações sobre o exame..."
                />
              </div>

              <div className="space-y-2">
                <Label>Arquivo *</Label>
                <Input
                  type="file"
                  required
                  onChange={(e) => setFile(e.target.files?.[0] || null)}
                  className="cursor-pointer"
                />
              </div>

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
                  {loading ? "Enviando..." : "Salvar Arquivo"}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="space-y-4">
        {files.length === 0 ? (
          <div className="p-8 text-center text-slate-500 bg-white rounded-xl shadow-sm border border-slate-200">
            <Upload className="w-12 h-12 mx-auto text-slate-300 mb-4" />
            <p className="text-lg font-medium">Nenhum arquivo encontrado.</p>
            <p className="text-sm mt-1">
              Faça upload de exames e documentos da cliente.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {files.map((file) => (
              <div
                key={file.id}
                className="bg-white p-4 rounded-xl shadow-sm border border-slate-200 flex items-start gap-4"
              >
                <div className="bg-slate-50 p-3 rounded-lg border border-slate-100 shrink-0">
                  {getIcon(file.fileType)}
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-bold text-slate-900 truncate">
                    {file.title}
                  </h4>
                  <p className="text-xs text-slate-500 flex items-center gap-2 mt-1">
                    <span>
                      {format(
                        new Date(file.createdAt),
                        "dd/MM/yyyy 'às' HH:mm",
                        {
                          locale: ptBR,
                        },
                      )}
                    </span>
                    <span>•</span>
                    <span className="font-medium text-primary uppercase text-[10px]">
                      {file.uploadedBy === "CLIENT" ? "CLIENTE" : "VITABABY"}
                    </span>
                  </p>
                  {file.description && (
                    <p className="text-sm text-slate-700 mt-2 line-clamp-2">
                      {file.description}
                    </p>
                  )}
                  <div className="mt-3">
                    <a
                      href={file.fileUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-sm font-medium text-[#af4d30] hover:underline"
                    >
                      <Download className="w-4 h-4" />
                      Visualizar/Baixar
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
