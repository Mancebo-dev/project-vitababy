"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/infrastructure/db/prisma";

export async function submitContactForm(
  _prevState: unknown,
  formData: FormData,
) {
  try {
    const name = formData.get("name") as string;
    const email = formData.get("email") as string;
    const phone = formData.get("phone") as string;
    const service = formData.get("service") as string;
    const message = formData.get("message") as string;

    if (!name || !email || !phone || !message) {
      return { error: "Por favor, preencha todos os campos obrigatórios." };
    }

    await prisma.contactMessage.create({
      data: {
        name,
        email,
        phone,
        service,
        message,
      },
    });

    revalidatePath("/admin/mensagens");

    return {
      success: "Mensagem enviada com sucesso! Entraremos em contato em breve.",
    };
  } catch (error) {
    console.error("Contact Form Error:", error);
    return {
      error:
        "Ocorreu um erro ao enviar sua mensagem. Tente novamente mais tarde.",
    };
  }
}
