"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/infrastructure/db/prisma";

export async function updatePartner(
  id: string,
  data: {
    name?: string;
    link?: string;
    active?: boolean;
    order?: number;
  },
) {
  await prisma.partner.update({
    where: { id },
    data,
  });
  revalidatePath("/admin/parceiros");
  revalidatePath("/");
}

export async function deletePartner(id: string) {
  await prisma.partner.delete({
    where: { id },
  });
  revalidatePath("/admin/parceiros");
  revalidatePath("/");
}

export async function uploadPartnerAction(formData: FormData) {
  const file = formData.get("file") as File;
  const name = formData.get("name") as string;
  const link = formData.get("link") as string;

  if (!file || !name) {
    throw new Error("Dados incompletos");
  }

  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);

  const base64Str = buffer.toString("base64");
  const mimeType = file.type || "image/jpeg";
  const logoUrl = `data:${mimeType};base64,${base64Str}`;

  await prisma.partner.create({
    data: {
      name,
      link,
      logoUrl,
      active: true,
      order: 0,
    },
  });

  revalidatePath("/admin/parceiros");
  revalidatePath("/");

  return { success: true };
}
