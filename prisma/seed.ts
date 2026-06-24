import { prisma } from "../lib/prisma";

const preorders = [
  {
    name: "Multi variant 3",
    preorderWhen: "out-of-stock",
    startsAt: new Date("2025-12-15T20:24:00"),
    endsAt: null,
    active: false,
  },
  {
    name: "Multi variant 2",
    preorderWhen: "regardless-of-stock",
    startsAt: new Date("2025-12-15T20:24:00"),
    endsAt: new Date("2025-12-15T20:27:00"),
    active: true,
  },
  {
    name: "Multi variants 1",
    preorderWhen: "regardless-of-stock",
    startsAt: new Date("2025-12-15T20:24:00"),
    endsAt: null,
    active: true,
  },
  {
    name: "Partial payment",
    preorderWhen: "regardless-of-stock",
    startsAt: new Date("2025-08-17T16:56:00"),
    endsAt: null,
    active: true,
  },
  {
    name: "Shipping not sure",
    preorderWhen: "regardless-of-stock",
    startsAt: new Date("2025-08-17T16:56:00"),
    endsAt: null,
    active: true,
  },
  {
    name: "Full payment",
    preorderWhen: "regardless-of-stock",
    startsAt: new Date("2025-08-17T16:56:00"),
    endsAt: null,
    active: true,
  },
  {
    name: "Coming soon",
    preorderWhen: "regardless-of-stock",
    startsAt: new Date("2025-12-11T04:42:00"),
    endsAt: null,
    active: true,
  },
  {
    name: "With ends",
    preorderWhen: "regardless-of-stock",
    startsAt: new Date("2025-08-14T15:59:00"),
    endsAt: null,
    active: true,
  },
];

async function main() {
  await prisma.preorder.deleteMany();

  const base = Date.now();
  for (let i = 0; i < preorders.length; i++) {
    await prisma.preorder.create({
      data: {
        ...preorders[i],
        products: 1,
        createdAt: new Date(base - i * 60000),
      },
    });
  }
}

main()
  .then(() => prisma.$disconnect())
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
