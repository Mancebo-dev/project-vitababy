"use server";

import crypto from "node:crypto";
import type { Client } from "@prisma/client";
import { hashPassword } from "better-auth/crypto";
import { revalidatePath } from "next/cache";
import { prisma } from "@/infrastructure/db/prisma";

export type ClientFormData = {
  name: string;
  phone: string;
  email?: string | null;
  cpf?: string | null;
  childName?: string | null;
  zipCode?: string | null;
  street?: string | null;
  number?: string | null;
  neighborhood?: string | null;
  city?: string | null;
  state?: string | null;
  complement?: string | null;
  address?: string | null;
  password?: string | null;
};

export type ClientActionResult = {
  success: boolean;
  error?: string;
  client?: Client;
};

function sanitizeString(val?: string | null): string | null {
  if (!val) return null;
  const trimmed = val.trim();
  return trimmed === "" ? null : trimmed;
}

function normalizeEmail(email?: string | null): string | null {
  const sanitized = sanitizeString(email);
  if (!sanitized) return null;
  return sanitized
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();
}

export async function createClient(
  data: ClientFormData,
): Promise<ClientActionResult> {
  try {
    const name = data.name?.trim();
    if (!name) return { success: false, error: "Nome é obrigatório." };
    const phone = data.phone?.trim();
    if (!phone) return { success: false, error: "Telefone é obrigatório." };

    const email = normalizeEmail(data.email);
    const cpf = sanitizeString(data.cpf);
    const childName = sanitizeString(data.childName);
    const zipCode = sanitizeString(data.zipCode);
    const street = sanitizeString(data.street);
    const number = sanitizeString(data.number);
    const neighborhood = sanitizeString(data.neighborhood);
    const city = sanitizeString(data.city);
    const state = sanitizeString(data.state)?.toUpperCase() || null;
    const complement = sanitizeString(data.complement);
    const address = sanitizeString(data.address);
    const password = sanitizeString(data.password);

    // Validação de unicidade
    if (email) {
      const existingEmail = await prisma.client.findFirst({
        where: { email },
      });
      if (existingEmail) {
        return {
          success: false,
          error: `Já existe um cliente cadastrado com o e-mail: ${email}`,
        };
      }
    }

    if (cpf) {
      const existingCpf = await prisma.client.findFirst({
        where: { cpf },
      });
      if (existingCpf) {
        return {
          success: false,
          error: `Já existe um cliente cadastrado com o CPF: ${cpf}`,
        };
      }
    }

    const client = await prisma.client.create({
      data: {
        name,
        phone,
        email,
        cpf,
        childName,
        zipCode,
        street,
        number,
        neighborhood,
        city,
        state,
        complement,
        address,
      },
    });

    if (email) {
      try {
        let targetPassword = password;
        if (!targetPassword) {
          const cleanCpf = cpf ? cpf.replace(/\D/g, "") : "";
          const isDummyCpf = !cleanCpf || cleanCpf.replace(/0/g, "") === "";
          if (cleanCpf.length >= 8 && !isDummyCpf) {
            targetPassword = cleanCpf;
          } else {
            targetPassword = "clientevitababy";
          }
        }

        const hashedPassword = await hashPassword(targetPassword);

        let user = await prisma.user.findUnique({ where: { email } });
        if (!user) {
          const userId = crypto.randomUUID();
          user = await prisma.user.create({
            data: {
              id: userId,
              name,
              email,
              emailVerified: true,
              role: "client",
              createdAt: new Date(),
              updatedAt: new Date(),
            },
          });

          await prisma.account.create({
            data: {
              id: crypto.randomUUID(),
              accountId: userId,
              providerId: "credential",
              userId: userId,
              password: hashedPassword,
              createdAt: new Date(),
              updatedAt: new Date(),
            },
          });
        } else {
          await prisma.user.update({
            where: { id: user.id },
            data: { role: "client", name },
          });

          const acc = await prisma.account.findFirst({
            where: { userId: user.id, providerId: "credential" },
          });
          if (acc && password) {
            await prisma.account.update({
              where: { id: acc.id },
              data: { password: hashedPassword, updatedAt: new Date() },
            });
          } else if (!acc) {
            await prisma.account.create({
              data: {
                id: crypto.randomUUID(),
                accountId: user.id,
                providerId: "credential",
                userId: user.id,
                password: hashedPassword,
                createdAt: new Date(),
                updatedAt: new Date(),
              },
            });
          }
        }

        const existingClientWithUser = await prisma.client.findFirst({
          where: { userId: user.id, id: { not: client.id } },
        });
        if (!existingClientWithUser) {
          await prisma.client.update({
            where: { id: client.id },
            data: { userId: user.id },
          });
        }
      } catch (error) {
        console.error("Error creating user account for client:", error);
      }
    }

    revalidatePath("/admin/clientes");
    return { success: true, client };
  } catch (error: unknown) {
    console.error("Erro ao criar cliente:", error);
    const err = error as { code?: string; message?: string } | undefined;
    if (err?.code === "P2002") {
      return {
        success: false,
        error: "Já existe um cliente cadastrado com este e-mail ou CPF.",
      };
    }
    return {
      success: false,
      error: err?.message || "Ocorreu um erro ao criar o cliente.",
    };
  }
}

export async function updateClient(
  id: string,
  data: ClientFormData,
): Promise<ClientActionResult> {
  try {
    const name = data.name?.trim();
    if (!name) return { success: false, error: "Nome é obrigatório." };
    const phone = data.phone?.trim();
    if (!phone) return { success: false, error: "Telefone é obrigatório." };

    const email = normalizeEmail(data.email);
    const cpf = sanitizeString(data.cpf);
    const childName = sanitizeString(data.childName);
    const zipCode = sanitizeString(data.zipCode);
    const street = sanitizeString(data.street);
    const number = sanitizeString(data.number);
    const neighborhood = sanitizeString(data.neighborhood);
    const city = sanitizeString(data.city);
    const state = sanitizeString(data.state)?.toUpperCase() || null;
    const complement = sanitizeString(data.complement);
    const address = sanitizeString(data.address);
    const password = sanitizeString(data.password);

    // Validação de unicidade contra outros clientes
    if (email) {
      const existingEmail = await prisma.client.findFirst({
        where: { email, id: { not: id } },
      });
      if (existingEmail) {
        return {
          success: false,
          error: `Já existe outro cliente cadastrado com o e-mail: ${email}`,
        };
      }
    }

    if (cpf) {
      const existingCpf = await prisma.client.findFirst({
        where: { cpf, id: { not: id } },
      });
      if (existingCpf) {
        return {
          success: false,
          error: `Já existe outro cliente cadastrado com o CPF: ${cpf}`,
        };
      }
    }

    const client = await prisma.client.update({
      where: { id },
      data: {
        name,
        phone,
        email,
        cpf,
        childName,
        zipCode,
        street,
        number,
        neighborhood,
        city,
        state,
        complement,
        address,
      },
    });

    if (client.userId) {
      try {
        // Sincroniza usuário e senha
        if (email) {
          const userWithSameEmail = await prisma.user.findFirst({
            where: { email, id: { not: client.userId } },
          });
          if (userWithSameEmail) {
            return {
              success: false,
              error: `O e-mail ${email} já está em uso por outro usuário no sistema.`,
            };
          }
        }

        await prisma.user.update({
          where: { id: client.userId },
          data: {
            name,
            ...(email ? { email } : {}),
            role: "client",
          },
        });

        if (password) {
          const hashedPassword = await hashPassword(password);
          const acc = await prisma.account.findFirst({
            where: { userId: client.userId, providerId: "credential" },
          });
          if (acc) {
            await prisma.account.update({
              where: { id: acc.id },
              data: { password: hashedPassword, updatedAt: new Date() },
            });
          } else {
            await prisma.account.create({
              data: {
                id: crypto.randomUUID(),
                accountId: client.userId,
                providerId: "credential",
                userId: client.userId,
                password: hashedPassword,
                createdAt: new Date(),
                updatedAt: new Date(),
              },
            });
          }
        }
      } catch (userErr: unknown) {
        console.error("Erro ao sincronizar usuário do cliente:", userErr);
        const err = userErr as { code?: string } | undefined;
        if (err?.code === "P2002") {
          return {
            success: false,
            error: "O e-mail informado já está em uso por outro usuário.",
          };
        }
      }
    } else if (email) {
      // Cliente não tinha usuário, cria com a senha informada ou padrão
      try {
        let targetPassword = password;
        if (!targetPassword) {
          const cleanCpf = cpf ? cpf.replace(/\D/g, "") : "";
          const isDummyCpf = !cleanCpf || cleanCpf.replace(/0/g, "") === "";
          if (cleanCpf.length >= 8 && !isDummyCpf) {
            targetPassword = cleanCpf;
          } else {
            targetPassword = "clientevitababy";
          }
        }

        const hashedPassword = await hashPassword(targetPassword);
        let user = await prisma.user.findUnique({ where: { email } });
        if (!user) {
          const userId = crypto.randomUUID();
          user = await prisma.user.create({
            data: {
              id: userId,
              name,
              email,
              emailVerified: true,
              role: "client",
              createdAt: new Date(),
              updatedAt: new Date(),
            },
          });

          await prisma.account.create({
            data: {
              id: crypto.randomUUID(),
              accountId: userId,
              providerId: "credential",
              userId: userId,
              password: hashedPassword,
              createdAt: new Date(),
              updatedAt: new Date(),
            },
          });
        } else {
          await prisma.user.update({
            where: { id: user.id },
            data: { role: "client", name },
          });
          if (password) {
            const acc = await prisma.account.findFirst({
              where: { userId: user.id, providerId: "credential" },
            });
            if (acc) {
              await prisma.account.update({
                where: { id: acc.id },
                data: { password: hashedPassword, updatedAt: new Date() },
              });
            } else {
              await prisma.account.create({
                data: {
                  id: crypto.randomUUID(),
                  accountId: user.id,
                  providerId: "credential",
                  userId: user.id,
                  password: hashedPassword,
                  createdAt: new Date(),
                  updatedAt: new Date(),
                },
              });
            }
          }
        }

        const existingClientWithUser = await prisma.client.findFirst({
          where: { userId: user.id, id: { not: client.id } },
        });
        if (!existingClientWithUser) {
          await prisma.client.update({
            where: { id: client.id },
            data: { userId: user.id },
          });
        }
      } catch (error) {
        console.error(
          "Error creating/linking user during client update:",
          error,
        );
      }
    }

    revalidatePath("/admin/clientes");
    revalidatePath(`/admin/clientes/${id}`);
    return { success: true, client };
  } catch (error: unknown) {
    console.error("Erro ao atualizar cliente:", error);
    const err = error as { code?: string; message?: string } | undefined;
    if (err?.code === "P2002") {
      return {
        success: false,
        error: "Já existe outro cliente com este e-mail ou CPF cadastrado.",
      };
    }
    return {
      success: false,
      error: err?.message || "Ocorreu um erro ao atualizar o cliente.",
    };
  }
}

export async function deleteClient(id: string): Promise<ClientActionResult> {
  try {
    await prisma.client.delete({
      where: { id },
    });
    revalidatePath("/admin/clientes");
    return { success: true };
  } catch (error: unknown) {
    console.error("Erro ao excluir cliente:", error);
    const err = error as { message?: string } | undefined;
    return {
      success: false,
      error:
        err?.message ||
        "Erro ao excluir o cliente. Verifique se ele não possui registros vinculados.",
    };
  }
}

export async function createConsultationNote(data: {
  clientId: string;
  title: string;
  content: string;
  sombraNotes?: string;
  professionalId: string;
}) {
  const note = await prisma.consultationNote.create({
    data: {
      clientId: data.clientId,
      professionalId: data.professionalId,
      title: data.title,
      content: data.content,
      sombraNotes: data.sombraNotes,
    },
  });

  revalidatePath(`/admin/clientes/${data.clientId}`);
  return note;
}

export async function uploadClientFileAction(formData: FormData) {
  const file = formData.get("file") as File;
  const clientId = formData.get("clientId") as string;
  const title = formData.get("title") as string;
  const description = formData.get("description") as string;
  const uploadedBy = formData.get("uploadedBy") as string;

  if (!file || !clientId || !title) {
    throw new Error("Dados incompletos");
  }

  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);

  const base64Str = buffer.toString("base64");
  const mimeType = file.type || "application/octet-stream";
  const fileUrl = `data:${mimeType};base64,${base64Str}`;

  const clientFile = await prisma.clientFile.create({
    data: {
      clientId,
      title,
      description,
      fileUrl,
      fileType: file.type || "application/octet-stream",
      uploadedBy,
    },
  });

  revalidatePath(`/admin/clientes/${clientId}`);
  revalidatePath(`/portal/exames`);

  return { success: true, clientFile };
}
