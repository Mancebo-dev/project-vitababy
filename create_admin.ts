import { auth } from "./src/infrastructure/auth/auth";
import { prisma } from "./src/infrastructure/db/prisma";

async function run() {
  try {
    const res = await auth.api.signUpEmail({
      body: {
        email: "rayane@vitababy.com.br",
        password: "adminvitababy",
        name: "Rayane",
      },
    });
    console.log("Signup res:", res);

    // Update role
    const updated = await prisma.user.update({
      where: { email: "rayane@vitababy.com.br" },
      data: { role: "admin" },
    });
    console.log("Updated user:", updated);
  } catch (err) {
    console.error("Error:", err);
  }
}
run();
