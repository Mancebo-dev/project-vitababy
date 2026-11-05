"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import type {
  Booking,
  Client,
  ClientSchedule,
  ContractTemplate,
  Professional,
  ScheduleSlot,
  Service,
  ServicePackage,
} from "@prisma/client";
import { Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { RichEditor } from "@/components/ui/rich-editor";
import { createContract } from "../actions";

const schema = z.object({
  clientId: z.string().min(1, "Selecione um cliente"),
  bookingId: z.string().optional(),
  scheduleId: z.string().optional(),
  templateId: z.string().min(1, "Selecione um modelo base"),
  customContent: z.string().optional(),
  serviceName: z.string().optional(),
  serviceDetails: z.string().optional(),
  serviceDate: z.string().optional(),
  serviceTime: z.string().optional(),
  serviceProfessional: z.string().optional(),
  scale: z.string().optional(),
  extraNotes: z.string().optional(),
  addImageClause: z.boolean().optional(),
  totalValue: z.string().optional(),
  monthlyValue: z.string().optional(),
  dailyValue: z.string().optional(),
  validityDescription: z.string().optional(),
  workRegime: z.string().optional(),
});

type FormData = z.infer<typeof schema>;

function parseMoneyInput(val?: string): number | null {
  if (!val || !val.trim()) return null;
  const normalized = val.trim().replace(",", ".");
  const parsed = Number.parseFloat(normalized);
  return Number.isNaN(parsed) ? null : parsed;
}

function toInputDateValue(d?: Date | string | null): string {
  if (!d) return "";
  if (typeof d === "string") {
    if (/^\d{4}-\d{2}-\d{2}$/.test(d.trim())) return d.trim();
    if (/^\d{2}\/\d{2}\/\d{4}$/.test(d.trim())) {
      const [day, month, year] = d.trim().split("/");
      return `${year}-${month}-${day}`;
    }
  }
  const dateObj = new Date(d);
  if (Number.isNaN(dateObj.getTime())) return "";
  return dateObj.toISOString().split("T")[0];
}

export function CreateContractModal({
  pendingBookings,
  templates,
  clients,
  clientSchedules,
  professionals = [],
}: {
  pendingBookings: (Booking & {
    client?: Client | null;
    professional?: Professional | null;
    packages?: (ServicePackage & { service: Service | null })[];
    scheduleSlot: ScheduleSlot & { professional?: Professional | null };
  })[];
  templates: ContractTemplate[];
  clients: Client[];
  clientSchedules: (ClientSchedule & { client: Client })[];
  professionals?: Professional[];
}) {
  const [open, setOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isEditingTemplate, setIsEditingTemplate] = useState(false);
  const [customProfMode, setCustomProfMode] = useState(false);
  const router = useRouter();

  const form = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      clientId: "",
      bookingId: "",
      scheduleId: "",
      templateId: "",
      customContent: "",
      serviceName: "",
      serviceDetails: "",
      serviceDate: "",
      serviceTime: "",
      serviceProfessional: "",
      scale: "",
      extraNotes: "",
      addImageClause: false,
      totalValue: "",
      monthlyValue: "",
      dailyValue: "",
      validityDescription: "",
      workRegime: "",
    },
  });

  const selectedTemplateId = form.watch("templateId");
  const selectedClientId = form.watch("clientId");

  const filteredBookings = selectedClientId
    ? pendingBookings.filter((b) => b.clientId === selectedClientId)
    : pendingBookings;

  const filteredSchedules = selectedClientId
    ? clientSchedules.filter((s) => s.clientId === selectedClientId)
    : clientSchedules;

  const handleBookingChange = (bookingId: string) => {
    form.setValue("bookingId", bookingId);
    if (!bookingId) return;
    const booking = pendingBookings.find((b) => b.id === bookingId);
    if (!booking) return;

    if (booking.clientId && !form.getValues("clientId")) {
      form.setValue("clientId", booking.clientId);
    }

    const pkgNames = booking.packages?.map((p) => p.name).join(" + ") || "";
    if (pkgNames) {
      form.setValue("serviceName", pkgNames);
    }

    const slotDate = toInputDateValue(booking.scheduleSlot?.date);
    if (slotDate) {
      form.setValue("serviceDate", slotDate);
    }

    const start = booking.scheduleSlot?.startTime || "";
    const end = booking.scheduleSlot?.endTime || "";
    if (start) {
      form.setValue("serviceTime", end ? `${start} às ${end}` : start);
    }

    const profName =
      booking.scheduleSlot?.professional?.name ||
      booking.professional?.name ||
      "";
    if (profName) {
      form.setValue("serviceProfessional", profName);
    }

    const total =
      (booking.packages?.reduce((sum, p) => sum + (p.price || 0), 0) || 0) +
      (booking.transportFee || 0);
    if (total > 0 && !form.getValues("totalValue")) {
      form.setValue("totalValue", String(total));
    }
  };

  const handleScheduleChange = (scheduleId: string) => {
    form.setValue("scheduleId", scheduleId);
    if (!scheduleId) return;
    const sched = clientSchedules.find((s) => s.id === scheduleId);
    if (!sched) return;

    if (sched.clientId && !form.getValues("clientId")) {
      form.setValue("clientId", sched.clientId);
    }
    if (!form.getValues("serviceName")) {
      form.setValue("serviceName", sched.title || `Escala ${sched.month}`);
    }
  };

  const handleEditTemplate = () => {
    if (!selectedTemplateId) {
      alert("Selecione um modelo base primeiro.");
      return;
    }
    const currentCustom = form.getValues("customContent");
    if (!currentCustom) {
      const template = templates.find((t) => t.id === selectedTemplateId);
      if (template) {
        form.setValue("customContent", template.content);
      }
    }
    setIsEditingTemplate(true);
  };

  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true);
    try {
      await createContract({
        ...data,
        serviceName: data.serviceName?.trim() || null,
        serviceDetails: data.serviceDetails?.trim() || null,
        serviceDate: data.serviceDate?.trim() || null,
        serviceTime: data.serviceTime?.trim() || null,
        serviceProfessional: data.serviceProfessional?.trim() || null,
        totalValue: parseMoneyInput(data.totalValue),
        monthlyValue: parseMoneyInput(data.monthlyValue),
        dailyValue: parseMoneyInput(data.dailyValue),
        validityDescription: data.validityDescription?.trim() || null,
        workRegime: data.workRegime?.trim() || null,
      });
      setOpen(false);
      setIsEditingTemplate(false);
      form.reset();
      router.refresh();
    } catch (error) {
      console.error(error);
      alert(error instanceof Error ? error.message : "Erro ao criar contrato");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(nextOpen) => {
        setOpen(nextOpen);
        if (!nextOpen) {
          setIsEditingTemplate(false);
        }
      }}
    >
      <DialogTrigger className="inline-flex items-center gap-1.5 bg-primary text-white px-3 sm:px-4 py-2 sm:py-2.5 rounded-lg hover:bg-primary/90 transition-colors font-medium cursor-pointer shadow-xs min-h-[40px]">
        <Plus className="w-5 h-5 shrink-0" />
        <span className="hidden sm:inline">Novo Contrato de Cliente</span>
        <span className="sm:hidden font-medium text-xs">Novo</span>
      </DialogTrigger>
      <DialogContent className="w-full max-w-[calc(100%-1.5rem)] sm:max-w-2xl lg:max-w-3xl max-h-[90vh] overflow-y-auto p-4 sm:p-6">
        <DialogHeader>
          <DialogTitle>Gerar Contrato para Cliente</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-4 pt-2"
          >
            {isEditingTemplate ? (
              <div className="space-y-4">
                <FormField
                  control={form.control}
                  name="customContent"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Editar Texto do Contrato</FormLabel>
                      <FormControl>
                        <RichEditor
                          value={field.value || ""}
                          onChange={field.onChange}
                          a4Mode={true}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-2 pt-4 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => setIsEditingTemplate(false)}
                    className="w-full sm:w-auto px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-md hover:bg-slate-50"
                  >
                    Voltar aos Campos
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full sm:w-auto px-4 py-2 text-sm font-medium text-white bg-primary rounded-md hover:bg-primary/90 disabled:opacity-50"
                  >
                    {isSubmitting ? "Gerando..." : "Gerar Contrato"}
                  </button>
                </div>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <FormField
                    control={form.control}
                    name="clientId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Cliente / Paciente *</FormLabel>
                        <FormControl>
                          <select
                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                            {...field}
                          >
                            <option value="">Selecione um cliente...</option>
                            {clients.map((c) => (
                              <option key={c.id} value={c.id}>
                                {c.name}
                              </option>
                            ))}
                          </select>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="templateId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Modelo Base (Template) *</FormLabel>
                        <FormControl>
                          <select
                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                            value={field.value}
                            onChange={(e) => {
                              field.onChange(e.target.value);
                              const tmpl = templates.find(
                                (t) => t.id === e.target.value,
                              );
                              form.setValue(
                                "customContent",
                                tmpl ? tmpl.content : "",
                              );
                            }}
                          >
                            <option value="">
                              Selecione um modelo base...
                            </option>
                            {templates.map((t) => (
                              <option key={t.id} value={t.id}>
                                {t.title}
                              </option>
                            ))}
                          </select>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <FormField
                    control={form.control}
                    name="bookingId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Agendamento (Opcional)</FormLabel>
                        <FormControl>
                          <select
                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                            value={field.value}
                            onChange={(e) =>
                              handleBookingChange(e.target.value)
                            }
                          >
                            <option value="">Nenhum...</option>
                            {filteredBookings.map((b) => (
                              <option key={b.id} value={b.id}>
                                {b.client?.name ? `${b.client.name} — ` : ""}
                                {new Date(
                                  b.scheduleSlot.date,
                                ).toLocaleDateString("pt-BR")}
                                {b.scheduleSlot.startTime
                                  ? ` às ${b.scheduleSlot.startTime}`
                                  : ""}{" "}
                                - {b.packages?.map((p) => p.name).join(" + ")}
                              </option>
                            ))}
                          </select>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="scheduleId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Escala (Opcional)</FormLabel>
                        <FormControl>
                          <select
                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                            value={field.value}
                            onChange={(e) =>
                              handleScheduleChange(e.target.value)
                            }
                          >
                            <option value="">Nenhuma...</option>
                            {filteredSchedules.map((s) => (
                              <option key={s.id} value={s.id}>
                                {s.client?.name ? `${s.client.name} — ` : ""}
                                {s.title || `Escala ${s.month}`} ({s.month})
                              </option>
                            ))}
                          </select>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Objeto do Contrato: Serviço, Assessora, Data e Horário */}
                <div className="p-3.5 bg-slate-50 rounded-lg border border-slate-200 space-y-3">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-700 block">
                    Objeto do Contrato (Serviço, Data, Horário e Assessora)
                  </span>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <FormField
                      control={form.control}
                      name="serviceName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>
                            Nome do Serviço / Objeto Contratado
                          </FormLabel>
                          <FormControl>
                            <input
                              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                              placeholder="Ex: Assistência Especializada - 6h de permanência"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="serviceProfessional"
                      render={({ field }) => (
                        <FormItem>
                          <div className="flex items-center justify-between">
                            <FormLabel>Assessora / Profissional</FormLabel>
                            <button
                              type="button"
                              onClick={() => setCustomProfMode(!customProfMode)}
                              className="text-[11px] text-primary hover:underline font-medium"
                            >
                              {customProfMode
                                ? "Selecionar da lista"
                                : "Digitar manualmente"}
                            </button>
                          </div>
                          <FormControl>
                            {customProfMode || professionals.length === 0 ? (
                              <input
                                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                                placeholder="Digite o nome da profissional..."
                                {...field}
                              />
                            ) : (
                              <select
                                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                                value={field.value || ""}
                                onChange={(e) => {
                                  if (e.target.value === "__custom__") {
                                    setCustomProfMode(true);
                                    field.onChange("");
                                  } else {
                                    field.onChange(e.target.value);
                                  }
                                }}
                              >
                                <option value="">
                                  Selecione a assessora (ou deixe em branco)...
                                </option>
                                {professionals.map((p) => (
                                  <option key={p.id} value={p.name}>
                                    {p.name}
                                  </option>
                                ))}
                                <option value="__custom__">
                                  Outro nome (digitar)...
                                </option>
                              </select>
                            )}
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <FormField
                      control={form.control}
                      name="serviceDate"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Data do Atendimento</FormLabel>
                          <FormControl>
                            <input
                              type="date"
                              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="serviceTime"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Horário do Atendimento (Horas)</FormLabel>
                          <FormControl>
                            <input
                              type="text"
                              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                              placeholder="Ex: 19:00 ou 19:00 às 01:00"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="serviceDetails"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Detalhes Adicionais (Opcional)</FormLabel>
                          <FormControl>
                            <input
                              type="text"
                              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                              placeholder="Ex: Plantão noturno domiciliar"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>

                {/* Competência e Regime */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-3 bg-slate-50 rounded-lg border border-slate-200">
                  <FormField
                    control={form.control}
                    name="validityDescription"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Competência / Validade</FormLabel>
                        <FormControl>
                          <input
                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                            placeholder="Ex: 3 meses (outubro, novembro e dezembro de 2026)"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="workRegime"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Regime de Atendimento</FormLabel>
                        <FormControl>
                          <input
                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                            placeholder="Ex: dias úteis da semana (de segunda-feira à sexta-feira)"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Valores Financeiros */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-3 bg-slate-50 rounded-lg border border-slate-200">
                  <FormField
                    control={form.control}
                    name="totalValue"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Valor Total (R$)</FormLabel>
                        <FormControl>
                          <input
                            type="text"
                            inputMode="decimal"
                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                            placeholder="Ex: 3500.00"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="monthlyValue"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Valor Mensal (R$)</FormLabel>
                        <FormControl>
                          <input
                            type="text"
                            inputMode="decimal"
                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                            placeholder="Ex: 1200.00"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="dailyValue"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Valor Diária (R$)</FormLabel>
                        <FormControl>
                          <input
                            type="text"
                            inputMode="decimal"
                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                            placeholder="Ex: 250.00"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="scale"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        Observação de Escala (Opcional, ex: 12x36)
                      </FormLabel>
                      <FormControl>
                        <input
                          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                          placeholder="Ex: 12x36, 24x48..."
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="extraNotes"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Observações Extras (Opcional)</FormLabel>
                      <FormControl>
                        <textarea
                          className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                          placeholder="Adicione cláusulas específicas para esta cliente..."
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="addImageClause"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center space-x-3 space-y-0 p-4 border rounded-md">
                      <FormControl>
                        <input
                          type="checkbox"
                          checked={field.value}
                          onChange={field.onChange}
                          className="rounded border-slate-300 text-primary focus:ring-primary w-4 h-4"
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel>
                          Adicionar cláusula de uso de imagem
                        </FormLabel>
                      </div>
                    </FormItem>
                  )}
                />

                <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-2 pt-4 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => setOpen(false)}
                    className="w-full sm:w-auto px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-md hover:bg-slate-50"
                  >
                    Cancelar
                  </button>
                  <button
                    type="button"
                    onClick={handleEditTemplate}
                    disabled={!selectedTemplateId}
                    className="w-full sm:w-auto px-4 py-2 text-sm font-medium text-white bg-slate-900 rounded-md hover:bg-slate-800 disabled:opacity-50"
                  >
                    Editar Texto do Contrato
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full sm:w-auto px-4 py-2 text-sm font-medium text-white bg-primary rounded-md hover:bg-primary/90 disabled:opacity-50"
                  >
                    {isSubmitting ? "Gerando..." : "Gerar Contrato"}
                  </button>
                </div>
              </>
            )}
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
