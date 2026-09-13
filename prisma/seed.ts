import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("Starting seed...");

  // 1. Create Professionals
  const ray = await prisma.professional.upsert({
    where: { email: "ray@vitababy.com" },
    update: {},
    create: {
      name: "Rayssa (Ray)",
      email: "ray@vitababy.com",
      phone: "22999999999",
      specialty: "Consultora de Sono e Amamentação",
      color: "#ae4d30",
    },
  });

  const paula = await prisma.professional.upsert({
    where: { email: "paula@vitababy.com" },
    update: {},
    create: {
      name: "Paula",
      email: "paula@vitababy.com",
      phone: "22988888888",
      specialty: "Consultora Baby Movie",
      color: "#4a7c59",
    },
  });

  // 2. Create Services & Packages
  const sonoService = await prisma.service.create({
    include: { packages: true },
    data: {
      name: "Consultoria de Sono",
      description: "Acompanhamento completo para o sono da criança.",
      packages: {
        create: [
          {
            name: "Plano Básico",
            description: "1 encontro online + material de apoio",
            price: 450.0,
            duration: 60,
          },
          {
            name: "Plano Premium",
            description: "4 encontros + acompanhamento diário por 30 dias",
            price: 1200.0,
            duration: 90,
          },
        ],
      },
    },
  });

  const babyMovieService = await prisma.service.create({
    include: { packages: true },
    data: {
      name: "Assessoria Baby Movie",
      description: "O primeiro filme da sua criança com direção profissional.",
      packages: {
        create: [
          {
            name: "Sessão Única",
            description: "Gravação de 2h no local",
            price: 800.0,
            duration: 120,
          },
        ],
      },
    },
  });

  // 3. Create Clients
  const client1 = await prisma.client.upsert({
    where: { email: "marcela@email.com" },
    update: {},
    create: {
      name: "Marcela Silva",
      email: "marcela@email.com",
      phone: "22977777777",
      cpf: "111.222.333-44",
      city: "Macaé",
      state: "RJ",
    },
  });

  const client2 = await prisma.client.upsert({
    where: { email: "juliana@email.com" },
    update: {},
    create: {
      name: "Juliana Costa",
      email: "juliana@email.com",
      phone: "22966666666",
      cpf: "222.333.444-55",
      city: "Rio das Ostras", // Fora de Macaé
      state: "RJ",
    },
  });

  // 4. Create Bookings (and slots)
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  tomorrow.setHours(0, 0, 0, 0);

  const slot1 = await prisma.scheduleSlot.create({
    data: {
      professionalId: ray.id,
      date: tomorrow,
      startTime: "14:00",
      endTime: "15:00",
      isBooked: true,
    },
  });

  const sonoPackage = await prisma.servicePackage.findFirst({
    where: { serviceId: sonoService.id },
    orderBy: { name: "asc" }, // Gets 'Plano Básico' ideally
  });

  const booking1 = await prisma.booking.create({
    data: {
      clientId: client1.id,
      professionalId: ray.id,
      packages: sonoPackage?.id
        ? { connect: [{ id: sonoPackage.id }] }
        : undefined,
      scheduleSlotId: slot1.id,
      status: "CONFIRMED",
      additionalInfo: "Preciso de ajuda urgente, a criança acorda 5x na noite.",
    },
  });

  const slot2 = await prisma.scheduleSlot.create({
    data: {
      professionalId: paula.id,
      date: tomorrow,
      startTime: "16:00",
      endTime: "18:00",
      isBooked: true,
    },
  });

  const babyPackage = await prisma.servicePackage.findFirst({
    where: { serviceId: babyMovieService.id },
  });

  const _booking2 = await prisma.booking.create({
    data: {
      clientId: client2.id,
      professionalId: paula.id,
      packages: babyPackage?.id
        ? { connect: [{ id: babyPackage.id }] }
        : undefined, // Baby Movie
      scheduleSlotId: slot2.id,
      status: "PENDING",
      transportFee: 150.0, // Fora de Macaé
      additionalInfo: "Gravação na praia",
    },
  });

  // 5. Create Payments (Cash flow)
  await prisma.payment.create({
    data: {
      bookingId: booking1.id,
      amount: 450.0,
      description: "Pagamento Consultoria",
      method: "PIX",
      type: "INCOME",
      status: "PAID",
    },
  });

  await prisma.payment.create({
    data: {
      amount: 150.0,
      description: "Compra de material escritório",
      method: "CREDIT",
      type: "EXPENSE",
      status: "PAID",
    },
  });

  // 6. Create Reviews
  await prisma.review.create({
    data: {
      clientId: client1.id,
      rating: 5,
      comment: "A Ray mudou nossa vida! A criança agora dorme a noite toda.",
      isHighlighted: true,
    },
  });

  console.log("Seed completed!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
