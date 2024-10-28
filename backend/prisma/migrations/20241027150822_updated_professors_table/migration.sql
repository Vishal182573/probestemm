/*
  Warnings:

  - You are about to drop the column `researchInterests` on the `Professor` table. All the data in the column will be lost.
  - Made the column `website` on table `Professor` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Business" ALTER COLUMN "description" DROP NOT NULL,
ALTER COLUMN "industry" DROP NOT NULL,
ALTER COLUMN "location" DROP NOT NULL,
ALTER COLUMN "phoneNumber" DROP NOT NULL;

-- AlterTable
ALTER TABLE "Professor" DROP COLUMN "researchInterests",
ADD COLUMN     "isApproved" BOOLEAN NOT NULL DEFAULT false,
ALTER COLUMN "title" DROP NOT NULL,
ALTER COLUMN "university" DROP NOT NULL,
ALTER COLUMN "website" SET NOT NULL,
ALTER COLUMN "degree" DROP NOT NULL,
ALTER COLUMN "department" DROP NOT NULL,
ALTER COLUMN "location" DROP NOT NULL,
ALTER COLUMN "phoneNumber" DROP NOT NULL,
ALTER COLUMN "position" DROP NOT NULL;

-- AlterTable
ALTER TABLE "Student" ALTER COLUMN "course" DROP NOT NULL,
ALTER COLUMN "experience" DROP NOT NULL,
ALTER COLUMN "location" DROP NOT NULL,
ALTER COLUMN "phoneNumber" DROP NOT NULL,
ALTER COLUMN "university" DROP NOT NULL;

-- CreateTable
CREATE TABLE "ResearchInterest" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "imageUrl" TEXT,
    "professorId" TEXT NOT NULL,

    CONSTRAINT "ResearchInterest_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProfessorTag" (
    "id" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "subcategory" TEXT NOT NULL,
    "professorId" TEXT NOT NULL,

    CONSTRAINT "ProfessorTag_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ProfessorTag_professorId_category_subcategory_key" ON "ProfessorTag"("professorId", "category", "subcategory");

-- AddForeignKey
ALTER TABLE "ResearchInterest" ADD CONSTRAINT "ResearchInterest_professorId_fkey" FOREIGN KEY ("professorId") REFERENCES "Professor"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProfessorTag" ADD CONSTRAINT "ProfessorTag_professorId_fkey" FOREIGN KEY ("professorId") REFERENCES "Professor"("id") ON DELETE CASCADE ON UPDATE CASCADE;
