"use server";

import { revalidatePath } from "next/cache";
import { headers } from "next/headers";
import { auth } from "@/infrastructure/auth/auth";
import { prisma } from "@/infrastructure/db/prisma";

export async function signContractAction(
  contractId: string,
  imageUsageAccepted?: boolean,
) {
  const headersList = await headers();
  const session = await auth.api.getSession({ headers: headersList });
  if (!session?.user) {
    throw new Error("Você precisa estar autenticado para assinar o contrato.");
  }

  const clientIp =
    headersList.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    headersList.get("x-real-ip") ||
    "IP Registrado";

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    include: { clientProfile: true },
  });

  const contract = await prisma.contract.findUnique({
    where: { id: contractId },
    include: {
      client: true,
      booking: { include: { client: true } },
    },
  });

  if (!contract) {
    throw new Error("Contrato não encontrado.");
  }

  const isClient =
    contract.clientId === user?.clientProfile?.id ||
    contract.booking?.clientId === user?.clientProfile?.id ||
    contract.client?.userId === user?.id ||
    contract.booking?.client?.userId === user?.id;

  const isAdmin = user?.role === "admin";

  if (!isClient && !isAdmin) {
    throw new Error("Acesso não autorizado para assinar este contrato.");
  }

  const updatedContract = await prisma.contract.update({
    where: { id: contractId },
    data: {
      signedByClient: true,
      signedAt: new Date(),
      clientIp,
      imageUsageAccepted: imageUsageAccepted ?? false,
    },
    include: {
      client: true,
      booking: { include: { client: true } },
    },
  });

  const recipientEmail =
    updatedContract.client?.email || updatedContract.booking?.client?.email;
  const recipientName =
    updatedContract.client?.name ||
    updatedContract.booking?.client?.name ||
    "Cliente";

  if (recipientEmail) {
    try {
      const { EmailService } = await import("@/domain/services/EmailService");
      const portalUrl = process.env.NEXT_PUBLIC_APP_URL
        ? `${process.env.NEXT_PUBLIC_APP_URL}/portal/contratos`
        : "http://localhost:3000/portal/contratos";

      await EmailService.sendContractSigned(
        recipientEmail,
        recipientName,
        portalUrl,
      );
    } catch (e) {
      console.error("Erro ao enviar email de notificação:", e);
    }
  }

  revalidatePath(`/contrato/${contractId}`);
  revalidatePath("/admin/contratos");
  revalidatePath("/portal/contratos");

  return { success: true };
}

export async function signContractByProfAction(contractId: string) {
  const headersList = await headers();
  const session = await auth.api.getSession({ headers: headersList });
  if (!session?.user) {
    throw new Error("Você precisa estar autenticado.");
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
  });

  if (user?.role !== "admin") {
    throw new Error("Apenas administradores podem assinar pela Contratada.");
  }

  await prisma.contract.update({
    where: { id: contractId },
    data: {
      signedByProf: true,
      signedByProfAt: new Date(),
    },
  });

  revalidatePath(`/contrato/${contractId}`);
  revalidatePath("/admin/contratos");

  return { success: true };
}

export async function signContractWithTokenAction(
  token: string,
  imageUsageAccepted: boolean,
) {
  if (!token) {
    throw new Error("Token de assinatura inválido.");
  }

  const contract = await prisma.contract.findUnique({
    where: { signToken: token },
    include: {
      client: true,
      booking: { include: { client: true } },
    },
  });

  if (!contract) {
    throw new Error("Link de assinatura inválido ou não encontrado.");
  }

  if (contract.signedByClient) {
    throw new Error("Este contrato já foi assinado digitalmente.");
  }

  if (contract.signTokenExpiresAt && contract.signTokenExpiresAt < new Date()) {
    throw new Error(
      "Este link de assinatura temporário expirou (validade de 12 horas). Solicite um novo link à equipe da Vita Baby.",
    );
  }

  const headersList = await headers();
  const clientIp =
    headersList.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    headersList.get("x-real-ip") ||
    "IP Registrado";

  // Desativa o link temporário no ato da assinatura
  const updatedContract = await prisma.contract.update({
    where: { id: contract.id },
    data: {
      signedByClient: true,
      signedAt: new Date(),
      clientIp,
      imageUsageAccepted: imageUsageAccepted ?? false,
      signTokenExpiresAt: new Date(0), // Link desativado/expirado
    },
    include: {
      client: true,
      booking: { include: { client: true } },
    },
  });

  const recipientEmail =
    updatedContract.client?.email || updatedContract.booking?.client?.email;
  const recipientName =
    updatedContract.client?.name ||
    updatedContract.booking?.client?.name ||
    "Cliente";

  if (recipientEmail) {
    try {
      const { EmailService } = await import("@/domain/services/EmailService");
      const portalUrl = process.env.NEXT_PUBLIC_APP_URL
        ? `${process.env.NEXT_PUBLIC_APP_URL}/portal/contratos`
        : "http://localhost:3000/portal/contratos";

      await EmailService.sendContractSigned(
        recipientEmail,
        recipientName,
        portalUrl,
      );
    } catch (e) {
      console.error("Erro ao enviar email de notificação:", e);
    }
  }

  revalidatePath(`/assinar/${token}`);
  revalidatePath(`/contrato/${contract.id}`);
  revalidatePath("/admin/contratos");
  revalidatePath("/portal/contratos");

  return { success: true };
}
