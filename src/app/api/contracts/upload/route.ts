import { writeFile } from "node:fs/promises";
import { join } from "node:path";
import { type NextRequest, NextResponse } from "next/server";
import { prisma } from "@/infrastructure/db/prisma";

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File;
    const contractId = formData.get("contractId") as string;
    const clientIp = request.headers.get("x-forwarded-for") || "Unknown IP";

    if (!file || !contractId) {
      return NextResponse.json(
        { error: "Faltam parâmetros obrigatórios." },
        { status: 400 },
      );
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Save to public/uploads directory
    const fileName = `contrato-${contractId}.pdf`;
    const path = join(process.cwd(), "public/uploads", fileName);

    await writeFile(path, buffer);
    const pdfUrl = `/uploads/${fileName}`;

    // Update contract in database (cast to any temporarily until prisma generate is run)
    const updatedContract = await (prisma.contract as any).update({
      where: { id: contractId },
      data: {
        signedByClient: true,
        signedAt: new Date(),
        clientIp,
        pdfUrl,
      },
      include: {
        booking: {
          include: { client: true },
        },
      },
    });

    if (updatedContract.booking?.client?.email) {
      const { EmailService } = await import("@/domain/services/EmailService");
      const portalUrl = process.env.NEXT_PUBLIC_APP_URL
        ? `${process.env.NEXT_PUBLIC_APP_URL}/portal/contratos`
        : `http://localhost:3000/portal/contratos`;

      await EmailService.sendContractSigned(
        updatedContract.booking.client.email,
        updatedContract.booking.client.name,
        portalUrl,
      );
    }

    return NextResponse.json({ success: true, pdfUrl });
  } catch (error) {
    console.error("Erro no upload do PDF:", error);
    return NextResponse.json(
      { error: "Erro interno no servidor." },
      { status: 500 },
    );
  }
}
