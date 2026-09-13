"use server";

import type { Prisma } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { prisma } from "@/infrastructure/db/prisma";

export async function createClient(data: Prisma.ClientUncheckedCreateInput) {
  await prisma.client.create({
    data,
  });
  revalidatePath("/admin/clientes");
}

export async function updateClient(
  id: string,
  data: Prisma.ClientUncheckedUpdateInput,
) {
  await prisma.client.update({
    where: { id },
    data,
  });
  revalidatePath("/admin/clientes");
  revalidatePath(`/admin/clientes/${id}`);
}

export async function deleteClient(id: string) {
  await prisma.client.delete({
    where: { id },
  });
  revalidatePath("/admin/clientes");
}

export async function createConsultationNote(data: {
  clientId: string;
  title: string;
  content: string;
  sombraNotes?: string;
  professionalId: string;
}) {
  const note = await prisma.consultationNote.create({
    data: {
      clientId: data.clientId,
      professionalId: data.professionalId,
      title: data.title,
      content: data.content,
      sombraNotes: data.sombraNotes,
    },
  });

  revalidatePath(`/admin/clientes/${data.clientId}`);
  return note;
}

import { mkdir, writeFile } from "node:fs/promises";
import { join } from "node:path";

export async function uploadClientFileAction(formData: FormData) {
  const file = formData.get("file") as File;
  const clientId = formData.get("clientId") as string;
  const title = formData.get("title") as string;
  const description = formData.get("description") as string;
  const uploadedBy = formData.get("uploadedBy") as string;

  if (!file || !clientId || !title) {
    throw new Error("Dados incompletos");
  }

  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);

  // Use a distinct filename to avoid overwrites
  const fileName = `${Date.now()}-${file.name.replace(/\s/g, "_")}`;

  // No Vercel MVP podemos usar public/uploads
  const uploadDir = join(process.cwd(), "public", "uploads");
  try {
    await mkdir(uploadDir, { recursive: true });
  } catch (_e) {
    // ignore
  }

  const path = join(uploadDir, fileName);
  await writeFile(path, buffer);

  const fileUrl = `/uploads/${fileName}`;

  const clientFile = await prisma.clientFile.create({
    data: {
      clientId,
      title,
      description,
      fileUrl,
      fileType: file.type || "application/octet-stream",
      uploadedBy,
    },
  });

  revalidatePath(`/admin/clientes/${clientId}`);
  revalidatePath(`/portal/exames`);

  return { success: true, clientFile };
}
