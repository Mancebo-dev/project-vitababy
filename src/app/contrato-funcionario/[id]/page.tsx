import { headers } from "next/headers";
import { notFound, redirect } from "next/navigation";
import {
  type EmployeeContractViewData,
  EmployeePDFWrapper,
} from "@/components/contracts/EmployeePDFWrapper";
import { auth } from "@/infrastructure/auth/auth";
import { prisma } from "@/infrastructure/db/prisma";

export default async function ContratoFuncionarioPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams?: Promise<{ token?: string; preview?: string }>;
}) {
  const { id } = await params;
  const query = searchParams ? await searchParams : undefined;

  if (query?.token) {
    redirect(`/assinar-funcionario/${query.token}`);
  }

  const headersList = await headers();
  const session = await auth.api
    .getSession({ headers: headersList })
    .catch(() => null);

  const user = session?.user?.id
    ? await prisma.user
        .findUnique({
          where: { id: session.user.id },
        })
        .catch(() => null)
    : null;

  const isAdmin = user?.role === "admin";
  const isPreview = query?.preview === "1";

  const contract = await prisma.employeeContract.findUnique({
    where: { id },
    include: {
      employee: true,
    },
  });

  if (!contract) {
    notFound();
  }

  if (!contract.signedByEmployee && !isAdmin && !isPreview) {
    let token = contract.signToken;
    const isExpired =
      contract.signTokenExpiresAt && contract.signTokenExpiresAt < new Date();

    if (!token || isExpired) {
      const crypto = await import("node:crypto");
      token = crypto.randomBytes(16).toString("hex");
      const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000);

      await prisma.employeeContract.update({
        where: { id: contract.id },
        data: {
          signToken: token,
          signTokenExpiresAt: expiresAt,
        },
      });
    }

    redirect(`/assinar-funcionario/${token}`);
  }

  const emp = contract.employee;
  const fullAddress = emp.street
    ? `${emp.street}, ${emp.number || "S/N"}${emp.complement ? ` - ${emp.complement}` : ""} - ${emp.neighborhood || ""} - ${emp.city || ""}/${emp.state || ""}${emp.zipCode ? ` - CEP: ${emp.zipCode}` : ""}`
    : "";

  const viewData: EmployeeContractViewData = {
    contractId: contract.id,
    signToken: contract.signToken || undefined,
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
    signedByEmployee: contract.signedByEmployee,
    signedAt: contract.signedAt,
    employeeIp: contract.employeeIp,
    signedByCompany: contract.signedByCompany,
    signedByCompanyAt: contract.signedByCompanyAt,
    isAdmin,
  };

  return (
    <div className="min-h-screen bg-slate-100/90 py-8 font-sans">
      <div className="w-full max-w-[220mm] mx-auto px-4">
        <EmployeePDFWrapper data={viewData} />
      </div>
    </div>
  );
}
