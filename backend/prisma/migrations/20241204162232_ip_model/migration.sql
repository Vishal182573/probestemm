-- CreateTable
CREATE TABLE "UserAccess" (
    "id" TEXT NOT NULL,
    "emailId" TEXT NOT NULL,
    "fullName" TEXT NOT NULL,
    "ipAddress" TEXT NOT NULL,
    "accessTime" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "UserAccess_pkey" PRIMARY KEY ("id")
);
