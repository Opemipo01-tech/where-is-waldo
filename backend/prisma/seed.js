import { prisma } from "../prisma_db/prisma.js";

async function main() {

    await prisma.character.deleteMany();

  await prisma.character.createMany({
    data: [
      {
        name: "Odlaw",
        x: 250,
        y: 392,
        tolerance: 20,
      },
      {
        name: "Waldo",
        x: 544,
        y: 393,
        tolerance: 20,
      },
      {
        name: "Wizard",
        x: 643,
        y: 397,
        tolerance: 20,
      },
    ],
  });

  console.log("Characters seeded successfully!");
}

main()
  .catch((error) => {
    console.error("Seeding failed:");
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
