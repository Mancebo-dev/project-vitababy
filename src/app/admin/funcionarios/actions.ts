"use server";

import { revalidatePath } from "next/cache";
import { headers } from "next/headers";
import { auth } from "@/infrastructure/auth/auth";
import { prisma } from "@/infrastructure/db/prisma";

async function requireAdminSession() {
  const headersList = await headers();
  const session = await auth.api.getSession({ headers: headersList });
  if (!session?.user) {
    throw new Error("Acesso não autorizado.");
  }
  return session;
}

export async function getEmployees() {
  return await prisma.employee.findMany({
    include: {
      contracts: {
        orderBy: { createdAt: "desc" },
      },
    },
    orderBy: { name: "asc" },
  });
}

export async function getEmployeeContracts() {
  return await prisma.employeeContract.findMany({
    include: {
      employee: true,
    },
    orderBy: { createdAt: "desc" },
  });
}

export async function createEmployee(data: {
  name: string;
  cpfCnpj?: string | null;
  rg?: string | null;
  email?: string | null;
  phone: string;
  role: string;
  serviceType?: string | null;
  contractType: string;
  workRegime?: string | null;
  billingCycle: string;
  amount?: number | null;
  paymentMethod: string;
  pixKey?: string | null;
  bankDetails?: string | null;
  paymentDay?: string | null;
  hireDate?: Date | string | null;
  status?: string;
  zipCode?: string | null;
  street?: string | null;
  number?: string | null;
  complement?: string | null;
  neighborhood?: string | null;
  city?: string | null;
  state?: string | null;
  notes?: string | null;
}) {
  await requireAdminSession();
  const parsedHireDate = data.hireDate ? new Date(data.hireDate) : null;

  const employee = await prisma.employee.create({
    data: {
      name: data.name.trim(),
      cpfCnpj: data.cpfCnpj?.trim() || null,
      rg: data.rg?.trim() || null,
      email: data.email?.trim() || null,
      phone: data.phone.trim(),
      role: data.role.trim(),
      serviceType: data.serviceType?.trim() || null,
      contractType: data.contractType || "PJ",
      workRegime: data.workRegime?.trim() || null,
      billingCycle: data.billingCycle || "MONTHLY",
      amount:
        data.amount !== undefined &&
        data.amount !== null &&
        !Number.isNaN(data.amount)
          ? data.amount
          : null,
      paymentMethod: data.paymentMethod || "PIX",
      pixKey: data.pixKey?.trim() || null,
      bankDetails: data.bankDetails?.trim() || null,
      paymentDay: data.paymentDay?.trim() || null,
      hireDate:
        parsedHireDate && !Number.isNaN(parsedHireDate.getTime())
          ? parsedHireDate
          : null,
      status: data.status || "ACTIVE",
      zipCode: data.zipCode?.trim() || null,
      street: data.street?.trim() || null,
      number: data.number?.trim() || null,
      complement: data.complement?.trim() || null,
      neighborhood: data.neighborhood?.trim() || null,
      city: data.city?.trim() || null,
      state: data.state?.trim() || null,
      notes: data.notes?.trim() || null,
    },
  });

  revalidatePath("/admin/funcionarios");
  return employee;
}

export async function updateEmployee(
  id: string,
  data: {
    name: string;
    cpfCnpj?: string | null;
    rg?: string | null;
    email?: string | null;
    phone: string;
    role: string;
    serviceType?: string | null;
    contractType: string;
    workRegime?: string | null;
    billingCycle: string;
    amount?: number | null;
    paymentMethod: string;
    pixKey?: string | null;
    bankDetails?: string | null;
    paymentDay?: string | null;
    hireDate?: Date | string | null;
    status?: string;
    zipCode?: string | null;
    street?: string | null;
    number?: string | null;
    complement?: string | null;
    neighborhood?: string | null;
    city?: string | null;
    state?: string | null;
    notes?: string | null;
  },
) {
  await requireAdminSession();
  const parsedHireDate = data.hireDate ? new Date(data.hireDate) : null;

  const updated = await prisma.employee.update({
    where: { id },
    data: {
      name: data.name.trim(),
      cpfCnpj: data.cpfCnpj?.trim() || null,
      rg: data.rg?.trim() || null,
      email: data.email?.trim() || null,
      phone: data.phone.trim(),
      role: data.role.trim(),
      serviceType: data.serviceType?.trim() || null,
      contractType: data.contractType || "PJ",
      workRegime: data.workRegime?.trim() || null,
      billingCycle: data.billingCycle || "MONTHLY",
      amount:
        data.amount !== undefined &&
        data.amount !== null &&
        !Number.isNaN(data.amount)
          ? data.amount
          : null,
      paymentMethod: data.paymentMethod || "PIX",
      pixKey: data.pixKey?.trim() || null,
      bankDetails: data.bankDetails?.trim() || null,
      paymentDay: data.paymentDay?.trim() || null,
      hireDate:
        parsedHireDate && !Number.isNaN(parsedHireDate.getTime())
          ? parsedHireDate
          : null,
      status: data.status || "ACTIVE",
      zipCode: data.zipCode?.trim() || null,
      street: data.street?.trim() || null,
      number: data.number?.trim() || null,
      complement: data.complement?.trim() || null,
      neighborhood: data.neighborhood?.trim() || null,
      city: data.city?.trim() || null,
      state: data.state?.trim() || null,
      notes: data.notes?.trim() || null,
    },
  });

  revalidatePath("/admin/funcionarios");
  return updated;
}

export async function deleteEmployee(id: string) {
  await requireAdminSession();
  await prisma.employee.delete({
    where: { id },
  });
  revalidatePath("/admin/funcionarios");
}

function getBillingCycleLabel(cycle?: string | null): string {
  switch (cycle) {
    case "SALARY":
      return "Salário Mensal";
    case "MONTHLY":
      return "Mensal";
    case "BIWEEKLY":
      return "Quinzenal";
    case "WEEKLY":
      return "Semanal";
    case "DAILY":
      return "Por Diária / Plantão";
    case "PER_SERVICE":
      return "Por Serviço / Demanda";
    default:
      return cycle || "Mensal";
  }
}

function getContractTypeLabel(type?: string | null): string {
  switch (type) {
    case "CLT":
      return "CLT / Vínculo Empregatício";
    case "PJ":
      return "Prestador de Serviços (PJ)";
    case "MEI":
      return "Microempreendedor Individual (MEI)";
    case "AUTONOMO":
      return "Profissional Autônomo";
    case "DIARISTA":
      return "Diarista / Plantonista";
    case "TEMPORARIO":
      return "Contrato Temporário";
    default:
      return type || "Prestação de Serviços";
  }
}

function formatDateDisplay(rawDate?: string | null): string {
  if (!rawDate) return "";
  const trimmed = rawDate.trim();
  if (!trimmed) return "";
  if (/^\d{4}-\d{2}-\d{2}$/.test(trimmed)) {
    const [y, m, d] = trimmed.split("-");
    return `${d}/${m}/${y}`;
  }
  return trimmed;
}

export async function createEmployeeContract(data: {
  employeeId: string;
  title?: string | null;
  serviceType?: string | null;
  serviceDescription?: string | null;
  contractType?: string | null;
  billingCycle?: string | null;
  amount?: number | null;
  paymentMethod?: string | null;
  paymentDetails?: string | null;
  workRegime?: string | null;
  startDate?: string | null;
  validityDescription?: string | null;
  content?: string | null;
}) {
  await requireAdminSession();
  const employee = await prisma.employee.findUnique({
    where: { id: data.employeeId },
  });
  if (!employee) throw new Error("Funcionário/Prestador não encontrado.");

  const formatBRL = (val: number) =>
    new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(val);

  const finalAmount =
    data.amount !== undefined &&
    data.amount !== null &&
    !Number.isNaN(data.amount)
      ? data.amount
      : employee.amount;

  const finalBillingCycle = data.billingCycle || employee.billingCycle;
  const finalContractType = data.contractType || employee.contractType;
  const finalServiceType =
    data.serviceType?.trim() || employee.role || "Prestação de Serviços";
  const finalServiceDesc =
    data.serviceDescription?.trim() || employee.serviceType || "";
  const finalPaymentMethod =
    data.paymentMethod?.trim() || employee.paymentMethod;
  const finalWorkRegime =
    data.workRegime?.trim() || employee.workRegime || null;
  const finalStartDate = formatDateDisplay(data.startDate) || null;
  const finalValidity = data.validityDescription?.trim() || null;

  const defaultPaymentDetails = [
    employee.pixKey ? `Chave PIX: ${employee.pixKey}` : null,
    employee.bankDetails ? `Dados Bancários: ${employee.bankDetails}` : null,
    employee.paymentDay
      ? `Vencimento/Dia de Pagamento: ${employee.paymentDay}`
      : null,
  ]
    .filter(Boolean)
    .join(" | ");

  const finalPaymentDetails =
    data.paymentDetails !== undefined
      ? data.paymentDetails?.trim() || null
      : defaultPaymentDetails || null;

  const fullAddress = [
    employee.street,
    employee.number,
    employee.complement,
    employee.neighborhood,
    employee.city,
    employee.state,
  ]
    .filter(Boolean)
    .join(", ");

  const cycleLabel = getBillingCycleLabel(finalBillingCycle);
  const typeLabel = getContractTypeLabel(finalContractType);
  const amountFormatted = finalAmount
    ? formatBRL(finalAmount)
    : "Conforme acordado";

  const defaultTemplate = `
    <h3>1. DO OBJETO DO CONTRATO</h3>
    <p>O presente instrumento tem como objeto a contratação dos serviços de <strong>{{CARGO_SERVICO}}</strong> sob a modalidade <strong>{{MODALIDADE_VINCULO}}</strong>, a serem prestados pelo(a) CONTRATADO(A) <strong>{{NOME_FUNCIONARIO}}</strong> em favor da CONTRATANTE <strong>VITA BABY ASSESSORIA</strong>.</p>
    ${finalServiceDesc ? `<p><strong>Escopo das atividades:</strong> {{DESCRICAO_SERVICO}}</p>` : ""}

    <h3>2. DA JORNADA E REGIME DE EXECUÇÃO</h3>
    <p>As atividades serão desempenhadas sob o regime de <strong>{{JORNADA_REGIME}}</strong>, observando os padrões de qualidade, pontualidade, ética profissional e humanização estabelecidos pela VITA BABY ASSESSORIA.</p>

    <h3>3. DA REMUNERAÇÃO E FORMA DE PAGAMENTO</h3>
    <p>Pelos serviços prestados, a CONTRATANTE pagará ao(à) CONTRATADO(A) o valor de <strong>{{VALOR_REMUNERACAO}}</strong>, com periodicidade <strong>{{TIPO_REMUNERACAO}}</strong>, por meio de <strong>{{FORMA_PAGAMENTO}}</strong>.</p>
    ${finalPaymentDetails ? `<p><strong>Condições e Dados para Pagamento:</strong> {{DADOS_PAGAMENTO}}</p>` : ""}

    <h3>4. DAS OBRIGAÇÕES E CONFIDENCIALIDADE</h3>
    <p>O(A) CONTRATADO(A) compromete-se a executar suas atribuições com zelo, sigilo absoluto sobre informações de clientes, pacientes e processos internos da VITA BABY ASSESSORIA (em conformidade com a LGPD — Lei nº 13.709/2018), bem como comunicar com antecedência qualquer imprevisto que afete a execução das atividades.</p>

    <h3>5. DA VIGÊNCIA E RESCISÃO</h3>
    <p>O presente contrato tem vigência por <strong>{{VIGENCIA}}</strong>${finalStartDate ? `, com início em <strong>{{DATA_INICIO}}</strong>` : ""}, podendo ser rescindido por qualquer das partes mediante aviso prévio acordado entre ambas.</p>
  `;

  const rawContent = data.content?.trim() || defaultTemplate;

  const finalContent = rawContent
    .replace(/\{\{NOME_FUNCIONARIO\}\}/g, employee.name)
    .replace(/\{\{CPF_CNPJ_FUNCIONARIO\}\}/g, employee.cpfCnpj || "")
    .replace(/\{\{RG_FUNCIONARIO\}\}/g, employee.rg || "")
    .replace(/\{\{ENDERECO_FUNCIONARIO\}\}/g, fullAddress)
    .replace(/\{\{CARGO_SERVICO\}\}/g, finalServiceType)
    .replace(/\{\{DESCRICAO_SERVICO\}\}/g, finalServiceDesc)
    .replace(/\{\{MODALIDADE_VINCULO\}\}/g, typeLabel)
    .replace(/\{\{TIPO_REMUNERACAO\}\}/g, cycleLabel)
    .replace(/\{\{VALOR_REMUNERACAO\}\}/g, amountFormatted)
    .replace(/\{\{FORMA_PAGAMENTO\}\}/g, finalPaymentMethod || "PIX")
    .replace(/\{\{DADOS_PAGAMENTO\}\}/g, finalPaymentDetails || "")
    .replace(
      /\{\{JORNADA_REGIME\}\}/g,
      finalWorkRegime || "horários e dias previamente acordados",
    )
    .replace(/\{\{DATA_INICIO\}\}/g, finalStartDate || "data de assinatura")
    .replace(/\{\{VIGENCIA\}\}/g, finalValidity || "prazo indeterminado");

  const crypto = await import("node:crypto");
  const token = crypto.randomBytes(16).toString("hex");
  const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24h

  const contract = await prisma.employeeContract.create({
    data: {
      employeeId: employee.id,
      title:
        data.title?.trim() ||
        `Contrato de ${finalServiceType} — ${employee.name}`,
      serviceType: finalServiceType,
      serviceDescription: finalServiceDesc || null,
      contractType: finalContractType,
      billingCycle: finalBillingCycle,
      amount: finalAmount ?? null,
      paymentMethod: finalPaymentMethod || null,
      paymentDetails: finalPaymentDetails,
      workRegime: finalWorkRegime,
      startDate: finalStartDate,
      validityDescription: finalValidity,
      content: finalContent,
      signToken: token,
      signTokenExpiresAt: expiresAt,
    },
  });

  revalidatePath("/admin/funcionarios");
  return contract;
}

export async function updateEmployeeContract(
  id: string,
  data: {
    employeeId?: string;
    title?: string | null;
    serviceType?: string | null;
    serviceDescription?: string | null;
    contractType?: string | null;
    billingCycle?: string | null;
    amount?: number | null;
    paymentMethod?: string | null;
    paymentDetails?: string | null;
    workRegime?: string | null;
    startDate?: string | null;
    validityDescription?: string | null;
    content?: string;
  },
) {
  await requireAdminSession();
  const existing = await prisma.employeeContract.findUnique({
    where: { id },
  });

  if (!existing) throw new Error("Contrato não encontrado.");

  const updated = await prisma.employeeContract.update({
    where: { id },
    data: {
      employeeId: data.employeeId || existing.employeeId,
      title:
        data.title !== undefined
          ? data.title?.trim() || existing.title
          : existing.title,
      serviceType:
        data.serviceType !== undefined
          ? data.serviceType?.trim() || null
          : existing.serviceType,
      serviceDescription:
        data.serviceDescription !== undefined
          ? data.serviceDescription?.trim() || null
          : existing.serviceDescription,
      contractType:
        data.contractType !== undefined
          ? data.contractType || null
          : existing.contractType,
      billingCycle:
        data.billingCycle !== undefined
          ? data.billingCycle || null
          : existing.billingCycle,
      amount:
        data.amount !== undefined
          ? data.amount !== null && !Number.isNaN(data.amount)
            ? data.amount
            : null
          : existing.amount,
      paymentMethod:
        data.paymentMethod !== undefined
          ? data.paymentMethod?.trim() || null
          : existing.paymentMethod,
      paymentDetails:
        data.paymentDetails !== undefined
          ? data.paymentDetails?.trim() || null
          : existing.paymentDetails,
      workRegime:
        data.workRegime !== undefined
          ? data.workRegime?.trim() || null
          : existing.workRegime,
      startDate:
        data.startDate !== undefined
          ? formatDateDisplay(data.startDate) || null
          : existing.startDate,
      validityDescription:
        data.validityDescription !== undefined
          ? data.validityDescription?.trim() || null
          : existing.validityDescription,
      content: data.content !== undefined ? data.content : existing.content,
    },
  });

  revalidatePath("/admin/funcionarios");
  revalidatePath(`/contrato-funcionario/${id}`);
  if (existing.signToken) {
    revalidatePath(`/assinar-funcionario/${existing.signToken}`);
  }
  return updated;
}

export async function deleteEmployeeContract(id: string) {
  await requireAdminSession();
  await prisma.employeeContract.delete({
    where: { id },
  });
  revalidatePath("/admin/funcionarios");
}

export async function generateEmployeeSignLink(contractId: string) {
  await requireAdminSession();
  const contract = await prisma.employeeContract.findUnique({
    where: { id: contractId },
  });

  if (!contract) throw new Error("Contrato não encontrado.");

  const crypto = await import("node:crypto");
  const token = crypto.randomBytes(16).toString("hex");
  const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24h

  await prisma.employeeContract.update({
    where: { id: contractId },
    data: {
      signToken: token,
      signTokenExpiresAt: expiresAt,
    },
  });

  revalidatePath("/admin/funcionarios");
  return { success: true, token, expiresAt };
}

export async function signEmployeeContractByCompanyAction(contractId: string) {
  const headersList = await headers();
  const session = await auth.api.getSession({ headers: headersList });

  if (!session?.user) {
    throw new Error("Apenas administradores podem assinar pela empresa.");
  }

  await prisma.employeeContract.update({
    where: { id: contractId },
    data: {
      signedByCompany: true,
      signedByCompanyAt: new Date(),
    },
  });

  revalidatePath(`/contrato-funcionario/${contractId}`);
  revalidatePath("/admin/funcionarios");
  return { success: true };
}

export async function signEmployeeContractWithTokenAction(token: string) {
  const headersList = await headers();
  const forwardedFor = headersList.get("x-forwarded-for");
  const realIp = headersList.get("x-real-ip");
  const employeeIp = forwardedFor
    ? forwardedFor.split(",")[0].trim()
    : realIp || "IP registrado";

  const contract = await prisma.employeeContract.findUnique({
    where: { signToken: token },
  });

  if (!contract) {
    throw new Error("Link de assinatura inválido ou expirado.");
  }

  if (contract.signedByEmployee) {
    throw new Error("Este contrato já foi assinado.");
  }

  if (contract.signTokenExpiresAt && contract.signTokenExpiresAt < new Date()) {
    throw new Error(
      "Este link de assinatura expirou. Solicite um novo link à Vita Baby.",
    );
  }

  await prisma.employeeContract.update({
    where: { id: contract.id },
    data: {
      signedByEmployee: true,
      signedAt: new Date(),
      employeeIp,
      signToken: null,
      signTokenExpiresAt: null,
    },
  });

  revalidatePath(`/contrato-funcionario/${contract.id}`);
  revalidatePath(`/assinar-funcionario/${token}`);
  revalidatePath("/admin/funcionarios");

  return { success: true };
}
