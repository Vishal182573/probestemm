-- CreateTable
CREATE TABLE "BlogLike" (
    "id" TEXT NOT NULL,
    "blogId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "isLike" BOOLEAN NOT NULL,

    CONSTRAINT "BlogLike_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "BlogLike_blogId_userId_key" ON "BlogLike"("blogId", "userId");

-- AddForeignKey
ALTER TABLE "BlogLike" ADD CONSTRAINT "BlogLike_blogId_fkey" FOREIGN KEY ("blogId") REFERENCES "Blog"("id") ON DELETE CASCADE ON UPDATE CASCADE;
