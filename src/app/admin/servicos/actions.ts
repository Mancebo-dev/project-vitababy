"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/infrastructure/db/prisma";

export async function createService(data: {
  name: string;
  description?: string;
}) {
  await prisma.service.create({
    data,
  });
  revalidatePath("/admin/servicos");
  revalidatePath("/");
  revalidatePath("/agendamento");
}

export async function updateService(
  id: string,
  data: { name: string; description?: string; active: boolean },
) {
  await prisma.service.update({
    where: { id },
    data,
  });
  revalidatePath("/admin/servicos");
  revalidatePath("/");
  revalidatePath("/agendamento");
}

export async function deleteService(id: string) {
  await prisma.service.delete({
    where: { id },
  });
  revalidatePath("/admin/servicos");
  revalidatePath("/");
  revalidatePath("/agendamento");
}

export async function createServicePackage(data: {
  serviceId: string;
  name: string;
  description?: string;
  price?: number;
  duration?: number;
}) {
  await prisma.servicePackage.create({
    data,
  });
  revalidatePath("/admin/servicos");
  revalidatePath("/");
  revalidatePath("/agendamento");
}

export async function updateServicePackage(
  id: string,
  data: {
    name: string;
    description?: string;
    price?: number;
    duration?: number;
  },
) {
  await prisma.servicePackage.update({
    where: { id },
    data,
  });
  revalidatePath("/admin/servicos");
  revalidatePath("/");
  revalidatePath("/agendamento");
}

export async function deleteServicePackage(id: string) {
  await prisma.servicePackage.delete({
    where: { id },
  });
  revalidatePath("/admin/servicos");
  revalidatePath("/");
  revalidatePath("/agendamento");
}
