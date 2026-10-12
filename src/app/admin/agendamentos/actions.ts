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
  scheduleSlotId?: string;
  newSlot?: {
    date: Date;
    startTime?: string | null;
    endTime?: string | null;
    type?: "ONLINE" | "IN_PERSON";
  };
  additionalInfo?: string;
  transportFee?: number;
}) {
  await prisma.$transaction(async (tx) => {
    let finalSlotId = data.scheduleSlotId;

    if (!finalSlotId && data.newSlot) {
      const slot = await tx.scheduleSlot.create({
        data: {
          professionalId: data.professionalId,
          date: data.newSlot.date,
          startTime: data.newSlot.startTime || null,
          endTime: data.newSlot.endTime || null,
          isBooked: true,
        },
      });
      finalSlotId = slot.id;
    }

    if (!finalSlotId) throw new Error("Data ou horário é obrigatório");

    // 1. Create booking
    await tx.booking.create({
      data: {
        clientId: data.clientId,
        professionalId: data.professionalId,
        scheduleSlotId: finalSlotId,
        additionalInfo: data.additionalInfo,
        transportFee: data.transportFee,
        packages: {
          connect: data.packageIds.map((id) => ({ id })),
        },
        status: "CONFIRMED",
      },
    });

    // 2. Mark slot as booked
    if (data.scheduleSlotId) {
      await tx.scheduleSlot.update({
        where: { id: data.scheduleSlotId },
        data: { isBooked: true },
      });
    }
  });

  revalidatePath("/admin/agendamentos");
  revalidatePath("/admin/agenda");
}

export async function updateBooking(
  id: string,
  data: {
    clientId: string;
    packageIds: string[];
    professionalId: string;
    date: Date;
    startTime?: string | null;
    endTime?: string | null;
    status: string;
    transportFee?: number;
    additionalInfo?: string;
  },
) {
  await prisma.$transaction(async (tx) => {
    const booking = await tx.booking.findUnique({
      where: { id },
      include: { scheduleSlot: true },
    });

    if (!booking) throw new Error("Agendamento não encontrado");

    // Update schedule slot
    if (booking.scheduleSlotId) {
      await tx.scheduleSlot.update({
        where: { id: booking.scheduleSlotId },
        data: {
          date: data.date,
          startTime: data.startTime || null,
          endTime: data.endTime || null,
          professionalId: data.professionalId,
        },
      });
    }

    // Update booking
    await tx.booking.update({
      where: { id },
      data: {
        clientId: data.clientId,
        professionalId: data.professionalId,
        status: data.status,
        transportFee: data.transportFee,
        additionalInfo: data.additionalInfo,
        packages: {
          set: data.packageIds.map((pid) => ({ id: pid })),
        },
      },
    });
  });

  revalidatePath("/admin/agendamentos");
  revalidatePath("/admin/agenda");
}

export async function deleteBooking(id: string) {
  const booking = await prisma.booking.findUnique({
    where: { id },
    select: { scheduleSlotId: true },
  });

  if (booking) {
    await prisma.$transaction(async (tx) => {
      await tx.booking.delete({
        where: { id },
      });

      if (booking.scheduleSlotId) {
        try {
          await tx.scheduleSlot.delete({
            where: { id: booking.scheduleSlotId },
          });
        } catch {
          await tx.scheduleSlot.update({
            where: { id: booking.scheduleSlotId },
            data: { isBooked: false },
          });
        }
      }
    });
  }

  revalidatePath("/admin/agendamentos");
  revalidatePath("/admin/agenda");
}
