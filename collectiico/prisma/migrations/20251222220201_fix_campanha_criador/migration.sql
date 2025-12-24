/*
  Warnings:

  - Added the required column `criadorId` to the `Campanha` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Campanha" ADD COLUMN     "criadorId" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "Campanha" ADD CONSTRAINT "Campanha_criadorId_fkey" FOREIGN KEY ("criadorId") REFERENCES "Usuario"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
