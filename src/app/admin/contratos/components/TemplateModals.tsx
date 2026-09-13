"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Plus, Trash2 } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
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
import { Input } from "@/components/ui/input";
import { RichEditor } from "@/components/ui/rich-editor";
import {
  createContractTemplate,
  deleteContractTemplate,
  updateContractTemplate,
} from "../actions";

const templateSchema = z.object({
  title: z.string().min(3, "O título precisa ter pelo menos 3 caracteres"),
  content: z.string().min(10, "O conteúdo do contrato é obrigatório"),
});

const TEMPLATE_VARIABLES = [
  "{{NOME_CLIENTE}}",
  "{{CPF_CLIENTE}}",
  "{{ENDERECO_CLIENTE}}",
  "{{NOME_ASSESSORA}}",
  "{{SERVICO}}",
  "{{VALOR}}",
  "{{DATA_AGENDAMENTO}}",
];

export function CreateTemplateModal() {
  const [open, setOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<z.infer<typeof templateSchema>>({
    resolver: zodResolver(templateSchema),
    defaultValues: { title: "", content: "" },
  });

  async function onSubmit(values: z.infer<typeof templateSchema>) {
    setIsSubmitting(true);
    try {
      await createContractTemplate(values);
      setOpen(false);
      form.reset();
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger>
        <div className="inline-flex items-center gap-2 bg-primary text-white px-4 py-2.5 rounded-lg hover:bg-primary/90 transition-colors font-medium cursor-pointer shadow-xs">
          <Plus className="w-4 h-4" />
          Novo Modelo
        </div>
      </DialogTrigger>
      <DialogContent className="w-full sm:max-w-5xl lg:max-w-6xl h-[95vh] flex flex-col p-0 overflow-hidden bg-slate-100 rounded-2xl shadow-2xl">
        <DialogHeader className="px-6 py-4 border-b border-slate-200 bg-white flex flex-row items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <DialogTitle className="text-base font-bold text-slate-900">
              Novo Modelo de Contrato
            </DialogTitle>
            <span className="text-[11px] font-semibold bg-slate-100 text-slate-600 px-2.5 py-0.5 rounded-full border border-slate-200">
              Formato A4
            </span>
          </div>
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex-1 flex flex-col min-h-0 overflow-hidden"
          >
            {/* Scrollable Work Area */}
            <div className="flex-1 overflow-y-auto bg-slate-200/80 p-4 sm:p-8 flex flex-col items-center gap-6">
              {/* Informações Básicas e Variáveis */}
              <div className="w-full max-w-[210mm] bg-white p-5 rounded-xl border border-slate-300 shadow-xs space-y-4">
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="font-semibold text-slate-800">
                        Título do Modelo *
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Ex: Contrato Padrão de Consultoria - Vita Baby"
                          className="bg-slate-50"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="pt-2 border-t border-slate-100">
                  <span className="text-xs font-semibold text-slate-700 block mb-1.5">
                    Variáveis Dinâmicas Disponíveis:
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {TEMPLATE_VARIABLES.map((v) => (
                      <span
                        key={v}
                        className="font-mono text-[11px] bg-slate-100 text-primary px-2 py-0.5 rounded-md border border-slate-200 select-all"
                        title="Copie e cole no corpo do contrato"
                      >
                        {v}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Editor de Contrato em Formato A4 */}
              <div className="w-full max-w-[210mm]">
                <FormField
                  control={form.control}
                  name="content"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <RichEditor
                          value={field.value}
                          onChange={field.onChange}
                          a4Mode={true}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            {/* Sticky Action Footer */}
            <div className="p-4 bg-white border-t border-slate-200 flex justify-end gap-3 shrink-0">
              <Button
                type="button"
                variant="outline"
                onClick={() => setOpen(false)}
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting}
                className="bg-primary hover:bg-primary/90 text-white min-w-[140px]"
              >
                {isSubmitting ? "Salvando..." : "Salvar Modelo"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

export function EditTemplateModal({
  template,
}: {
  template: { id: string; title: string; content: string };
}) {
  const [open, setOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<z.infer<typeof templateSchema>>({
    resolver: zodResolver(templateSchema),
    defaultValues: { title: template.title, content: template.content },
  });

  async function onSubmit(values: z.infer<typeof templateSchema>) {
    setIsSubmitting(true);
    try {
      await updateContractTemplate(template.id, values);
      setOpen(false);
    } finally {
      setIsSubmitting(false);
    }
  }

  const handleDelete = async () => {
    if (confirm("Tem certeza que deseja excluir este modelo?")) {
      await deleteContractTemplate(template.id);
      setOpen(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger>
        <div className="text-sm font-medium text-primary hover:text-primary/80 cursor-pointer">
          Editar
        </div>
      </DialogTrigger>
      <DialogContent className="w-full sm:max-w-5xl lg:max-w-6xl h-[95vh] flex flex-col p-0 overflow-hidden bg-slate-100 rounded-2xl shadow-2xl">
        <DialogHeader className="px-6 py-4 border-b border-slate-200 bg-white flex flex-row items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <DialogTitle className="text-base font-bold text-slate-900">
              Editar Modelo de Contrato
            </DialogTitle>
            <span className="text-[11px] font-semibold bg-slate-100 text-slate-600 px-2.5 py-0.5 rounded-full border border-slate-200">
              Formato A4
            </span>
          </div>
          <button
            type="button"
            onClick={handleDelete}
            className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors mr-6"
            title="Excluir modelo"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex-1 flex flex-col min-h-0 overflow-hidden"
          >
            {/* Scrollable Work Area */}
            <div className="flex-1 overflow-y-auto bg-slate-200/80 p-4 sm:p-8 flex flex-col items-center gap-6">
              {/* Informações Básicas e Variáveis */}
              <div className="w-full max-w-[210mm] bg-white p-5 rounded-xl border border-slate-300 shadow-xs space-y-4">
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="font-semibold text-slate-800">
                        Título do Modelo *
                      </FormLabel>
                      <FormControl>
                        <Input className="bg-slate-50" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="pt-2 border-t border-slate-100">
                  <span className="text-xs font-semibold text-slate-700 block mb-1.5">
                    Variáveis Dinâmicas Disponíveis:
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {TEMPLATE_VARIABLES.map((v) => (
                      <span
                        key={v}
                        className="font-mono text-[11px] bg-slate-100 text-primary px-2 py-0.5 rounded-md border border-slate-200 select-all"
                        title="Copie e cole no corpo do contrato"
                      >
                        {v}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Editor de Contrato em Formato A4 */}
              <div className="w-full max-w-[210mm]">
                <FormField
                  control={form.control}
                  name="content"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <RichEditor
                          value={field.value}
                          onChange={field.onChange}
                          a4Mode={true}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            {/* Sticky Action Footer */}
            <div className="p-4 bg-white border-t border-slate-200 flex justify-end gap-3 shrink-0">
              <Button
                type="button"
                variant="outline"
                onClick={() => setOpen(false)}
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting}
                className="bg-primary hover:bg-primary/90 text-white min-w-[140px]"
              >
                {isSubmitting ? "Salvando..." : "Salvar Alterações"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
