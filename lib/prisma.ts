import path from "node:path";
import { PrismaClient } from "@prisma/client";
import { PrismaLibSQL } from "@prisma/adapter-libsql";

function localFileUrl() {
  const file = path.join(process.cwd(), "prisma", "dev.db").replace(/\\/g, "/");
  return `file:${file}`;
}

const adapter = new PrismaLibSQL({
  url: process.env.TURSO_DATABASE_URL ?? localFileUrl(),
  authToken: process.env.TURSO_AUTH_TOKEN,
});

const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

export const prisma = globalForPrisma.prisma ?? new PrismaClient({ adapter });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
