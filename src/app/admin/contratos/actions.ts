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
      status: { in: ["CONFIRMED", "PENDING"] },
    },
    include: {
      client: true,
      professional: true,
      packages: {
        include: { service: true },
      },
      scheduleSlot: {
        include: { professional: true },
      },
    },
    orderBy: { createdAt: "desc" },
  });
}

function formatDateDisplay(rawDate?: string | null): string {
  if (!rawDate) return "";
  const trimmed = rawDate.trim();
  if (!trimmed) return "";
  // If YYYY-MM-DD, format as DD/MM/YYYY
  if (/^\d{4}-\d{2}-\d{2}$/.test(trimmed)) {
    const [y, m, d] = trimmed.split("-");
    return `${d}/${m}/${y}`;
  }
  return trimmed;
}

export async function createContract(data: {
  clientId: string;
  bookingId?: string;
  scheduleId?: string;
  templateId?: string;
  customContent?: string;
  serviceName?: string | null;
  serviceDetails?: string | null;
  serviceDate?: string | null;
  serviceTime?: string | null;
  serviceProfessional?: string | null;
  scale?: string | null;
  extraNotes?: string | null;
  addImageClause?: boolean;
  totalValue?: number | null;
  monthlyValue?: number | null;
  dailyValue?: number | null;
  validityMonths?: number | null;
  validityDescription?: string | null;
  workRegime?: string | null;
}) {
  let templateContent = data.customContent?.trim() || "";

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
        packages: { include: { service: true } },
        scheduleSlot: { include: { professional: true } },
        contract: true,
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
    data.totalValue ??
    (booking
      ? booking.packages.reduce((sum, p) => sum + (p.price || 0), 0) +
        (booking.transportFee || 0)
      : 0);

  const defaultBookingServiceName =
    booking?.packages.map((p) => p.name).join(" + ") || "";

  const finalServiceName =
    data.serviceName !== undefined
      ? data.serviceName?.trim() || null
      : defaultBookingServiceName || "Assessoria Materno-Infantil";

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

  const cleanValidity = data.validityDescription?.trim() || null;
  const cleanRegime = data.workRegime?.trim() || data.scale?.trim() || null;

  const validityForClause =
    cleanValidity ||
    (data.validityMonths
      ? `${data.validityMonths} meses`
      : "prazo acordado entre as partes");
  const regimeForClause = cleanRegime || "regime e dias previamente acordados";

  const clausulaObjeto = `O presente instrumento tem por objeto a prestação de serviços de assessoria materno-infantil pela VITA BABY ASSESSORIA, conforme o plano descrito neste documento. Sendo em ${regimeForClause}, em horários previamente acordados entre ambas as partes, tendo como validade o presente contrato por ${validityForClause}.`;

  let resolvedDate = formatDateDisplay(data.serviceDate);
  let resolvedTime = data.serviceTime?.trim() || "";
  let resolvedProf = data.serviceProfessional?.trim() || "";

  if (booking?.scheduleSlot) {
    if (!resolvedDate) {
      const d = new Date(booking.scheduleSlot.date);
      resolvedDate = new Intl.DateTimeFormat("pt-BR").format(d);
    }
    if (!resolvedTime && booking.scheduleSlot.startTime) {
      resolvedTime = booking.scheduleSlot.endTime
        ? `${booking.scheduleSlot.startTime} às ${booking.scheduleSlot.endTime}`
        : booking.scheduleSlot.startTime;
    }
    if (!resolvedProf) {
      resolvedProf =
        booking.scheduleSlot.professional?.name ||
        booking.professional?.name ||
        "";
    }
  }

  let contentWithVars = templateContent
    .replace(/\{\{NOME_CLIENTE\}\}/g, client.name || "")
    .replace(/\{\{CPF_CLIENTE\}\}/g, client.cpf || "")
    .replace(/\{\{ENDERECO_CLIENTE\}\}/g, fullAddress || client.address || "")
    .replace(
      /\{\{SERVICO\}\}/g,
      finalServiceName || "Assessoria Materno-Infantil",
    )
    .replace(
      /\{\{VALOR\}\}/g,
      calculatedPrice > 0 ? formatCurrency(calculatedPrice) : "",
    )
    .replace(
      /\{\{VALOR_MENSAL\}\}/g,
      data.monthlyValue ? formatCurrency(data.monthlyValue) : "",
    )
    .replace(
      /\{\{VALOR_DIARIA\}\}/g,
      data.dailyValue ? formatCurrency(data.dailyValue) : "",
    )
    .replace(/\{\{VALIDADE\}\}/g, validityForClause)
    .replace(/\{\{REGIME\}\}/g, regimeForClause)
    .replace(/\{\{CLAUSULA_OBJETO\}\}/g, clausulaObjeto)
    .replace(/\{\{NOME_ASSESSORA\}\}/g, resolvedProf || "Equipe Vita Baby")
    .replace(/\{\{ESCALA\}\}/g, cleanRegime || "Conforme escala acordada");

  if (resolvedDate) {
    contentWithVars = contentWithVars.replace(
      /\{\{DATA_AGENDAMENTO\}\}/g,
      resolvedTime ? `${resolvedDate} (${resolvedTime})` : resolvedDate,
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

  const finalContent = data.extraNotes?.trim()
    ? `${contentWithVars}<h4>Observações Adicionais</h4><p>${data.extraNotes.trim()}</p>`
    : contentWithVars;

  // Avoid unique constraint collision if booking already had a contract
  const safeBookingId = booking && !booking.contract ? booking.id : undefined;

  const contract = await prisma.contract.create({
    data: {
      clientId: data.clientId,
      bookingId: safeBookingId,
      scheduleId: data.scheduleId || undefined,
      content: finalContent,
      serviceName: finalServiceName,
      serviceDetails: data.serviceDetails?.trim() || null,
      serviceDate: resolvedDate || null,
      serviceTime: resolvedTime || null,
      serviceProfessional: resolvedProf || null,
      totalValue:
        data.totalValue !== undefined &&
        data.totalValue !== null &&
        !Number.isNaN(data.totalValue)
          ? data.totalValue
          : calculatedPrice > 0
            ? calculatedPrice
            : null,
      monthlyValue:
        data.monthlyValue !== undefined &&
        data.monthlyValue !== null &&
        !Number.isNaN(data.monthlyValue)
          ? data.monthlyValue
          : null,
      dailyValue:
        data.dailyValue !== undefined &&
        data.dailyValue !== null &&
        !Number.isNaN(data.dailyValue)
          ? data.dailyValue
          : null,
      validityMonths: data.validityMonths ?? null,
      validityDescription: cleanValidity,
      workRegime: cleanRegime,
    },
  });

  if (client.email) {
    try {
      const { EmailService } = await import("@/domain/services/EmailService");
      const contractUrl = process.env.NEXT_PUBLIC_APP_URL
        ? `${process.env.NEXT_PUBLIC_APP_URL}/portal/contratos`
        : "https://vitababy.com.br/portal/contratos";

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
    clientId?: string;
    content?: string;
    serviceName?: string | null;
    serviceDetails?: string | null;
    serviceDate?: string | null;
    serviceTime?: string | null;
    serviceProfessional?: string | null;
    totalValue?: number | null;
    monthlyValue?: number | null;
    dailyValue?: number | null;
    validityMonths?: number | null;
    validityDescription?: string | null;
    workRegime?: string | null;
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

  const parseSafeFloat = (val: number | null | undefined) => {
    if (val === undefined) return undefined;
    if (val === null || Number.isNaN(val)) return null;
    return val;
  };

  const updated = await prisma.contract.update({
    where: { id },
    data: {
      clientId: data.clientId || existing.clientId,
      content: data.content !== undefined ? data.content : existing.content,
      serviceName:
        data.serviceName !== undefined
          ? data.serviceName?.trim() || null
          : existing.serviceName,
      serviceDetails:
        data.serviceDetails !== undefined
          ? data.serviceDetails?.trim() || null
          : existing.serviceDetails,
      serviceDate:
        data.serviceDate !== undefined
          ? formatDateDisplay(data.serviceDate) || null
          : existing.serviceDate,
      serviceTime:
        data.serviceTime !== undefined
          ? data.serviceTime?.trim() || null
          : existing.serviceTime,
      serviceProfessional:
        data.serviceProfessional !== undefined
          ? data.serviceProfessional?.trim() || null
          : existing.serviceProfessional,
      totalValue: parseSafeFloat(data.totalValue),
      monthlyValue: parseSafeFloat(data.monthlyValue),
      dailyValue: parseSafeFloat(data.dailyValue),
      validityMonths:
        data.validityMonths !== undefined
          ? data.validityMonths
          : existing.validityMonths,
      validityDescription:
        data.validityDescription !== undefined
          ? data.validityDescription?.trim() || null
          : existing.validityDescription,
      workRegime:
        data.workRegime !== undefined
          ? data.workRegime?.trim() || null
          : existing.workRegime,
    },
  });

  revalidatePath("/admin/contratos");
  revalidatePath(`/contrato/${id}`);
  if (existing.signToken) {
    revalidatePath(`/assinar/${existing.signToken}`);
  }
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
          professional: true,
          packages: { include: { service: true } },
          scheduleSlot: { include: { professional: true } },
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });
}

export async function generateSignLink(contractId: string) {
  const contract = await prisma.contract.findUnique({
    where: { id: contractId },
    select: {
      id: true,
      signedByClient: true,
      signToken: true,
      signTokenExpiresAt: true,
    },
  });

  if (!contract) {
    throw new Error("Contrato não encontrado.");
  }

  if (contract.signedByClient) {
    throw new Error("Este contrato já foi assinado pelo cliente.");
  }

  const crypto = await import("node:crypto");
  const token = crypto.randomBytes(16).toString("hex");
  const expiresAt = new Date(Date.now() + 12 * 60 * 60 * 1000); // 12 horas de validade

  await prisma.contract.update({
    where: { id: contractId },
    data: {
      signToken: token,
      signTokenExpiresAt: expiresAt,
    },
  });

  revalidatePath("/admin/contratos");
  return { success: true, token, expiresAt };
}
