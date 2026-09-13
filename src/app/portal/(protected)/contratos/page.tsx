import { CheckCircle2, Download, FileText } from "lucide-react";
import { headers } from "next/headers";
import Link from "next/link";
import { auth } from "@/infrastructure/auth/auth";
import { prisma } from "@/infrastructure/db/prisma";

export default async function PortalContratos() {
  const headersList = await headers();
  const session = await auth.api.getSession({ headers: headersList });

  const client = await prisma.client.findFirst({
    where: { userId: session?.user?.id },
    include: {
      bookings: {
        include: {
          contract: true,
          packages: true,
        },
        orderBy: {
          createdAt: "desc",
        },
      },
    },
  });

  if (!client) {
    return (
      <div className="p-4">
        <h1>Perfil não encontrado.</h1>
      </div>
    );
  }

  // Find bookings that have a contract
  const bookingsWithContract = client.bookings.filter((b) => b.contract);

  return (
    <div className="flex flex-col gap-6">
      <header className="flex flex-col gap-2">
        <h1 className="text-2xl font-bold font-heading text-[#411f03]">
          Meus Contratos
        </h1>
        <p className="text-[#444840]">
          Aqui você pode assinar seus contratos pendentes e baixar os que já
          foram assinados.
        </p>
      </header>

      <section className="flex flex-col gap-4">
        {bookingsWithContract.length === 0 ? (
          <div className="bg-white p-6 rounded-2xl border border-[#e4e2de] shadow-sm">
            <p className="text-[#7d7a75]">
              Você não possui contratos emitidos no momento.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {bookingsWithContract.map((booking) => {
              const contract = booking.contract!;
              const isSigned = contract.signedByClient;

              return (
                <div
                  key={contract.id}
                  className="bg-white border border-[#e4e2de] rounded-2xl p-6 shadow-sm flex flex-col gap-4"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-10 h-10 rounded-full flex items-center justify-center ${isSigned ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"}`}
                      >
                        {isSigned ? (
                          <CheckCircle2 className="w-5 h-5" />
                        ) : (
                          <FileText className="w-5 h-5" />
                        )}
                      </div>
                      <div>
                        <h3 className="font-bold text-[#411f03]">
                          Contrato de Prestação de Serviços
                        </h3>
                        <p className="text-sm text-[#7d7a75]">
                          Ref: {booking.packages.map((p) => p.name).join(" + ")}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-[#f0eee9] flex items-center justify-between">
                    <span
                      className={`text-sm font-bold ${isSigned ? "text-green-700" : "text-yellow-700"}`}
                    >
                      {isSigned ? "Assinado" : "Pendente de Assinatura"}
                    </span>

                    {isSigned ? (
                      contract.pdfUrl ? (
                        <a
                          href={contract.pdfUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-2 text-[#af4d30] font-medium text-sm hover:underline"
                        >
                          <Download className="w-4 h-4" /> Baixar PDF
                        </a>
                      ) : (
                        <span className="text-xs text-gray-400">
                          PDF indisponível
                        </span>
                      )
                    ) : (
                      <Link
                        href={`/contrato/${contract.id}`}
                        className="px-4 py-2 bg-[#af4d30] hover:bg-[#af4d30]/90 text-white rounded-lg text-sm font-semibold transition-colors"
                      >
                        Ler e Assinar
                      </Link>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
}
