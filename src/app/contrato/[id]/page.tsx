import { headers } from "next/headers";
import { notFound, redirect } from "next/navigation";
import {
  type ContractData,
  PDFWrapper,
} from "@/components/contracts/PDFWrapper";
import { auth } from "@/infrastructure/auth/auth";
import { prisma } from "@/infrastructure/db/prisma";

export default async function ContratoPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams?: Promise<{ token?: string; preview?: string }>;
}) {
  const { id } = await params;
  const query = searchParams ? await searchParams : undefined;

  if (query?.token) {
    redirect(`/assinar/${query.token}`);
  }

  const headersList = await headers();
  const session = await auth.api
    .getSession({ headers: headersList })
    .catch(() => null);

  const user = session?.user?.id
    ? await prisma.user
        .findUnique({
          where: { id: session.user.id },
          include: { clientProfile: true },
        })
        .catch(() => null)
    : null;

  const isAdmin = user?.role === "admin";
  const isPreview = query?.preview === "1";

  // Busca contrato emitido
  const contract = await prisma.contract.findUnique({
    where: { id },
    include: {
      client: true,
      schedule: { include: { client: true } },
      booking: {
        include: {
          client: true,
          professional: true,
          packages: { include: { service: true } },
          scheduleSlot: { include: { professional: true } },
        },
      },
    },
  });

  // Basic placeholders para templates ou contratos
  const viewData: ContractData = {
    contractNumber: "[NÚMERO DO CONTRATO]",
    date: "[DATA DE GERAÇÃO]",
    content: "",
    clientName: "[NOME DO CLIENTE]",
    clientEmail: "[EMAIL DO CLIENTE]",
    clientPhone: "[TELEFONE DO CLIENTE]",
    clientAddress: "[ENDEREÇO COMPLETO DO CLIENTE]",
    serviceName: "[NOME DO SERVIÇO/PACOTE]",
    serviceDetails: "[DETALHES DO SERVIÇO]",
    serviceDate: "[DATA DO ATENDIMENTO]",
    serviceTime: "[HORÁRIO DO ATENDIMENTO]",
    serviceProfessional: "[NOME DA PROFISSIONAL]",
    serviceValue: "[VALOR DO SERVIÇO]",
  };

  let isTemplate = false;

  if (contract) {
    // Se o contrato AINDA NÃO foi assinado pelo cliente:
    if (!contract.signedByClient) {
      // Se não for admin e não for preview explícito do admin,
      // redireciona para a página de assinatura direta sem login (/assinar/[token])
      if (!isAdmin && !isPreview) {
        let token = contract.signToken;
        const isExpired =
          contract.signTokenExpiresAt &&
          contract.signTokenExpiresAt < new Date();

        if (!token || isExpired) {
          const crypto = await import("node:crypto");
          token = crypto.randomBytes(16).toString("hex");
          const expiresAt = new Date(Date.now() + 60 * 60 * 1000); // 1h

          await prisma.contract.update({
            where: { id: contract.id },
            data: {
              signToken: token,
              signTokenExpiresAt: expiresAt,
            },
          });
        }

        redirect(`/assinar/${token}`);
      }
    }

    viewData.contractId = contract.id;
    viewData.signToken = contract.signToken || undefined;
    viewData.isSigned = contract.signedByClient;
    viewData.signedAt = contract.signedAt;
    viewData.clientIp = contract.clientIp;
    viewData.signedByProf = contract.signedByProf;
    viewData.signedByProfAt = contract.signedByProfAt;
    viewData.pdfUrl = contract.pdfUrl;
    viewData.isAdmin = isAdmin;

    viewData.totalValue = contract.totalValue;
    viewData.monthlyValue = contract.monthlyValue;
    viewData.dailyValue = contract.dailyValue;
    viewData.validityDescription = contract.validityDescription;
    viewData.workRegime = contract.workRegime;

    viewData.content = contract.content;
    viewData.contractNumber = contract.id.slice(-6).toUpperCase();
    viewData.date = contract.createdAt.toLocaleDateString("pt-BR");

    const client =
      contract.client || contract.booking?.client || contract.schedule?.client;
    if (client) {
      viewData.clientName = client.name;
      viewData.clientEmail = client.email || "";
      viewData.clientPhone = client.phone || "";
      viewData.clientAddress = client.street
        ? `${client.street}, ${client.number || "S/N"}${client.complement ? ` - ${client.complement}` : ""} - ${client.neighborhood || ""} - ${client.city || ""}/${client.state || ""}${client.zipCode ? ` - CEP: ${client.zipCode}` : ""}`
        : client.address || "";
    }

    viewData.imageUsageAccepted = contract.imageUsageAccepted;

    // Service Name
    if (contract.serviceName !== null && contract.serviceName !== undefined) {
      viewData.serviceName = contract.serviceName;
    } else if (contract.booking) {
      viewData.serviceName =
        contract.booking.packages?.map((p) => p.name).join(" + ") || "";
    } else if (contract.schedule) {
      viewData.serviceName =
        contract.schedule.title || `Escala ${contract.schedule.month}`;
    } else {
      viewData.serviceName = "";
    }

    // Service Details
    if (
      contract.serviceDetails !== null &&
      contract.serviceDetails !== undefined
    ) {
      viewData.serviceDetails = contract.serviceDetails;
    } else if (contract.booking) {
      viewData.serviceDetails =
        contract.booking.packages
          ?.map((p) => p.service?.name)
          .filter(Boolean)
          .join(" + ") || "";
    } else if (contract.schedule) {
      viewData.serviceDetails =
        "Assessoria e Cuidados Materno-Infantil (Escala)";
    } else {
      viewData.serviceDetails = "";
    }

    if (contract.booking) {
      const basePrice =
        contract.booking.packages?.reduce(
          (acc, p) => acc + (p.price || 0),
          0,
        ) || 0;
      const transport = contract.booking.transportFee || 0;
      const total = basePrice + transport;
      if (!viewData.totalValue && total > 0) {
        viewData.totalValue = total;
      }

      if (contract.booking.scheduleSlot) {
        const d = new Date(contract.booking.scheduleSlot.date);
        viewData.serviceDate = d.toLocaleDateString("pt-BR");
        viewData.serviceTime = contract.booking.scheduleSlot.startTime || "";
        if (contract.booking.scheduleSlot.professional) {
          viewData.serviceProfessional =
            contract.booking.scheduleSlot.professional.name;
        }
      }
    }
  } else {
    // Se não for contrato emitido, verifica se é pré-visualização de modelo (template)
    const template = await prisma.contractTemplate.findUnique({
      where: { id },
    });
    if (template) {
      isTemplate = true;
      viewData.content = template.content;
      viewData.isAdmin = isAdmin;
    } else {
      notFound();
    }
  }

  return (
    <div className="min-h-screen bg-slate-100/90 py-8 font-sans">
      <div className="w-full max-w-[220mm] mx-auto px-4">
        {isTemplate && (
          <div className="mb-6 max-w-[210mm] mx-auto bg-blue-50 border border-blue-200 border-l-4 border-l-blue-500 rounded-lg p-4 shadow-xs">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg
                  className="h-5 w-5 text-blue-500"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  aria-label="Aviso"
                  role="img"
                >
                  <path
                    fillRule="evenodd"
                    d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-blue-800 font-medium">
                  Modo de pré-visualização de template. Este não é um contrato
                  assinado. Os dados exibidos são ilustrativos.
                </p>
              </div>
            </div>
          </div>
        )}

        <PDFWrapper data={viewData} />
      </div>
    </div>
  );
}
