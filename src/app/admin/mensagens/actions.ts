"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/infrastructure/db/prisma";

export async function markAsRead(id: string) {
  try {
    await prisma.contactMessage.update({
      where: { id },
      data: { status: "READ" },
    });
    revalidatePath("/admin/mensagens");
  } catch (error) {
    console.error("Error marking message as read:", error);
  }
}

export async function markAsUnread(id: string) {
  try {
    await prisma.contactMessage.update({
      where: { id },
      data: { status: "UNREAD" },
    });
    revalidatePath("/admin/mensagens");
  } catch (error) {
    console.error("Error marking message as unread:", error);
  }
}

export async function deleteMessage(id: string) {
  try {
    await prisma.contactMessage.delete({
      where: { id },
    });
    revalidatePath("/admin/mensagens");
  } catch (error) {
    console.error("Error deleting message:", error);
  }
}
