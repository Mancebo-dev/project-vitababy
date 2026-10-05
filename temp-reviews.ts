import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
prisma.review
  .findMany({ include: { client: true } })
  .then((r) => console.log(JSON.stringify(r, null, 2)))
  .finally(() => prisma.$disconnect());
