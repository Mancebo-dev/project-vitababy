"use client";

import type { Partner } from "@prisma/client";
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

export function PartnerManager({ partners }: { partners: Partner[] }) {
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
              <Button className="bg-[#af4d30] hover:bg-[#8c3d26] text-white flex items-center" />
            }
          >
            <Plus className="w-4 h-4 sm:mr-2" />
            <span className="hidden sm:inline">Novo Parceiro</span>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Adicionar Parceiro / Banner</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleFileUpload} className="space-y-4 pt-4">
              <div className="space-y-2">
                <Label>Nome do Parceiro ou Tema</Label>
                <Input
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  placeholder="Ex: Clínica Pediátrica Macaé"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label>Link do Instagram / Publicação (Opcional)</Label>
                <Input
                  value={formData.link}
                  onChange={(e) =>
                    setFormData({ ...formData, link: e.target.value })
                  }
                  placeholder="Ex: https://www.instagram.com/p/..."
                />
              </div>
              <div className="space-y-2 pt-2">
                <Label>
                  Banner / Cartaz da Publicação (Imagem vertical ou quadrada)
                </Label>
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
                  {isUploading ? "Enviando..." : "Salvar Publicação"}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {partners.map((partner) => (
          <div
            key={partner.id}
            className="group relative rounded-xl overflow-hidden bg-white border border-slate-200 aspect-[4/5] flex items-center justify-center shadow-sm hover:shadow-md transition-shadow"
          >
            <Image
              src={partner.logoUrl}
              alt={partner.name}
              fill
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-between p-3">
              <div>
                <p className="text-white font-medium text-xs truncate text-center mt-1 bg-black/40 py-1 px-2 rounded-full">
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
