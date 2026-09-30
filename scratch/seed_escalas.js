const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function main() {
  const client = await prisma.client.create({
    data: {
      name: "Test Client",
      phone: "11999999999",
    },
  });

  const professional = await prisma.professional.create({
    data: {
      name: "Test Professional",
      phone: "11988888888",
      color: "#ae4d30",
    },
  });

  const schedule = await prisma.clientSchedule.create({
    data: {
      clientId: client.id,
      month: "2026-09",
      title: "Mock Schedule",
    },
  });

  await prisma.clientScheduleShift.create({
    data: {
      scheduleId: schedule.id,
      date: new Date(),
      startTime: "08:00",
      endTime: "12:00",
      professionalId: professional.id,
      status: "SCHEDULED",
    },
  });

  console.log("Mock data created");
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
