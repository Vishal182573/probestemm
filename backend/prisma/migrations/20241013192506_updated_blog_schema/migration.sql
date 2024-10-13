-- CreateEnum
CREATE TYPE "BlogAuthorType" AS ENUM ('PROFESSOR', 'BUSINESS');

-- DropForeignKey
ALTER TABLE "Blog" DROP CONSTRAINT "Blog_professorId_fkey";

-- AlterTable
ALTER TABLE "Blog" ADD COLUMN     "authorType" "BlogAuthorType",
ADD COLUMN     "businessId" TEXT,
ALTER COLUMN "professorId" DROP NOT NULL;

-- AlterTable
ALTER TABLE "Comment" ADD COLUMN     "businessId" TEXT;

-- AddForeignKey
ALTER TABLE "Blog" ADD CONSTRAINT "Blog_professorId_fkey" FOREIGN KEY ("professorId") REFERENCES "Professor"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Blog" ADD CONSTRAINT "Blog_businessId_fkey" FOREIGN KEY ("businessId") REFERENCES "Business"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Comment" ADD CONSTRAINT "Comment_businessId_fkey" FOREIGN KEY ("businessId") REFERENCES "Business"("id") ON DELETE SET NULL ON UPDATE CASCADE;
