"use server";

import { headers } from "next/headers";
import { auth } from "@/infrastructure/auth/auth";

export async function updatePasswordAction(
  currentPassword: string,
  newPassword: string,
) {
  try {
    const headersList = await headers();
    const session = await auth.api.getSession({ headers: headersList });

    if (!session?.user) {
      return { success: false, error: "Usuário não autenticado." };
    }

    // Attempt to change password
    const _result = await auth.api.changePassword({
      body: {
        newPassword,
        currentPassword,
        revokeOtherSessions: true,
      },
      headers: headersList,
    });

    // Send email notification asynchronously
    if (session.user.email) {
      import("@/domain/services/EmailService").then(({ EmailService }) => {
        EmailService.sendPasswordUpdated(
          session.user.email,
          session.user.name,
        ).catch(console.error);
      });
    }

    return { success: true };
  } catch (error: any) {
    console.error("Erro ao atualizar senha:", error);
    if (error?.status === 400 || error?.message?.includes("password")) {
      return {
        success: false,
        error: "Senha atual incorreta ou nova senha inválida.",
      };
    }
    return { success: false, error: "Ocorreu um erro ao atualizar a senha." };
  }
}

export async function updateClientProfile(
  clientId: string,
  data: { phone: string; zipCode: string; address: string },
) {
  try {
    const headersList = await headers();
    const session = await auth.api.getSession({ headers: headersList });

    if (!session?.user) {
      return { success: false, error: "Usuário não autenticado." };
    }

    const { prisma } = await import("@/infrastructure/db/prisma");

    // Ensure the client belongs to the user
    const client = await prisma.client.findFirst({
      where: { id: clientId, userId: session.user.id },
    });

    if (!client) {
      return { success: false, error: "Perfil não encontrado." };
    }

    await prisma.client.update({
      where: { id: clientId },
      data: {
        phone: data.phone,
        zipCode: data.zipCode,
        address: data.address,
      },
    });

    return { success: true };
  } catch (error: any) {
    console.error("Erro ao atualizar perfil:", error);
    return { success: false, error: "Ocorreu um erro ao atualizar os dados." };
  }
}
