// lib/prisma.ts
import { PrismaClient } from "@prisma/client";

// Declaração para o TypeScript sobre o global.prisma
declare global {
  var prisma: PrismaClient | undefined;
}

// Lógica para evitar múltiplas instâncias em desenvolvimento
const prisma = global.prisma || new PrismaClient();

if (process.env.NODE_ENV !== "production") {
  global.prisma = prisma;
}

export default prisma;
