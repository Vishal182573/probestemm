-- DropForeignKey
ALTER TABLE "ResearchHighlight" DROP CONSTRAINT "ResearchHighlight_studentId_fkey";

-- AlterTable
ALTER TABLE "Student" ADD COLUMN     "skills" TEXT[];
