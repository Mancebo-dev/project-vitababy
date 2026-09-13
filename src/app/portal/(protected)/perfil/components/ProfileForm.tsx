"use client";

import { useState } from "react";
import { updateClientProfile } from "../actions";

interface ProfileFormProps {
  client: {
    id: string;
    name: string;
    cpf: string | null;
    phone: string | null;
    zipCode: string | null;
    address: string | null;
  };
}

export function ProfileForm({ client }: ProfileFormProps) {
  const [isPending, setIsPending] = useState(false);
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsPending(true);
    setMessage(null);

    const formData = new FormData(e.currentTarget);
    const phone = formData.get("phone") as string;
    const zipCode = formData.get("zipCode") as string;
    const address = formData.get("address") as string;

    const res = await updateClientProfile(client.id, {
      phone,
      zipCode,
      address,
    });

    setIsPending(false);
    if (res.success) {
      setMessage({ type: "success", text: "Dados atualizados com sucesso!" });
    } else {
      setMessage({ type: "error", text: res.error || "Ocorreu um erro." });
    }
  };

  return (
    <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
      <h3 className="font-bold text-[#411f03] text-lg">Dados Cadastrais</h3>

      {message && (
        <div
          className={`p-3 rounded-lg text-sm font-medium ${
            message.type === "success"
              ? "bg-green-50 text-green-700"
              : "bg-red-50 text-red-700"
          }`}
        >
          {message.text}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label
            htmlFor="name"
            className="block text-sm font-semibold text-[#411f03] mb-1"
          >
            Nome Completo
          </label>
          <input
            id="name"
            type="text"
            defaultValue={client.name}
            className="w-full px-4 py-2 border border-[#e4e2de] rounded-xl bg-[#fbf9f5] focus:border-[#af4d30] outline-none"
            readOnly
          />
        </div>
        <div>
          <label
            htmlFor="cpf"
            className="block text-sm font-semibold text-[#411f03] mb-1"
          >
            CPF
          </label>
          <input
            id="cpf"
            type="text"
            defaultValue={client.cpf || ""}
            className="w-full px-4 py-2 border border-[#e4e2de] rounded-xl bg-[#fbf9f5] focus:border-[#af4d30] outline-none"
            readOnly
          />
        </div>
        <div>
          <label
            htmlFor="phone"
            className="block text-sm font-semibold text-[#411f03] mb-1"
          >
            WhatsApp
          </label>
          <input
            id="phone"
            type="text"
            name="phone"
            defaultValue={client.phone || ""}
            className="w-full px-4 py-2 border border-[#e4e2de] rounded-xl bg-white focus:border-[#af4d30] outline-none"
          />
        </div>
        <div>
          <label
            htmlFor="zipCode"
            className="block text-sm font-semibold text-[#411f03] mb-1"
          >
            CEP
          </label>
          <input
            id="zipCode"
            type="text"
            name="zipCode"
            defaultValue={client.zipCode || ""}
            className="w-full px-4 py-2 border border-[#e4e2de] rounded-xl bg-white focus:border-[#af4d30] outline-none"
          />
        </div>
        <div className="md:col-span-2">
          <label
            htmlFor="address"
            className="block text-sm font-semibold text-[#411f03] mb-1"
          >
            Endereço Completo
          </label>
          <input
            id="address"
            type="text"
            name="address"
            defaultValue={client.address || ""}
            className="w-full px-4 py-2 border border-[#e4e2de] rounded-xl bg-white focus:border-[#af4d30] outline-none"
          />
        </div>
      </div>

      <div className="flex justify-end pt-4">
        <button
          type="submit"
          disabled={isPending}
          className="px-6 py-2.5 bg-[#411f03] text-white rounded-xl font-semibold hover:bg-[#411f03]/90 transition-colors disabled:opacity-50"
        >
          {isPending ? "Salvando..." : "Salvar Alterações"}
        </button>
      </div>
    </form>
  );
}
