import { Calendar, Clock, MessageCircle, User as UserIcon } from "lucide-react";
import { headers } from "next/headers";
import { auth } from "@/infrastructure/auth/auth";
import { prisma } from "@/infrastructure/db/prisma";

export default async function PortalDashboard() {
  const headersList = await headers();
  const session = await auth.api.getSession({ headers: headersList });

  const client = await prisma.client.findFirst({
    where: { userId: session?.user?.id },
    include: {
      bookings: {
        include: {
          professional: true,
          scheduleSlot: true,
          packages: true,
        },
        orderBy: {
          createdAt: "desc",
        },
        take: 5,
      },
    },
  });

  if (!client) {
    return (
      <div className="p-4">
        <h1>Perfil de cliente não encontrado.</h1>
      </div>
    );
  }

  const upcomingBookings = client.bookings
    .filter(
      (b) =>
        new Date(b.scheduleSlot.date) >= new Date() && b.status !== "CANCELLED",
    )
    .sort(
      (a, b) =>
        new Date(a.scheduleSlot.date).getTime() -
        new Date(b.scheduleSlot.date).getTime(),
    );

  const pastBookings = client.bookings.filter(
    (b) =>
      new Date(b.scheduleSlot.date) < new Date() || b.status === "COMPLETED",
  );

  return (
    <div className="flex flex-col gap-6">
      <header className="flex flex-col gap-2">
        <h1 className="text-2xl font-bold font-heading text-[#411f03]">
          Olá, {client.name.split(" ")[0]}
        </h1>
        <p className="text-[#444840]">
          Bem-vinda à sua Área do Cliente Vitababy.
        </p>
      </header>

      <section className="bg-white p-6 rounded-2xl border border-[#e4e2de] shadow-sm flex flex-col gap-4">
        <h2 className="text-xl font-bold font-heading text-[#411f03]">
          Próximos Agendamentos
        </h2>
        {upcomingBookings.length === 0 ? (
          <div className="bg-[#fbf9f5] border border-[#e4e2de] rounded-xl p-6 text-center flex flex-col items-center gap-3">
            <Calendar className="w-10 h-10 text-[#d1cece]" />
            <p className="text-[#7d7a75] max-w-sm">
              Você não tem nenhum agendamento futuro no momento.
            </p>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {upcomingBookings.map((booking) => (
              <div
                key={booking.id}
                className="border border-[#e4e2de] rounded-xl p-4 flex flex-col md:flex-row md:items-center justify-between gap-4 bg-[#fbf9f5]"
              >
                <div className="flex flex-col gap-2">
                  <div className="flex items-center gap-2">
                    <span
                      className={`px-3 py-1 text-xs font-bold rounded-full ${
                        booking.status === "CONFIRMED"
                          ? "bg-green-100 text-green-700"
                          : "bg-yellow-100 text-yellow-700"
                      }`}
                    >
                      {booking.status === "CONFIRMED"
                        ? "Confirmado"
                        : "Aguardando"}
                    </span>
                    <h3 className="font-bold text-[#411f03]">
                      {booking.packages.map((p) => p.name).join(" + ")}
                    </h3>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-[#444840] mt-1">
                    <span className="flex items-center gap-1 font-medium text-[#af4d30]">
                      <Calendar className="w-4 h-4" />{" "}
                      {new Date(booking.scheduleSlot.date).toLocaleDateString(
                        "pt-BR",
                      )}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />{" "}
                      {booking.scheduleSlot.startTime}
                    </span>
                    <span className="flex items-center gap-1">
                      <UserIcon className="w-4 h-4" />{" "}
                      {booking.professional.name}
                    </span>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto mt-2 md:mt-0">
                  {booking.professional.phone && (
                    <a
                      href={`https://wa.me/55${booking.professional.phone.replace(/\D/g, "")}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full md:w-auto flex items-center justify-center gap-2 px-4 py-2 bg-[#25D366] text-white rounded-xl font-medium hover:bg-[#20bd5a] transition-colors text-sm shadow-sm"
                    >
                      <MessageCircle className="w-4 h-4" /> Falar com a
                      Consultora
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      <section className="bg-white p-6 rounded-2xl border border-[#e4e2de] shadow-sm flex flex-col gap-4">
        <h2 className="text-xl font-bold font-heading text-[#411f03]">
          Histórico
        </h2>
        {pastBookings.length === 0 ? (
          <p className="text-[#7d7a75]">Nenhum histórico encontrado.</p>
        ) : (
          <div className="flex flex-col gap-4">
            {pastBookings.map((booking) => (
              <div
                key={booking.id}
                className="border-b border-[#e4e2de] pb-4 last:border-0 last:pb-0 flex flex-col gap-2"
              >
                <div className="flex items-center gap-2">
                  <h3 className="font-bold text-[#411f03]">
                    {booking.packages.map((p) => p.name).join(" + ")}
                  </h3>
                </div>
                <div className="flex items-center gap-4 text-sm text-[#444840]">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />{" "}
                    {new Date(booking.scheduleSlot.date).toLocaleDateString(
                      "pt-BR",
                    )}
                  </span>
                  <span className="flex items-center gap-1">
                    <UserIcon className="w-4 h-4" /> {booking.professional.name}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
