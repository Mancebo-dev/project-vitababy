import {
  Briefcase,
  CheckCircle2,
  CreditCard,
  DollarSign,
  FilePlus2,
  FileText,
  Plus,
  ShieldCheck,
  Users,
} from "lucide-react";
import type { Metadata } from "next";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getContractTemplates } from "../contratos/actions";
import { getEmployeeContracts, getEmployees } from "./actions";
import {
  DeleteEmployeeContractButton,
  EmployeeCopyLinkButton,
  EmployeePDFPreviewModal,
} from "./components/EmployeeContractActions";
import { EmployeeContractModal } from "./components/EmployeeContractModal";
import { EmployeeModal } from "./components/EmployeeModal";

export const metadata: Metadata = {
  title: "Funcionários e Prestadores | Vita Baby Dashboard",
};

export const dynamic = "force-dynamic";

function formatBillingCycle(cycle?: string | null) {
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
      return "Diária / Plantão";
    case "PER_SERVICE":
      return "Por Serviço";
    default:
      return cycle || "Mensal";
  }
}

function formatContractType(type?: string | null) {
  switch (type) {
    case "CLT":
      return "CLT";
    case "PJ":
      return "PJ";
    case "MEI":
      return "MEI";
    case "AUTONOMO":
      return "Autônomo";
    case "DIARISTA":
      return "Diarista";
    case "TEMPORARIO":
      return "Temporário";
    default:
      return type || "PJ";
  }
}

function formatBRL(val?: number | null) {
  if (val === null || val === undefined) return "-";
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(val);
}

export default async function FuncionariosPage() {
  let employees: Awaited<ReturnType<typeof getEmployees>> = [];
  let contracts: Awaited<ReturnType<typeof getEmployeeContracts>> = [];
  let templates: Awaited<ReturnType<typeof getContractTemplates>> = [];

  try {
    [employees, contracts, templates] = await Promise.all([
      getEmployees(),
      getEmployeeContracts(),
      getContractTemplates(),
    ]);
  } catch (error) {
    console.error("Erro ao carregar funcionários:", error);
  }

  const activeEmployees = employees.filter((e) => e.status === "ACTIVE");
  const estimatedMonthlyTotal = activeEmployees.reduce((acc, emp) => {
    const val = emp.amount || 0;
    if (emp.billingCycle === "SALARY" || emp.billingCycle === "MONTHLY") {
      return acc + val;
    }
    if (emp.billingCycle === "BIWEEKLY") {
      return acc + val * 2;
    }
    if (emp.billingCycle === "WEEKLY") {
      return acc + val * 4;
    }
    return acc;
  }, 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">
            Funcionários & Prestadores
          </h1>
          <p className="text-slate-500 mt-1.5 text-sm">
            Gestão geral da equipe interna, prestadores de serviços, folha de
            pagamentos (salário, mensal, semanal, diária) e contratos da Vita
            Baby.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <EmployeeContractModal employees={employees} templates={templates} />
          <EmployeeModal
            trigger={
              <Button className="bg-slate-900 hover:bg-slate-800 text-white gap-2 min-h-[40px] px-3.5 shadow-xs cursor-pointer">
                <Plus className="w-4 h-4" />
                <span>Novo Funcionário</span>
              </Button>
            }
          />
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs flex items-center gap-4">
          <div className="w-11 h-11 rounded-xl bg-[#ae4d30]/10 text-[#ae4d30] flex items-center justify-center shrink-0">
            <Users className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">
              Funcionários Ativos
            </p>
            <p className="text-2xl font-bold text-slate-900 mt-0.5">
              {activeEmployees.length}{" "}
              <span className="text-xs font-normal text-slate-400">
                / {employees.length} cadastrados
              </span>
            </p>
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs flex items-center gap-4">
          <div className="w-11 h-11 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
            <DollarSign className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">
              Folha Fixa / Mensal Estimada
            </p>
            <p className="text-2xl font-bold text-slate-900 mt-0.5">
              {formatBRL(estimatedMonthlyTotal)}
            </p>
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs flex items-center gap-4">
          <div className="w-11 h-11 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center shrink-0">
            <FileText className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">
              Contratos Emitidos
            </p>
            <p className="text-2xl font-bold text-slate-900 mt-0.5">
              {contracts.length}{" "}
              <span className="text-xs font-normal text-slate-400">
                ({contracts.filter((c) => c.signedByEmployee).length} assinados)
              </span>
            </p>
          </div>
        </div>
      </div>

      <Tabs defaultValue="funcionarios" className="w-full">
        <TabsList className="mb-5">
          <TabsTrigger value="funcionarios">
            Quadro de Funcionários ({employees.length})
          </TabsTrigger>
          <TabsTrigger value="contratos">
            Contratos de Funcionários ({contracts.length})
          </TabsTrigger>
        </TabsList>

        {/* ABA 1: FUNCIONÁRIOS */}
        <TabsContent value="funcionarios">
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
            {employees.length === 0 ? (
              <div className="p-12 text-center text-slate-500">
                <Briefcase className="w-12 h-12 mx-auto text-slate-300 mb-4" />
                <p className="text-lg font-medium text-slate-900">
                  Nenhum funcionário ou prestador cadastrado.
                </p>
                <p className="text-sm mt-1">
                  Cadastre funcionários, prestadores de serviços, métodos de
                  pagamento e gere contratos personalizados.
                </p>
              </div>
            ) : (
              <>
                {/* Mobile View */}
                <div className="sm:hidden divide-y divide-slate-100">
                  {employees.map((emp) => (
                    <div key={emp.id} className="p-4 space-y-3">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <p className="font-bold text-slate-900 text-sm">
                            {emp.name}
                          </p>
                          <p className="text-xs font-medium text-[#ae4d30]">
                            {emp.role} · {formatContractType(emp.contractType)}
                          </p>
                          {emp.serviceType && (
                            <p className="text-xs text-slate-500 mt-0.5">
                              {emp.serviceType}
                            </p>
                          )}
                        </div>
                        <span
                          className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider shrink-0 ${
                            emp.status === "ACTIVE"
                              ? "bg-emerald-100 text-emerald-800"
                              : emp.status === "ON_LEAVE"
                                ? "bg-amber-100 text-amber-800"
                                : "bg-slate-100 text-slate-700"
                          }`}
                        >
                          {emp.status === "ACTIVE"
                            ? "Ativo"
                            : emp.status === "ON_LEAVE"
                              ? "Afastado"
                              : "Inativo"}
                        </span>
                      </div>

                      <div className="bg-slate-50 p-3 rounded-lg text-xs space-y-1.5 border border-slate-100">
                        <div className="flex justify-between">
                          <span className="text-slate-500">Remuneração:</span>
                          <span className="font-bold text-slate-900">
                            {formatBRL(emp.amount)} (
                            {formatBillingCycle(emp.billingCycle)})
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-500">Pagamento:</span>
                          <span className="font-medium text-slate-800">
                            {emp.paymentMethod}
                            {emp.paymentDay ? ` · ${emp.paymentDay}` : ""}
                          </span>
                        </div>
                        {emp.pixKey && (
                          <div className="flex justify-between">
                            <span className="text-slate-500">PIX:</span>
                            <span className="font-mono text-[11px] text-slate-700">
                              {emp.pixKey}
                            </span>
                          </div>
                        )}
                        <div className="flex justify-between">
                          <span className="text-slate-500">Contato:</span>
                          <span className="text-slate-800">{emp.phone}</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 pt-1">
                        <EmployeeModal
                          employee={emp}
                          trigger={
                            <button
                              type="button"
                              className="flex-1 py-2 px-3 text-xs font-semibold text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50"
                            >
                              Editar Dados
                            </button>
                          }
                        />
                        <EmployeeContractModal
                          employees={employees}
                          templates={templates}
                          preselectedEmployeeId={emp.id}
                          trigger={
                            <button
                              type="button"
                              className="flex-1 py-2 px-3 text-xs font-semibold text-white bg-primary rounded-lg hover:bg-primary/90 inline-flex items-center justify-center gap-1"
                            >
                              <FilePlus2 className="w-3.5 h-3.5" />
                              Gerar Contrato
                            </button>
                          }
                        />
                      </div>
                    </div>
                  ))}
                </div>

                {/* Desktop View */}
                <div className="hidden sm:block overflow-x-auto">
                  <table className="w-full text-sm text-left">
                    <thead className="bg-slate-50 text-slate-600 font-medium border-b border-slate-200">
                      <tr>
                        <th className="px-6 py-4">Funcionário & Documento</th>
                        <th className="px-6 py-4">Cargo & Tipo de Serviço</th>
                        <th className="px-6 py-4">Remuneração</th>
                        <th className="px-6 py-4">Método de Pagamento</th>
                        <th className="px-6 py-4">Status</th>
                        <th className="px-6 py-4 text-right">Ações</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {employees.map((emp) => (
                        <tr
                          key={emp.id}
                          className="hover:bg-slate-50/50 transition-colors"
                        >
                          <td className="px-6 py-4">
                            <p className="font-semibold text-slate-900">
                              {emp.name}
                            </p>
                            <p className="text-xs text-slate-500 mt-0.5">
                              {emp.phone}
                              {emp.email ? ` · ${emp.email}` : ""}
                            </p>
                            {emp.cpfCnpj && (
                              <p className="text-[11px] text-slate-400 font-mono mt-0.5">
                                Doc: {emp.cpfCnpj}
                              </p>
                            )}
                          </td>

                          <td className="px-6 py-4 max-w-[260px]">
                            <div className="flex items-center gap-1.5">
                              <span className="font-semibold text-slate-800 text-xs">
                                {emp.role}
                              </span>
                              <span className="text-[10px] font-bold uppercase px-1.5 py-0.5 rounded bg-slate-100 text-slate-700">
                                {formatContractType(emp.contractType)}
                              </span>
                            </div>
                            {emp.serviceType && (
                              <p className="text-xs text-slate-500 mt-1 line-clamp-2">
                                {emp.serviceType}
                              </p>
                            )}
                            {emp.workRegime && (
                              <p className="text-[11px] text-slate-400 mt-0.5">
                                Jornada: {emp.workRegime}
                              </p>
                            )}
                          </td>

                          <td className="px-6 py-4">
                            <p className="font-bold text-[#ae4d30] text-sm">
                              {formatBRL(emp.amount)}
                            </p>
                            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold bg-amber-50 text-amber-900 border border-amber-200 mt-1">
                              {formatBillingCycle(emp.billingCycle)}
                            </span>
                          </td>

                          <td className="px-6 py-4">
                            <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-800">
                              <CreditCard className="w-3.5 h-3.5 text-slate-400" />
                              {emp.paymentMethod}
                            </div>
                            {emp.pixKey && (
                              <p className="text-[11px] text-slate-500 mt-0.5 truncate max-w-[200px]">
                                PIX: {emp.pixKey}
                              </p>
                            )}
                            {emp.paymentDay && (
                              <p className="text-[11px] text-slate-400 mt-0.5">
                                Venc.: {emp.paymentDay}
                              </p>
                            )}
                          </td>

                          <td className="px-6 py-4">
                            <span
                              className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                emp.status === "ACTIVE"
                                  ? "bg-emerald-100 text-emerald-800"
                                  : emp.status === "ON_LEAVE"
                                    ? "bg-amber-100 text-amber-800"
                                    : "bg-slate-100 text-slate-700"
                              }`}
                            >
                              {emp.status === "ACTIVE"
                                ? "Ativo(a)"
                                : emp.status === "ON_LEAVE"
                                  ? "Afastado(a)"
                                  : "Inativo(a)"}
                            </span>
                          </td>

                          <td className="px-6 py-4 text-right">
                            <div className="inline-flex items-center justify-end gap-2">
                              <EmployeeContractModal
                                employees={employees}
                                templates={templates}
                                preselectedEmployeeId={emp.id}
                                trigger={
                                  <button
                                    type="button"
                                    className="inline-flex items-center gap-1 px-2.5 py-1.5 text-xs font-semibold text-[#ae4d30] bg-[#ae4d30]/10 hover:bg-[#ae4d30]/20 rounded-lg transition-colors cursor-pointer"
                                  >
                                    <FilePlus2 className="w-3.5 h-3.5" />
                                    Contrato
                                  </button>
                                }
                              />
                              <EmployeeModal
                                employee={emp}
                                trigger={
                                  <button
                                    type="button"
                                    className="px-3 py-1.5 text-xs font-semibold text-slate-700 bg-white border border-slate-300 hover:bg-slate-50 rounded-lg transition-colors cursor-pointer"
                                  >
                                    Editar
                                  </button>
                                }
                              />
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </>
            )}
          </div>
        </TabsContent>

        {/* ABA 2: CONTRATOS DE FUNCIONÁRIOS */}
        <TabsContent value="contratos">
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
            {contracts.length === 0 ? (
              <div className="p-12 text-center text-slate-500">
                <FileText className="w-12 h-12 mx-auto text-slate-300 mb-4" />
                <p className="text-lg font-medium text-slate-900">
                  Nenhum contrato de funcionário emitido.
                </p>
                <p className="text-sm mt-1">
                  Clique em &quot;Novo Contrato de Funcionário&quot; para gerar
                  o documento entre a Vita Baby e o colaborador/prestador.
                </p>
              </div>
            ) : (
              <div className="divide-y divide-slate-100">
                {contracts.map((contract) => {
                  const emp = contract.employee;
                  return (
                    <div
                      key={contract.id}
                      className="p-4 sm:p-6 flex flex-col lg:flex-row lg:items-center justify-between hover:bg-slate-50/50 transition-colors gap-4"
                    >
                      <div className="flex items-start gap-4">
                        <div
                          className={`w-10 h-10 flex items-center justify-center rounded-lg shrink-0 mt-1 ${
                            contract.signedByEmployee &&
                            contract.signedByCompany
                              ? "bg-emerald-100 text-emerald-600"
                              : contract.signedByCompany
                                ? "bg-blue-100 text-blue-600"
                                : contract.signedByEmployee
                                  ? "bg-amber-100 text-amber-600"
                                  : "bg-slate-100 text-slate-600"
                          }`}
                        >
                          {contract.signedByEmployee &&
                          contract.signedByCompany ? (
                            <CheckCircle2 className="w-5 h-5" />
                          ) : contract.signedByCompany ? (
                            <ShieldCheck className="w-5 h-5" />
                          ) : (
                            <FileText className="w-5 h-5" />
                          )}
                        </div>

                        <div>
                          <div className="flex flex-wrap items-center gap-2">
                            <h3 className="font-semibold text-slate-900">
                              {contract.title}
                            </h3>
                            {contract.signedByEmployee &&
                            contract.signedByCompany ? (
                              <span className="text-[10px] bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full font-bold uppercase tracking-wider">
                                100% Assinado
                              </span>
                            ) : contract.signedByCompany ? (
                              <span className="text-[10px] bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full font-bold uppercase tracking-wider">
                                Assinado p/ Vita Baby
                              </span>
                            ) : contract.signedByEmployee ? (
                              <span className="text-[10px] bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full font-bold uppercase tracking-wider">
                                Assinado p/ Funcionário
                              </span>
                            ) : (
                              <span className="text-[10px] bg-slate-100 text-slate-700 px-2 py-0.5 rounded-full font-bold uppercase tracking-wider">
                                Aguardando Assinatura
                              </span>
                            )}
                          </div>

                          <p className="text-xs text-slate-600 mt-1 font-medium">
                            Funcionário/Prestador: {emp.name} ({emp.phone}) ·{" "}
                            {formatContractType(contract.contractType)}
                          </p>

                          <div className="flex flex-wrap gap-x-4 text-xs text-slate-500 mt-1">
                            {contract.amount && (
                              <span className="font-semibold text-[#ae4d30]">
                                Valor: {formatBRL(contract.amount)} (
                                {formatBillingCycle(contract.billingCycle)})
                              </span>
                            )}
                            {contract.paymentMethod && (
                              <span>Pagamento: {contract.paymentMethod}</span>
                            )}
                            <span>
                              Emitido em:{" "}
                              {new Date(contract.createdAt).toLocaleDateString(
                                "pt-BR",
                              )}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 sm:flex sm:flex-wrap sm:items-center gap-2 pt-3 lg:pt-0 border-t lg:border-t-0 border-slate-100 w-full lg:w-auto">
                        <EmployeeContractModal
                          employees={employees}
                          templates={templates}
                          existingContract={contract}
                        />

                        <EmployeeCopyLinkButton
                          contractId={contract.id}
                          isSigned={contract.signedByEmployee}
                          employeePhone={emp.phone}
                          employeeName={emp.name}
                        />

                        <EmployeePDFPreviewModal
                          contractId={contract.id}
                          title={contract.title}
                        />

                        <DeleteEmployeeContractButton
                          contractId={contract.id}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
