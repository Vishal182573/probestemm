-- AlterTable
ALTER TABLE "Blog" ADD COLUMN     "superAdminId" TEXT;

-- AlterTable
ALTER TABLE "Business" ADD COLUMN     "superAdminId" TEXT;

-- AlterTable
ALTER TABLE "Discussion" ADD COLUMN     "superAdminId" TEXT;

-- AlterTable
ALTER TABLE "Professor" ADD COLUMN     "superAdminId" TEXT;

-- AlterTable
ALTER TABLE "Project" ADD COLUMN     "superAdminId" TEXT;

-- AlterTable
ALTER TABLE "Student" ADD COLUMN     "superAdminId" TEXT;

-- AlterTable
ALTER TABLE "Webinar" ADD COLUMN     "superAdminId" TEXT;

-- CreateTable
CREATE TABLE "SuperAdmin" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SuperAdmin_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "SuperAdmin_email_key" ON "SuperAdmin"("email");

-- AddForeignKey
ALTER TABLE "Student" ADD CONSTRAINT "Student_superAdminId_fkey" FOREIGN KEY ("superAdminId") REFERENCES "SuperAdmin"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Professor" ADD CONSTRAINT "Professor_superAdminId_fkey" FOREIGN KEY ("superAdminId") REFERENCES "SuperAdmin"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Business" ADD CONSTRAINT "Business_superAdminId_fkey" FOREIGN KEY ("superAdminId") REFERENCES "SuperAdmin"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Discussion" ADD CONSTRAINT "Discussion_superAdminId_fkey" FOREIGN KEY ("superAdminId") REFERENCES "SuperAdmin"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Blog" ADD CONSTRAINT "Blog_superAdminId_fkey" FOREIGN KEY ("superAdminId") REFERENCES "SuperAdmin"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Project" ADD CONSTRAINT "Project_superAdminId_fkey" FOREIGN KEY ("superAdminId") REFERENCES "SuperAdmin"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Webinar" ADD CONSTRAINT "Webinar_superAdminId_fkey" FOREIGN KEY ("superAdminId") REFERENCES "SuperAdmin"("id") ON DELETE SET NULL ON UPDATE CASCADE;
