"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/infrastructure/db/prisma";

export async function approveBooking(id: string) {
  const booking = await prisma.booking.update({
    where: { id },
    data: { status: "CONFIRMED" },
    include: {
      client: true,
      packages: true,
      scheduleSlot: true,
    },
  });

  if (booking.client.email) {
    const { EmailService } = await import("@/domain/services/EmailService");
    const serviceName = booking.packages[0]?.name || "Serviço";
    const dateStr = booking.scheduleSlot.date.toLocaleDateString("pt-BR");
    await EmailService.sendBookingConfirmed(
      booking.client.email,
      booking.client.name,
      serviceName,
      `${dateStr} às ${booking.scheduleSlot.startTime}`,
    );
  }

  revalidatePath("/admin/agendamentos");
}

export async function rejectBooking(id: string, reason: string) {
  await prisma.booking.update({
    where: { id },
    data: {
      status: "CANCELLED",
      cancelReason: reason,
    },
  });
  revalidatePath("/admin/agendamentos");
}

export async function createManualBooking(data: {
  clientId: string;
  packageIds: string[];
  professionalId: string;
  scheduleSlotId: string;
  additionalInfo?: string;
  transportFee?: number;
}) {
  await prisma.$transaction(async (tx) => {
    // 1. Create booking
    await tx.booking.create({
      data: {
        clientId: data.clientId,
        professionalId: data.professionalId,
        scheduleSlotId: data.scheduleSlotId,
        additionalInfo: data.additionalInfo,
        transportFee: data.transportFee,
        packages: {
          connect: data.packageIds.map((id) => ({ id })),
        },
        status: "CONFIRMED",
      },
    });

    // 2. Mark slot as booked
    await tx.scheduleSlot.update({
      where: { id: data.scheduleSlotId },
      data: { isBooked: true },
    });
  });

  revalidatePath("/admin/agendamentos");
}
