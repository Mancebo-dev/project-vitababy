"use server";

import { prisma } from "@/infrastructure/db/prisma";

export async function submitReview(data: {
  name: string;
  rating: number;
  comment: string;
}) {
  // To submit a review, we need a clientId. If the user uses a public link,
  // we might need to find or create a basic client record just to attach the review,
  // or allow reviews without client if we change the schema. But we linked Review to Client.
  // So we will upsert a client based on name just for the review record.

  let client = await prisma.client.findFirst({
    where: { name: data.name },
  });

  if (!client) {
    client = await prisma.client.create({
      data: {
        name: data.name,
        phone: "N/A",
      },
    });
  }

  await prisma.review.create({
    data: {
      rating: data.rating,
      comment: data.comment,
      clientId: client.id,
    },
  });
}
