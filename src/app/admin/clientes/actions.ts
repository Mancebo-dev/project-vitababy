"use server";

import type { Prisma } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { auth } from "@/infrastructure/auth/auth";
import { prisma } from "@/infrastructure/db/prisma";

export async function createClient(data: Prisma.ClientUncheckedCreateInput) {
  const client = await prisma.client.create({
    data,
  });

  if (client.email && client.cpf && !client.userId) {
    try {
      let password = client.cpf.replace(/\D/g, "");
      if (password.length < 8) {
        password = password.padEnd(8, "0");
      }

      const res = await auth.api.signUpEmail({
        body: {
          email: client.email,
          password: password,
          name: client.name,
        },
      });

      if (res?.user?.id) {
        await prisma.client.update({
          where: { id: client.id },
          data: { userId: res.user.id },
        });
        await prisma.user.update({
          where: { id: res.user.id },
          data: { role: "client" },
        });
      }
    } catch (error) {
      console.error("Error creating user account for client:", error);
    }
  }

  revalidatePath("/admin/clientes");
}

export async function updateClient(
  id: string,
  data: Prisma.ClientUncheckedUpdateInput,
) {
  const client = await prisma.client.update({
    where: { id },
    data,
  });

  if (client.email && client.cpf && !client.userId) {
    try {
      let password = client.cpf.replace(/\D/g, "");
      if (password.length < 8) {
        password = password.padEnd(8, "0");
      }

      const res = await auth.api.signUpEmail({
        body: {
          email: client.email,
          password: password,
          name: client.name,
        },
      });

      if (res?.user?.id) {
        await prisma.client.update({
          where: { id: client.id },
          data: { userId: res.user.id },
        });
        await prisma.user.update({
          where: { id: res.user.id },
          data: { role: "client" },
        });
      }
    } catch (error) {
      console.error("Error creating user account during client update:", error);
    }
  }

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

  const base64Str = buffer.toString("base64");
  const mimeType = file.type || "application/octet-stream";
  const fileUrl = `data:${mimeType};base64,${base64Str}`;

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
