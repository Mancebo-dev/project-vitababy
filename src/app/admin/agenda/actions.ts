"use server";

import type { Prisma } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { prisma } from "@/infrastructure/db/prisma";

export async function createPlannerItem(data: {
  title: string;
  description: string;
  type: string;
  date: Date;
  startTime: string;
  endTime: string;
  color: string;
}) {
  await prisma.plannerItem.create({
    data,
  });
  revalidatePath("/admin/agenda");
}

export async function deletePlannerItem(id: string) {
  await prisma.plannerItem.delete({
    where: { id },
  });
  revalidatePath("/admin/agenda");
}

export async function createScheduleSlot(
  data: Prisma.ScheduleSlotUncheckedCreateInput,
) {
  await prisma.scheduleSlot.create({ data });
  revalidatePath("/admin/agenda");
}

export async function deleteScheduleSlot(id: string) {
  await prisma.scheduleSlot.delete({ where: { id } });
  revalidatePath("/admin/agenda");
}
