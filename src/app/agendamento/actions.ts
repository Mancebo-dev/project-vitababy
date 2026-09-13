"use server";

import { headers } from "next/headers";
import type { BookingFormData } from "@/components/agendamento/types";
import { auth } from "@/infrastructure/auth/auth";
import { prisma } from "@/infrastructure/db/prisma";

export async function submitBookingAction(data: BookingFormData) {
  try {
    const rawCpf = data.clientCpf.replace(/\D/g, "");

    // 1. Check if user already exists
    let userId = null;
    const existingUser = await prisma.user.findUnique({
      where: { email: data.clientEmail },
    });

    if (existingUser) {
      userId = existingUser.id;
    } else {
      // 2. Create user in better-auth
      const headersList = await headers();

      const signUpResult = await auth.api.signUpEmail({
        body: {
          email: data.clientEmail,
          password: rawCpf,
          name: data.clientName,
        },
        headers: headersList,
        asResponse: false,
      });

      if (!signUpResult || !signUpResult.user) {
        throw new Error("Falha ao criar usuário no sistema de autenticação.");
      }

      userId = signUpResult.user.id;

      // Update role to client
      await prisma.user.update({
        where: { id: userId },
        data: { role: "client" },
      });
    }

    // 3. Create or update Client profile
    let client = await prisma.client.findFirst({
      where: {
        OR: [{ email: data.clientEmail }, { cpf: data.clientCpf }],
      },
    });

    if (client) {
      client = await prisma.client.update({
        where: { id: client.id },
        data: {
          userId,
          name: data.clientName,
          phone: data.clientPhone,
          zipCode: data.clientZipCode,
          address: data.clientAddress,
        },
      });
    } else {
      client = await prisma.client.create({
        data: {
          userId,
          name: data.clientName,
          email: data.clientEmail,
          phone: data.clientPhone,
          cpf: data.clientCpf,
          zipCode: data.clientZipCode,
          address: data.clientAddress,
        },
      });
    }

    // 4. Handle Professional
    const realProfessionalId = data.professionalId;

    // 5. Create Booking
    // For simplicity, we just use the first date preference as the schedule slot
    const pref = data.dates[0];
    const dateObj = new Date(pref.date);

    // Find existing slot
    const slot = await prisma.scheduleSlot.findFirst({
      where: {
        professionalId: realProfessionalId,
        date: dateObj,
        startTime: pref.time,
        isBooked: false,
      },
    });

    if (!slot) {
      throw new Error("O horário selecionado não está mais disponível.");
    }

    // Mark as booked
    await prisma.scheduleSlot.update({
      where: { id: slot.id },
      data: { isBooked: true },
    });

    // We assume the selected service has at least one package, or we create a default one for it
    // For this MVP, let's just find the first package of the first selected service
    let servicePkg = await prisma.servicePackage.findFirst({
      where: { serviceId: data.serviceIds[0] },
    });

    if (!servicePkg) {
      servicePkg = await prisma.servicePackage.create({
        data: {
          serviceId: data.serviceIds[0],
          name: "Pacote Padrão",
          price: 150.0,
        },
      });
    }

    // Create Booking
    const booking = await prisma.booking.create({
      data: {
        clientId: client.id,
        professionalId: realProfessionalId,
        scheduleSlotId: slot.id,
        additionalInfo: data.additionalInfo || null,
        status: "PENDING",
        packages: {
          connect: { id: servicePkg.id },
        },
      },
    });

    // Send Email (do not await to avoid blocking response, or await and catch inside EmailService)
    const { EmailService } = await import("@/domain/services/EmailService");
    await EmailService.sendBookingReceived(
      data.clientEmail,
      data.clientName,
      servicePkg.name,
      `${dateObj.toLocaleDateString("pt-BR")} às ${pref.time}`,
    );

    return { success: true, bookingId: booking.id };
  } catch (error: unknown) {
    console.error("Booking Error:", error);
    const errorMessage =
      error instanceof Error ? error.message : "Erro interno ao agendar.";
    return {
      success: false,
      error: errorMessage,
    };
  }
}
