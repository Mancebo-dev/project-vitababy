"use client";

import type { Employee } from "@prisma/client";
import { Loader2, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createEmployee, deleteEmployee, updateEmployee } from "../actions";

function parseMoneyInput(val?: string): number | null {
  if (!val || !val.trim()) return null;
  const normalized = val.trim().replace(",", ".");
  const parsed = Number.parseFloat(normalized);
  return Number.isNaN(parsed) ? null : parsed;
}

function toInputDateValue(d?: Date | string | null): string {
  if (!d) return "";
  const dateObj = new Date(d);
  if (Number.isNaN(dateObj.getTime())) return "";
  return dateObj.toISOString().split("T")[0];
}

export function EmployeeModal({
  employee,
  trigger,
}: {
  employee?: Employee;
  trigger: React.ReactElement;
}) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loadingCep, setLoadingCep] = useState(false);
  const router = useRouter();

  const [formData, setFormData] = useState({
    name: employee?.name || "",
    cpfCnpj: employee?.cpfCnpj || "",
    rg: employee?.rg || "",
    email: employee?.email || "",
    phone: employee?.phone || "",
    role: employee?.role || "",
    serviceType: employee?.serviceType || "",
    contractType: employee?.contractType || "PJ",
    workRegime: employee?.workRegime || "",
    billingCycle: employee?.billingCycle || "MONTHLY",
    amount:
      employee?.amount !== null && employee?.amount !== undefined
        ? String(employee.amount)
        : "",
    paymentMethod: employee?.paymentMethod || "PIX",
    pixKey: employee?.pixKey || "",
    bankDetails: employee?.bankDetails || "",
    paymentDay: employee?.paymentDay || "",
    hireDate: toInputDateValue(employee?.hireDate),
    status: employee?.status || "ACTIVE",
    zipCode: employee?.zipCode || "",
    street: employee?.street || "",
    number: employee?.number || "",
    complement: employee?.complement || "",
    neighborhood: employee?.neighborhood || "",
    city: employee?.city || "",
    state: employee?.state || "",
    notes: employee?.notes || "",
  });

  useEffect(() => {
    if (open) {
      setFormData({
        name: employee?.name || "",
        cpfCnpj: employee?.cpfCnpj || "",
        rg: employee?.rg || "",
        email: employee?.email || "",
        phone: employee?.phone || "",
        role: employee?.role || "",
        serviceType: employee?.serviceType || "",
        contractType: employee?.contractType || "PJ",
        workRegime: employee?.workRegime || "",
        billingCycle: employee?.billingCycle || "MONTHLY",
        amount:
          employee?.amount !== null && employee?.amount !== undefined
            ? String(employee.amount)
            : "",
        paymentMethod: employee?.paymentMethod || "PIX",
        pixKey: employee?.pixKey || "",
        bankDetails: employee?.bankDetails || "",
        paymentDay: employee?.paymentDay || "",
        hireDate: toInputDateValue(employee?.hireDate),
        status: employee?.status || "ACTIVE",
        zipCode: employee?.zipCode || "",
        street: employee?.street || "",
        number: employee?.number || "",
        complement: employee?.complement || "",
        neighborhood: employee?.neighborhood || "",
        city: employee?.city || "",
        state: employee?.state || "",
        notes: employee?.notes || "",
      });
    }
  }, [open, employee]);

  const handleZipCodeBlur = async () => {
    const cleanCep = formData.zipCode.replace(/\D/g, "");
    if (cleanCep.length !== 8) return;
    setLoadingCep(true);
    try {
      const res = await fetch(`https://viacep.com.br/ws/${cleanCep}/json/`);
      const data = await res.json();
      if (!data.erro) {
        setFormData((prev) => ({
          ...prev,
          street: data.logradouro || prev.street,
          neighborhood: data.bairro || prev.neighborhood,
          city: data.localidade || prev.city,
          state: data.uf || prev.state,
        }));
      }
    } catch {
      // Ignore ViaCEP failure
    } finally {
      setLoadingCep(false);
    }
  };

  const handleDelete = async () => {
    if (!employee) return;
    if (
      confirm(
        `Tem certeza que deseja excluir o cadastro de ${employee.name}? Todos os contratos vinculados a este funcionário também serão removidos.`,
      )
    ) {
      setLoading(true);
      try {
        await deleteEmployee(employee.id);
        setOpen(false);
        router.refresh();
      } catch (err) {
        console.error(err);
        alert("Erro ao excluir funcionário.");
      } finally {
        setLoading(false);
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (
      !formData.name.trim() ||
      !formData.phone.trim() ||
      !formData.role.trim()
    ) {
      alert("Preencha Nome, Telefone e Cargo/Função.");
      return;
    }

    setLoading(true);
    try {
      const payload = {
        ...formData,
        amount: parseMoneyInput(formData.amount),
        hireDate: formData.hireDate || null,
      };

      if (employee?.id) {
        await updateEmployee(employee.id, payload);
      } else {
        await createEmployee(payload);
      }
      setOpen(false);
      router.refresh();
    } catch (err) {
      console.error(err);
      alert("Erro ao salvar dados do funcionário.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={trigger} />
      <DialogContent className="w-full max-w-[calc(100%-1.5rem)] sm:max-w-3xl max-h-[92vh] overflow-y-auto p-4 sm:p-6">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-slate-900">
            {employee
              ? "Editar Funcionário / Prestador"
              : "Novo Funcionário / Prestador de Serviço"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-5 pt-2">
          {/* 1. Dados Pessoais e Contato */}
          <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-3.5">
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#ae4d30]">
              1. Dados Pessoais e Contato
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="sm:col-span-2 space-y-1">
                <Label htmlFor="emp-name">Nome Completo / Razão Social *</Label>
                <Input
                  id="emp-name"
                  required
                  placeholder="Ex: Maria Clara Souza"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  className="bg-white"
                />
              </div>

              <div className="space-y-1">
                <Label htmlFor="emp-cpf">CPF ou CNPJ</Label>
                <Input
                  id="emp-cpf"
                  placeholder="000.000.000-00 ou 00.000.000/0001-00"
                  value={formData.cpfCnpj}
                  onChange={(e) =>
                    setFormData({ ...formData, cpfCnpj: e.target.value })
                  }
                  className="bg-white"
                />
              </div>

              <div className="space-y-1">
                <Label htmlFor="emp-rg">RG / Documento</Label>
                <Input
                  id="emp-rg"
                  placeholder="Ex: 12.345.678-9"
                  value={formData.rg}
                  onChange={(e) =>
                    setFormData({ ...formData, rg: e.target.value })
                  }
                  className="bg-white"
                />
              </div>

              <div className="space-y-1">
                <Label htmlFor="emp-phone">Telefone / WhatsApp *</Label>
                <Input
                  id="emp-phone"
                  required
                  placeholder="(22) 99999-9999"
                  value={formData.phone}
                  onChange={(e) =>
                    setFormData({ ...formData, phone: e.target.value })
                  }
                  className="bg-white"
                />
              </div>

              <div className="space-y-1">
                <Label htmlFor="emp-email">E-mail</Label>
                <Input
                  id="emp-email"
                  type="email"
                  placeholder="email@exemplo.com"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  className="bg-white"
                />
              </div>
            </div>
          </div>

          {/* 2. Cargo, Serviço e Vínculo */}
          <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-3.5">
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#ae4d30]">
              2. Função, Tipo de Serviço e Vínculo
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="sm:col-span-2 space-y-1">
                <Label htmlFor="emp-role">Cargo / Função Principal *</Label>
                <Input
                  id="emp-role"
                  required
                  placeholder="Ex: Auxiliar Administrativo, Babá, Social Media, Enfermeira, Limpeza..."
                  value={formData.role}
                  onChange={(e) =>
                    setFormData({ ...formData, role: e.target.value })
                  }
                  className="bg-white"
                />
              </div>

              <div className="space-y-1">
                <Label htmlFor="emp-contract-type">Modalidade / Vínculo</Label>
                <select
                  id="emp-contract-type"
                  value={formData.contractType}
                  onChange={(e) =>
                    setFormData({ ...formData, contractType: e.target.value })
                  }
                  className="flex h-10 w-full rounded-md border border-input bg-white px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  <option value="PJ">Prestador de Serviço (PJ)</option>
                  <option value="MEI">MEI</option>
                  <option value="AUTONOMO">Autônomo / Recibo</option>
                  <option value="CLT">CLT (Salário / Carteira)</option>
                  <option value="DIARISTA">Diarista / Plantonista</option>
                  <option value="TEMPORARIO">Temporário</option>
                </select>
              </div>

              <div className="sm:col-span-3 space-y-1">
                <Label htmlFor="emp-service-type">
                  Descrição / Tipo de Serviço Prestado
                </Label>
                <Input
                  id="emp-service-type"
                  placeholder="Ex: Gestão de atendimento ao cliente, suporte administrativo, plantões domiciliares..."
                  value={formData.serviceType}
                  onChange={(e) =>
                    setFormData({ ...formData, serviceType: e.target.value })
                  }
                  className="bg-white"
                />
              </div>

              <div className="space-y-1">
                <Label htmlFor="emp-regime">Jornada / Regime de Trabalho</Label>
                <Input
                  id="emp-regime"
                  placeholder="Ex: Seg a Sex (08h às 17h), 12x36, Sob demanda"
                  value={formData.workRegime}
                  onChange={(e) =>
                    setFormData({ ...formData, workRegime: e.target.value })
                  }
                  className="bg-white"
                />
              </div>

              <div className="space-y-1">
                <Label htmlFor="emp-hire-date">Data de Início / Admissão</Label>
                <Input
                  id="emp-hire-date"
                  type="date"
                  value={formData.hireDate}
                  onChange={(e) =>
                    setFormData({ ...formData, hireDate: e.target.value })
                  }
                  className="bg-white"
                />
              </div>

              <div className="space-y-1">
                <Label htmlFor="emp-status">Status</Label>
                <select
                  id="emp-status"
                  value={formData.status}
                  onChange={(e) =>
                    setFormData({ ...formData, status: e.target.value })
                  }
                  className="flex h-10 w-full rounded-md border border-input bg-white px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  <option value="ACTIVE">Ativo(a)</option>
                  <option value="ON_LEAVE">Em Férias / Afastado(a)</option>
                  <option value="INACTIVE">Inativo(a) / Desligado(a)</option>
                </select>
              </div>
            </div>
          </div>

          {/* 3. Remuneração e Método de Pagamento */}
          <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-3.5">
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#ae4d30]">
              3. Remuneração, Valores e Método de Pagamento
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="space-y-1">
                <Label htmlFor="emp-cycle">Periodicidade do Valor</Label>
                <select
                  id="emp-cycle"
                  value={formData.billingCycle}
                  onChange={(e) =>
                    setFormData({ ...formData, billingCycle: e.target.value })
                  }
                  className="flex h-10 w-full rounded-md border border-input bg-white px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  <option value="SALARY">Salário Mensal</option>
                  <option value="MONTHLY">Valor Mensal (Fixo)</option>
                  <option value="BIWEEKLY">Valor Quinzenal</option>
                  <option value="WEEKLY">Valor Semanal</option>
                  <option value="DAILY">Valor por Diária / Plantão</option>
                  <option value="PER_SERVICE">
                    Valor por Serviço / Demanda
                  </option>
                </select>
              </div>

              <div className="space-y-1">
                <Label htmlFor="emp-amount">Valor (R$)</Label>
                <Input
                  id="emp-amount"
                  type="text"
                  inputMode="decimal"
                  placeholder="Ex: 2500.00"
                  value={formData.amount}
                  onChange={(e) =>
                    setFormData({ ...formData, amount: e.target.value })
                  }
                  className="bg-white"
                />
              </div>

              <div className="space-y-1">
                <Label htmlFor="emp-pay-method">Método de Pagamento</Label>
                <select
                  id="emp-pay-method"
                  value={formData.paymentMethod}
                  onChange={(e) =>
                    setFormData({ ...formData, paymentMethod: e.target.value })
                  }
                  className="flex h-10 w-full rounded-md border border-input bg-white px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
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

              <div className="space-y-1">
                <Label htmlFor="emp-pix">Chave PIX</Label>
                <Input
                  id="emp-pix"
                  placeholder="CPF, CNPJ, E-mail, Telefone ou Aleatória"
                  value={formData.pixKey}
                  onChange={(e) =>
                    setFormData({ ...formData, pixKey: e.target.value })
                  }
                  className="bg-white"
                />
              </div>

              <div className="space-y-1">
                <Label htmlFor="emp-bank">Dados Bancários (Opcional)</Label>
                <Input
                  id="emp-bank"
                  placeholder="Ex: Banco Itaú, Ag 0001, CC 12345-6"
                  value={formData.bankDetails}
                  onChange={(e) =>
                    setFormData({ ...formData, bankDetails: e.target.value })
                  }
                  className="bg-white"
                />
              </div>

              <div className="space-y-1">
                <Label htmlFor="emp-pay-day">Dia / Regra de Pagamento</Label>
                <Input
                  id="emp-pay-day"
                  placeholder="Ex: Todo dia 05, Toda sexta-feira"
                  value={formData.paymentDay}
                  onChange={(e) =>
                    setFormData({ ...formData, paymentDay: e.target.value })
                  }
                  className="bg-white"
                />
              </div>
            </div>
          </div>

          {/* 4. Endereço e Observações */}
          <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-3.5">
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#ae4d30]">
              4. Endereço e Observações (Para Contratos)
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
              <div className="space-y-1">
                <Label htmlFor="emp-cep">
                  CEP {loadingCep && "(Buscando...)"}
                </Label>
                <Input
                  id="emp-cep"
                  placeholder="00000-000"
                  value={formData.zipCode}
                  onChange={(e) =>
                    setFormData({ ...formData, zipCode: e.target.value })
                  }
                  onBlur={handleZipCodeBlur}
                  className="bg-white"
                />
              </div>

              <div className="sm:col-span-2 space-y-1">
                <Label htmlFor="emp-street">Rua / Logradouro</Label>
                <Input
                  id="emp-street"
                  placeholder="Ex: Rua das Flores"
                  value={formData.street}
                  onChange={(e) =>
                    setFormData({ ...formData, street: e.target.value })
                  }
                  className="bg-white"
                />
              </div>

              <div className="space-y-1">
                <Label htmlFor="emp-number">Número</Label>
                <Input
                  id="emp-number"
                  placeholder="Ex: 120"
                  value={formData.number}
                  onChange={(e) =>
                    setFormData({ ...formData, number: e.target.value })
                  }
                  className="bg-white"
                />
              </div>

              <div className="space-y-1">
                <Label htmlFor="emp-comp">Complemento</Label>
                <Input
                  id="emp-comp"
                  placeholder="Apto, Bloco..."
                  value={formData.complement}
                  onChange={(e) =>
                    setFormData({ ...formData, complement: e.target.value })
                  }
                  className="bg-white"
                />
              </div>

              <div className="space-y-1">
                <Label htmlFor="emp-neigh">Bairro</Label>
                <Input
                  id="emp-neigh"
                  placeholder="Bairro"
                  value={formData.neighborhood}
                  onChange={(e) =>
                    setFormData({ ...formData, neighborhood: e.target.value })
                  }
                  className="bg-white"
                />
              </div>

              <div className="space-y-1">
                <Label htmlFor="emp-city">Cidade</Label>
                <Input
                  id="emp-city"
                  placeholder="Cidade"
                  value={formData.city}
                  onChange={(e) =>
                    setFormData({ ...formData, city: e.target.value })
                  }
                  className="bg-white"
                />
              </div>

              <div className="space-y-1">
                <Label htmlFor="emp-state">UF</Label>
                <Input
                  id="emp-state"
                  maxLength={2}
                  placeholder="RJ"
                  value={formData.state}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      state: e.target.value.toUpperCase(),
                    })
                  }
                  className="bg-white"
                />
              </div>

              <div className="sm:col-span-4 space-y-1">
                <Label htmlFor="emp-notes">Observações Internas</Label>
                <textarea
                  id="emp-notes"
                  rows={2}
                  placeholder="Anotações sobre horários, acordos específicos, documentos..."
                  value={formData.notes}
                  onChange={(e) =>
                    setFormData({ ...formData, notes: e.target.value })
                  }
                  className="flex w-full rounded-md border border-input bg-white px-3 py-2 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                />
              </div>
            </div>
          </div>

          <div className="pt-3 border-t border-slate-100 flex flex-col-reverse sm:flex-row sm:justify-between items-stretch sm:items-center gap-2">
            <div>
              {employee?.id && (
                <Button
                  type="button"
                  variant="destructive"
                  onClick={handleDelete}
                  disabled={loading}
                  className="w-full sm:w-auto"
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Excluir
                </Button>
              )}
            </div>
            <div className="flex flex-col-reverse sm:flex-row gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setOpen(false)}
                className="w-full sm:w-auto"
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                disabled={loading}
                className="bg-primary text-white hover:bg-primary/90 w-full sm:w-auto min-w-[140px]"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin mr-2" />
                    Salvando...
                  </>
                ) : (
                  "Salvar Funcionário"
                )}
              </Button>
            </div>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
