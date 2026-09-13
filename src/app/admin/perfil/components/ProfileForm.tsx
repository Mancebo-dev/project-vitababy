"use client";

import type { Professional, User } from "@prisma/client";
import {
  Check,
  CheckCircle2,
  KeyRound,
  Loader2,
  Plus,
  Shield,
  Upload,
  User as UserIcon,
  X,
} from "lucide-react";
import Image from "next/image";
import { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  changeUserPasswordAction,
  updateAdminProfileAction,
  uploadProfileAvatarAction,
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

interface ProfileFormProps {
  user: User;
  professional?: Professional | null;
}

export function ProfileForm({ user, professional }: ProfileFormProps) {
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Form State
  const [avatarUrl, setAvatarUrl] = useState(
    user.image || professional?.avatarUrl || "",
  );
  const [name, setName] = useState(user.name || "");
  const [whatsapp, setWhatsapp] = useState(
    user.whatsapp || professional?.phone || "",
  );

  // Professional State
  const [specialty, setSpecialty] = useState(professional?.specialty || "");
  const [crnOrCoren, setCrnOrCoren] = useState(professional?.crnOrCoren || "");
  const [experience, setExperience] = useState(professional?.experience || "");
  const [bio, setBio] = useState(professional?.bio || "");
  const [pixKey, setPixKey] = useState(professional?.pixKey || "");
  const [city, setCity] = useState(professional?.city || "");
  const [color, setColor] = useState(professional?.color || "#ae4d30");
  const [specialties, setSpecialties] = useState<string[]>(
    professional?.specialties
      ? professional.specialties
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean)
      : [],
  );
  const [customSpecialty, setCustomSpecialty] = useState("");

  // Password State
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [passwordSuccess, setPasswordSuccess] = useState(false);
  const [passwordError, setPasswordError] = useState("");

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingAvatar(true);
    setErrorMessage("");
    try {
      const data = new FormData();
      data.append("avatar", file);
      const res = await uploadProfileAvatarAction(data);
      if (res.success && res.url) {
        setAvatarUrl(res.url);
        setSuccessMessage("Foto de perfil atualizada com sucesso!");
        setTimeout(() => setSuccessMessage(""), 4000);
      } else {
        setErrorMessage(res.error || "Erro no upload da foto.");
      }
    } catch {
      setErrorMessage("Erro inesperado ao processar a imagem.");
    } finally {
      setUploadingAvatar(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const toggleSpecialty = (item: string) => {
    setSpecialties((prev) =>
      prev.includes(item) ? prev.filter((s) => s !== item) : [...prev, item],
    );
  };

  const addCustomSpecialty = () => {
    const trimmed = customSpecialty.trim();
    if (trimmed && !specialties.includes(trimmed)) {
      setSpecialties((prev) => [...prev, trimmed]);
      setCustomSpecialty("");
    }
  };

  const handleSubmitProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setSuccessMessage("");
    setErrorMessage("");

    try {
      const res = await updateAdminProfileAction({
        name,
        whatsapp,
        specialty,
        specialties: specialties.join(", "),
        crnOrCoren,
        experience,
        bio,
        pixKey,
        city,
        color,
      });

      if (res.success) {
        setSuccessMessage("Dados do perfil salvos com sucesso!");
        setTimeout(() => setSuccessMessage(""), 4000);
      } else {
        setErrorMessage(res.error || "Não foi possível salvar os dados.");
      }
    } catch {
      setErrorMessage("Ocorreu um erro ao salvar as alterações.");
    } finally {
      setLoading(false);
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError("");
    setPasswordSuccess(false);

    if (newPassword.length < 8) {
      setPasswordError("A nova senha deve ter no mínimo 8 caracteres.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setPasswordError("A confirmação da nova senha não coincide.");
      return;
    }

    setPasswordLoading(true);
    try {
      const res = await changeUserPasswordAction(currentPassword, newPassword);
      if (res.success) {
        setPasswordSuccess(true);
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
        setTimeout(() => setPasswordSuccess(false), 5000);
      } else {
        setPasswordError(res.error || "Falha ao alterar senha.");
      }
    } catch {
      setPasswordError("Erro ao processar alteração de senha.");
    } finally {
      setPasswordLoading(false);
    }
  };

  return (
    <div className="space-y-8 max-w-4xl">
      {/* Mensagens de Feedback */}
      {successMessage && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl flex items-center gap-2 text-sm font-medium">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />
          <span>{successMessage}</span>
        </div>
      )}

      {errorMessage && (
        <div className="p-4 bg-red-50 border border-red-200 text-red-800 rounded-xl flex items-center gap-2 text-sm font-medium">
          <Shield className="w-5 h-5 text-red-600 flex-shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Cartão de Foto e Identidade */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs flex flex-col sm:flex-row items-center sm:items-start gap-6">
        <div className="relative w-24 h-24 rounded-full overflow-hidden border-4 border-white shadow-md bg-slate-100 flex-shrink-0 flex items-center justify-center">
          {avatarUrl ? (
            <Image
              src={avatarUrl}
              alt={name || "Perfil"}
              fill
              className="object-cover"
            />
          ) : (
            <div
              className="w-full h-full flex items-center justify-center font-bold text-white text-3xl uppercase"
              style={{ backgroundColor: color }}
            >
              {name ? name.charAt(0) : "A"}
            </div>
          )}

          {uploadingAvatar && (
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center text-white">
              <Loader2 className="w-6 h-6 animate-spin" />
            </div>
          )}
        </div>

        <div className="flex-1 text-center sm:text-left space-y-2">
          <div className="flex flex-col sm:flex-row sm:items-center gap-2">
            <h2 className="text-2xl font-bold text-slate-900">
              {name || "Usuário"}
            </h2>
            <span className="inline-flex self-center sm:self-auto px-2.5 py-0.5 rounded-full text-xs font-semibold uppercase tracking-wider bg-primary/10 text-primary">
              {user.role === "admin" ? "Administrador" : "Assessora Técnica"}
            </span>
          </div>
          <p className="text-sm text-slate-500">{user.email}</p>

          <div className="pt-2 flex flex-wrap justify-center sm:justify-start gap-2">
            <input
              type="file"
              ref={fileInputRef}
              accept="image/*"
              onChange={handleAvatarUpload}
              className="hidden"
            />
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="gap-2 text-xs text-slate-700 bg-white"
              onClick={() => fileInputRef.current?.click()}
              disabled={uploadingAvatar}
            >
              <Upload className="w-3.5 h-3.5" />
              Alterar Foto
            </Button>
            {avatarUrl && (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="text-xs text-red-600 hover:text-red-700 hover:bg-red-50"
                onClick={() => setAvatarUrl("")}
              >
                Remover Foto
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Formulário Principal: Dados Pessoais e Atuação */}
      <form onSubmit={handleSubmitProfile} className="space-y-6">
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-6">
          <div className="border-b border-slate-100 pb-4">
            <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <UserIcon className="w-5 h-5 text-primary" />
              Dados Pessoais e Contato
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              Informações básicas de identificação na plataforma.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5 sm:col-span-2">
              <Label htmlFor="input-name">Nome Completo *</Label>
              <Input
                id="input-name"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="input-email">E-mail de Acesso</Label>
              <Input
                id="input-email"
                type="email"
                value={user.email}
                disabled
                className="bg-slate-50 cursor-not-allowed"
              />
              <p className="text-[11px] text-slate-400">
                O e-mail é utilizado para login institucional.
              </p>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="input-phone">Telefone / WhatsApp</Label>
              <Input
                id="input-phone"
                placeholder="(61) 98888-7777"
                value={whatsapp}
                onChange={(e) => setWhatsapp(e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* Informações Profissionais e Especialidades */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-6">
          <div className="border-b border-slate-100 pb-4">
            <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <Shield className="w-5 h-5 text-primary" />
              Atuação Profissional e Especialidades
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              Especialidades clínicas, registro do conselho e preferências de
              atendimento.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="input-specialty">Cargo / Função</Label>
              <Input
                id="input-specialty"
                placeholder="Ex: Enfermeira Neonatal"
                value={specialty}
                onChange={(e) => setSpecialty(e.target.value)}
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="input-coren">Registro (COREN / CRN)</Label>
              <Input
                id="input-coren"
                placeholder="Ex: COREN-DF 492.831"
                value={crnOrCoren}
                onChange={(e) => setCrnOrCoren(e.target.value)}
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="input-exp">Tempo de Experiência</Label>
              <Input
                id="input-exp"
                placeholder="Ex: 9+ anos de experiência"
                value={experience}
                onChange={(e) => setExperience(e.target.value)}
              />
            </div>
          </div>

          {/* Tags de Especialidades */}
          <div className="space-y-2.5">
            <Label>Especialidades Atendidas</Label>
            <div className="flex flex-wrap gap-1.5">
              {PRESET_SPECIALTIES.map((spec) => {
                const isSelected = specialties.includes(spec);
                return (
                  <button
                    key={spec}
                    type="button"
                    onClick={() => toggleSpecialty(spec)}
                    className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium border transition-colors ${
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
            {specialties.filter((s) => !PRESET_SPECIALTIES.includes(s)).length >
              0 && (
              <div className="flex flex-wrap gap-1.5 pt-1">
                {specialties
                  .filter((s) => !PRESET_SPECIALTIES.includes(s))
                  .map((custom) => (
                    <span
                      key={custom}
                      className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary border border-primary/20"
                    >
                      {custom}
                      <button
                        type="button"
                        onClick={() => toggleSpecialty(custom)}
                        className="hover:text-red-600 ml-1"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
              </div>
            )}

            <div className="flex gap-2 pt-1 max-w-sm">
              <Input
                placeholder="Outra especialidade..."
                value={customSpecialty}
                onChange={(e) => setCustomSpecialty(e.target.value)}
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
            <Label htmlFor="input-bio">
              Mini-Bio / Apresentação Profissional
            </Label>
            <textarea
              id="input-bio"
              rows={3}
              className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              placeholder="Descreva sua trajetória, filosofia de atendimento humanizado e diferenciais clínicos..."
              value={bio}
              onChange={(e) => setBio(e.target.value)}
            />
          </div>

          {/* Repasses e Região */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="input-pix">Chave PIX (para repasses)</Label>
              <Input
                id="input-pix"
                placeholder="CPF, CNPJ, e-mail ou telefone"
                value={pixKey}
                onChange={(e) => setPixKey(e.target.value)}
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="input-city">Região / Cidade de Atendimento</Label>
              <Input
                id="input-city"
                placeholder="Ex: Brasília - DF e Região Metropolitana"
                value={city}
                onChange={(e) => setCity(e.target.value)}
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
                  onClick={() => setColor(c)}
                  className={`w-6 h-6 rounded-full border-2 transition-all mx-auto ${
                    color === c
                      ? "border-slate-900 scale-125 shadow-sm"
                      : "border-transparent hover:scale-110"
                  }`}
                  style={{ backgroundColor: c }}
                  title={c}
                />
              ))}
            </div>
          </div>
        </div>

        <div className="flex justify-end">
          <Button
            type="submit"
            className="bg-primary text-white hover:bg-primary/90 min-w-[140px]"
            disabled={loading}
          >
            {loading ? "Salvando..." : "Salvar Alterações"}
          </Button>
        </div>
      </form>

      {/* Cartão de Segurança: Alterar Senha */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-6">
        <div className="border-b border-slate-100 pb-4">
          <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <KeyRound className="w-5 h-5 text-primary" />
            Segurança e Senha de Acesso
          </h3>
          <p className="text-xs text-slate-500 mt-1">
            Recomendamos alterar sua senha periodicamente para manter a
            segurança da conta.
          </p>
        </div>

        {passwordSuccess && (
          <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl flex items-center gap-2 text-sm font-medium">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />
            <span>Sua senha foi alterada com sucesso!</span>
          </div>
        )}

        {passwordError && (
          <div className="p-4 bg-red-50 border border-red-200 text-red-800 rounded-xl flex items-center gap-2 text-sm font-medium">
            <Shield className="w-5 h-5 text-red-600 flex-shrink-0" />
            <span>{passwordError}</span>
          </div>
        )}

        <form onSubmit={handleChangePassword} className="space-y-4 max-w-md">
          <div className="space-y-1.5">
            <Label htmlFor="current-pw">Senha Atual</Label>
            <Input
              id="current-pw"
              type="password"
              required
              placeholder="Digite sua senha atual"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="new-pw">Nova Senha</Label>
            <Input
              id="new-pw"
              type="password"
              required
              placeholder="Mínimo de 8 caracteres"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="confirm-pw">Confirmar Nova Senha</Label>
            <Input
              id="confirm-pw"
              type="password"
              required
              placeholder="Repita a nova senha"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </div>

          <Button
            type="submit"
            variant="outline"
            className="border-slate-300 text-slate-800 hover:bg-slate-50"
            disabled={passwordLoading}
          >
            {passwordLoading ? "Alterando..." : "Alterar Senha"}
          </Button>
        </form>
      </div>
    </div>
  );
}
