-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "NotificationType" ADD VALUE 'PATENT_APPLICATION';
ALTER TYPE "NotificationType" ADD VALUE 'PROFESSOR_TAG';
ALTER TYPE "NotificationType" ADD VALUE 'DISCUSSION_TAG';

-- AlterTable
ALTER TABLE "Notification" ADD COLUMN     "patentId" TEXT,
ADD COLUMN     "professorTagId" TEXT;

-- CreateTable
CREATE TABLE "Patent" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "imageUrl" TEXT NOT NULL,
    "professorId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Patent_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Notification" ADD CONSTRAINT "Notification_patentId_fkey" FOREIGN KEY ("patentId") REFERENCES "Patent"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Notification" ADD CONSTRAINT "Notification_professorTagId_fkey" FOREIGN KEY ("professorTagId") REFERENCES "ProfessorTag"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Patent" ADD CONSTRAINT "Patent_professorId_fkey" FOREIGN KEY ("professorId") REFERENCES "Professor"("id") ON DELETE CASCADE ON UPDATE CASCADE;
