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
  type EmployeeContractViewData,
  EmployeePDFWrapper,
} from "@/components/contracts/EmployeePDFWrapper";
import { prisma } from "@/infrastructure/db/prisma";
import { buildWhatsAppLink } from "@/utils/whatsapp";

export default async function AssinarContratoFuncionarioPage({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const { token } = await params;

  if (!token) {
    return <InvalidLinkView message="Nenhum código de assinatura fornecido." />;
  }

  const contract = await prisma.employeeContract.findUnique({
    where: { signToken: token },
    include: {
      employee: true,
    },
  });

  if (!contract) {
    return (
      <InvalidLinkView message="Link de assinatura inválido ou não encontrado. Este link pode ter expirado ou já ter sido utilizado." />
    );
  }

  const emp = contract.employee;

  if (contract.signedByEmployee) {
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
              Olá, <strong>{emp.name}</strong>! Seu contrato já foi assinado
              digitalmente com sucesso{" "}
              {contract.signedAt &&
                `em ${new Date(contract.signedAt).toLocaleString("pt-BR")}`}
              .
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

  const isExpired =
    contract.signTokenExpiresAt && contract.signTokenExpiresAt < new Date();

  if (isExpired) {
    const whatsappLink = buildWhatsAppLink(
      "5522998632616",
      `Olá! Meu link de assinatura do contrato da Vita Baby expirou. Poderiam me enviar um novo link, por favor?`,
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
          <div className="w-16 h-16 bg-amber-100 text-amber-600 rounded-full flex items-center justify-center mx-auto">
            <Clock className="w-8 h-8" />
          </div>
          <div className="space-y-2">
            <h1 className="text-xl font-bold text-slate-900">
              Link de Assinatura Expirado
            </h1>
            <p className="text-sm text-slate-600">
              Olá, <strong>{emp.name}</strong>! Por motivos de segurança, este
              link de assinatura expirou. Solicite um novo link à Vita Baby.
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

  const fullAddress = emp.street
    ? `${emp.street}, ${emp.number || "S/N"}${emp.complement ? ` - ${emp.complement}` : ""} - ${emp.neighborhood || ""} - ${emp.city || ""}/${emp.state || ""}${emp.zipCode ? ` - CEP: ${emp.zipCode}` : ""}`
    : "";

  const viewData: EmployeeContractViewData = {
    contractId: contract.id,
    signToken: token,
    contractNumber: contract.id.slice(-6).toUpperCase(),
    date: contract.createdAt.toLocaleDateString("pt-BR"),
    title: contract.title,
    content: contract.content,
    employeeName: emp.name,
    employeeCpfCnpj: emp.cpfCnpj || undefined,
    employeeRg: emp.rg || undefined,
    employeeEmail: emp.email || undefined,
    employeePhone: emp.phone,
    employeeAddress: fullAddress || undefined,
    serviceType: contract.serviceType || emp.role,
    serviceDescription: contract.serviceDescription || undefined,
    contractType: contract.contractType || emp.contractType,
    billingCycle: contract.billingCycle || emp.billingCycle,
    amount: contract.amount,
    paymentMethod: contract.paymentMethod || emp.paymentMethod,
    paymentDetails: contract.paymentDetails || undefined,
    workRegime: contract.workRegime || undefined,
    startDate: contract.startDate || undefined,
    validityDescription: contract.validityDescription || undefined,
    signedByEmployee: false,
    signedByCompany: contract.signedByCompany,
    signedByCompanyAt: contract.signedByCompanyAt,
    isAdmin: false,
  };

  return (
    <div className="min-h-screen bg-slate-100/90 py-6 sm:py-8 font-sans">
      <div className="w-full max-w-[220mm] mx-auto px-4">
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
                <strong className="text-slate-900">{emp.name}</strong>. Não é
                necessário fazer login.
              </p>
            </div>
          </div>
        </div>

        <EmployeePDFWrapper data={viewData} />
      </div>
    </div>
  );
}

function InvalidLinkView({ message }: { message: string }) {
  const whatsappLink = buildWhatsAppLink(
    "5522998632616",
    "Olá! Estou com dificuldades com o link de assinatura do meu contrato Vita Baby.",
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
