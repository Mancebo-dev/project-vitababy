"use client";

import type { Professional } from "@prisma/client";
import { Check, Loader2, Plus, Upload, X } from "lucide-react";
import Image from "next/image";
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
import {
  createProfessional,
  updateProfessional,
  uploadProfessionalAvatarAction,
} from "../actions";

const PRESET_SPECIALTIES = [
  "Amamentação",
  "Banho Humanizado",
  "Primeiros Socorros",
  "Pós-Parto",
  "Laserterapia Mamária",
  "Furinho Humanizado",
  "Sono do Bebê",
];

const COLOR_PALETTE = [
  "#ae4d30",
  "#b95d43",
  "#c66e56",
  "#d47f6a",
  "#e1917d",
  "#ef4444",
  "#f97316",
  "#f59e0b",
  "#eab308",
  "#84cc16",
  "#22c55e",
  "#10b981",
  "#14b8a6",
  "#06b6d4",
  "#0ea5e9",
  "#3b82f6",
  "#6366f1",
  "#8b5cf6",
  "#a855f7",
  "#d946ef",
];

export function ProfessionalModal({
  prof,
  trigger,
}: {
  prof?: Professional;
  trigger: React.ReactElement;
}) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState({
    name: prof?.name || "",
    email: prof?.email || "",
    phone: prof?.phone || "",
    specialty: prof?.specialty || "",
    specialties: prof?.specialties
      ? prof.specialties
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean)
      : [],
    crnOrCoren: prof?.crnOrCoren || "",
    experience: prof?.experience || "",
    bio: prof?.bio || "",
    avatarUrl: prof?.avatarUrl || "",
    pixKey: prof?.pixKey || "",
    city: prof?.city || "",
    color: prof?.color || "#ae4d30",
    active: prof ? prof.active : true,
  });

  const [customSpecialtyInput, setCustomSpecialtyInput] = useState("");

  const handleAvatarFileChange = async (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingAvatar(true);
    try {
      const data = new FormData();
      data.append("avatar", file);
      const res = await uploadProfessionalAvatarAction(data);
      if (res.success && res.url) {
        setFormData((prev) => ({ ...prev, avatarUrl: res.url || "" }));
      } else {
        alert(res.error || "Erro ao fazer upload da imagem.");
      }
    } catch {
      alert("Erro ao processar imagem.");
    } finally {
      setUploadingAvatar(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const toggleSpecialty = (item: string) => {
    setFormData((prev) => {
      const exists = prev.specialties.includes(item);
      const updated = exists
        ? prev.specialties.filter((s) => s !== item)
        : [...prev.specialties, item];
      return { ...prev, specialties: updated };
    });
  };

  const addCustomSpecialty = () => {
    const trimmed = customSpecialtyInput.trim();
    if (!trimmed) return;
    if (!formData.specialties.includes(trimmed)) {
      setFormData((prev) => ({
        ...prev,
        specialties: [...prev.specialties, trimmed],
      }));
    }
    setCustomSpecialtyInput("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const payload = {
        name: formData.name,
        email: formData.email || null,
        phone: formData.phone || null,
        specialty: formData.specialty || null,
        specialties: formData.specialties.join(", ") || null,
        crnOrCoren: formData.crnOrCoren || null,
        experience: formData.experience || null,
        bio: formData.bio || null,
        avatarUrl: formData.avatarUrl || null,
        pixKey: formData.pixKey || null,
        city: formData.city || null,
        color: formData.color,
        active: formData.active,
      };

      if (prof?.id) {
        await updateProfessional(prof.id, payload);
      } else {
        await createProfessional(payload);
      }
      setOpen(false);
    } catch {
      alert("Erro ao salvar dados da assessora.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={trigger} />
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-slate-900">
            {prof ? "Editar Assessora" : "Nova Assessora"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6 pt-2">
          {/* Seção de Foto / Avatar */}
          <div className="flex items-center gap-5 p-4 bg-slate-50 border border-slate-200 rounded-xl">
            <div className="relative w-20 h-20 rounded-full overflow-hidden border-2 border-white shadow bg-slate-200 flex-shrink-0 flex items-center justify-center">
              {formData.avatarUrl ? (
                <Image
                  src={formData.avatarUrl}
                  alt={formData.name || "Assessora"}
                  fill
                  className="object-cover"
                />
              ) : (
                <span
                  className="text-2xl font-bold text-white uppercase"
                  style={{ backgroundColor: formData.color }}
                >
                  {formData.name.charAt(0) || "A"}
                </span>
              )}
              {uploadingAvatar && (
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center text-white">
                  <Loader2 className="w-6 h-6 animate-spin" />
                </div>
              )}
            </div>

            <div className="flex flex-col gap-2">
              <span className="text-sm font-semibold text-slate-800">
                Foto de Perfil
              </span>
              <p className="text-xs text-slate-500">
                Formatos recomendados: JPG, PNG ou WEBP até 5MB.
              </p>
              <div className="flex items-center gap-2">
                <input
                  type="file"
                  ref={fileInputRef}
                  accept="image/*"
                  onChange={handleAvatarFileChange}
                  className="hidden"
                  id="avatar-upload"
                />
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="gap-1.5 text-xs text-slate-700 bg-white"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={uploadingAvatar}
                >
                  <Upload className="w-3.5 h-3.5" />
                  Enviar Foto
                </Button>
                {formData.avatarUrl && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="text-xs text-red-600 hover:text-red-700 hover:bg-red-50"
                    onClick={() =>
                      setFormData((prev) => ({ ...prev, avatarUrl: "" }))
                    }
                  >
                    Remover
                  </Button>
                )}
              </div>
            </div>
          </div>

          {/* Dados Pessoais e Contato */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5 sm:col-span-2">
              <Label htmlFor="prof-name">Nome Completo *</Label>
              <Input
                id="prof-name"
                required
                placeholder="Ex: Rayane Castro"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="prof-email">E-mail Profissional</Label>
              <Input
                id="prof-email"
                type="email"
                placeholder="assessora@vitababy.com.br"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="prof-phone">Telefone / WhatsApp</Label>
              <Input
                id="prof-phone"
                placeholder="(61) 98888-7777"
                value={formData.phone}
                onChange={(e) =>
                  setFormData({ ...formData, phone: e.target.value })
                }
              />
            </div>
          </div>

          {/* Dados Técnicos e Registro */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="prof-specialty">Cargo / Função Principal</Label>
              <Input
                id="prof-specialty"
                placeholder="Ex: Enfermeira Obstetra"
                value={formData.specialty}
                onChange={(e) =>
                  setFormData({ ...formData, specialty: e.target.value })
                }
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="prof-coren">Registro (COREN / CRN)</Label>
              <Input
                id="prof-coren"
                placeholder="COREN-DF 492.831"
                value={formData.crnOrCoren}
                onChange={(e) =>
                  setFormData({ ...formData, crnOrCoren: e.target.value })
                }
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="prof-exp">Tempo de Experiência</Label>
              <Input
                id="prof-exp"
                placeholder="Ex: 9+ anos de experiência"
                value={formData.experience}
                onChange={(e) =>
                  setFormData({ ...formData, experience: e.target.value })
                }
              />
            </div>
          </div>

          {/* Especialidades com Tags */}
          <div className="space-y-2.5">
            <Label>Especialidades Atendidas</Label>
            <div className="flex flex-wrap gap-1.5">
              {PRESET_SPECIALTIES.map((spec) => {
                const isSelected = formData.specialties.includes(spec);
                return (
                  <button
                    key={spec}
                    type="button"
                    onClick={() => toggleSpecialty(spec)}
                    className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium border transition-colors ${
                      isSelected
                        ? "bg-primary text-white border-primary shadow-xs"
                        : "bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100"
                    }`}
                  >
                    {isSelected && <Check className="w-3 h-3" />}
                    {spec}
                  </button>
                );
              })}
            </div>

            {/* Custom tags */}
            {formData.specialties.filter((s) => !PRESET_SPECIALTIES.includes(s))
              .length > 0 && (
              <div className="flex flex-wrap gap-1.5 pt-1">
                {formData.specialties
                  .filter((s) => !PRESET_SPECIALTIES.includes(s))
                  .map((custom) => (
                    <span
                      key={custom}
                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary border border-primary/20"
                    >
                      {custom}
                      <button
                        type="button"
                        onClick={() => toggleSpecialty(custom)}
                        className="hover:text-red-600 ml-0.5"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
              </div>
            )}

            <div className="flex gap-2 pt-1">
              <Input
                placeholder="Outra especialidade..."
                value={customSpecialtyInput}
                onChange={(e) => setCustomSpecialtyInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    addCustomSpecialty();
                  }
                }}
                className="h-8 text-xs"
              />
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={addCustomSpecialty}
                className="h-8 px-2.5 text-xs text-slate-700"
              >
                <Plus className="w-3.5 h-3.5 mr-1" />
                Adicionar
              </Button>
            </div>
          </div>

          {/* Mini-Bio */}
          <div className="space-y-1.5">
            <Label htmlFor="prof-bio">Mini-Bio / Apresentação</Label>
            <textarea
              id="prof-bio"
              rows={3}
              className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              placeholder="Apresentação profissional, formação e abordagem de cuidado..."
              value={formData.bio}
              onChange={(e) =>
                setFormData({ ...formData, bio: e.target.value })
              }
            />
          </div>

          {/* Chave PIX e Cidade */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="prof-pix">Chave PIX (para repasses)</Label>
              <Input
                id="prof-pix"
                placeholder="CPF, CNPJ, e-mail ou telefone"
                value={formData.pixKey}
                onChange={(e) =>
                  setFormData({ ...formData, pixKey: e.target.value })
                }
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="prof-city">Região / Cidade de Atendimento</Label>
              <Input
                id="prof-city"
                placeholder="Ex: Brasília - DF e Entorno"
                value={formData.city}
                onChange={(e) =>
                  setFormData({ ...formData, city: e.target.value })
                }
              />
            </div>
          </div>

          {/* Cor na Agenda */}
          <div className="space-y-2">
            <Label>Cor de Identificação na Agenda</Label>
            <div className="grid grid-cols-10 gap-1.5 p-2 bg-slate-50 border border-slate-200 rounded-lg">
              {COLOR_PALETTE.map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setFormData({ ...formData, color: c })}
                  className={`w-6 h-6 rounded-full border-2 transition-all mx-auto ${
                    formData.color === c
                      ? "border-slate-900 scale-125 shadow-sm"
                      : "border-transparent hover:scale-110"
                  }`}
                  style={{ backgroundColor: c }}
                  title={c}
                />
              ))}
            </div>
          </div>

          {/* Status Ativo */}
          {prof && (
            <div className="flex items-center gap-2 pt-1">
              <input
                type="checkbox"
                id="prof-active"
                checked={formData.active}
                onChange={(e) =>
                  setFormData({ ...formData, active: e.target.checked })
                }
                className="w-4 h-4 rounded border-slate-300 text-primary focus:ring-primary"
              />
              <Label
                htmlFor="prof-active"
                className="cursor-pointer text-sm font-medium"
              >
                Assessora ativa para novos atendimentos
              </Label>
            </div>
          )}

          <div className="pt-4 border-t border-slate-100 flex justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              className="bg-primary text-white hover:bg-primary/90 min-w-[100px]"
              disabled={loading || uploadingAvatar}
            >
              {loading ? "Salvando..." : "Salvar"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
