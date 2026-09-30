"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/infrastructure/db/prisma";

export async function getClients() {
  try {
    return await prisma.client.findMany({
      orderBy: { name: "asc" },
    });
  } catch (error) {
    console.error("Error fetching clients:", error);
    return [];
  }
}

export async function getProfessionals() {
  try {
    return await prisma.professional.findMany({
      where: { active: true },
      orderBy: { name: "asc" },
    });
  } catch (error) {
    console.error("Error fetching professionals:", error);
    return [];
  }
}

export async function getSchedules() {
  try {
    return await prisma.clientSchedule.findMany({
      include: {
        client: true,
        shifts: {
          include: {
            professional: true,
          },
          orderBy: [{ date: "asc" }, { startTime: "asc" }],
        },
      },
      orderBy: { createdAt: "desc" },
    });
  } catch (error) {
    console.error("Error fetching schedules:", error);
    return [];
  }
}

export async function createSchedule(data: {
  clientId: string;
  month: string;
  title: string;
  shifts: {
    date: Date;
    startTime: string;
    endTime: string;
    professionalId: string;
  }[];
}) {
  await prisma.clientSchedule.create({
    data: {
      clientId: data.clientId,
      month: data.month,
      title: data.title,
      shifts: {
        create: data.shifts,
      },
    },
  });
  revalidatePath("/admin/escalas");
}

export async function deleteSchedule(id: string) {
  await prisma.clientSchedule.delete({ where: { id } });
  revalidatePath("/admin/escalas");
}

export async function deleteShift(id: string) {
  await prisma.clientScheduleShift.delete({ where: { id } });
  revalidatePath("/admin/escalas");
}

export async function updateShiftStatus(id: string, status: string) {
  await prisma.clientScheduleShift.update({
    where: { id },
    data: { status },
  });
  revalidatePath("/admin/escalas");
}
