/*
  Warnings:

  - The values [BUSINESS,PROFESSOR] on the enum `ProjectType` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the column `difficulty` on the `Project` table. All the data in the column will be lost.
  - You are about to drop the column `subcategory` on the `Project` table. All the data in the column will be lost.
  - The `category` column on the `Project` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `imageUrl` column on the `ResearchInterest` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - You are about to drop the `AppliedProfessor` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `AppliedStudent` table. If the table is not empty, all the data it contains will be lost.

*/
-- CreateEnum
CREATE TYPE "ProposalCategory" AS ENUM ('PROJECT', 'INTERNSHIP', 'PHD_POSITION', 'PROFESSOR_COLLABORATION', 'STUDENT_OPPORTUNITY', 'INDUSTRY_COLLABORATION', 'TECHNOLOGY_SOLUTION', 'RND_PROJECT');

-- AlterEnum
BEGIN;
CREATE TYPE "ProjectType_new" AS ENUM ('BUSINESS_PROJECT', 'PROFESSOR_PROJECT', 'STUDENT_PROPOSAL');
ALTER TABLE "Project" ALTER COLUMN "type" TYPE "ProjectType_new" USING ("type"::text::"ProjectType_new");
ALTER TYPE "ProjectType" RENAME TO "ProjectType_old";
ALTER TYPE "ProjectType_new" RENAME TO "ProjectType";
DROP TYPE "ProjectType_old";
COMMIT;

-- DropForeignKey
ALTER TABLE "AppliedProfessor" DROP CONSTRAINT "AppliedProfessor_projectId_fkey";

-- DropForeignKey
ALTER TABLE "AppliedStudent" DROP CONSTRAINT "AppliedStudent_projectId_fkey";

-- AlterTable
ALTER TABLE "Professor" ADD COLUMN     "googleScholar" TEXT;

-- AlterTable
ALTER TABLE "Project" DROP COLUMN "difficulty",
DROP COLUMN "subcategory",
ADD COLUMN     "desirable" TEXT,
ADD COLUMN     "eligibility" TEXT,
ADD COLUMN     "fundDetails" TEXT,
ADD COLUMN     "isFunded" BOOLEAN,
ADD COLUMN     "requirements" TEXT,
ADD COLUMN     "techDescription" TEXT,
ALTER COLUMN "timeline" DROP NOT NULL,
DROP COLUMN "category",
ADD COLUMN     "category" "ProposalCategory" NOT NULL DEFAULT 'PROJECT';

-- AlterTable
ALTER TABLE "ResearchInterest" DROP COLUMN "imageUrl",
ADD COLUMN     "imageUrl" TEXT[];

-- DropTable
DROP TABLE "AppliedProfessor";

-- DropTable
DROP TABLE "AppliedStudent";

-- DropEnum
DROP TYPE "Difficulty";

-- CreateTable
CREATE TABLE "Duration" (
    "id" TEXT NOT NULL,
    "startDate" TIMESTAMP(3) NOT NULL,
    "endDate" TIMESTAMP(3) NOT NULL,
    "projectId" TEXT NOT NULL,

    CONSTRAINT "Duration_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProfessorApplication" (
    "id" TEXT NOT NULL,
    "projectId" TEXT NOT NULL,
    "professorId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT,
    "phoneNumber" TEXT,
    "description" TEXT NOT NULL,
    "images" TEXT[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ProfessorApplication_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "StudentApplication" (
    "id" TEXT NOT NULL,
    "projectId" TEXT NOT NULL,
    "studentId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT,
    "phoneNumber" TEXT,
    "description" TEXT NOT NULL,
    "images" TEXT[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "StudentApplication_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BusinessApplication" (
    "id" TEXT NOT NULL,
    "projectId" TEXT NOT NULL,
    "businessId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT,
    "phoneNumber" TEXT,
    "description" TEXT NOT NULL,
    "images" TEXT[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "BusinessApplication_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Duration_projectId_key" ON "Duration"("projectId");

-- CreateIndex
CREATE UNIQUE INDEX "ProfessorApplication_projectId_professorId_key" ON "ProfessorApplication"("projectId", "professorId");

-- CreateIndex
CREATE UNIQUE INDEX "StudentApplication_projectId_studentId_key" ON "StudentApplication"("projectId", "studentId");

-- CreateIndex
CREATE UNIQUE INDEX "BusinessApplication_projectId_businessId_key" ON "BusinessApplication"("projectId", "businessId");

-- AddForeignKey
ALTER TABLE "Duration" ADD CONSTRAINT "Duration_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProfessorApplication" ADD CONSTRAINT "ProfessorApplication_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StudentApplication" ADD CONSTRAINT "StudentApplication_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BusinessApplication" ADD CONSTRAINT "BusinessApplication_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE CASCADE ON UPDATE CASCADE;
