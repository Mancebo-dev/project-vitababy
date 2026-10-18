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
  serviceName?: string;
  serviceDetails?: string;
  scale?: string;
  extraNotes?: string;
  addImageClause?: boolean;
  totalValue?: number;
  monthlyValue?: number;
  dailyValue?: number;
  validityMonths?: number;
  validityDescription?: string;
  workRegime?: string;
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

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(val);
  };

  const calculatedPrice =
    data.totalValue ||
    booking?.packages.reduce((sum, p) => sum + (p.price || 0), 0) ||
    0;
  const serviceNames =
    booking?.packages.map((p) => p.name).join(" + ") ||
    "Assessoria Materno-Infantil";

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

  const validityText =
    data.validityDescription ||
    (data.validityMonths
      ? `${data.validityMonths} meses`
      : "tempo indeterminado");
  const regimeText =
    data.workRegime ||
    data.scale ||
    "dias úteis da semana (segunda-feira à sexta-feira)";

  // Dynamic Clause 1 interpolation
  const clausulaObjeto = `O presente instrumento tem por objeto a prestação de serviços de assessoria materno-infantil pela VITA BABY ASSESSORIA, conforme o plano descrito neste documento. Sendo em ${regimeText}, em horários previamente acordados entre ambas as partes, tendo como validade o presente contrato por ${validityText}.`;

  let contentWithVars = templateContent
    .replace(/\{\{NOME_CLIENTE\}\}/g, client.name || "")
    .replace(/\{\{CPF_CLIENTE\}\}/g, client.cpf || "")
    .replace(/\{\{ENDERECO_CLIENTE\}\}/g, fullAddress || client.address || "")
    .replace(/\{\{SERVICO\}\}/g, serviceNames)
    .replace(/\{\{VALOR\}\}/g, formatCurrency(calculatedPrice))
    .replace(
      /\{\{VALOR_MENSAL\}\}/g,
      data.monthlyValue ? formatCurrency(data.monthlyValue) : "",
    )
    .replace(
      /\{\{VALOR_DIARIA\}\}/g,
      data.dailyValue ? formatCurrency(data.dailyValue) : "",
    )
    .replace(/\{\{VALIDADE\}\}/g, validityText)
    .replace(/\{\{REGIME\}\}/g, regimeText)
    .replace(/\{\{CLAUSULA_OBJETO\}\}/g, clausulaObjeto)
    .replace(
      /\{\{NOME_ASSESSORA\}\}/g,
      booking?.professional?.name || "A definir",
    )
    .replace(/\{\{ESCALA\}\}/g, data.scale || regimeText);

  if (booking?.scheduleSlot) {
    const d = new Date(booking.scheduleSlot.date);
    const dateFormatted = new Intl.DateTimeFormat("pt-BR").format(d);
    contentWithVars = contentWithVars.replace(
      /\{\{DATA_AGENDAMENTO\}\}/g,
      booking.scheduleSlot.startTime
        ? `${dateFormatted} às ${booking.scheduleSlot.startTime}`
        : dateFormatted,
    );
  } else {
    contentWithVars = contentWithVars.replace(
      /\{\{DATA_AGENDAMENTO\}\}/g,
      "Conforme escala acordada",
    );
  }

  if (data.addImageClause) {
    const imageClause = `
      <h4>Cláusula de Uso de Imagem</h4>
      <p>O(A) CONTRATANTE autoriza expressamente o(a) CONTRATADO(A) a utilizar sua imagem, voz e som, bem como de seu bebê, captadas durante a prestação dos serviços, para fins de divulgação em redes sociais, site e materiais promocionais, de forma gratuita e por prazo indeterminado.</p>
    `;
    contentWithVars += imageClause;
  }

  const finalContent = data.extraNotes
    ? `${contentWithVars}<h4>Observações Adicionais</h4><p>${data.extraNotes}</p>`
    : contentWithVars;

  const contract = await prisma.contract.create({
    data: {
      clientId: data.clientId,
      bookingId: data.bookingId || undefined,
      scheduleId: data.scheduleId || undefined,
      content: finalContent,
      serviceName: data.serviceName || serviceNames,
      serviceDetails: data.serviceDetails || null,
      totalValue: data.totalValue,
      monthlyValue: data.monthlyValue,
      dailyValue: data.dailyValue,
      validityMonths: data.validityMonths,
      validityDescription: data.validityDescription,
      workRegime: data.workRegime,
    },
  });

  if (client.email) {
    try {
      const { EmailService } = await import("@/domain/services/EmailService");
      const contractUrl = process.env.NEXT_PUBLIC_APP_URL
        ? `${process.env.NEXT_PUBLIC_APP_URL}/portal/contratos`
        : "http://localhost:3000/portal/contratos";

      await EmailService.sendContractReady(
        client.email,
        client.name,
        contractUrl,
      );
    } catch (err) {
      console.error("Erro ao enviar email do contrato:", err);
    }
  }

  revalidatePath("/admin/contratos");
  return contract;
}

export async function updateContract(
  id: string,
  data: {
    content?: string;
    serviceName?: string;
    serviceDetails?: string;
    totalValue?: number;
    monthlyValue?: number;
    dailyValue?: number;
    validityMonths?: number;
    validityDescription?: string;
    workRegime?: string;
  },
) {
  const existing = await prisma.contract.findUnique({
    where: { id },
  });

  if (!existing) {
    throw new Error("Contrato não encontrado.");
  }

  if (existing.signedByClient) {
    throw new Error(
      "Este contrato já foi assinado digitalmente pelo cliente e não pode ser alterado.",
    );
  }

  const updated = await prisma.contract.update({
    where: { id },
    data: {
      content: data.content ?? existing.content,
      serviceName:
        data.serviceName !== undefined
          ? data.serviceName
          : existing.serviceName,
      serviceDetails:
        data.serviceDetails !== undefined
          ? data.serviceDetails
          : existing.serviceDetails,
      totalValue:
        data.totalValue !== undefined ? data.totalValue : existing.totalValue,
      monthlyValue:
        data.monthlyValue !== undefined
          ? data.monthlyValue
          : existing.monthlyValue,
      dailyValue:
        data.dailyValue !== undefined ? data.dailyValue : existing.dailyValue,
      validityMonths:
        data.validityMonths !== undefined
          ? data.validityMonths
          : existing.validityMonths,
      validityDescription:
        data.validityDescription ?? existing.validityDescription,
      workRegime: data.workRegime ?? existing.workRegime,
    },
  });

  revalidatePath("/admin/contratos");
  revalidatePath(`/contrato/${id}`);
  return updated;
}

export async function deleteContract(id: string) {
  const existing = await prisma.contract.findUnique({
    where: { id },
  });

  if (!existing) {
    throw new Error("Contrato não encontrado.");
  }

  await prisma.contract.delete({
    where: { id },
  });

  revalidatePath("/admin/contratos");
}

export async function getContracts() {
  return await prisma.contract.findMany({
    include: {
      client: true,
      schedule: {
        include: { client: true },
      },
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
