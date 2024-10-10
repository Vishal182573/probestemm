/*
  Warnings:

  - You are about to drop the column `title` on the `Achievement` table. All the data in the column will be lost.
  - You are about to drop the column `superAdminId` on the `Blog` table. All the data in the column will be lost.
  - You are about to drop the column `superAdminId` on the `Business` table. All the data in the column will be lost.
  - You are about to drop the column `superAdminId` on the `Discussion` table. All the data in the column will be lost.
  - You are about to drop the column `university` on the `Position` table. All the data in the column will be lost.
  - You are about to drop the column `name` on the `Professor` table. All the data in the column will be lost.
  - You are about to drop the column `superAdminId` on the `Professor` table. All the data in the column will be lost.
  - You are about to drop the column `superAdminId` on the `Project` table. All the data in the column will be lost.
  - You are about to drop the column `name` on the `Student` table. All the data in the column will be lost.
  - You are about to drop the column `superAdminId` on the `Student` table. All the data in the column will be lost.
  - You are about to drop the column `superAdminId` on the `Webinar` table. All the data in the column will be lost.
  - You are about to drop the `Experience` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `ProfessorAchievement` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `SuperAdmin` table. If the table is not empty, all the data it contains will be lost.
  - Made the column `description` on table `Achievement` required. This step will fail if there are existing NULL values in that column.
  - Added the required column `industry` to the `Business` table without a default value. This is not possible if the table is not empty.
  - Added the required column `location` to the `Business` table without a default value. This is not possible if the table is not empty.
  - Added the required column `phoneNumber` to the `Business` table without a default value. This is not possible if the table is not empty.
  - Added the required column `institution` to the `Position` table without a default value. This is not possible if the table is not empty.
  - Added the required column `department` to the `Professor` table without a default value. This is not possible if the table is not empty.
  - Added the required column `fullName` to the `Professor` table without a default value. This is not possible if the table is not empty.
  - Added the required column `location` to the `Professor` table without a default value. This is not possible if the table is not empty.
  - Added the required column `phoneNumber` to the `Professor` table without a default value. This is not possible if the table is not empty.
  - Added the required column `position` to the `Professor` table without a default value. This is not possible if the table is not empty.
  - Added the required column `researchInterests` to the `Professor` table without a default value. This is not possible if the table is not empty.
  - Added the required column `course` to the `Student` table without a default value. This is not possible if the table is not empty.
  - Added the required column `experience` to the `Student` table without a default value. This is not possible if the table is not empty.
  - Added the required column `fullName` to the `Student` table without a default value. This is not possible if the table is not empty.
  - Added the required column `location` to the `Student` table without a default value. This is not possible if the table is not empty.
  - Added the required column `phoneNumber` to the `Student` table without a default value. This is not possible if the table is not empty.
  - Added the required column `university` to the `Student` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Answer" DROP CONSTRAINT "Answer_businessId_fkey";

-- DropForeignKey
ALTER TABLE "Answer" DROP CONSTRAINT "Answer_professorId_fkey";

-- DropForeignKey
ALTER TABLE "Blog" DROP CONSTRAINT "Blog_superAdminId_fkey";

-- DropForeignKey
ALTER TABLE "Business" DROP CONSTRAINT "Business_superAdminId_fkey";

-- DropForeignKey
ALTER TABLE "Comment" DROP CONSTRAINT "Comment_professorId_fkey";

-- DropForeignKey
ALTER TABLE "Comment" DROP CONSTRAINT "Comment_studentId_fkey";

-- DropForeignKey
ALTER TABLE "Discussion" DROP CONSTRAINT "Discussion_superAdminId_fkey";

-- DropForeignKey
ALTER TABLE "Experience" DROP CONSTRAINT "Experience_studentId_fkey";

-- DropForeignKey
ALTER TABLE "Professor" DROP CONSTRAINT "Professor_superAdminId_fkey";

-- DropForeignKey
ALTER TABLE "ProfessorAchievement" DROP CONSTRAINT "ProfessorAchievement_professorId_fkey";

-- DropForeignKey
ALTER TABLE "Project" DROP CONSTRAINT "Project_businessId_fkey";

-- DropForeignKey
ALTER TABLE "Project" DROP CONSTRAINT "Project_professorId_fkey";

-- DropForeignKey
ALTER TABLE "Project" DROP CONSTRAINT "Project_superAdminId_fkey";

-- DropForeignKey
ALTER TABLE "Student" DROP CONSTRAINT "Student_superAdminId_fkey";

-- DropForeignKey
ALTER TABLE "Webinar" DROP CONSTRAINT "Webinar_superAdminId_fkey";

-- AlterTable
ALTER TABLE "Achievement" DROP COLUMN "title",
ADD COLUMN     "professorId" TEXT,
ALTER COLUMN "year" SET DATA TYPE TEXT,
ALTER COLUMN "description" SET NOT NULL,
ALTER COLUMN "studentId" DROP NOT NULL;

-- AlterTable
ALTER TABLE "Answer" ALTER COLUMN "professorId" DROP NOT NULL,
ALTER COLUMN "businessId" DROP NOT NULL;

-- AlterTable
ALTER TABLE "Blog" DROP COLUMN "superAdminId";

-- AlterTable
ALTER TABLE "Business" DROP COLUMN "superAdminId",
ADD COLUMN     "industry" TEXT NOT NULL,
ADD COLUMN     "location" TEXT NOT NULL,
ADD COLUMN     "phoneNumber" TEXT NOT NULL,
ALTER COLUMN "website" DROP NOT NULL;

-- AlterTable
ALTER TABLE "Discussion" DROP COLUMN "superAdminId";

-- AlterTable
ALTER TABLE "Position" DROP COLUMN "university",
ADD COLUMN     "institution" TEXT NOT NULL,
ALTER COLUMN "startYear" SET DATA TYPE TEXT,
ALTER COLUMN "endYear" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "Professor" DROP COLUMN "name",
DROP COLUMN "superAdminId",
ADD COLUMN     "department" TEXT NOT NULL,
ADD COLUMN     "fullName" TEXT NOT NULL,
ADD COLUMN     "location" TEXT NOT NULL,
ADD COLUMN     "phoneNumber" TEXT NOT NULL,
ADD COLUMN     "position" TEXT NOT NULL,
ADD COLUMN     "researchInterests" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Project" DROP COLUMN "superAdminId";

-- AlterTable
ALTER TABLE "Student" DROP COLUMN "name",
DROP COLUMN "superAdminId",
ADD COLUMN     "course" TEXT NOT NULL,
ADD COLUMN     "experience" TEXT NOT NULL,
ADD COLUMN     "fullName" TEXT NOT NULL,
ADD COLUMN     "location" TEXT NOT NULL,
ADD COLUMN     "phoneNumber" TEXT NOT NULL,
ADD COLUMN     "university" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Webinar" DROP COLUMN "superAdminId";

-- DropTable
DROP TABLE "Experience";

-- DropTable
DROP TABLE "ProfessorAchievement";

-- DropTable
DROP TABLE "SuperAdmin";

-- AddForeignKey
ALTER TABLE "Achievement" ADD CONSTRAINT "Achievement_professorId_fkey" FOREIGN KEY ("professorId") REFERENCES "Professor"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Answer" ADD CONSTRAINT "Answer_professorId_fkey" FOREIGN KEY ("professorId") REFERENCES "Professor"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Answer" ADD CONSTRAINT "Answer_businessId_fkey" FOREIGN KEY ("businessId") REFERENCES "Business"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Comment" ADD CONSTRAINT "Comment_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "Student"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Comment" ADD CONSTRAINT "Comment_professorId_fkey" FOREIGN KEY ("professorId") REFERENCES "Professor"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Project" ADD CONSTRAINT "Project_professorId_fkey" FOREIGN KEY ("professorId") REFERENCES "Professor"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Project" ADD CONSTRAINT "Project_businessId_fkey" FOREIGN KEY ("businessId") REFERENCES "Business"("id") ON DELETE SET NULL ON UPDATE CASCADE;
