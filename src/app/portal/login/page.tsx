import type { Metadata } from "next";
import { ClientLoginForm } from "./ClientLoginForm";

export const metadata: Metadata = {
  title: "Área do Cliente - Login | Vita Baby",
};

export default function PortalLoginPage() {
  return (
    <main className="flex min-h-[100dvh] flex-col items-center justify-center bg-[#fbf9f5] p-[1.5rem] lg:p-[4rem]">
      <ClientLoginForm />
    </main>
  );
}
