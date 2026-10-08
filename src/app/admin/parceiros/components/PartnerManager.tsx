"use client";

import { Plus, Trash2 } from "lucide-react";
import Image from "next/image";
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
import { deletePartner, uploadPartnerAction } from "../actions";

export function PartnerManager({ partners }: { partners: any[] }) {
  const [isUploading, setIsUploading] = useState(false);
  const [openUpload, setOpenUpload] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    link: "",
  });

  const [file, setFile] = useState<File | null>(null);

  const handleFileUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file || !formData.name) return;

    setIsUploading(true);
    try {
      const form = new FormData();
      form.append("file", file);
      form.append("name", formData.name);
      if (formData.link) {
        form.append("link", formData.link);
      }

      await uploadPartnerAction(form);

      setOpenUpload(false);
      setFormData({ name: "", link: "" });
      setFile(null);
    } catch (error) {
      console.error(error);
      alert("Erro ao enviar imagem do parceiro.");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center bg-white p-4 rounded-lg shadow-sm border border-slate-100">
        <h3 className="font-semibold text-slate-700">
          Parceiros Cadastrados ({partners.length})
        </h3>
        <Dialog open={openUpload} onOpenChange={setOpenUpload}>
          <DialogTrigger
            render={
              <Button className="bg-[#af4d30] hover:bg-[#8c3d26] text-white" />
            }
          >
            <Plus className="w-4 h-4 mr-2" />
            Novo Parceiro
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Adicionar Parceiro</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleFileUpload} className="space-y-4 pt-4">
              <div className="space-y-2">
                <Label>Nome da Empresa / Parceiro</Label>
                <Input
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  placeholder="Ex: Clínica Pediátrica"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label>Link do Site / Instagram (Opcional)</Label>
                <Input
                  value={formData.link}
                  onChange={(e) =>
                    setFormData({ ...formData, link: e.target.value })
                  }
                  placeholder="Ex: https://instagram.com/..."
                />
              </div>
              <div className="space-y-2 pt-2">
                <Label>Logomarca (Imagem)</Label>
                <Input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setFile(e.target.files?.[0] || null)}
                  disabled={isUploading}
                  required
                />
              </div>
              <div className="pt-4 flex justify-end">
                <Button
                  type="submit"
                  disabled={isUploading || !file || !formData.name}
                  className="bg-[#af4d30] hover:bg-[#8c3d26] text-white"
                >
                  {isUploading ? "Enviando..." : "Salvar Parceiro"}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {partners.map((partner) => (
          <div
            key={partner.id}
            className="group relative rounded-xl overflow-hidden bg-white border border-slate-200 aspect-video flex items-center justify-center p-4 shadow-sm hover:shadow-md transition-shadow"
          >
            <Image
              src={partner.logoUrl}
              alt={partner.name}
              fill
              className="object-contain p-4"
            />
            <div className="absolute inset-0 bg-black/70 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-between p-3">
              <div>
                <p className="text-white font-medium text-sm truncate text-center mt-2">
                  {partner.name}
                </p>
              </div>
              <div className="flex justify-center mb-2">
                <Button
                  size="sm"
                  variant="destructive"
                  onClick={() => {
                    if (confirm("Remover este parceiro do site?")) {
                      deletePartner(partner.id);
                    }
                  }}
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Remover
                </Button>
              </div>
            </div>
          </div>
        ))}
        {partners.length === 0 && (
          <div className="col-span-full py-12 text-center text-slate-500 bg-white rounded-xl border border-dashed border-slate-300">
            Nenhum parceiro cadastrado.
          </div>
        )}
      </div>
    </div>
  );
}
