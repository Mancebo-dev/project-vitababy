"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/infrastructure/db/prisma";

export async function toggleHighlight(id: string, current: boolean) {
  await prisma.review.update({
    where: { id },
    data: { isHighlighted: !current },
  });
  revalidatePath("/admin/depoimentos");
  revalidatePath("/");
}

export async function deleteReview(id: string) {
  await prisma.review.delete({
    where: { id },
  });
  revalidatePath("/admin/depoimentos");
  revalidatePath("/");
}

export async function updateReview(
  id: string,
  data: {
    comment: string;
    rating: number;
    clientName?: string;
    childName?: string;
  },
) {
  const existing = await prisma.review.findUnique({
    where: { id },
    include: { client: true },
  });

  if (!existing) {
    throw new Error("Depoimento não encontrado.");
  }

  await prisma.review.update({
    where: { id },
    data: {
      comment: data.comment,
      rating: data.rating,
    },
  });

  if (
    existing.clientId &&
    (data.clientName !== undefined || data.childName !== undefined)
  ) {
    await prisma.client.update({
      where: { id: existing.clientId },
      data: {
        ...(data.clientName ? { name: data.clientName.trim() } : {}),
        ...(data.childName !== undefined
          ? { childName: data.childName.trim() || null }
          : {}),
      },
    });
  }

  revalidatePath("/admin/depoimentos");
  revalidatePath("/");
}
