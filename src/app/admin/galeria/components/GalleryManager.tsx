"use client";

import { ImageIcon, Plus, Trash2 } from "lucide-react";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import {
  addImageToPublicGallery,
  deletePublicGalleryImage,
  uploadPublicGalleryImageAction,
} from "../actions";

export function GalleryManager({
  publicImages,
  clientImages,
}: {
  publicImages: any[];
  clientImages: any[];
}) {
  const [isUploading, setIsUploading] = useState(false);
  const [openUpload, setOpenUpload] = useState(false);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
  });

  const [file, setFile] = useState<File | null>(null);

  const handleFileUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) return;

    setIsUploading(true);
    try {
      const form = new FormData();
      form.append("file", file);
      form.append("title", formData.title || file.name);
      if (formData.description) {
        form.append("description", formData.description);
      }

      await uploadPublicGalleryImageAction(form);

      setOpenUpload(false);
      setFormData({ title: "", description: "" });
      setFile(null);
    } catch (error) {
      console.error(error);
      alert("Erro ao enviar imagem.");
    } finally {
      setIsUploading(false);
    }
  };

  const handleCopyFromClient = async (clientImage: any) => {
    setIsUploading(true);
    try {
      await addImageToPublicGallery({
        imageUrl: clientImage.fileUrl,
        title: clientImage.title,
        description: `Foto de ${clientImage.client.name}`,
      });
      alert("Foto enviada para o site!");
    } catch (error) {
      console.error(error);
      alert("Erro ao enviar foto para o site.");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <Tabs defaultValue="site" className="w-full">
      <TabsList className="mb-4">
        <TabsTrigger value="site">Fotos no Site</TabsTrigger>
        <TabsTrigger value="clientes">Fotos de Clientes</TabsTrigger>
      </TabsList>

      <TabsContent value="site" className="space-y-6">
        <div className="flex justify-between items-center bg-white p-4 rounded-lg shadow-sm border border-slate-100">
          <h3 className="font-semibold text-slate-700">
            Imagens Públicas ({publicImages.length})
          </h3>
          <Dialog open={openUpload} onOpenChange={setOpenUpload}>
            <DialogTrigger
              render={
                <Button className="bg-[#af4d30] hover:bg-[#8c3d26] text-white" />
              }
            >
              <Plus className="w-4 h-4 mr-2" />
              Nova Foto no Site
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Adicionar foto ao site</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleFileUpload} className="space-y-4 pt-4">
                <div className="space-y-2">
                  <Label>Título / Legenda Curta</Label>
                  <Input
                    value={formData.title}
                    onChange={(e) =>
                      setFormData({ ...formData, title: e.target.value })
                    }
                    placeholder="Ex: Consultoria em casa"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Descrição (Opcional)</Label>
                  <Textarea
                    value={formData.description}
                    onChange={(e) =>
                      setFormData({ ...formData, description: e.target.value })
                    }
                    placeholder="Ex: Um momento especial com a família..."
                  />
                </div>
                <div className="space-y-2 pt-2">
                  <Label>Selecione a Imagem</Label>
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
                    disabled={isUploading || !file}
                    className="bg-[#af4d30] hover:bg-[#8c3d26] text-white"
                  >
                    {isUploading ? "Enviando..." : "Salvar Foto"}
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {publicImages.map((img) => (
            <div
              key={img.id}
              className="group relative rounded-xl overflow-hidden bg-slate-100 border border-slate-200 aspect-square"
            >
              <Image
                src={img.imageUrl}
                alt={img.title}
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-3">
                <p className="text-white font-medium text-sm truncate">
                  {img.title}
                </p>
                <div className="mt-2 flex justify-end">
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => {
                      if (confirm("Remover esta foto do site?")) {
                        deletePublicGalleryImage(img.id);
                      }
                    }}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
          {publicImages.length === 0 && (
            <div className="col-span-full py-12 text-center text-slate-500 bg-white rounded-xl border border-dashed border-slate-300">
              <ImageIcon className="w-8 h-8 mx-auto mb-2 opacity-50" />
              Nenhuma imagem na galeria pública.
            </div>
          )}
        </div>
      </TabsContent>

      <TabsContent value="clientes" className="space-y-6">
        <div className="bg-white p-4 rounded-lg shadow-sm border border-slate-100 mb-4">
          <p className="text-slate-500 text-sm">
            Estas são todas as fotos enviadas nos perfis dos clientes. Você pode
            copiar qualquer uma delas para aparecer na galeria pública do site.
          </p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {clientImages.map((img) => (
            <div
              key={img.id}
              className="group relative rounded-xl overflow-hidden bg-slate-100 border border-slate-200 aspect-square"
            >
              <Image
                src={img.fileUrl}
                alt={img.title}
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-between p-3">
                <div>
                  <p className="text-white font-medium text-sm truncate">
                    {img.title}
                  </p>
                  <p className="text-white/70 text-xs truncate">
                    De: {img.client?.name}
                  </p>
                </div>
                <Button
                  size="sm"
                  className="w-full bg-[#af4d30] text-white hover:bg-[#8c3d26]"
                  onClick={() => handleCopyFromClient(img)}
                  disabled={isUploading}
                >
                  Ir para o Site
                </Button>
              </div>
            </div>
          ))}
          {clientImages.length === 0 && (
            <div className="col-span-full py-12 text-center text-slate-500 bg-white rounded-xl border border-dashed border-slate-300">
              Nenhuma foto de cliente encontrada.
            </div>
          )}
        </div>
      </TabsContent>
    </Tabs>
  );
}
