import {
  CheckCircle2,
  Clock,
  MessageCircle,
  ShieldAlert,
  ShieldCheck,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import {
  type ContractData,
  PDFWrapper,
} from "@/components/contracts/PDFWrapper";
import { prisma } from "@/infrastructure/db/prisma";
import { buildWhatsAppLink } from "@/utils/whatsapp";

export default async function AssinarContratoPage({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const { token } = await params;

  if (!token) {
    return <InvalidLinkView message="Nenhum código de assinatura fornecido." />;
  }

  const contract = await prisma.contract.findUnique({
    where: { signToken: token },
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

  if (!contract) {
    return (
      <InvalidLinkView message="Link de assinatura inválido ou não encontrado. Este link pode ter expirado ou já ter sido utilizado." />
    );
  }

  const client =
    contract.client || contract.booking?.client || contract.schedule?.client;
  const clientName = client?.name || "Cliente";

  // Se já foi assinado
  if (contract.signedByClient) {
    return (
      <div className="min-h-screen bg-[#fbf9f5] flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-lg border border-slate-200 p-8 text-center space-y-5">
          <div className="relative w-36 h-12 mx-auto">
            <Image
              src="/assets/logo-vita-baby.png"
              alt="Vita Baby"
              fill
              className="object-contain"
              priority
            />
          </div>
          <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-8 h-8" />
          </div>
          <div className="space-y-2">
            <h1 className="text-xl font-bold text-slate-900">
              Contrato Já Assinado!
            </h1>
            <p className="text-sm text-slate-600">
              Olá, <strong>{clientName}</strong>! Seu contrato já foi assinado
              digitalmente com sucesso{" "}
              {contract.signedAt &&
                `em ${new Date(contract.signedAt).toLocaleString("pt-BR")}`}
              .
            </p>
            <p className="text-xs text-slate-500 pt-2">
              Por medidas de segurança, este link de assinatura exclusivo já foi
              desativado.
            </p>
          </div>
          <div className="pt-2">
            <Link
              href="/"
              className="inline-flex items-center justify-center px-5 py-2.5 bg-[#af4d30] text-white rounded-xl text-sm font-semibold hover:bg-[#af4d30]/90 transition-colors w-full"
            >
              Ir para o Início
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Se o link expirou
  const isExpired =
    contract.signTokenExpiresAt && contract.signTokenExpiresAt < new Date();

  if (isExpired) {
    const expiredAtFormatted = contract.signTokenExpiresAt
      ? new Date(contract.signTokenExpiresAt).toLocaleTimeString("pt-BR", {
          hour: "2-digit",
          minute: "2-digit",
        })
      : "12 horas";

    const whatsappMessage = `Olá! Meu link de assinatura do contrato expirou (expirava às ${expiredAtFormatted}). Poderiam me enviar um novo link de assinatura, por favor?`;
    const whatsappLink = buildWhatsAppLink("5522998632616", whatsappMessage);

    return (
      <div className="min-h-screen bg-[#fbf9f5] flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-lg border border-slate-200 p-8 text-center space-y-5">
          <div className="relative w-36 h-12 mx-auto">
            <Image
              src="/assets/logo-vita-baby.png"
              alt="Vita Baby"
              fill
              className="object-contain"
              priority
            />
          </div>
          <div className="w-16 h-16 bg-amber-100 text-amber-600 rounded-full flex items-center justify-center mx-auto">
            <Clock className="w-8 h-8" />
          </div>
          <div className="space-y-2">
            <h1 className="text-xl font-bold text-slate-900">
              Link de Assinatura Expirado
            </h1>
            <p className="text-sm text-slate-600">
              Olá, <strong>{clientName}</strong>! Por motivos de segurança, os
              links de assinatura temporários têm validade de 12 horas.
            </p>
            <p className="text-xs text-slate-500">
              Este link expirou. Por favor, solicite à nossa equipe o envio de
              um novo link.
            </p>
          </div>
          <div className="pt-2">
            <a
              href={whatsappLink}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-emerald-600 text-white rounded-xl text-sm font-semibold hover:bg-emerald-700 transition-colors w-full"
            >
              <MessageCircle className="w-4 h-4" />
              Solicitar Novo Link no WhatsApp
            </a>
          </div>
        </div>
      </div>
    );
  }

  // Prepara dados do contrato para exibição
  const viewData: ContractData = {
    contractId: contract.id,
    signToken: token,
    contractNumber: contract.id.slice(-6).toUpperCase(),
    date: contract.createdAt.toLocaleDateString("pt-BR"),
    content: contract.content,
    clientName,
    clientEmail: client?.email || "",
    clientPhone: client?.phone || "",
    clientAddress: client?.street
      ? `${client.street}, ${client.number || "S/N"}${client.complement ? ` - ${client.complement}` : ""} - ${client.neighborhood || ""} - ${client.city || ""}/${client.state || ""}${client.zipCode ? ` - CEP: ${client.zipCode}` : ""}`
      : client?.address || "",
    serviceName: "",
    serviceDetails: "",
    isSigned: false,
    isAdmin: false,
    imageUsageAccepted: contract.imageUsageAccepted,
    totalValue: contract.totalValue,
    monthlyValue: contract.monthlyValue,
    dailyValue: contract.dailyValue,
    validityDescription: contract.validityDescription,
    workRegime: contract.workRegime,
    signedByProf: contract.signedByProf,
    signedByProfAt: contract.signedByProfAt,
    pdfUrl: contract.pdfUrl,
  };

  // Service Name
  if (contract.serviceName !== null && contract.serviceName !== undefined) {
    viewData.serviceName = contract.serviceName;
  } else if (contract.booking) {
    viewData.serviceName =
      contract.booking.packages?.map((p) => p.name).join(" + ") || "";
  } else if (contract.schedule) {
    viewData.serviceName =
      contract.schedule.title || `Escala ${contract.schedule.month}`;
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
    viewData.serviceDetails = "Assessoria e Cuidados Materno-Infantil (Escala)";
  }

  if (contract.booking) {
    const basePrice =
      contract.booking.packages?.reduce((acc, p) => acc + (p.price || 0), 0) ||
      0;
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

  const expiresTimeFormatted = contract.signTokenExpiresAt
    ? new Date(contract.signTokenExpiresAt).toLocaleTimeString("pt-BR", {
        hour: "2-digit",
        minute: "2-digit",
      })
    : "12 horas";

  return (
    <div className="min-h-screen bg-slate-100/90 py-6 sm:py-8 font-sans">
      <div className="w-full max-w-[220mm] mx-auto px-4">
        {/* Banner de Boas-Vindas e Segurança */}
        <div className="mb-6 bg-gradient-to-r from-amber-50 to-orange-50/60 border border-amber-200 rounded-xl p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-xs">
          <div className="flex items-start sm:items-center gap-3">
            <div className="p-2 bg-white rounded-lg border border-amber-200 text-[#ae4d30] shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <p className="font-bold text-slate-900 text-sm sm:text-base">
                Assinatura Digital de Contrato
              </p>
              <p className="text-xs text-slate-600">
                Documento vinculado a{" "}
                <strong className="text-slate-900">{clientName}</strong>. Não é
                necessário fazer login.
              </p>
            </div>
          </div>
          <div className="inline-flex items-center gap-1.5 text-xs bg-white text-amber-900 px-3 py-1.5 rounded-lg border border-amber-200 font-semibold shrink-0 self-start sm:self-auto">
            <Clock className="w-3.5 h-3.5 text-amber-600" />
            Válido até {expiresTimeFormatted}
          </div>
        </div>

        <PDFWrapper data={viewData} />
      </div>
    </div>
  );
}

function InvalidLinkView({ message }: { message: string }) {
  const whatsappLink = buildWhatsAppLink(
    "5522998632616",
    "Olá! Estou com dificuldades com o link de assinatura do meu contrato Vita Baby. Poderiam me ajudar?",
  );

  return (
    <div className="min-h-screen bg-[#fbf9f5] flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-lg border border-slate-200 p-8 text-center space-y-5">
        <div className="relative w-36 h-12 mx-auto">
          <Image
            src="/assets/logo-vita-baby.png"
            alt="Vita Baby"
            fill
            className="object-contain"
            priority
          />
        </div>
        <div className="w-16 h-16 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto">
          <ShieldAlert className="w-8 h-8" />
        </div>
        <div className="space-y-2">
          <h1 className="text-xl font-bold text-slate-900">
            Link Não Encontrado
          </h1>
          <p className="text-sm text-slate-600">{message}</p>
        </div>
        <div className="pt-2">
          <a
            href={whatsappLink}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-emerald-600 text-white rounded-xl text-sm font-semibold hover:bg-emerald-700 transition-colors w-full"
          >
            <MessageCircle className="w-4 h-4" />
            Falar com a Vita Baby no WhatsApp
          </a>
        </div>
      </div>
    </div>
  );
}
