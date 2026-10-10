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
  clientId: string;
  bookingId?: string;
  scheduleId?: string;
  templateId?: string;
  customContent?: string;
  scale?: string;
  extraNotes?: string;
  addImageClause?: boolean;
}) {
  let templateContent = data.customContent || "";

  if (!templateContent && data.templateId) {
    const template = await prisma.contractTemplate.findUnique({
      where: { id: data.templateId },
    });
    if (!template) throw new Error("Template não encontrado.");
    templateContent = template.content;
  }

  if (!templateContent) throw new Error("Conteúdo do contrato é obrigatório.");

  const client = await prisma.client.findUnique({
    where: { id: data.clientId },
  });
  if (!client) throw new Error("Cliente não encontrado.");

  let booking = null;
  if (data.bookingId) {
    booking = await prisma.booking.findUnique({
      where: { id: data.bookingId },
      include: {
        professional: true,
        packages: true,
        scheduleSlot: true,
      },
    });
  }

  let schedule = null;
  if (data.scheduleId) {
    schedule = await prisma.clientSchedule.findUnique({
      where: { id: data.scheduleId },
    });
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

  const totalPrice =
    booking?.packages.reduce((sum, p) => sum + (p.price || 0), 0) || 0;
  const serviceNames =
    booking?.packages.map((p) => p.name).join(" + ") || "Serviço Avulso/Escala";

  const fullAddress = [
    client.street,
    client.number,
    client.complement,
    client.neighborhood,
    client.city,
    client.state,
  ]
    .filter(Boolean)
    .join(", ");

  let contentWithVars = templateContent
    .replace(/\{\{NOME_CLIENTE\}\}/g, client.name || "")
    .replace(/\{\{CPF_CLIENTE\}\}/g, client.cpf || "")
    .replace(/\{\{ENDERECO_CLIENTE\}\}/g, fullAddress || client.address || "")
    .replace(/\{\{SERVICO\}\}/g, serviceNames || "")
    .replace(/\{\{VALOR\}\}/g, formatCurrency(totalPrice))
    .replace(
      /\{\{NOME_ASSESSORA\}\}/g,
      booking?.professional?.name || "A definir",
    )
    .replace(/\{\{ESCALA\}\}/g, data.scale || "N/A");

  if (booking?.scheduleSlot) {
    contentWithVars = contentWithVars.replace(
      /\{\{DATA_AGENDAMENTO\}\}/g,
      formatDate(booking.scheduleSlot.date) +
        " às " +
        booking.scheduleSlot.startTime,
    );
  } else {
    contentWithVars = contentWithVars.replace(
      /\{\{DATA_AGENDAMENTO\}\}/g,
      "A definir",
    );
  }

  if (data.addImageClause) {
    const imageClause = `
      <h4>Cláusula de Uso de Imagem</h4>
      <p>O(A) CONTRATANTE autoriza expressamente o(a) CONTRATADO(A) a utilizar sua imagem, voz e som, bem como de seu bebê, captadas durante a prestação dos serviços, para fins de divulgação em redes sociais, site e materiais promocionais, de forma gratuita e por prazo indeterminado.</p>
    `;
    contentWithVars += imageClause;
  }

  // Combine template content with extra notes
  const finalContent = `
    ${contentWithVars}
    ${data.extraNotes ? `<h4>Observações Adicionais</h4><p>${data.extraNotes}</p>` : ""}
  `;

  const contract = await prisma.contract.create({
    data: {
      clientId: data.clientId,
      bookingId: data.bookingId || undefined,
      scheduleId: data.scheduleId || undefined,
      content: finalContent,
    },
  });

  if (client.email) {
    const { EmailService } = await import("@/domain/services/EmailService");
    const contractUrl = process.env.NEXT_PUBLIC_APP_URL
      ? `${process.env.NEXT_PUBLIC_APP_URL}/portal/contratos`
      : `http://localhost:3000/portal/contratos`;

    await EmailService.sendContractReady(
      client.email,
      client.name,
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
