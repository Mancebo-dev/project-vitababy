"use server";

import { mkdir, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { revalidatePath } from "next/cache";
import { headers } from "next/headers";
import { auth } from "@/infrastructure/auth/auth";
import { prisma } from "@/infrastructure/db/prisma";

export async function uploadProfileAvatarAction(formData: FormData): Promise<{
  success: boolean;
  url?: string;
  error?: string;
}> {
  try {
    const headersList = await headers();
    const session = await auth.api.getSession({ headers: headersList });

    if (!session?.user) {
      return { success: false, error: "Usuário não autenticado." };
    }

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

    const uploadDir = join(process.cwd(), "public", "uploads", "avatars");
    await mkdir(uploadDir, { recursive: true });

    const safeName = file.name.replace(/[^a-zA-Z0-9.-]/g, "_");
    const fileName = `avatar_${session.user.id}_${Date.now()}_${safeName}`;
    const filePath = join(uploadDir, fileName);

    const buffer = Buffer.from(await file.arrayBuffer());
    await writeFile(filePath, buffer);

    const publicUrl = `/uploads/avatars/${fileName}`;

    // Update user image
    await prisma.user.update({
      where: { id: session.user.id },
      data: { image: publicUrl },
    });

    // If there is an associated professional, update avatarUrl too
    await prisma.professional.updateMany({
      where: {
        OR: [{ userId: session.user.id }, { email: session.user.email }],
      },
      data: { avatarUrl: publicUrl },
    });

    revalidatePath("/admin/perfil");
    revalidatePath("/admin/assessoras");
    return { success: true, url: publicUrl };
  } catch (error) {
    console.error("Erro ao salvar foto de perfil:", error);
    return { success: false, error: "Falha ao processar upload da foto." };
  }
}

export async function updateAdminProfileAction(data: {
  name: string;
  whatsapp?: string | null;
  // Professional fields (optional)
  specialty?: string | null;
  specialties?: string | null;
  crnOrCoren?: string | null;
  experience?: string | null;
  bio?: string | null;
  pixKey?: string | null;
  city?: string | null;
  color?: string | null;
}): Promise<{ success: boolean; error?: string }> {
  try {
    const headersList = await headers();
    const session = await auth.api.getSession({ headers: headersList });

    if (!session?.user) {
      return { success: false, error: "Usuário não autenticado." };
    }

    // 1. Update User basic info
    await prisma.user.update({
      where: { id: session.user.id },
      data: {
        name: data.name,
        whatsapp: data.whatsapp || null,
      },
    });

    // 2. Check if a Professional profile exists for this user or email
    const existingProf = await prisma.professional.findFirst({
      where: {
        OR: [{ userId: session.user.id }, { email: session.user.email }],
      },
    });

    if (existingProf) {
      await prisma.professional.update({
        where: { id: existingProf.id },
        data: {
          name: data.name,
          phone: data.whatsapp || existingProf.phone,
          specialty:
            data.specialty !== undefined
              ? data.specialty
              : existingProf.specialty,
          specialties:
            data.specialties !== undefined
              ? data.specialties
              : existingProf.specialties,
          crnOrCoren:
            data.crnOrCoren !== undefined
              ? data.crnOrCoren
              : existingProf.crnOrCoren,
          experience:
            data.experience !== undefined
              ? data.experience
              : existingProf.experience,
          bio: data.bio !== undefined ? data.bio : existingProf.bio,
          pixKey: data.pixKey !== undefined ? data.pixKey : existingProf.pixKey,
          city: data.city !== undefined ? data.city : existingProf.city,
          color: data.color !== undefined ? data.color : existingProf.color,
          userId: session.user.id,
        },
      });
    }

    revalidatePath("/admin/perfil");
    revalidatePath("/admin/assessoras");
    return { success: true };
  } catch (error) {
    console.error("Erro ao atualizar perfil do administrador:", error);
    return { success: false, error: "Erro ao salvar alterações no perfil." };
  }
}

export async function changeUserPasswordAction(
  currentPassword: string,
  newPassword: string,
): Promise<{ success: boolean; error?: string }> {
  try {
    const headersList = await headers();
    const session = await auth.api.getSession({ headers: headersList });

    if (!session?.user) {
      return { success: false, error: "Usuário não autenticado." };
    }

    await auth.api.changePassword({
      body: {
        currentPassword,
        newPassword,
        revokeOtherSessions: false,
      },
      headers: headersList,
    });

    return { success: true };
  } catch (error: unknown) {
    const err = error as { message?: string; status?: number };
    console.error("Erro ao alterar senha:", err);
    if (err?.status === 400 || err?.message?.includes("password")) {
      return {
        success: false,
        error:
          "A senha atual informada está incorreta ou a nova senha não atende aos requisitos.",
      };
    }
    return { success: false, error: "Falha ao alterar senha de acesso." };
  }
}
