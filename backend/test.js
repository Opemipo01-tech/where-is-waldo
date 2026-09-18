import { prisma } from "./prisma_db/prisma.js";

async function main() {
  console.log("Testing Prisma connection...");

  const characters = await prisma.character.findMany();

  console.log("Successfully connected to the database!");
  console.log("Characters:", characters);
}

main()
  .catch((error) => {
    console.error("Prisma test failed:");
    console.error(error);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
