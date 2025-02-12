/*
  Warnings:

  - You are about to drop the column `images` on the `BusinessApplication` table. All the data in the column will be lost.
  - You are about to drop the column `images` on the `ProfessorApplication` table. All the data in the column will be lost.
  - You are about to drop the column `images` on the `StudentApplication` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "BusinessApplication" DROP COLUMN "images",
ADD COLUMN     "resume" TEXT;

-- AlterTable
ALTER TABLE "ProfessorApplication" DROP COLUMN "images",
ADD COLUMN     "resume" TEXT;

-- AlterTable
ALTER TABLE "StudentApplication" DROP COLUMN "images",
ADD COLUMN     "resume" TEXT;
