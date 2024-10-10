/*
  Warnings:

  - Added the required column `password` to the `Business` table without a default value. This is not possible if the table is not empty.
  - Added the required column `password` to the `Professor` table without a default value. This is not possible if the table is not empty.
  - Added the required column `password` to the `Student` table without a default value. This is not possible if the table is not empty.
  - Added the required column `password` to the `SuperAdmin` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Business" ADD COLUMN     "password" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Professor" ADD COLUMN     "password" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Student" ADD COLUMN     "password" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "SuperAdmin" ADD COLUMN     "password" TEXT NOT NULL;
