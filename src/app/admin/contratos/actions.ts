"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/infrastructure/db/prisma";

export async function getContractTemplates() {
  return await prisma.contractTemplate.findMany({
    orderBy: { createdAt: "desc" },
  });
}

export async function createContractTemplate(data: {
  title: string;
  content: string;
}) {
  await prisma.contractTemplate.create({
    data,
  });
  revalidatePath("/admin/contratos");
}

export async function updateContractTemplate(
  id: string,
  data: { title: string; content: string },
) {
  await prisma.contractTemplate.update({
    where: { id },
    data,
  });
  revalidatePath("/admin/contratos");
}

export async function deleteContractTemplate(id: string) {
  await prisma.contractTemplate.delete({
    where: { id },
  });
  revalidatePath("/admin/contratos");
}

export async function getPendingBookings() {
  return await prisma.booking.findMany({
    where: {
      contract: null,
      status: "CONFIRMED", // Or any status representing an approved booking
    },
    include: {
      packages: {
        include: { service: true },
      },
      scheduleSlot: true,
    },
    orderBy: { createdAt: "desc" },
  });
}

export async function createContract(data: {
  bookingId: string;
  templateId: string;
  extraNotes?: string;
}) {
  const template = await prisma.contractTemplate.findUnique({
    where: { id: data.templateId },
  });

  if (!template) {
    throw new Error("Template não encontrado.");
  }

  const booking = await prisma.booking.findUnique({
    where: { id: data.bookingId },
    include: {
      client: true,
      professional: true,
      packages: true,
      scheduleSlot: true,
    },
  });

  if (!booking) {
    throw new Error("Agendamento não encontrado.");
  }

  // Helper formatting functions
  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat("pt-BR").format(date);
  };

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(val);
  };

  const totalPrice = booking.packages.reduce(
    (sum, p) => sum + (p.price || 0),
    0,
  );
  const serviceNames = booking.packages.map((p) => p.name).join(" + ");

  const fullAddress = [
    booking.client.street,
    booking.client.number,
    booking.client.complement,
    booking.client.neighborhood,
    booking.client.city,
    booking.client.state,
  ]
    .filter(Boolean)
    .join(", ");

  const contentWithVars = template.content
    .replace(/\{\{NOME_CLIENTE\}\}/g, booking.client.name || "")
    .replace(/\{\{CPF_CLIENTE\}\}/g, booking.client.cpf || "")
    .replace(
      /\{\{ENDERECO_CLIENTE\}\}/g,
      fullAddress || booking.client.address || "",
    )
    .replace(/\{\{SERVICO\}\}/g, serviceNames || "")
    .replace(/\{\{VALOR\}\}/g, formatCurrency(totalPrice))
    .replace(/\{\{NOME_ASSESSORA\}\}/g, booking.professional.name || "")
    .replace(
      /\{\{DATA_AGENDAMENTO\}\}/g,
      formatDate(booking.scheduleSlot.date) +
        " às " +
        booking.scheduleSlot.startTime,
    );

  // Combine template content with extra notes
  const finalContent = `
    ${contentWithVars}
    ${data.extraNotes ? `<h4>Observações Adicionais</h4><p>${data.extraNotes}</p>` : ""}
  `;

  const contract = await prisma.contract.create({
    data: {
      bookingId: data.bookingId,
      content: finalContent,
    },
  });

  if (booking.client.email) {
    const { EmailService } = await import("@/domain/services/EmailService");
    const contractUrl = process.env.NEXT_PUBLIC_APP_URL
      ? `${process.env.NEXT_PUBLIC_APP_URL}/portal/contratos`
      : `http://localhost:3000/portal/contratos`;

    await EmailService.sendContractReady(
      booking.client.email,
      booking.client.name,
      contractUrl,
    );
  }

  revalidatePath("/admin/contratos");
  return contract;
}

export async function getContracts() {
  return await prisma.contract.findMany({
    include: {
      booking: {
        include: {
          client: true,
          packages: { include: { service: true } },
          scheduleSlot: true,
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });
}
