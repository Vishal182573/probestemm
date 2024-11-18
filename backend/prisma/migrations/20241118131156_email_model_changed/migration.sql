/*
  Warnings:

  - You are about to drop the column `createdAt` on the `EmailVerification` table. All the data in the column will be lost.
  - Added the required column `expiresAt` to the `EmailVerification` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "EmailVerification" DROP COLUMN "createdAt",
ADD COLUMN     "expiresAt" TIMESTAMP(3) NOT NULL;
