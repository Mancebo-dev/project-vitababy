"use client";

import { Upload } from "lucide-react";
import { useState } from "react";
import { uploadClientFileAction } from "@/app/admin/clientes/actions";
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

export function ClientUploadForm({ clientId }: { clientId: string }) {
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
      formData.append("uploadedBy", "CLIENT");

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

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        render={
          <Button className="bg-[#af4d30] hover:bg-[#af4d30]/90 text-white rounded-xl shadow-sm px-6 h-11" />
        }
      >
        <Upload className="w-4 h-4 mr-2" />
        Enviar Arquivo
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
  );
}
