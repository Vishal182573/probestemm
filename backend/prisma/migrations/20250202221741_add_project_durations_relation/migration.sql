/*
  Warnings:

  - You are about to drop the column `projectId` on the `Duration` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Duration" DROP CONSTRAINT "Duration_projectId_fkey";

-- DropIndex
DROP INDEX "Duration_projectId_key";

-- AlterTable
ALTER TABLE "Duration" DROP COLUMN "projectId";

-- AlterTable
ALTER TABLE "Project" ADD COLUMN     "deadline" TIMESTAMP(3),
ADD COLUMN     "duration" TEXT;
