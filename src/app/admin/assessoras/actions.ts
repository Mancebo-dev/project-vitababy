"use server";

import { mkdir, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { revalidatePath } from "next/cache";
import { prisma } from "@/infrastructure/db/prisma";

export async function createProfessional(data: {
  name: string;
  email?: string | null;
  phone?: string | null;
  specialty?: string | null;
  specialties?: string | null;
  crnOrCoren?: string | null;
  experience?: string | null;
  bio?: string | null;
  avatarUrl?: string | null;
  pixKey?: string | null;
  city?: string | null;
  color?: string | null;
  active?: boolean;
  userId?: string | null;
}) {
  await prisma.professional.create({
    data: {
      name: data.name,
      email: data.email || null,
      phone: data.phone || null,
      specialty: data.specialty || null,
      specialties: data.specialties || null,
      crnOrCoren: data.crnOrCoren || null,
      experience: data.experience || null,
      bio: data.bio || null,
      avatarUrl: data.avatarUrl || null,
      pixKey: data.pixKey || null,
      city: data.city || null,
      color: data.color || "#ae4d30",
      active: data.active ?? true,
      userId: data.userId || null,
    },
  });
  revalidatePath("/admin/assessoras");
  revalidatePath("/admin/agenda");
}

export async function updateProfessional(
  id: string,
  data: {
    name?: string;
    email?: string | null;
    phone?: string | null;
    specialty?: string | null;
    specialties?: string | null;
    crnOrCoren?: string | null;
    experience?: string | null;
    bio?: string | null;
    avatarUrl?: string | null;
    pixKey?: string | null;
    city?: string | null;
    color?: string | null;
    active?: boolean;
    userId?: string | null;
  },
) {
  await prisma.professional.update({
    where: { id },
    data: {
      name: data.name,
      email: data.email !== undefined ? data.email || null : undefined,
      phone: data.phone !== undefined ? data.phone || null : undefined,
      specialty:
        data.specialty !== undefined ? data.specialty || null : undefined,
      specialties:
        data.specialties !== undefined ? data.specialties || null : undefined,
      crnOrCoren:
        data.crnOrCoren !== undefined ? data.crnOrCoren || null : undefined,
      experience:
        data.experience !== undefined ? data.experience || null : undefined,
      bio: data.bio !== undefined ? data.bio || null : undefined,
      avatarUrl:
        data.avatarUrl !== undefined ? data.avatarUrl || null : undefined,
      pixKey: data.pixKey !== undefined ? data.pixKey || null : undefined,
      city: data.city !== undefined ? data.city || null : undefined,
      color: data.color !== undefined ? data.color : undefined,
      active: data.active !== undefined ? data.active : undefined,
      userId: data.userId !== undefined ? data.userId || null : undefined,
    },
  });
  revalidatePath("/admin/assessoras");
  revalidatePath("/admin/agenda");
}

export async function deleteProfessional(id: string) {
  await prisma.professional.delete({
    where: { id },
  });
  revalidatePath("/admin/assessoras");
  revalidatePath("/admin/agenda");
}

export async function uploadProfessionalAvatarAction(
  formData: FormData,
): Promise<{
  success: boolean;
  url?: string;
  error?: string;
}> {
  try {
    const file = formData.get("avatar") as File | null;
    if (!file || file.size === 0) {
      return { success: false, error: "Nenhum arquivo enviado." };
    }

    if (!file.type.startsWith("image/")) {
      return {
        success: false,
        error: "O arquivo deve ser uma imagem (PNG, JPG, WEBP).",
      };
    }

    const uploadDir = join(process.cwd(), "public", "uploads", "profissionais");
    await mkdir(uploadDir, { recursive: true });

    const safeName = file.name.replace(/[^a-zA-Z0-9.-]/g, "_");
    const fileName = `prof_${Date.now()}_${safeName}`;
    const filePath = join(uploadDir, fileName);

    const buffer = Buffer.from(await file.arrayBuffer());
    await writeFile(filePath, buffer);

    const publicUrl = `/uploads/profissionais/${fileName}`;
    return { success: true, url: publicUrl };
  } catch (error) {
    console.error("Erro ao salvar foto de perfil:", error);
    return { success: false, error: "Falha ao processar upload da foto." };
  }
}
