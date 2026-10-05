"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/infrastructure/db/prisma";

export async function addImageToPublicGallery(data: {
  imageUrl: string;
  title: string;
  description?: string;
  active?: boolean;
}) {
  await prisma.publicGallery.create({
    data: {
      imageUrl: data.imageUrl,
      title: data.title,
      description: data.description,
      active: data.active ?? true,
    },
  });
  revalidatePath("/admin/galeria");
  revalidatePath("/galeria");
}

export async function updatePublicGalleryImage(
  id: string,
  data: {
    title?: string;
    description?: string;
    active?: boolean;
  },
) {
  await prisma.publicGallery.update({
    where: { id },
    data,
  });
  revalidatePath("/admin/galeria");
  revalidatePath("/galeria");
}

export async function deletePublicGalleryImage(id: string) {
  await prisma.publicGallery.delete({
    where: { id },
  });
  revalidatePath("/admin/galeria");
  revalidatePath("/galeria");
}

export async function uploadPublicGalleryImageAction(formData: FormData) {
  const file = formData.get("file") as File;
  const title = formData.get("title") as string;
  const description = formData.get("description") as string;

  if (!file || !title) {
    throw new Error("Dados incompletos");
  }

  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);

  const base64Str = buffer.toString("base64");
  const mimeType = file.type || "image/jpeg";
  const imageUrl = `data:${mimeType};base64,${base64Str}`;

  await prisma.publicGallery.create({
    data: {
      imageUrl,
      title,
      description,
      active: true,
    },
  });

  revalidatePath("/admin/galeria");
  revalidatePath("/galeria");

  return { success: true };
}
