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
      contracts: {
        orderBy: {
          createdAt: "desc",
        },
      },
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

  // Combine contracts from client.contracts and bookings
  const contractsMap = new Map<
    string,
    (typeof client.contracts)[0] & { packageName?: string }
  >();

  for (const c of client.contracts) {
    contractsMap.set(c.id, c);
  }
  for (const b of client.bookings) {
    if (b.contract) {
      contractsMap.set(b.contract.id, {
        ...b.contract,
        packageName: b.packages.map((p) => p.name).join(" + "),
      });
    }
  }

  const allContracts = Array.from(contractsMap.values());

  return (
    <div className="flex flex-col gap-6">
      <header className="flex flex-col gap-2">
        <h1 className="text-2xl font-bold font-heading text-[#411f03]">
          Meus Contratos
        </h1>
        <p className="text-[#444840]">
          Aqui você pode assinar seus contratos pendentes e acessar os
          documentos assinados por ambas as partes.
        </p>
      </header>

      <section className="flex flex-col gap-4">
        {allContracts.length === 0 ? (
          <div className="bg-white p-6 rounded-2xl border border-[#e4e2de] shadow-sm">
            <p className="text-[#7d7a75]">
              Você não possui contratos emitidos no momento.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {allContracts.map((contract) => {
              const isSigned = contract.signedByClient;

              return (
                <div
                  key={contract.id}
                  className="bg-white border border-[#e4e2de] rounded-2xl p-6 shadow-sm flex flex-col gap-4"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-10 h-10 rounded-full flex items-center justify-center ${
                          isSigned
                            ? "bg-green-100 text-green-700"
                            : "bg-yellow-100 text-yellow-700"
                        }`}
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
                        {contract.packageName && (
                          <p className="text-sm text-[#7d7a75]">
                            Ref: {contract.packageName}
                          </p>
                        )}
                        {contract.validityDescription && (
                          <p className="text-xs text-slate-500">
                            Vigência: {contract.validityDescription}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-[#f0eee9] flex items-center justify-between">
                    <span
                      className={`text-sm font-bold ${
                        isSigned ? "text-green-700" : "text-yellow-700"
                      }`}
                    >
                      {isSigned
                        ? "Assinado por ambas as partes"
                        : "Pendente de Assinatura"}
                    </span>

                    <Link
                      href={`/contrato/${contract.id}`}
                      className={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors flex items-center gap-2 ${
                        isSigned
                          ? "bg-slate-100 hover:bg-slate-200 text-slate-800"
                          : "bg-[#af4d30] hover:bg-[#af4d30]/90 text-white"
                      }`}
                    >
                      {isSigned ? (
                        <>
                          <Download className="w-4 h-4 text-[#af4d30]" />{" "}
                          Visualizar / PDF
                        </>
                      ) : (
                        "Ler e Assinar"
                      )}
                    </Link>
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
