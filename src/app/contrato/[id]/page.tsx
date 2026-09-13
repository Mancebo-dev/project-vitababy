import { headers } from "next/headers";
import { notFound, redirect } from "next/navigation";
import { auth } from "@/infrastructure/auth/auth";
import { prisma } from "@/infrastructure/db/prisma";
import { type ContractData, PDFWrapper } from "./PDFWrapper";

export default async function ContratoPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const headersList = await headers();
  const session = await auth.api.getSession({ headers: headersList });

  if (!session?.user) {
    redirect(`/portal/login?callbackUrl=/contrato/${id}`);
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
  });

  // Try to find an actual signed contract
  const contract = await prisma.contract.findUnique({
    where: { id },
    include: {
      booking: {
        include: {
          client: true,
          professional: true,
          packages: { include: { service: true } },
          scheduleSlot: true,
        },
      },
    },
  });

  if (contract) {
    if (
      user?.role !== "admin" &&
      contract.booking?.client?.userId !== user?.id
    ) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-[#fbf9f5]">
          <h1 className="text-xl font-bold text-[#af4d30]">
            Acesso negado. Este contrato pertence a outro cliente.
          </h1>
        </div>
      );
    }
  }

  // Basic mock data for template previews
  const viewData: ContractData = {
    contractNumber: id.slice(-4).toUpperCase(),
    date: new Date().toLocaleDateString("pt-BR"),
    content: "",
    clientName: "Maria da Silva",
    clientEmail: "maria.silva@email.com",
    clientPhone: "(11) 99999-9999",
    clientAddress:
      "Rua Fictícia, 123, Bairro Centro, Cidade Exemplo - SP, CEP 00000-000",
    serviceName: "Consultoria de Sono",
    serviceDetails: "Acompanhamento personalizado para rotina de sono do bebê",
    serviceDate: "15/10 (terça)",
    serviceTime: "14:00",
    serviceProfessional: "Ana Caroline",
    serviceValue: "A combinar",
  };

  let isTemplate = false;

  if (contract?.booking) {
    viewData.contractId = contract.id;
    viewData.isSigned = contract.signedByClient;
    viewData.signedAt = contract.signedAt;
    viewData.clientIp = contract.clientIp;
    viewData.pdfUrl = contract.pdfUrl;

    viewData.content = contract.content;
    viewData.contractNumber = `00${parseInt(contract.id.slice(-8), 16).toString().slice(-4)}`; // Mock numeric ID
    viewData.date = contract.createdAt.toLocaleDateString("pt-BR");

    if (contract.booking.client) {
      const c = contract.booking.client;
      viewData.clientName = c.name;
      viewData.clientEmail = c.email || "";
      viewData.clientPhone = c.phone || "";
      viewData.clientAddress = c.street
        ? `${c.street}, ${c.number || "S/N"} ${c.complement ? ` - ${c.complement}` : ""} - ${c.neighborhood || ""} - ${c.city || ""}/${c.state || ""} - CEP: ${c.zipCode || ""}`
        : c.address || "";
    }

    viewData.serviceName =
      contract.booking.packages?.map((p) => p.name).join(" + ") ||
      viewData.serviceName;
    viewData.serviceDetails =
      contract.booking.packages
        ?.map((p) => p.service?.name)
        .filter(Boolean)
        .join(" + ") || viewData.serviceDetails;

    // Calculate Total Value
    const basePrice =
      contract.booking.packages?.reduce((acc, p) => acc + (p.price || 0), 0) ||
      0;
    const transport = contract.booking.transportFee || 0;
    const total = basePrice + transport;
    if (total > 0) {
      viewData.serviceValue = new Intl.NumberFormat("pt-BR", {
        style: "currency",
        currency: "BRL",
      }).format(total);
      if (transport > 0) {
        viewData.serviceValue += ` (inclui R$ ${transport.toFixed(2)} de deslocamento)`;
      }
    }

    if (contract.booking.scheduleSlot) {
      const d = new Date(contract.booking.scheduleSlot.date);
      viewData.serviceDate = d.toLocaleDateString("pt-BR");
      viewData.serviceTime = contract.booking.scheduleSlot.startTime;
    }
  } else {
    // If not found, check if it's a template preview
    const template = await prisma.contractTemplate.findUnique({
      where: { id },
    });
    if (template) {
      isTemplate = true;
      viewData.content = template.content;
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
