"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/infrastructure/db/prisma";

export async function createTransaction(data: {
  amount: number;
  description: string;
  type: string;
  method: string;
  status: string;
  date: Date;
}) {
  await prisma.payment.create({
    data: {
      amount: data.amount,
      description: data.description,
      type: data.type,
      method: data.method,
      status: data.status,
      date: data.date,
    },
  });
  revalidatePath("/admin/financeiro");
}

export async function deleteTransaction(id: string) {
  await prisma.payment.delete({
    where: { id },
  });
  revalidatePath("/admin/financeiro");
}
