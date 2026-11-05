"use client";

import type {
  ContractTemplate,
  Employee,
  EmployeeContract,
} from "@prisma/client";
import { Edit3, FileText, Loader2, Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { RichEditor } from "@/components/ui/rich-editor";
import { createEmployeeContract, updateEmployeeContract } from "../actions";

function parseMoneyInput(val?: string): number | null {
  if (!val || !val.trim()) return null;
  const normalized = val.trim().replace(",", ".");
  const parsed = Number.parseFloat(normalized);
  return Number.isNaN(parsed) ? null : parsed;
}

function toInputDateValue(d?: string | Date | null): string {
  if (!d) return "";
  if (typeof d === "string") {
    const trimmed = d.trim();
    if (/^\d{4}-\d{2}-\d{2}$/.test(trimmed)) return trimmed;
    if (/^\d{2}\/\d{2}\/\d{4}$/.test(trimmed)) {
      const [day, month, year] = trimmed.split("/");
      return `${year}-${month}-${day}`;
    }
    return "";
  }
  const dateObj = new Date(d);
  if (Number.isNaN(dateObj.getTime())) return "";
  return dateObj.toISOString().split("T")[0];
}

const DEFAULT_EMPLOYEE_CONTRACT_TEXT = `<h3>1. DO OBJETO DO CONTRATO</h3>
<p>O presente instrumento tem como objeto a contratação dos serviços de <strong>{{CARGO_SERVICO}}</strong> sob a modalidade <strong>{{MODALIDADE_VINCULO}}</strong>, a serem prestados pelo(a) CONTRATADO(A) <strong>{{NOME_FUNCIONARIO}}</strong> em favor da CONTRATANTE <strong>VITA BABY ASSESSORIA</strong>.</p>
<p><strong>Escopo das atividades:</strong> {{DESCRICAO_SERVICO}}</p>

<h3>2. DA JORNADA E REGIME DE EXECUÇÃO</h3>
<p>As atividades serão desempenhadas sob o regime de <strong>{{JORNADA_REGIME}}</strong>, observando os padrões de qualidade, pontualidade, ética profissional e humanização estabelecidos pela VITA BABY ASSESSORIA.</p>

<h3>3. DA REMUNERAÇÃO E FORMA DE PAGAMENTO</h3>
<p>Pelos serviços prestados, a CONTRATANTE pagará ao(à) CONTRATADO(A) o valor de <strong>{{VALOR_REMUNERACAO}}</strong>, com periodicidade <strong>{{TIPO_REMUNERACAO}}</strong>, por meio de <strong>{{FORMA_PAGAMENTO}}</strong>.</p>
<p><strong>Condições e Dados para Pagamento:</strong> {{DADOS_PAGAMENTO}}</p>

<h3>4. DAS OBRIGAÇÕES E CONFIDENCIALIDADE</h3>
<p>O(A) CONTRATADO(A) compromete-se a executar suas atribuições com zelo, sigilo absoluto sobre informações de clientes, pacientes e processos internos da VITA BABY ASSESSORIA (em conformidade com a LGPD — Lei nº 13.709/2018), bem como comunicar com antecedência qualquer imprevisto que afete a execução das atividades.</p>

<h3>5. DA VIGÊNCIA E RESCISÃO</h3>
<p>O presente contrato tem vigência por <strong>{{VIGENCIA}}</strong>, com início em <strong>{{DATA_INICIO}}</strong>, podendo ser rescindido por qualquer das partes mediante aviso prévio acordado entre ambas.</p>`;

export function EmployeeContractModal({
  employees,
  templates = [],
  existingContract,
  preselectedEmployeeId,
  trigger,
}: {
  employees: Employee[];
  templates?: ContractTemplate[];
  existingContract?: EmployeeContract;
  preselectedEmployeeId?: string;
  trigger?: React.ReactElement;
}) {
  const [open, setOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  const [employeeId, setEmployeeId] = useState(
    existingContract?.employeeId || preselectedEmployeeId || "",
  );
  const [title, setTitle] = useState(existingContract?.title || "");
  const [serviceType, setServiceType] = useState(
    existingContract?.serviceType || "",
  );
  const [serviceDescription, setServiceDescription] = useState(
    existingContract?.serviceDescription || "",
  );
  const [contractType, setContractType] = useState(
    existingContract?.contractType || "PJ",
  );
  const [billingCycle, setBillingCycle] = useState(
    existingContract?.billingCycle || "MONTHLY",
  );
  const [amount, setAmount] = useState(
    existingContract?.amount !== null && existingContract?.amount !== undefined
      ? String(existingContract.amount)
      : "",
  );
  const [paymentMethod, setPaymentMethod] = useState(
    existingContract?.paymentMethod || "PIX",
  );
  const [paymentDetails, setPaymentDetails] = useState(
    existingContract?.paymentDetails || "",
  );
  const [workRegime, setWorkRegime] = useState(
    existingContract?.workRegime || "",
  );
  const [startDate, setStartDate] = useState(
    toInputDateValue(existingContract?.startDate),
  );
  const [validityDescription, setValidityDescription] = useState(
    existingContract?.validityDescription || "",
  );
  const [content, setContent] = useState(
    existingContract?.content || DEFAULT_EMPLOYEE_CONTRACT_TEXT,
  );

  const applyEmployeeDefaults = useCallback(
    (empId: string) => {
      setEmployeeId(empId);
      const emp = employees.find((e) => e.id === empId);
      if (!emp) return;

      setTitle(`Contrato de ${emp.role} — ${emp.name}`);
      setServiceType(emp.role || "");
      setServiceDescription(emp.serviceType || "");
      setContractType(emp.contractType || "PJ");
      setBillingCycle(emp.billingCycle || "MONTHLY");
      setAmount(
        emp.amount !== null && emp.amount !== undefined
          ? String(emp.amount)
          : "",
      );
      setPaymentMethod(emp.paymentMethod || "PIX");
      setWorkRegime(emp.workRegime || "");
      setStartDate(toInputDateValue(emp.hireDate));

      const payInfo = [
        emp.pixKey ? `PIX: ${emp.pixKey}` : null,
        emp.bankDetails ? `Banco: ${emp.bankDetails}` : null,
        emp.paymentDay ? `Pagamento: ${emp.paymentDay}` : null,
      ]
        .filter(Boolean)
        .join(" | ");
      setPaymentDetails(payInfo);
    },
    [employees],
  );

  useEffect(() => {
    if (open) {
      if (existingContract) {
        setEmployeeId(existingContract.employeeId);
        setTitle(existingContract.title || "");
        setServiceType(existingContract.serviceType || "");
        setServiceDescription(existingContract.serviceDescription || "");
        setContractType(existingContract.contractType || "PJ");
        setBillingCycle(existingContract.billingCycle || "MONTHLY");
        setAmount(
          existingContract.amount !== null &&
            existingContract.amount !== undefined
            ? String(existingContract.amount)
            : "",
        );
        setPaymentMethod(existingContract.paymentMethod || "PIX");
        setPaymentDetails(existingContract.paymentDetails || "");
        setWorkRegime(existingContract.workRegime || "");
        setStartDate(toInputDateValue(existingContract.startDate));
        setValidityDescription(existingContract.validityDescription || "");
        setContent(existingContract.content || DEFAULT_EMPLOYEE_CONTRACT_TEXT);
      } else if (preselectedEmployeeId) {
        applyEmployeeDefaults(preselectedEmployeeId);
        setValidityDescription("");
        setContent(DEFAULT_EMPLOYEE_CONTRACT_TEXT);
      } else {
        setEmployeeId("");
        setTitle("");
        setServiceType("");
        setServiceDescription("");
        setContractType("PJ");
        setBillingCycle("MONTHLY");
        setAmount("");
        setPaymentMethod("PIX");
        setPaymentDetails("");
        setWorkRegime("");
        setStartDate("");
        setValidityDescription("");
        setContent(DEFAULT_EMPLOYEE_CONTRACT_TEXT);
      }
    }
  }, [open, existingContract, preselectedEmployeeId, applyEmployeeDefaults]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!employeeId) {
      alert("Selecione o funcionário / prestador de serviço.");
      return;
    }

    setIsSubmitting(true);
    try {
      const payload = {
        employeeId,
        title: title.trim() || null,
        serviceType: serviceType.trim() || null,
        serviceDescription: serviceDescription.trim() || null,
        contractType,
        billingCycle,
        amount: parseMoneyInput(amount),
        paymentMethod: paymentMethod.trim() || null,
        paymentDetails: paymentDetails.trim() || null,
        workRegime: workRegime.trim() || null,
        startDate: startDate.trim() || null,
        validityDescription: validityDescription.trim() || null,
        content,
      };

      if (existingContract) {
        await updateEmployeeContract(existingContract.id, payload);
      } else {
        await createEmployeeContract(payload);
      }
      setOpen(false);
      router.refresh();
    } catch (error) {
      console.error(error);
      alert(
        error instanceof Error
          ? error.message
          : "Erro ao salvar contrato de funcionário.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {trigger ? (
        <DialogTrigger render={trigger} />
      ) : existingContract ? (
        <DialogTrigger className="inline-flex items-center justify-center gap-1.5 px-3 py-2 sm:py-1.5 text-xs font-semibold text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors shadow-xs cursor-pointer min-h-[38px] w-full sm:w-auto">
          <Edit3 className="w-3.5 h-3.5 text-slate-500" />
          <span>Editar</span>
        </DialogTrigger>
      ) : (
        <DialogTrigger className="inline-flex items-center gap-1.5 bg-primary text-white px-3.5 py-2 rounded-lg hover:bg-primary/90 transition-colors font-medium cursor-pointer shadow-xs min-h-[40px] text-sm">
          <Plus className="w-4 h-4 shrink-0" />
          <span>Novo Contrato de Funcionário</span>
        </DialogTrigger>
      )}

      <DialogContent className="w-full max-w-[calc(100%-1.5rem)] sm:max-w-3xl lg:max-w-4xl max-h-[92vh] overflow-y-auto p-4 sm:p-6">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-lg font-bold text-slate-900">
            <FileText className="w-5 h-5 text-[#ae4d30]" />
            {existingContract
              ? `Editar Contrato de Funcionário (Nº ${existingContract.id.slice(-6).toUpperCase()})`
              : "Emitir Contrato para Funcionário / Prestador"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 pt-2">
          {/* Seleção de Funcionário e Modelo */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-4 bg-slate-50 border border-slate-200 rounded-xl">
            <div>
              <label
                htmlFor="emp-contract-employee"
                className="block text-xs font-semibold text-slate-700 mb-1"
              >
                Funcionário / Prestador de Serviço *
              </label>
              <select
                id="emp-contract-employee"
                required
                value={employeeId}
                onChange={(e) => applyEmployeeDefaults(e.target.value)}
                className="w-full px-3 py-2 text-sm border rounded-lg bg-white"
              >
                <option value="">Selecione um funcionário...</option>
                {employees.map((emp) => (
                  <option key={emp.id} value={emp.id}>
                    {emp.name} — {emp.role}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label
                htmlFor="emp-contract-title"
                className="block text-xs font-semibold text-slate-700 mb-1"
              >
                Título de Identificação do Contrato
              </label>
              <input
                id="emp-contract-title"
                type="text"
                placeholder="Ex: Contrato de Prestação de Serviços — Maria"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-3 py-2 text-sm border rounded-lg bg-white"
              />
            </div>

            {templates.length > 0 && !existingContract && (
              <div className="sm:col-span-2">
                <label
                  htmlFor="emp-contract-template"
                  className="block text-xs font-semibold text-slate-700 mb-1"
                >
                  Carregar Texto de um Modelo Base (Opcional)
                </label>
                <select
                  id="emp-contract-template"
                  defaultValue=""
                  onChange={(e) => {
                    if (!e.target.value) {
                      setContent(DEFAULT_EMPLOYEE_CONTRACT_TEXT);
                      return;
                    }
                    const found = templates.find(
                      (t) => t.id === e.target.value,
                    );
                    if (found) setContent(found.content);
                  }}
                  className="w-full px-3 py-2 text-sm border rounded-lg bg-white"
                >
                  <option value="">
                    Usar Modelo Padrão de Contrato de Funcionário / Prestador
                  </option>
                  {templates.map((t) => (
                    <option key={t.id} value={t.id}>
                      {t.title}
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>

          {/* Serviço, Vínculo e Jornada */}
          <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-3">
            <span className="text-xs font-bold uppercase tracking-wider text-[#ae4d30] block">
              Serviço Contratado, Vínculo e Jornada
            </span>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="sm:col-span-2">
                <label
                  htmlFor="emp-contract-service"
                  className="block text-xs font-semibold text-slate-700 mb-1"
                >
                  Cargo / Tipo de Serviço
                </label>
                <input
                  id="emp-contract-service"
                  type="text"
                  placeholder="Ex: Auxiliar Administrativo, Enfermeira Plantonista, Babá..."
                  value={serviceType}
                  onChange={(e) => setServiceType(e.target.value)}
                  className="w-full px-3 py-2 text-sm border rounded-lg bg-white"
                />
              </div>

              <div>
                <label
                  htmlFor="emp-contract-modality"
                  className="block text-xs font-semibold text-slate-700 mb-1"
                >
                  Modalidade / Vínculo
                </label>
                <select
                  id="emp-contract-modality"
                  value={contractType}
                  onChange={(e) => setContractType(e.target.value)}
                  className="w-full px-3 py-2 text-sm border rounded-lg bg-white"
                >
                  <option value="PJ">Prestador de Serviços (PJ)</option>
                  <option value="MEI">MEI</option>
                  <option value="AUTONOMO">Profissional Autônomo</option>
                  <option value="CLT">CLT (Salário / Carteira)</option>
                  <option value="DIARISTA">Diarista / Plantonista</option>
                  <option value="TEMPORARIO">Contrato Temporário</option>
                </select>
              </div>

              <div className="sm:col-span-3">
                <label
                  htmlFor="emp-contract-desc"
                  className="block text-xs font-semibold text-slate-700 mb-1"
                >
                  Descrição / Escopo Detalhado do Serviço
                </label>
                <input
                  id="emp-contract-desc"
                  type="text"
                  placeholder="Ex: Atendimento domiciliar materno-infantil, organização administrativa..."
                  value={serviceDescription}
                  onChange={(e) => setServiceDescription(e.target.value)}
                  className="w-full px-3 py-2 text-sm border rounded-lg bg-white"
                />
              </div>

              <div>
                <label
                  htmlFor="emp-contract-regime"
                  className="block text-xs font-semibold text-slate-700 mb-1"
                >
                  Jornada / Regime de Trabalho
                </label>
                <input
                  id="emp-contract-regime"
                  type="text"
                  placeholder="Ex: Segunda a Sexta (08h às 17h), 12x36..."
                  value={workRegime}
                  onChange={(e) => setWorkRegime(e.target.value)}
                  className="w-full px-3 py-2 text-sm border rounded-lg bg-white"
                />
              </div>

              <div>
                <label
                  htmlFor="emp-contract-start"
                  className="block text-xs font-semibold text-slate-700 mb-1"
                >
                  Data de Início
                </label>
                <input
                  id="emp-contract-start"
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="w-full px-3 py-2 text-sm border rounded-lg bg-white"
                />
              </div>

              <div>
                <label
                  htmlFor="emp-contract-validity"
                  className="block text-xs font-semibold text-slate-700 mb-1"
                >
                  Vigência / Prazo do Contrato
                </label>
                <input
                  id="emp-contract-validity"
                  type="text"
                  placeholder="Ex: 12 meses, Indeterminado..."
                  value={validityDescription}
                  onChange={(e) => setValidityDescription(e.target.value)}
                  className="w-full px-3 py-2 text-sm border rounded-lg bg-white"
                />
              </div>
            </div>
          </div>

          {/* Remuneração e Pagamentos */}
          <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-3">
            <span className="text-xs font-bold uppercase tracking-wider text-[#ae4d30] block">
              Remuneração, Periodicidade e Método de Pagamento
            </span>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label
                  htmlFor="emp-contract-cycle"
                  className="block text-xs font-semibold text-slate-700 mb-1"
                >
                  Tipo de Remuneração
                </label>
                <select
                  id="emp-contract-cycle"
                  value={billingCycle}
                  onChange={(e) => setBillingCycle(e.target.value)}
                  className="w-full px-3 py-2 text-sm border rounded-lg bg-white"
                >
                  <option value="SALARY">Salário Mensal</option>
                  <option value="MONTHLY">Valor Mensal (Fixo)</option>
                  <option value="BIWEEKLY">Valor Quinzenal</option>
                  <option value="WEEKLY">Valor Semanal</option>
                  <option value="DAILY">Valor por Diária / Plantão</option>
                  <option value="PER_SERVICE">Valor por Serviço</option>
                </select>
              </div>

              <div>
                <label
                  htmlFor="emp-contract-amount"
                  className="block text-xs font-semibold text-slate-700 mb-1"
                >
                  Valor Acordado (R$)
                </label>
                <input
                  id="emp-contract-amount"
                  type="text"
                  inputMode="decimal"
                  placeholder="Ex: 2500.00"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="w-full px-3 py-2 text-sm border rounded-lg bg-white"
                />
              </div>

              <div>
                <label
                  htmlFor="emp-contract-paymethod"
                  className="block text-xs font-semibold text-slate-700 mb-1"
                >
                  Método de Pagamento
                </label>
                <select
                  id="emp-contract-paymethod"
                  value={paymentMethod}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  className="w-full px-3 py-2 text-sm border rounded-lg bg-white"
                >
                  <option value="PIX">PIX</option>
                  <option value="TRANSFERENCIA">
                    Transferência Bancária (TED/DOC)
                  </option>
                  <option value="DINHEIRO">Espécie / Dinheiro</option>
                  <option value="BOLETO">Boleto Bancário</option>
                  <option value="OUTRO">Outro</option>
                </select>
              </div>

              <div className="sm:col-span-3">
                <label
                  htmlFor="emp-contract-paydetails"
                  className="block text-xs font-semibold text-slate-700 mb-1"
                >
                  Dados de Pagamento (Chave PIX, Conta Bancária, Dia de
                  Vencimento)
                </label>
                <input
                  id="emp-contract-paydetails"
                  type="text"
                  placeholder="Ex: PIX CPF 000.000.000-00 | Vencimento todo dia 05"
                  value={paymentDetails}
                  onChange={(e) => setPaymentDetails(e.target.value)}
                  className="w-full px-3 py-2 text-sm border rounded-lg bg-white"
                />
              </div>
            </div>
          </div>

          {/* Cláusulas do Contrato */}
          <div>
            <span className="block text-xs font-semibold text-slate-700 mb-1">
              Texto e Cláusulas do Contrato (Vita Baby → Funcionário/Prestador)
            </span>
            <RichEditor value={content} onChange={setContent} a4Mode={false} />
          </div>

          <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-2 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="w-full sm:w-auto px-4 py-2 text-sm text-slate-600 bg-white border rounded-lg hover:bg-slate-50"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2 text-sm font-semibold text-white bg-primary rounded-lg hover:bg-primary/90 disabled:opacity-50"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" /> Salvando...
                </>
              ) : existingContract ? (
                "Salvar Alterações"
              ) : (
                "Emitir Contrato"
              )}
            </button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
