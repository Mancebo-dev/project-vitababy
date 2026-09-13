"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/infrastructure/db/prisma";

export async function toggleHighlight(id: string, current: boolean) {
  await prisma.review.update({
    where: { id },
    data: { isHighlighted: !current },
  });
  revalidatePath("/admin/depoimentos");
}

export async function deleteReview(id: string) {
  await prisma.review.delete({
    where: { id },
  });
  revalidatePath("/admin/depoimentos");
}
