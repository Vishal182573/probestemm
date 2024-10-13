/*
  Warnings:

  - You are about to drop the column `appliedProfessors` on the `Project` table. All the data in the column will be lost.
  - You are about to drop the column `appliedStudents` on the `Project` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Project" DROP COLUMN "appliedProfessors",
DROP COLUMN "appliedStudents";

-- CreateTable
CREATE TABLE "AppliedProfessor" (
    "id" TEXT NOT NULL,
    "projectId" TEXT NOT NULL,
    "professorId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phoneNumber" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AppliedProfessor_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AppliedStudent" (
    "id" TEXT NOT NULL,
    "projectId" TEXT NOT NULL,
    "studentId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phoneNumber" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AppliedStudent_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "AppliedProfessor_projectId_professorId_key" ON "AppliedProfessor"("projectId", "professorId");

-- CreateIndex
CREATE UNIQUE INDEX "AppliedStudent_projectId_studentId_key" ON "AppliedStudent"("projectId", "studentId");

-- AddForeignKey
ALTER TABLE "AppliedProfessor" ADD CONSTRAINT "AppliedProfessor_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AppliedStudent" ADD CONSTRAINT "AppliedStudent_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE CASCADE ON UPDATE CASCADE;
