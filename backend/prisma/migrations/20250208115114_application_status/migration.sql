-- CreateEnum
CREATE TYPE "ApplicationStatus" AS ENUM ('PENDING', 'IN_REVIEW', 'REJECTED', 'ACCEPTED');

-- AlterTable
ALTER TABLE "BusinessApplication" ADD COLUMN     "status" "ApplicationStatus" NOT NULL DEFAULT 'PENDING';

-- AlterTable
ALTER TABLE "ProfessorApplication" ADD COLUMN     "status" "ApplicationStatus" NOT NULL DEFAULT 'PENDING';

-- AlterTable
ALTER TABLE "StudentApplication" ADD COLUMN     "status" "ApplicationStatus" NOT NULL DEFAULT 'PENDING';
